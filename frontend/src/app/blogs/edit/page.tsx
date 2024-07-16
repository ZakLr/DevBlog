"use client";

import React, { useState } from "react";
import { Blog } from "../../../../lib/types";
import { useRouter } from "next/navigation";

export default function Edit(props:Blog) {
    const [blog, setBlog] = useState({ title: "", content: "", picture: null });
    const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files) {
      setBlog((prevBlog) => ({ ...prevBlog, picture: files[0] }));
    } else {
      setBlog((prevBlog) => ({ ...prevBlog, [name]: value }));
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("content", blog.content);
    if (blog.picture) {
      formData.append("picture", blog.picture);
    }

    
    fetch(`http://localhost:3000/api/blog/edit/${props.id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
            alert("Blog updated successfully!");
            router.push(`/blogs/${props.id}`);
        } else {
          alert("Failed to update blog.");
        }
      })
      .catch((error) => {
        console.error("Error updating blog:", error);
        alert("Error updating blog.");
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-semibold mb-4">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={blog.title}
                      onChange={handleChange}
                      placeholder={`${props.title}`}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content:</label>
          <textarea
            name="content"
            id="content"
            value={blog.content}
                      onChange={handleChange}
                        placeholder={`${props.content}`}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Picture:</label>
          <input
            type="file"
            name="picture"
            id="picture"
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Update Blog
        </button>
      </form>
    </div>
  );
}