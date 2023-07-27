import React from "react";
import { Helmet } from "react-helmet";
import PersistentDrawerLeft from "./PersistentDrawerLeft";

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <div>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
        </div>
        <title>{title}</title>
      </Helmet>
      <PersistentDrawerLeft />
      <main style={{ minHeight: "80vh" }}>{children}</main>
    </div>
  );
};

Layout.defaultProps = {
  title: "Store Management app",
  description: "React final project",
  keywords: "react,redux,firebase",
  author: "Roy Atali",
};

export default Layout;
