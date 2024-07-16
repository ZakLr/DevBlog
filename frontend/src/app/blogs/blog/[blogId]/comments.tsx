"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../state/store";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { Comment } from "../../../../../lib/types";

const customComponents = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1 className="text-2xl font-bold text-highlight underline decoration-2 underline-offset-4 italic p-2" {...props} />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-xl font-bold text-text-secondary underline underline-offset-4 p-2" {...props} />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-lg font-bold text-text-secondary p-2" {...props} />
  ),
  h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h4 className="text-lg font-bold text-text-secondary p-2" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-base leading-relaxed text-text-primary p-2" {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc pl-4 py-1" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="py-1 mx-2" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote className="pl-2 border-l-2 border-text-secondary italic py-1 text-sm" {...props} />
  ),
  code: (props: React.HTMLProps<HTMLElement>) => (
    <code className="bg-background-secondary rounded p-1 text-xs" {...props} />
  ),
  pre: (props: React.HTMLProps<HTMLPreElement>) => (
    <pre className="bg-background-primary text-background-secondary rounded-lg p-2 text-xs overflow-x-auto" {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="w-full max-h-48 rounded-lg shadow-lg mx-auto" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-text-third hover:text-highlight underline text-sm" {...props} />
  ),
  table: (props: React.HTMLProps<HTMLTableElement>) => (
    <table className="min-w-full divide-y divide-gray-200 table-auto text-sm" {...props} />
  ),
  thead: (props: React.HTMLProps<HTMLTableSectionElement>) => (
    <thead className="bg-gray-50 text-xs" {...props} />
  ),
  tbody: (props: React.HTMLProps<HTMLTableSectionElement>) => (
    <tbody className="bg-white divide-y divide-gray-200 text-xs" {...props} />
  ),
  tr: (props: React.HTMLProps<HTMLTableRowElement>) => <tr className="text-sm" {...props} />,
  th: (props: React.HTMLProps<HTMLTableHeaderCellElement>) => (
    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide" {...props} />
  ),
  td: (props: React.HTMLProps<HTMLTableDataCellElement>) => (
    <td className="px-4 py-2 whitespace-nowrap text-xs" {...props} />
  ),
  em: (props: React.HTMLProps<HTMLElement>) => (
    <em className="italic text-sm" {...props} />
  ),
  strong: (props: React.HTMLProps<HTMLElement>) => (
    <strong className="font-bold text-sm" {...props} />
  ),
};

export default function Comments({ params }: { params: { blogId: string } }) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const currentUser = useSelector((state: RootState) => state.users.currentUser);
    
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/blog/getcomments/${params.blogId}`);
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/blog/addcomment/${params.blogId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser?.id,
          content: newComment,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowModal(false);
        setNewComment("");
        alert("Comment added successfully!");
      } else {
        console.error("Error adding comment:", data);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLikeComment = async (id: string) => { 
    try {
      const response = await fetch(`http://localhost:3000/api/blog/likecomment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        // Update the state to reflect the new like count
        setComments((prevComments) => {
          if (!prevComments) return null;
          return prevComments.map((comment) => {
            if (comment.id === id) {
              return {
                ...comment,
                likes: data.likes, // Assuming the API returns updated like count
              };
            }
            return comment;
          });
        });
        alert("Comment liked successfully!");
      } else {
        console.error("Error liking comment:", data);
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  }

  const handleUnlike = async (id: string) => { 
    try {
      const response = await fetch(`http://localhost:3000/api/blog/unlikecomment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        // Update the state to reflect the new like count
        setComments((prevComments) => {
          if (!prevComments) return null;
          return prevComments.map((comment) => {
            if (comment.id === id) {
              return {
                ...comment,
                likes: data.likes, // Assuming the API returns updated like count
              };
            }
            return comment;
          });
        });
        alert("Comment unliked successfully!");
      } else {
        console.error("Error unliking comment:", data);
      }
    } catch (error) {
      console.error("Error unliking comment:", error);
    }
  }

  return (
    <div className="w-full my-8">
      <div className="mx-8">
        <h2 className="text-2xl font-bold mb-4 text-text-primary text-center flex justify-between items-baseline">
          Comments
          <button
            className="mt-6 bg-highlight text-white px-4 py-2 rounded-lg shadow hover:bg-highlight/70"
            onClick={() => setShowModal(true)}
          >
            Add Comment
          </button>
        </h2>
      </div>

      <div className="space-y-6 mx-8">
        {comments?.map((comment, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 bg-background-secondary p-4 rounded-lg shadow-md"
          >
            <img
              src={comment?.author?.pfp || "/default-avatar.png"}
              alt={comment?.author?.name || "User Avatar"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm text-text-secondary">
                By: {comment?.author?.name || comment.author?.email}
              </p>
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={customComponents}
              >
                {comment?.content}
              </ReactMarkdown>
              <small className="text-text-secondary">
                {new Date(comment?.createdAt).toLocaleDateString()}
              </small>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className="flex items-center justify-center text-white bg-highlight hover:bg-highlight-dark p-2 rounded-full transition-colors duration-300 shadow-lg"
                >
                  <FaThumbsUp className="h-4 w-4" />
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </button>
                <button
                  onClick={() => handleUnlike(comment.id)}
                  className="flex items-center justify-center text-white bg-red-500 hover:bg-red-600 p-2 rounded-full transition-colors duration-300 shadow-lg"
                >
                  <FaThumbsDown className="h-4 w-4" />
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-background-secondary p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">New Comment</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full h-32 p-2 border border-text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight"
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-300 text-text-primary px-4 py-2 rounded-lg hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-highlight text-text-primary px-4 py-2 rounded-lg shadow hover:bg-yellow-500"
                onClick={handleAddComment}
              >
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
