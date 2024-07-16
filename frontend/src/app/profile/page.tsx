"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { setCurrentUser } from "../../../state/features/user/userSlice";
import RecentBlogs from "./recentblogs";
import { Blog } from "../../../lib/types";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import DotsEffect from "../../../lib/DotsEffect";

export default function Profile() {
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({
    name: currentUser?.name || "",
    bio: currentUser?.bio || "",
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    pfp: currentUser?.pfp || null,
    backgroundImage: currentUser?.backgroundImage || null,
    email: currentUser?.email || "",
    website: currentUser?.website || "",
    job: currentUser?.job || "",
    totalComments: currentUser?.totalComments || 0,
    totalBlogs: currentUser?.totalBlogs || 0,
    instagram: currentUser?.instagram || "userinstagram",
    linkedin: currentUser?.linkedin || "userlinkedin",
    facebook: currentUser?.facebook || "userfacebook",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notification, setNotification] = useState("");
  const [passwordNotification, setPasswordNotification] = useState("");

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files) {
      setUserDetails((prevUser) => ({ ...prevUser, pfp: files[0] }));
    } else {
      setUserDetails((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handlePasswordChange = (e: any) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({ ...prevPasswords, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

    const { pfp, ...userDetailsWithoutPfp } = userDetails;

    // Append user details as a JSON string under a specific key, without the pfp field
    formData.append("userDetails", JSON.stringify(userDetailsWithoutPfp));

    // Check if the images exist and append them to the formData
    if (userDetails.pfp) {
      formData.append("pfp", userDetails.pfp);
    }
    /* if (userDetails.backgroundImage) {
      formData.append("backgroundImage", userDetails.backgroundImage);
    } */

    try {
      const response = await fetch("http://localhost:3000/api/user/update", {
        method: "PUT",
        body: formData, // Send formData instead of JSON
        credentials: "include",
      });
      if (response.ok) {
        setNotification("Profile updated successfully!");
        const data = await response.json();
        dispatch(setCurrentUser(data));
        setShowEditModal(false);
        setTimeout(() => window.location.reload(), 0);
      } else {
        setNotification("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification("Error updating profile.");
    }
  };

  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordNotification("New passwords do not match.");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/changepassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwords),
        }
      );
      if (response.ok) {
        setPasswordNotification("Password changed successfully!");
        setShowPasswordModal(false);
      } else {
        setPasswordNotification("Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordNotification("Error changing password.");
    }
  };
  const [recentblogs, setRecentBlogs] = useState<Blog[] | null>();

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      const response = await fetch(
        "http://localhost:3000/api/user/recentblogs",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setRecentBlogs(data.blogs);
      } else {
        console.error("Failed to fetch recent blogs.");
      }
    };
    fetchRecentBlogs();
  }, []);

  return (
    <div className=" overflow-hidden relative">
      <section className="w-full overflow-hidden bg-background-primary pt-32 min-h-screen ">
        <div className="flex flex-col ">
          <div className="w-full max-w-screen-lg mx-auto flex flex-col sm:flex-row justify-between items-center px-4 py-6">
            <div className="flex gap-6 items-center">
              {currentUser?.pfp ? (
                <img
                  src={currentUser?.pfp}
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
                  {currentUser?.firstName + " " + currentUser?.lastName}
                </h1>
                <h2 className="mt-4 sm:mt-0 text-text-primary/60 text-md sm:text-2xl lg:text-2xl font-serif">
                  {currentUser && currentUser.name
                    ? currentUser.name
                    : "Blog User"}
                </h2>
                <h3 className="opacity-70 text-highlight  text-sm sm:text-xl lg:text-2xl font-serif">
                  {currentUser && currentUser.job
                    ? currentUser.job
                    : "Software Engineer"}
                </h3>
              </div>
            </div>
            <div className="flex gap-4 mt-6 sm:mt-0">
              <button
                className="inline-flex  justify-center py-2 px-4 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-highlight hover:bg-highlight/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </button>
              <button
                className="inline-flex  justify-center py-2 px-4 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-text-primary hover:bg-text-primary/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
            {/*social links */}
            <div className="flex gap-3">
              <Link href={currentUser?.instagram ? currentUser?.instagram : ""}>
                <FaInstagram className="text-highlight text-4xl hover:cursor:pointer" />
              </Link>

              <Link href={currentUser?.linkedin ? currentUser?.linkedin : ""}>
                <FaLinkedin
                  className="text-highlight text-4xl hover:cursor:pointer"
                  href={currentUser?.linkedin ? currentUser?.linkedin : ""}
                />
              </Link>
              <Link href={currentUser?.facebook ? currentUser?.facebook : ""}>
                <FaFacebook
                  className="text-highlight text-4xl hover:cursor:pointer"
                  href={currentUser?.facebook ? currentUser?.facebook : ""}
                />
              </Link>
            </div>
            {/*Bio */}
            <p className="w-fit text-text-secondary text-md max-w-3xl text-center pt-5">
              {currentUser?.bio
                ? currentUser?.bio
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
                        {userDetails.firstName}
                      </dd>
                    </div>
                    <div className="flex gap-4 py-3">
                      <dt className="mb-1 text-text-third md:text-lg ">
                        Last Name
                      </dt>
                      <dd className="text-lg font-semibold text-text-secondary">
                        {userDetails.lastName}
                      </dd>
                    </div>
                    <div className="flex gap-4 py-3">
                      <dt className="mb-1 text-text-third md:text-lg ">
                        Total comments:
                      </dt>
                      <dd className="text-lg font-semibold text-text-secondary">
                        {userDetails.totalComments}
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
                        {userDetails.email}
                      </dd>
                    </div>
                    <div className="flex gap-4 py-3">
                      <dt className="mb-1 text-text-third md:text-lg ">
                        website
                      </dt>
                      <dd className="text-lg font-semibold text-text-secondary">
                        {userDetails.website}
                      </dd>
                    </div>
                    <div className="flex gap-4 py-3">
                      <dt className="mb-1 text-text-third md:text-lg ">
                        Total blogs:
                      </dt>
                      <dd className="text-lg font-semibold text-text-secondary">
                        {userDetails.totalBlogs}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*last reactions section */}
      <section className="flex gap-6 justify-center bg-background-primary  px-3 relative">
        <DotsEffect
          top={0}
          right={0}
          scale={1}
          rows={12}
          columns={4}
          rotation={45}
          opacity={0.2}
        />
        <div className="grid place-items-center ">
          <div className="flex justify-between items-baseline w-full">
            <h1 className="text-3xl my-3 md:ml-9 italic">Last liked Blogs :</h1>
          </div>
          {recentblogs ? (
            <RecentBlogs cards={recentblogs || []} />
          ) : (
            <h2 className="text-3xl my-3">No blogs yet</h2>
          )}
        </div>
        <div className="grid place-items-center ">
          <div className="flex justify-between items-baseline w-full">
            <h1 className="text-3xl my-3 md:ml-9 italic">
              Last commented Blogs :
            </h1>
          </div>
          {recentblogs ? (
            <RecentBlogs cards={recentblogs || []} />
          ) : (
            <h2 className="text-3xl my-3">No blogs yet</h2>
          )}
        </div>
      </section>

      {/*some recent blogs */}
      <section className="grid place-items-center bg-background-primary relative">
      <DotsEffect
        top={5}
        left={0}
        scale={1}
        rows={6}
        columns={6}
        rotation={45}
        opacity={0.1}
      />
        <div className="flex justify-between items-baseline w-full max-w-7xl">
          <h1 className="text-3xl my-5 md:ml-9 italic">My Blogs</h1>
          <Link
            href={`/user/${currentUser?.id}`}
            className="text-xl pr-20 hover:opacity-75"
          >
            See more &rarr;
          </Link>
        </div>
        {recentblogs ? (
          <RecentBlogs cards={recentblogs || []} />
        ) : (
          <h2 className="text-3xl my-3">No blogs yet</h2>
        )}
      </section>

      {showEditModal && (
        <div className="fixed z-10 inset-x-0 inset-y-0 overflow-y-auto mt-16">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle lg:w-1/2 w-full p-6 dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Edit Profile
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowEditModal(false)}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 "
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={userDetails.name}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4 sm:text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    value={userDetails.bio}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={userDetails.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={userDetails.lastName}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={userDetails.email}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={userDetails.website}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="website"
                    id="website"
                    value={userDetails.instagram}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="website"
                    id="website"
                    value={userDetails.facebook}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    name="website"
                    id="website"
                    value={userDetails.linkedin}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="Job"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Job
                  </label>
                  <input
                    type="text"
                    name="job"
                    id="job"
                    value={userDetails.job}
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pfp"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="pfp"
                    id="pfp"
                    onChange={handleChange}
                    className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end col-span-2">
                  <button
                    type="button"
                    className="py-2 px-4 mr-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-highlight hover:bg-highlight/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle lg:w-1/3 w-full p-6 dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Change Password
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPasswordModal(false)}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className="mt-4 grid grid-cols-1 gap-6"
              >
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-highlight focus:ring-4  sm:text-sm dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="py-2 px-4 mr-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Change Password
                  </button>
                </div>
              </form>

              {passwordNotification && (
                <div className="mt-4 text-center text-green-600">
                  {passwordNotification}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <DotsEffect
        top={-10}
        left={0}
        scale={1.5}
        rows={12}
        columns={4}
        rotation={45}
        opacity={0.1}
      />
    </div>
  );
}
