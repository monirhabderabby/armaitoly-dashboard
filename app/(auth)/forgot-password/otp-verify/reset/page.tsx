import { Suspense } from "react";
import ResetPasswordForm from "./_components/reset-password-form";

const page = () => {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default page;
