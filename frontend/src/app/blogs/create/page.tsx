"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import remarkGfm from "remark-gfm";

const validTopics = [
  "Python",
  "JavaScript",
  "Java",
  "C",
  "Cpp",
  "CSharp",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "TypeScript",
  "HTML",
  "CSS",
  "SQL",
  "NoSQL",
  "GraphQL",
  "REST",
  "WebDev",
  "MobileDev",
  "GameDev",
  "AI",
  "ML",
  "DL",
  "IoT",
  "Cloud",
  "DevOps",
  "Testing",
  "Security",
  "Blockchain",
  "DataScience",
  "Other",
];

import "@mdxeditor/editor/style.css";
import { RootState } from "../../../../state/store";
import { useSelector } from "react-redux";
import MarkdownInstructions from "./MarkdownInstructions";

const customComponents = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1
      className="text-5xl font-bold text-highlight underline decoration-4 underline-offset-8 italic p-5"
      {...props}
    />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2
      className="text-4xl font-bold text-text-secondary underline underline-offset-8 p-4"
      {...props}
    />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold text-text-secondary p-4" {...props} />
  ),
  h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold text-text-secondary p-4" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-lg leading-relaxed text-text-primary p-3" {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc pl-10 py-2" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="py-1 mx-6" {...props} />
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
    <pre className=" text-white  rounded-lg overflow-x-auto" {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="w-full max-h-96 rounded-lg shadow-lg mx-auto" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-text-third hover:text-blue-700 underline" {...props} />
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

export default function Create() {
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    picture: null,
    topic: "",
  });
  const router = useRouter();
  const [helpModal, setHelpModal] = useState<Boolean>(false);
  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files) {
      setBlog((prevBlog) => ({ ...prevBlog, picture: files[0] }));
    } else {
      setBlog((prevBlog) => ({ ...prevBlog, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("content", blog.content);
    formData.append("topic", blog.topic);
    if (blog.picture) {
      formData.append("picture", blog.picture);
    }

    try {
      const response = await fetch("http://localhost:3000/api/blog/create", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        alert("Blog created successfully!");
        router.push(`/blogs/blog/${data.id}`);
      } else {
        alert("Failed to create blog.");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Error creating blog.");
    }
  };

  const handleHelpModal = async () => {
    setHelpModal(!helpModal);
  };

  return (
    <div className="gap-5  flex flex-col lg:flex-row min-h-screen relative pt-32 bg-background-primary pb-3 px-4">
      <section className="lg:w-1/3 flex flex-col justify-start shadow-2xl rounded-lg p-5 bg-background-secondary">
        <h2 className="text-2xl font-semibold mb-4">Create Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title:
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={blog.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700"
            >
              Topic:
            </label>
            <select
              name="topic"
              id="topic"
              value={blog.topic}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a topic</option>
              {validTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="picture"
              className="block text-sm font-medium text-gray-700"
            >
              Picture:
            </label>
            <input
              type="file"
              name="picture"
              id="picture"
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content:
            </label>
            <textarea
              name="content"
              id="content"
              value={blog.content}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm min-h-64"
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Blog
          </button>
        </form>
      </section>

      <section className="lg:w-2/3 lg:ml-4 mt-8 lg:mt-0 hidden sm:block shadow-2xl rounded-lg p-3 overflow-y-auto max-h-screen bg-background-secondary">
        <h2 className="text-2xl font-semibold mb-4">Blog Content Preview:</h2>
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          remarkPlugins={[remarkGfm]}
          components={customComponents}
          className={"overflow-y-auto max-h-screen"}
        >
          {`# ${blog.title}` + "\n" + blog.content}
        </ReactMarkdown>
      </section>
      <button
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 rounded-full h-12 w-12 bg-highlight text-white grid place-items-center shadow-lg z-10"
        onClick={handleHelpModal}
      >
        ?
      </button>

      {helpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-primary backdrop-blur-sm bg-opacity-50 w-full">
          <div className="relative bg-white w-1/2 max-w-lg p-2 rounded-lg shadow-lg">
            <button
              onClick={() => setHelpModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition duration-150"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="overflow-y-auto max-h-[90vh] w-full">
              <MarkdownInstructions />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
