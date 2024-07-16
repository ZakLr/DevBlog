'use client'

import { redirect } from "next/navigation";

export default async function login(formData: any) {
  const { email, password } = formData;
  const response = await fetch('http://localhost:3000/api/user/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
    
  return response
    
}