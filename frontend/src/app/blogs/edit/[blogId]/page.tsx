"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Edit(params: { params: { blogId: string } }) {
  const [blog, setBlog] = useState({ title: "", content: "", picture: null });
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/blog/get/${params.params.blogId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog details");
        }
        const data = await response.json();
        setBlog(data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, []);

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
    if (blog.picture) {
      formData.append("picture", blog.picture);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/blog/edit/${params.params.blogId}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        alert("Blog updated successfully!");
        router.push(`/blogs/blog/${params.params.blogId}`);
      } else {
        alert("Failed to update blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Error updating blog.");
    }
  };

  const handleDeleteAction = async () => {
    setDeleteModal(true);
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/blog/delete/${params.params.blogId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Blog deleted successfully!");
        router.push(`/home`);
      } else {
        alert("Failed to delete blog.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Error deleting blog.");
    }
  }

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
      <button onClick={handleDeleteAction} className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
        Delete Blog
      </button>

      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this blog? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
