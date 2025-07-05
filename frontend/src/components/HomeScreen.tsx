import React from "react";
import ChatWithEditor from "@/components/ChatWithEditor";
import Header from "./Header";

const HomeScreen = () => {

  return (
    <div className="relative min-h-screen bg-[#070E1B]">
      <Header />
      <div className="w-full max-w-5xl mt-8 p-5 mx-auto">
        <ChatWithEditor />
      </div>
    </div>
  );
};

export default HomeScreen; 