import CreatePasswordPage from "@/components/auth/CreatePassword";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading Create Passwored page...</div>}>
      <CreatePasswordPage />
    </Suspense>
  );
};

export default page;
