import React from 'react';
import NavBar from '@/components/NavBar';

const Page = ({ children }: { children: React.ReactNode }) => {


  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <NavBar />
      {children}
    </div>
  );
};

export default Page;