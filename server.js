require("dotenv").config();
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { MongoClient } = require("mongodb");
const { notifyNewSubscriber } = require("./mailer");

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

// Required so req.ip reflects the real visitor's IP (not the host's
// reverse proxy) once this is deployed behind Render/Railway/etc. Without
// this, every visitor would look identical to the comment-limiting logic
// below.
app.set("trust proxy", true);

app.use(express.json({ extended: false }));

const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db("samutech");
    await operations(db);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to database", error: error.message });
  }
};

// ---- comment helpers -------------------------------------------------

const loadArticleDoc = async (db, name) => {
  const doc = await db.collection("articles").findOne({ name });
  return doc || { name, comments: [] };
};

const saveComments = async (db, name, comments) => {
  await db.collection("articles").updateOne(
    { name },
    { $set: { comments } },
    { upsert: true }
  );
};

// Strips IP addresses and raw "who liked this" lists before anything goes
// to the client, and replaces them with the two booleans the UI actually
// needs: isMine (show edit/delete) and likedByMe (highlight the like button).
const shapeComment = (c, ip) => ({
  id: c.id,
  username: c.username,
  text: c.text,
  createdAt: c.createdAt,
  editedAt: c.editedAt || null,
  likes: (c.likedBy || []).length,
  likedByMe: (c.likedBy || []).includes(ip),
  isMine: c.ip === ip,
  replies: (c.replies || []).map((r) => shapeComment(r, ip)),
});

const shapeArticle = (doc, ip, articleName) => {
  const comments = doc?.comments || [];
  return {
    name: articleName,
    comments: comments.map((c) => shapeComment(c, ip)),
    // Lets the frontend disable the comment form for someone who's already
    // commented on this article, without exposing anyone's actual IP.
    hasCommented: comments.some((c) => c.ip === ip),
  };
};

// Finds a comment OR a reply by id anywhere in the article's comment tree.
const findTarget = (comments, id) => {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === id) {
      return { item: comments[i], commentIndex: i, replyIndex: null, isReply: false };
    }
    const replies = comments[i].replies || [];
    for (let j = 0; j < replies.length; j++) {
      if (replies[j].id === id) {
        return { item: replies[j], commentIndex: i, replyIndex: j, isReply: true };
      }
    }
  }
  return null;
};

// ---- article + comments routes ---------------------------------------

app.get("/api/articles/:name", async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;
    const doc = await loadArticleDoc(db, articleName);
    res.status(200).json(shapeArticle(doc, req.ip, articleName));
  }, res);
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { username, text } = req.body;
  const articleName = req.params.name;

  if (!username?.trim() || !text?.trim()) {
    return res.status(400).json({ message: "username and text are required" });
  }

  withDB(async (db) => {
    const doc = await loadArticleDoc(db, articleName);

    const alreadyCommented = doc.comments.some((c) => c.ip === req.ip);
    if (alreadyCommented) {
      res.status(409).json({ message: "You've already commented on this article from this device." });
      return;
    }

    const newComment = {
      id: crypto.randomUUID(),
      username: username.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      editedAt: null,
      ip: req.ip,
      likedBy: [],
      replies: [],
    };

    // Newest top-level comment first.
    const comments = [newComment, ...doc.comments];
    await saveComments(db, articleName, comments);
    res.status(201).json(shapeArticle({ comments }, req.ip, articleName));
  }, res);
});

app.put("/api/articles/:name/comments/:commentId", async (req, res) => {
  const { text } = req.body;
  const { name: articleName, commentId } = req.params;

  if (!text?.trim()) {
    return res.status(400).json({ message: "text is required" });
  }

  withDB(async (db) => {
    const doc = await loadArticleDoc(db, articleName);
    const target = findTarget(doc.comments, commentId);

    if (!target) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    if (target.item.ip !== req.ip) {
      res.status(403).json({ message: "You can only edit your own comment." });
      return;
    }

    target.item.text = text.trim();
    target.item.editedAt = new Date().toISOString();

    await saveComments(db, articleName, doc.comments);
    res.status(200).json(shapeArticle(doc, req.ip, articleName));
  }, res);
});

app.delete("/api/articles/:name/comments/:commentId", async (req, res) => {
  const { name: articleName, commentId } = req.params;

  withDB(async (db) => {
    const doc = await loadArticleDoc(db, articleName);
    const target = findTarget(doc.comments, commentId);

    if (!target) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    if (target.item.ip !== req.ip) {
      res.status(403).json({ message: "You can only delete your own comment." });
      return;
    }

    if (target.isReply) {
      doc.comments[target.commentIndex].replies.splice(target.replyIndex, 1);
    } else {
      doc.comments.splice(target.commentIndex, 1);
    }

    await saveComments(db, articleName, doc.comments);
    res.status(200).json(shapeArticle(doc, req.ip, articleName));
  }, res);
});

// Toggles a like/unlike. Anyone can like; one like per IP per comment.
app.post("/api/articles/:name/comments/:commentId/like", async (req, res) => {
  const { name: articleName, commentId } = req.params;

  withDB(async (db) => {
    const doc = await loadArticleDoc(db, articleName);
    const target = findTarget(doc.comments, commentId);

    if (!target) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const likedBy = target.item.likedBy || [];
    const alreadyLiked = likedBy.includes(req.ip);
    target.item.likedBy = alreadyLiked
      ? likedBy.filter((ip) => ip !== req.ip)
      : [...likedBy, req.ip];

    await saveComments(db, articleName, doc.comments);
    res.status(200).json(shapeArticle(doc, req.ip, articleName));
  }, res);
});

// Replies attach to a top-level comment only (one level of nesting).
app.post("/api/articles/:name/comments/:commentId/replies", async (req, res) => {
  const { username, text } = req.body;
  const { name: articleName, commentId } = req.params;

  if (!username?.trim() || !text?.trim()) {
    return res.status(400).json({ message: "username and text are required" });
  }

  withDB(async (db) => {
    const doc = await loadArticleDoc(db, articleName);
    const parentIndex = doc.comments.findIndex((c) => c.id === commentId);

    if (parentIndex === -1) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const newReply = {
      id: crypto.randomUUID(),
      username: username.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      editedAt: null,
      ip: req.ip,
      likedBy: [],
    };

    doc.comments[parentIndex].replies = [...(doc.comments[parentIndex].replies || []), newReply];

    await saveComments(db, articleName, doc.comments);
    res.status(201).json(shapeArticle(doc, req.ip, articleName));
  }, res);
});

// Total engagement (comments + replies) per article — used to rank the
// "other articles you may like" section.
app.get("/api/comment-counts", async (req, res) => {
  withDB(async (db) => {
    const docs = await db.collection("articles").find({}).toArray();
    const counts = {};
    docs.forEach((doc) => {
      const replyCount = (doc.comments || []).reduce(
        (sum, c) => sum + (c.replies?.length || 0),
        0
      );
      counts[doc.name] = (doc.comments || []).length + replyCount;
    });
    res.status(200).json(counts);
  }, res);
});

// ---- subscribers --------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email || !EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  withDB(async (db) => {
    const existing = await db.collection("subscribers").findOne({ email: normalizedEmail });

    if (existing) {
      res.status(200).json({ message: "You're already subscribed!" });
      return;
    }

    await db.collection("subscribers").insertOne({
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
    });

    notifyNewSubscriber(normalizedEmail); // best-effort, never blocks this response

    res.status(201).json({ message: "Subscribed!" });
  }, res);
});

// In production, serve the built React app for any request that isn't
// one of the API routes above (this is what lets the whole blog run as a
// single deployed service).
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client", "build");
  app.use(express.static(clientBuildPath));
  app.use((req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
