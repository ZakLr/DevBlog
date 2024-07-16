'use client';
import React, { useState, useEffect } from 'react';

export default function FakeCursor() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHidden(hidden => !hidden);
    }, 1000); // Toggle visibility every 1000ms

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className={`h-12 text-black ${hidden ? 'invisible' : 'visible'}`}>
      |
    </div>
  );
}
