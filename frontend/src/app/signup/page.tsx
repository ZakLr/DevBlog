"use client"; // Ensure this is at the top for Next.js app directory client component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // For app directory
// import { useRouter } from "next/router"; // For pages directory

function Signup() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [job, setJob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState('');
  const router = useRouter();

  const handleNextStep = (e: any) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = { email, password,  name, firstName, lastName, job};
    try {
      const response = await fetch('http://localhost:3000/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      router.push('/signin');
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-primary pt-32 pb-3">
      <div className="flex flex-col max-w-2xl p-6 rounded-md sm:p-10 bg-background-secondary">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Sign up</h1>
          <p className="text-sm dark:text-gray-600">Create your account</p>
        </div>
        <div className={``}>
          <form onSubmit={handleNextStep} className={`space-y-6 ${step === 1 ? 'block' : 'hidden'} `}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name"
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Your first name"
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Your last name"
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="job" className="block mb-2 text-sm">Job</label>
                <input
                  type="text"
                  name="job"
                  id="job"
                  placeholder="Your job title"
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <button
                type="submit"
                className="w-full px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50"
              >
                Next
              </button>
            </div>
          </form>

          <form onSubmit={handleSubmit} className={`space-y-6 ${step === 2 ? 'block' : 'hidden'}`}>
            <div className="space-y-4">
              
              <div>
                <label htmlFor="email" className="block mb-2 text-sm">Email address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="*****"
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
            </div>
            <div className="space-y-2 mt-4">
              <button
                type="submit"
                className="w-full px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
