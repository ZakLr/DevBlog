"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../state/store";

import { Blog, User } from "../../../../lib/types";
import Link from "next/link";
import RecentBlogs from "@/app/profile/recentblogs";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import Pagination from "@/app/home/Pagination";

export default function Profile(params: {
  params: {
    id: string;
  };
}) {
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  const ref = useRef<HTMLHeadingElement>(null);
  const [blogs, setBlogs] = useState<Blog[] | null>();
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const fetchBlogs = async (page: number) => {
      const url = new URL(
        `http://localhost:3000/api/user/blogs/${params.params.id}`
      );
      url.searchParams.append("page", page.toString()); // Add query parameters here

      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("data",data)
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
      } else {
        console.error("Failed to fetch recent blogs.");
      }
    };
    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:3000/api/user/getuserpage/${params.params.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user.");
      }
    };
    fetchBlogs(currentPage);
    fetchUser();
  }, [currentPage]);

  return (
    <div>
      <section className="w-full overflow-hidden bg-background-primary pt-32 min-h-screen">
        <div className="flex flex-col ">
          <div className="w-full max-w-screen-lg mx-auto flex flex-col sm:flex-row justify-between items-center px-4 py-6">
            <div className="flex gap-6 items-center">
              {user?.pfp ? (
                <img
                  src={user?.pfp}
                  alt=""
                  className="rounded-full w-[7rem] h-[7rem] sm:w-[8rem] sm:h-[8rem] md:w-[10rem] md:h-[10rem] lg:w-[12rem] lg:h-[12rem] outline outline-2 outline-offset-2 outline-highlight"
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw3fHxwZW9wbGV8ZW58MHwwfHx8MTcxMTExMTM4N3ww&ixlib=rb-4.0.3&q=80&w=1080"
                  alt="User Profile"
                  className="rounded-full w-[7rem] h-[7rem] sm:w-[8rem] sm:h-[8rem] md:w-[10rem] md:h-[10rem] lg:w-[12rem] lg:h-[12rem] outline outline-2 outline-offset-2 outline-highlight"
                />
              )}
              <div className="flex flex-col text-center sm:text-left">
                <h1 className="mt-4 sm:mt-0 text-text-primary text-xl sm:text-3xl lg:text-4xl font-serif">
                  {user?.firstName + " " + user?.lastName}
                </h1>
                <h2 className="mt-4 sm:mt-0 text-text-primary text-md sm:text-2xl lg:text-2xl font-serif">
                  {user && user.name ? user.name : "Blog User"}
                </h2>
                <h3 className="opacity-70 text-highlight  text-sm sm:text-xl lg:text-2xl font-serif">
                  {user && user.job ? user.job : "Software Engineer"}
                </h3>
              </div>
            </div>
          </div>

          <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
            {/*social links */}
            <div className="flex gap-3">
              
              
              <Link href={user?.instagram ? user?.instagram : ""}>
                <FaInstagram className="text-highlight text-4xl hover:cursor:pointer" />
              </Link>

              <Link href={user?.linkedin ? user?.linkedin : ""}>
                <FaLinkedin
                  className="text-highlight text-4xl hover:cursor:pointer"
                  href={user?.linkedin ? user?.linkedin : ""}
                />
              </Link>
              <Link href={user?.facebook ? user?.facebook : ""}>
                <FaFacebook
                  className="text-highlight text-4xl hover:cursor:pointer"
                  href={user?.facebook ? user?.facebook : ""}
                />
              </Link>
            </div>
            {/*Bio */}
            <p className="w-fit text-text-secondary text-md max-w-3xl text-center pt-5">
              {user?.bio
                ? user?.bio
                : "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam"}
            </p>

            <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
              <div className="w-full flex sm:flex-row xs:flex-col gap-9 justify-center">
                <div className="w-full">
                  <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                    <div className="flex gap-4 pb-3">
                      <dt className="mb-1  text-text-third md:text-lg ">
                        First Name:
                      </dt>
                      <dd className="text-lg font-semibold text-text-secondary">
                        {user?.firstName}
                      </dd>
                    </div>
                    <div className="flex gap-4 py-3">
                      <dt className="mb-1 text-text-third md:text-lg ">
                        Last Name
                      </dt>
                      <dd className="text-lg font-semibold text-text-secondary">
                        {user?.lastName}
                      </dd>
                    </div>
                    <div className="flex gap-4 py-3">
                      <dt className="mb-1 text-text-third md:text-lg ">
                        Total blogs commented:
                      </dt>
                      <dd className="text-lg font-semibold text-text-secondary">
                        {user?.lastName}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="w-full">
                  <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                    <div className="flex gap-4 pb-3">
                      <dt className="mb-1  text-text-third md:text-lg ">
                        Email:
                      </dt>
                      <dd className="text-lg font-semibold text-text-secondary">
                        {user?.email}
                      </dd>
                    </div>
                    <div className="flex gap-4 py-3">
                      <dt className="mb-1 text-text-third md:text-lg ">
                        website
                      </dt>
                      <dd className="text-lg font-semibold text-text-secondary">
                        {user?.website}
                      </dd>
                    </div>
                    <div className="flex gap-4 py-3">
                      <dt className="mb-1 text-text-third md:text-lg ">
                        Total blogs commented:
                      </dt>
                      <dd className="text-lg font-semibold text-text-secondary">
                        {user?.lastName}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section ref={ref}>
        <div>{ user?.firstName + "'s blogs"}</div>
        <RecentBlogs cards={blogs || []} />
      </section>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        reference={ref}
        
      />
    </div>
  );
}
