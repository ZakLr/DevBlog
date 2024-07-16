import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaGithub, FaGlobe } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiNodedotjs, SiExpress, SiPostgresql, SiPrisma } from "react-icons/si";

export default function Footer() {
  return (
    <div className="p-5 bg-highlight text-white">
      <span className="block text-xl mb-3 text-center">
        Built by Zakaria LOURGHI
      </span>
      <div className="flex justify-center items-center space-x-10">
        <div className="flex flex-col items-center">
        <h2 className="text-lg mb-3">My Socials</h2>
          <ul className="flex  space-x-3 ">
            <li>
              <a href="https://facebook.com/zaki.lr.5" className="text-white">
                <FaFacebook size={24} />
              </a>
            </li>
            <li>
              <a href="https://instagram.com/zaki._lr" className="text-white">
                <FaInstagram size={24} />
              </a>
            </li>
            <li>
              <a href="https://github.com/ZakLr" className="text-white">
                <FaGithub size={24} />
              </a>
            </li>
            
          </ul>
        </div>
        <div className="border-l border-gray-600 h-32"></div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg mb-3">Tools Used</h2>
          <ul className="flex  space-x-3">
            <li>
              <a href="https://nextjs.org/" target="_blank" className="text-white">
                <SiNextdotjs size={24} />
              </a>
            </li>
            <li>
              <a href="https://tailwindcss.com/" target="_blank" className="text-white">
                <SiTailwindcss size={24} />
              </a>
            </li>
            <li>
              <a href="https://www.typescriptlang.org/" target="_blank" className="text-white">
                <SiTypescript size={24} />
              </a>
            </li>
            <li>
              <a href="https://nodejs.org/" target="_blank" className="text-white">
                <SiNodedotjs size={24} />
              </a>
            </li>
            <li>
              <a href="https://expressjs.com/" target="_blank" className="text-white">
                <SiExpress size={24} />
              </a>
            </li>
            <li>
              <a href="https://www.postgresql.org/" target="_blank" className="text-white">
                <SiPostgresql size={24} />
              </a>
            </li>
            <li>
              <a href="https://www.prisma.io/" target="_blank" className="text-white">
                <SiPrisma size={24} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
