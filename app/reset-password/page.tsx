import { PasswordRecoveryFlow } from "@/components/PasswordRecoveryFlow";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <PasswordRecoveryFlow />
    </Suspense>
  );
}
