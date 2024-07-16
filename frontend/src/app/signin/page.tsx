"use client";

import React, { useState } from "react"; // Step 1: Import useState
import { redirect, useRouter } from "next/navigation";
import login from "./login";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../../state/features/user/userSlice";



function Login() {
  const [email, setEmail] = useState(''); // Step 2: Initialize email state
  const [password, setPassword] = useState(''); // Step 2: Initialize password state
  const router = useRouter();
  const dispatch = useDispatch();


  const handleSubmit = async (e:any) => {
    e.preventDefault(); // Prevent default form submission
    const formData = { email, password }; // Step 4: Create formData object
    const res = await fetch("http://localhost:3000/api/user/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    })
    const data = await res.json()
    if (res.ok) {
      dispatch(setCurrentUser(data))
      localStorage.setItem('currentUser', JSON.stringify(data));
      router.push('/home');
    } else {
      alert('Login failed');
    }
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 dark:bg-gray-50 dark:text-gray-800">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Sign in</h1>
          <p className="text-sm dark:text-gray-600">Sign in to access your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-12"> {/* Update form to use handleSubmit */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="leroy@jenkins.com"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
                value={email} // Set input value to state
                onChange={(e) => setEmail(e.target.value)} // Step 3: Update state on change
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <a
                  rel="noopener noreferrer"
                  href="#"
                  className="text-xs hover:underline dark:text-gray-600"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="*****"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
                value={password} // Set input value to state
                onChange={(e) => setPassword(e.target.value)} // Step 3: Update state on change
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <button
                type="submit"
                className="w-full px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50"
              >
                Sign in
              </button>
            </div>
            <p className="px-6 text-sm text-center dark:text-gray-600">
              Don't have an account yet?
              <a
                rel="noopener noreferrer"
                href="/signup"
                className="hover:underline dark:text-violet-600"
              >
                Sign up
              </a>
              .
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;