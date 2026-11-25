import { ValidateEmailFlow } from "@/components/ValidateEmailFlow";
import { Suspense } from "react";

export default function ValidateEmailPage() {
  return (
    <Suspense>
      <ValidateEmailFlow />
    </Suspense>
  );
}
