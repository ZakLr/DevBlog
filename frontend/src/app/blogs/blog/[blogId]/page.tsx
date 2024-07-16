"use client";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // or any other style of your choice
import type { Blog } from "../../../../../lib/types";
import remarkGfm from "remark-gfm";
import Comments from "./comments";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../state/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SideBar from "../../../../../lib/SideBar";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const customComponents = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1
      className="text-3xl sm:text-5xl font-bold text-highlight underline decoration-4 underline-offset-8 italic p-5"
      {...props}
    />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2
      className="text-2xl sm:text-3xl font-bold text-text-secondary underline underline-offset-8 p-4"
      {...props}
    />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2
      className="text-xl sm:text-2xl font-bold text-text-third p-4"
      {...props}
    />
  ),
  h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2
      className="text-lg sm:text-xl font-bold text-text-secondary p-4"
      {...props}
    />
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



export default function Blog(params: {
  params: {
    blogId: string;
  };
}) {
  const [likes, setLikes] = useState(0);
  const [blog, setBlog] = useState<Blog>();
  const router = useRouter();
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );

  useEffect(() => {
    const fetchBlog = async () => {
      const response = await fetch(
        `http://localhost:3000/api/blog/get/${params.params.blogId}`
      );
      const data = await response.json();
      setBlog(data.blog);
      setLikes(data.blog.likes); // Initialize likes count from the blog data
    };

    fetchBlog();
  }, []);

  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/blog/like/${params.params.blogId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setLikes(likes + 1); // Update the likes count in the UI
        alert("Blog liked successfully!");
      } else {
        console.error("Error liking blog:", data);
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/blog/unlike/${params.params.blogId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setLikes(likes - 1); // Update the likes count in the UI
        alert("Blog unliked successfully!");
      } else {
        console.error("Error unliking blog:", data);
      }
    } catch (error) {
      console.error("Error unliking blog:", error);
    }
  };

  const formattedDate = blog?.createdAt
    ? format(new Date(blog.createdAt), "MMMM dd, yyyy")
    : "";
  return (
    <div className="flex flex-col pt-20 bg-background-primary">
      <div className="bg-background-primary py-8 mx-8">
        {blog?.pictureUrl && (
          <img
            src={blog.pictureUrl}
            alt="Blog Image"
            className="rounded-lg shadow-lg bg-cover bg-center h-96 w-full object-cover"
          />
        )}
        <div className="container mx-auto flex flex-col md:flex-row ">
          <div className="w-full md:w-3/4 px-1 bg-background-secondary rounded-lg ">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              remarkPlugins={[remarkGfm]}
              components={customComponents}
            >
              {`
# ${blog?.title}

*By ${blog?.author?.firstName} ${blog?.author?.lastName} - ${formattedDate}*

---

${blog?.content}
`}
            </ReactMarkdown>
          </div>
          <div className="w-full md:w-1/4 px-4 mt-4 md:mt-0">
            {currentUser?.id === blog?.authorId && (
              <Link
                href={`/blogs/edit/${params.params.blogId}`}
                className="text-xl text-white bg-highlight p-2 rounded-xl inline-block mb-4 "
              >
                Edit
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 5a1 1 0 011-1h2.586a1 1 0 01.707.293l9 9a1 1 0 010 1.414l-2 2a1 1 0 01-1.414 0l-9-9A1 1 0 012 7.586V10H1a1 1 0 01-1-1V5zm17.707 9.707a1 1 0 010 1.414l-2 2a1 1 0 01-1.414 0l-9-9A1 1 0 016.414 7H9V6a1 1 0 011-1h4a1 1 0 011 1v4h1.586a1 1 0 01.707.293l2 2zM9 6v2H7V7a1 1 0 011-1h1zm2 2h2v2h-2V8zm-2 2V9h2v2H9zm2 0h2v2h-2v-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            )}
            <div>
              {currentUser?.id !== blog?.authorId && (
                <div className="flex justify-center items-center m-4 space-x-4 ">
                  <button
                    onClick={handleLike}
                    className="flex items-center justify-center text-white bg-highlight hover:bg-highlight-dark p-3 rounded-full transition-colors duration-300 shadow-lg"
                  >
                    <FaThumbsUp className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleUnlike}
                    className="flex items-center justify-center text-white bg-red-500 hover:bg-red-600 p-3 rounded-full transition-colors duration-300 shadow-lg"
                  >
                    <FaThumbsDown className="h-6 w-6" />
                  </button>
                  <span className="text-xl text-text-primary ml-4">
                    Likes: {likes}
                  </span>
                </div>
              )}
              <SideBar />
            </div>
          </div>
        </div>
      </div>

      <Comments params={params.params} />
    </div>
  );
}
