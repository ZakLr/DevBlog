"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import Link from "next/link";
import { logout } from "../state/features/user/userSlice";
import { useRouter } from "next/navigation";
import Search from "../lib/Search";
import { FaPlus, FaSearch } from "react-icons/fa";
import { TfiPencilAlt } from "react-icons/tfi";

interface Route {
  name: string;
  href: string;
  isActive: boolean;
}

const routes: Route[] = [
  { name: "Home", href: "/", isActive: true },
  { name: "About", href: "/about", isActive: false },
  { name: "Blog", href: "/blog", isActive: false },
  { name: "Contact", href: "/contact", isActive: false },
];

interface NavMenuProps {
  routes: Route[];
}

const NavMenu: React.FC<NavMenuProps> = ({ routes }) => (
  <ul
    className="flex flex-col lg:flex-row justify-center items-center text-3xl gap-6 lg:text-base lg:gap-2 absolute h-screen w-screen top-0 left-full lg:left-0 lg:relative lg:h-auto lg:w-auto bg-white dark:bg-[#0b1727] lg:bg-transparent"
    id="navbar"
  >
    {routes.map((route, i) => (
      <li key={i}>
        <Link href={route.href}>
          <a
            className={`px-4 ${
              route.isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
            }`}
          >
            {route.name}
          </a>
        </Link>
      </li>
    ))}
  </ul>
);

NavMenu.propTypes = {
  routes: PropTypes.array.isRequired,
};

const Navbar: React.FC = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/signin");
    setToggleMenu(!toggleMenu);
  };

  return (
    <nav className="fixed  top-4 left-1/2 transform -translate-x-1/2 z-50 w-[60vw] bg-background-secondary/60 rounded-3xl backdrop-blur-md backdrop-opacity-60 ">
      <div className="w-full mx-auto py-4">
        <div className="flex justify-between items-center w-5/6 mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-16">
            <Link
              href="/home"
              className="text-3xl font-serif font-bold text-highlight"
            >
              &lt;Dev Blog/&gt;
            </Link>
          </div>

          {/*search input */}
          {searchActive &&
            <div className="">
            <Search />
            </div>
          }

          {/* User Profile & Logout */}
          <div className="flex items-center gap-6 relative">
            {/*Creating a blog button */}
            <div className="flex gap-3 text-xl text-highlight ">
              <button onClick={() => {
                setSearchActive(!searchActive);
              }}>
                <FaSearch className=""/>
              </button>
              <Link href="/blogs/create" className="w-full">
                <TfiPencilAlt className="" />
              </Link>
            </div>
            {currentUser ? (
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={currentUser.pfp}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full cursor-pointer"
                    onClick={() => setToggleMenu(!toggleMenu)}
                  />
                  {/* Submenu */}
                  {toggleMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 text-xl transition ease-in-out duration-400 transform  scale-95  hover:scale-100">
                      
                      {/* <p className="px-4 py-2 text-text-secondary">
                        {currentUser.firstName} {currentUser.lastName}
                      </p> */}
                      <button onClick={()=>{setToggleMenu(!toggleMenu)}}>
                        <Link
                          href="/profile"                         
                          className="block px-4 py-2 text-gray-500 hover:text-blue-600"
                        >
                          View Profile
                        </Link>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:text-red-800"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/signin" className="text-lg font-semibold">
                Sign In
              </Link>
            )}
            {/* Mobile navigation toggle */}
            {/* <div className="lg:hidden flex items-center text-highlight">
              <button onClick={() => setToggleMenu(!toggleMenu)}>☰</button>
            </div> */}
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {/* <div className={`fixed z-40 w-full bg-white text-black overflow-hidden flex flex-col lg:hidden gap-12 origin-top duration-700 ${!toggleMenu ? "h-0" : "h-screen"}`}>
        <div className="px-12 py-16">
          <div className="flex flex-col gap-8 font-bold tracking-wider">
            {routes.map((route, i) => (
              <Link href={route.href} key={i} className="pl-4 border-l-4 border-gray-600">{route.name}</Link>
            ))}
            {currentUser && (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={currentUser.pfp}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <p className="text-lg font-semibold">{currentUser.name}</p>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
                <button
                  onClick={handleLogout}
                  className="bg-text-alert text-white px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div> */}
    </nav>
  );
};

export default Navbar;
