'use client'

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import Search from '../../../lib/Search';
import DotsEffect from '../../../lib/DotsEffect';

export default function Header() {
  const currentUser = useSelector((state: RootState) => state.users.currentUser);

  return (
    <div className="relative h-[90vh] bg-background-primary text-primary ">
      <div className="flex flex-col gap-4 justify-center items-center w-full h-full px-3 md:px-0">
        <h1 className="text-3xl md:text-6xl lg:text-6xl font-bold">
          Hi again {currentUser?.firstName}
        </h1>
        <p className="text-highlight text-xl">Looking for anything today?</p>
        <div className="relative p-3 border border-gray-200 rounded-lg w-full max-w-lg">
          <Search />
        </div>
      </div>
      <DotsEffect bottom={2} opacity={0.6} right={-1} scale={0.75} rows={4} columns={4} rotation={45} />
    </div>
  );
}
