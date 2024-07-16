"use client";

import React, { useContext, useEffect, useState } from "react";

import FeedComponent from "./FeedComponent";
import { User } from "../../../lib/types";
import UserContext from "../../../lib/UserContext";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../../state/features/user/userSlice";
import Header from "./Header";
import Search from "../../../lib/Search";
import DotsEffect from "../../../lib/DotsEffect";

export default function Feed() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch("http://localhost:3000/api/user/getuser", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      dispatch(setCurrentUser(data));
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="overflow-x-hidden overflow-y-visible relative ">
      <Header />
      <FeedComponent />
      
      <DotsEffect top={0} opacity={0.4} scale={2} rows={9} columns={3} rotation={45} />

      

    </div>
  );
}
