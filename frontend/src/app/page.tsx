'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserFromLocalStorage } from "../../state/features/user/userSlice";

export default function Home() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);
  const router = useRouter()
  router.push("/home")
  return (
    <main className="flex items-center justify-center min-h-screen">
      
    </main>
  );
}
