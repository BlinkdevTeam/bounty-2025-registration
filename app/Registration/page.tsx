// app/verify/page.tsx
"use client";

import React, { Suspense } from "react";
import VerifyPage from "./Reg";

export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={<div>Loading verification status...</div>}>
      <VerifyPage />
    </Suspense>
  );
}
