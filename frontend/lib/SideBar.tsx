'use client';

import React, { useEffect, useState } from 'react'
import { Blog } from './types'

export default function SideBar() {
    const [recentBlogs,setRecentBlogs] = useState<Blog[]>()
    const [trendingCategories, setTrendingCategories] = useState<String[]>()

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/blog/sidebar', {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' },
                })
                const data = await response.json()
                setRecentBlogs(data.recentBlogs);
                setTrendingCategories(data.trendingCategories);
            } catch (error) {
                console.log(error)
            }
        }

        fetchSidebarData();
    },[])

  return (
    <section className="w-1/4 px-4">
            <div className="bg-background-secondary p-4 rounded-lg">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Recent Blogs
              </h2>
              <ul className="list-none">
                {recentBlogs?.map((blog) => (
                  <li key={blog.id} className="mb-2">
                    <a
                      href="#"
                      className="text-text-secondary hover:text-text-primary"
                    >
                      {blog.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background-secondary p-4 mt-4 rounded-lg">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Trending Categories
              </h2>
              <ul className="list-none">
                {trendingCategories?.map((category) => (
                  <li  className="mb-2">
                    <a
                      href="#"
                      className="text-text-secondary hover:text-text-primary"
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
      </section>
  )
}
