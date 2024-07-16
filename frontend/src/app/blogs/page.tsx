"use client";

import React, { useState } from "react";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // or any other style of your choice
import { useRouter } from "next/navigation";

const recentPosts = [
  { id: 1, title: "Blog Post 1" },
  { id: 2, title: "Blog Post 2" },
  { id: 3, title: "Blog Post 3" },
  { id: 4, title: "Blog Post 4" },
];

const categories = [
  { id: 1, title: "Category 1" },
  { id: 2, title: "Category 2" },
  { id: 3, title: "Category 3" },
  { id: 4, title: "Category 4" },
];

const mainBlogContent = {
  title: "Main Blog Title",
  publishedDate: "April 4, 2023",
  imageUrl:
    "https://images.unsplash.com/photo-1506157786151-b8491531f063" ||
    "alternative",
  content:
    "This is the main content of the blog. It can be as long as needed and include HTML elements.",
};

const authorInfo = {
  name: "Author Name",
  bio: "This is a short bio of the author.",
};

const customComponents = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1
      className="text-5xl font-bold text-blue-600 underline decoration-4 underline-offset-8 italic p-5"
      {...props}
    />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-4xl font-semibold text-green-500 p-4" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-2xl leading-relaxed p-3 " {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc pl-10 py-2" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="py-1" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote
      className="pl-4 border-l-4 border-gray-400 italic py-2"
      {...props}
    />
  ),
  code: (props: React.HTMLProps<HTMLElement>) => (
    <code className="bg-gray-100 rounded p-1 text-sm" {...props} />
  ),
  pre: (props: React.HTMLProps<HTMLPreElement>) => (
    <pre
      className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto"
      {...props}
    />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="max-w-3/2 h-auto rounded-lg shadow-lg mx-auto" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-blue-500 hover:text-blue-700 underline" {...props} />
  ),
  table: (props: React.HTMLProps<HTMLTableElement>) => (
    <table
      className="min-w-full divide-y divide-gray-200 table-auto"
      {...props}
    />
  ),
  thead: (props: React.HTMLProps<HTMLTableSectionElement>) => (
    <thead className="bg-gray-50" {...props} />
  ),
  tbody: (props: React.HTMLProps<HTMLTableSectionElement>) => (
    <tbody className="bg-white divide-y divide-gray-200" {...props} />
  ),
  tr: (props: React.HTMLProps<HTMLTableRowElement>) => <tr {...props} />,
  th: (props: React.HTMLProps<HTMLTableHeaderCellElement>) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: React.HTMLProps<HTMLTableDataCellElement>) => (
    <td className="px-6 py-4 whitespace-nowrap" {...props} />
  ),
  em: (props: React.HTMLProps<HTMLElement>) => (
    <em className="italic" {...props} />
  ),
  strong: (props: React.HTMLProps<HTMLElement>) => (
    <strong className="font-bold" {...props} />
  ),
};


export default function Blog( params: { blogId: number }) {
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
    setLikes(likes + 1);
  };
  const id = params.blogId;

  return (
    <div className="flex flex-col">
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {mainBlogContent.title}
            {id}
          </h1>
          
          <p className="text-gray-600">
            Published on {mainBlogContent.publishedDate}
          </p>
          <div className="text-gray-800 mt-4">
            <h2 className="text-lg font-bold">{authorInfo.name}</h2>
            <p>{authorInfo.bio}</p>
          </div>
          <button
            className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
            onClick={handleLike}
          >
            Like ({likes})
          </button>
        </div>
      </div>
      <div className="bg-white py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row">
          <div className="w-full md:w-3/4 px-4">
            <img
              src={mainBlogContent.imageUrl}
              alt="Blog Featured Image"
              className="mb-8"
            />
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={customComponents}
            >
              {`# Welcome to My Blog

This is a **sample blog post** to demonstrate markdown rendering in React.

## Introduction

Markdown is a lightweight markup language with plain-text formatting syntax. Its design allows it to be converted to many output formats, but the original tool by the same name only supports HTML.

Here's a code snippet example in JavaScript:

\`\`\`javascript
function add(a, b) {
  return a + b;
}
\`\`\`

### Lists

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

1. First item
2. Second item
   1. Subitem 1
   2. Subitem 2

### Blockquotes

> Markdown is a text-to-HTML conversion tool for writers.

### Tables

| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |

### Thematic Breaks

---

### Images

![Markdown Logo](https://markdown-here.com/img/icon256.png)

### Links

[GitHub](https://github.com)

### Inline Code

This is an inline code example: \`const x = 100;\`

### Emphasis

*Italic*, **Bold**, ~~Strikethrough~~

`}
            </ReactMarkdown>
          </div>
          <div className="w-full md:w-1/4 px-4">
            <div className="bg-gray-100 p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recent Posts
              </h2>
              <ul className="list-none">
                {recentPosts.map((post) => (
                  <li key={post.id} className="mb-2">
                    <a href="#" className="text-gray-700 hover:text-gray-900">
                      {post.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 p-4 mt-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Categories
              </h2>
              <ul className="list-none">
                {categories.map((category) => (
                  <li key={category.id} className="mb-2">
                    <a href="#" className="text-gray-700 hover:text-gray-900">
                      {category.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
