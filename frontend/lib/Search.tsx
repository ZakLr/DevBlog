'use client';

import React, { useEffect, useState, ChangeEvent, useRef, RefObject } from 'react';
import { Blog, User } from './types';
import Link from 'next/link';

interface SearchResponse {
  users: User[];
  blogs: Blog[];
}

export default function Search() {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const wrapperRef :RefObject<HTMLDivElement>= useRef(null);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (query) {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:3000/api/blog/search?search=${query}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          });
          const data: SearchResponse = await response.json();
          setUsers(data.users || []);
          setBlogs(data.blogs || []);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchSearchData();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event:any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  return (
    <div ref={wrapperRef} className="relative w-full mx-auto z-10">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition duration-300 ease-in-out"
      />
      
      {query && showSuggestions && (
        <>
          <div className="fixed inset-0 z-0" onClick={() => setShowSuggestions(false)}></div>
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border border-gray-200 z-10 mt-1 rounded-md">
            {isLoading ? (
              <div className="p-3 text-center">Loading...</div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {users.length > 0 && (
                  <div>
                    <div className="p-3 font-bold text-text-secondary">Users</div>
                    {users.map(user => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                )}
                {blogs.length > 0 && (
                  <div>
                    <div className="p-3 font-bold text-text-secondary">Blogs</div>
                    {blogs.map(blog => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                )}
                {users.length === 0 && blogs.length === 0 && (
                  <div className="p-3 text-center">No results found</div>
                )}
                <button onClick={() => setShowSuggestions(false)} className="p-3 w-full text-left">Close</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// BlogCard and UserCard components remain unchanged

interface BlogCardProps {
    blog: Blog;
  }
  
  const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    return (
      <Link href={`/blogs/blog/${blog.id}`} className="flex flex-col p-3 border-b border-gray-200 hover:bg-gray-100">
        <div className="font-bold">{blog.title}</div>
        <div className="text-sm text-gray-600">{blog.subtitle}</div>
        <div className="text-xs text-gray-500 mt-1">By {blog.author?.firstName} {blog.author?.lastName}</div>
      </Link>
    );
  };
  
  interface UserCardProps {
    user: User;
  }
  
  const UserCard: React.FC<UserCardProps> = ({ user }) => {
    return (
      <Link href={`/user/${user.id}`} className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-100">
        <img src={user.pfp} alt={`${user.firstName} ${user.lastName}`} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <div className="font-bold">{user.firstName} {user.lastName}</div>
          <div className="text-sm text-gray-600">{user.job}</div>
        </div>
      </Link>
    );
  };
