import { Suspense } from "react";
import OtpVerifyForm from "./_components/verify-otp-form";

const page = () => {
  return (
    <Suspense>
      <OtpVerifyForm />
    </Suspense>
  );
};

export default page;
