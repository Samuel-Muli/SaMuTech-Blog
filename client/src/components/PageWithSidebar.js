import React from "react";
import Sidebar from "./Sidebar";

const PageWithSidebar = ({ children, articles, searchValue, onSearchChange }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-12">
        <div className="min-w-0">{children}</div>
        <Sidebar articles={articles} searchValue={searchValue} onSearchChange={onSearchChange} />
      </div>
    </div>
  );
};

export default PageWithSidebar;
