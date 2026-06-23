require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

//initialize middleware
//function of express. It passes incoming JSON payload
app.use(express.json({ extended: false }));

const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db("samutech");
    await operations(db);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to database", error });
  }
};

app.get("/api/articles/:name", async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    // No comments stored for this article yet — that's expected for a
    // fresh database, not an error. Return an empty comments list instead
    // of 404 so the page can render normally.
    res.status(200).json(articleInfo || { name: articleName, comments: [] });
  }, res);
});

app.post("/api/articles/:name/add-comments", async (req, res) => {
  const { username, text } = req.body;
  const articleName = req.params.name;

  if (!username?.trim() || !text?.trim()) {
    return res.status(400).json({ message: "username and text are required" });
  }

  withDB(async (db) => {
    // upsert: true creates the article's comment document on its first
    // comment, so there's no separate seed step needed before going live.
    await db.collection("articles").updateOne(
      { name: articleName },
      { $push: { comments: { username, text } } },
      { upsert: true }
    );

    const updatedArticleInfo = await db.collection("articles").findOne({ name: articleName });
    res.status(200).json(updatedArticleInfo);
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
