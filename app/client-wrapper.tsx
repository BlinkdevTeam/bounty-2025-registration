"use client";

import React from "react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-screen h-screen">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="fixed top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source
          src="/assets/bounty/BOUNTY_B3S_BUMPER_LOOPING_BG.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Foreground content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
