"use client";

import React, { useState, useEffect, useRef } from "react";
import { getFeed } from "./Feed";
import { Blog } from "../../../lib/types";
import Link from "next/link";
import Pagination from "./Pagination";
import SideBar from "../../../lib/SideBar";
import DotsEffect from "../../../lib/DotsEffect";
import { FaCommentAlt, FaThumbsUp } from "react-icons/fa";

export default function Feed() {
  const [cards, setCards] = useState<Blog[]>();
  const ref = useRef<HTMLHeadingElement>(null);
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const [totalPages, setTotalPages] = useState(0); // State to track total pages

  useEffect(() => {
    fetchData(currentPage); // Fetch data when component mounts or when currentPage changes
  }, [currentPage]);

  console.log(cards);

  const fetchData = async (page: number) => {
    try {
      const response = await getFeed(page); // Assuming getFeed returns a Promise that resolves to a response
      const data = await response.json(); // Convert the response to JSON
      setCards(data.blogs); // Update the state with the fetched data
      setTotalPages(data.totalPages); // Update the total pages
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error as needed
    }
  };

  return (
    <div className="max-w-screen mx-auto p-16 flex bg-background-primary text-text-primary relative overflow-visible z-10">
      <section className="w-3/4">
        <h1 className="text-5xl mb-5 text-text-secondary" ref={ref}>
          Recommendations for you:
        </h1>
        <div className="flex flex-col gap-10 z-10">
          {cards?.map((card, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-4 bg-background-secondary text-text-primary transition duration-300 rounded overflow-hidden shadow-lg"
            >
              <img
                src={card.picture}
                className="md:w-1/3 w-full object-cover"
                alt="Article"
              />
              <div className="flex flex-col justify-between p-4 w-full">
                <div>
                  <p className="rounded-full h-12 w-12 text-text-secondary">
                    {card.author?.email}
                  </p>
                  <Link
                    className="text-lg mb-3 font-semibold"
                    href={`/blogs/blog/${card.id}`}
                  >
                    {card.title}
                  </Link>
                  <p className="text-sm text-text-secondary">
                    {card.content.length > 200
                      ? card.content.slice(0, 200) + "..."
                      : card.content}
                  </p>
                </div>
                <div className="w-full">
                  <hr className="my-4" />
                  <div className="flex justify-between w-full">
                    <div className="flex justify-between w-full">
                      <span className="text-xs text-highlight">
                        {card?.topics ? card?.topics : "ARTICLE"}
                      </span>
                      <div className="flex gap-3">
                        <span className="flex items-baseline text-highlight">
                          <FaThumbsUp className="h-4 w-4 mr-1" /> {card.likes}
                        </span>
                        <span className="flex items-baseline text-highlight">
                          <FaCommentAlt className="h-4 w-4 mr-1" />{" "}
                          {card.comments || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          reference={ref}
        />
      </section>
      <SideBar />

      <DotsEffect
        top={30}
        right={-2}
        scale={0.7}
        rows={8}
        columns={3}
        rotation={45}
        opacity={0.6}
      />
    </div>
  );
}
