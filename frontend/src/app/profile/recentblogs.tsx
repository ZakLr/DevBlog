'use client'

import Link from "next/link";
import { Blog } from "../../../lib/types";
import { useRouter } from "next/navigation";
export default function RecentBlogs({ cards }: { cards: Blog[] }) {
  const router = useRouter()
  return (
    <div className="max-w-screen-xl mx-auto p-16 z-20">
      <div className="flex flex-col gap-10">
        {cards?.map((card, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-4 justify-center bg-background-secondary text-text-primary transition duration-300 rounded-xl overflow-hidden shadow-xl px-2"
          >
            <div className="flex flex-col justify-between p-4 w-full">
              <div>
                <div className="flex items-center w-full">
                <img
                  src={card.author?.pfp}
                  alt=""
                  className="h-16 w-16 rounded-full m-3"
                />
                  <div>
                  <button className="text-text-secondary text-2xl w-full font-semibold hover:cursor-pointer" onClick={()=>router.push(`/user/${card.authorId}`)}>
                  {`${
                    card.author?.firstName
                      ? card.author?.firstName
                      : card.author?.name
                      }  ${card.author?.lastName}`
                    }
                </button>
                  <p className="  text-text-secondary text-md w-full italic">
                  {`${card.author?.name}`
                    }
                </p>
                </div>
                </div>
                <Link
                  className="text-xl mb-3 font-semibold"
                  href={`/blogs/blog/${card.id}`}
                >
                  {card.title}
                </Link>
                <div className="text-md text-text-primary/70 text-lg">
                  {card.subtitle? card.subtitle: "Subtitle placeholder"}
                </div>
                <p className="text-sm text-text-secondary">
                  {card.content.length > 200
                    ? card.content.slice(0, 200) + "..."
                    : card.content}
                </p>
              </div>
              <div className="w-full">
                <hr className="my-4" />
                <div className="flex justify-between  w-full">
                  <div className="flex justify-between w-full">
                    <span className="text-xs text-text-secondary">{ card.topics ? card.topics : "ARTICLE"}</span>
                    <div className="flex gap-3">
                      <span>👍 {card.likes}</span>
                      <span>💬 {card.comments || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
