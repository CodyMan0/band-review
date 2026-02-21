"use client";

import { EmailInput, PasswordInput } from "@/features/auth/ui";
import { useSignUpActionState } from "@/features/sign-up/model/useSignUpActionState";
import { Button } from "@/shared/ui/button";

export default function SignUpForm() {
  const { signUpFormState, singUpAndLoginAction } = useSignUpActionState();

  return (
    <form
      action={singUpAndLoginAction}
      className="flex w-full flex-1 flex-col justify-center gap-4 text-foreground"
    >
      <EmailInput />
      <PasswordInput />
      <Button className="mt-4">Sign Up</Button>
      <p className="mt-4 p-4 text-center text-foreground">
        {signUpFormState?.message}
      </p>
    </form>
  );
}
