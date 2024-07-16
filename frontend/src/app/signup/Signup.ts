// Assuming this function is called within a React component
import { useRouter } from 'next/router';

export default async function login(formData: any) {
  const router = useRouter(); // Use the useRouter hook to get the router instance
  const { email, password, username } = formData;
  const response = await fetch('http://localhost:3000/api/user/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  console.log(data);
  // Saving access token in local storage
  localStorage.setItem('accessToken', data.accessToken);
  // Redirect to the home page
  router.push('/home');
}