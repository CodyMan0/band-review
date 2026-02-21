"use client";

import Link from "next/link";

import { EmailInput, PasswordInput } from "@/features/auth/ui";
import { useLoginActionState } from "@/features/login/model/useLoginActionState";
import { SIGN_UP_PATHNAME } from "@/shared/config/pathname";
import { Button } from "@/shared/ui/button";

export default function LoginForm() {
  const { loginFormState, loginFormAction } = useLoginActionState();

  return (
    <form className="flex w-full flex-1 flex-col justify-center gap-4 text-foreground">
      <EmailInput />
      <PasswordInput />
      <Button className="mt-4" variant="outline" formAction={loginFormAction}>
        Login
      </Button>
      <Button asChild>
        <Link href={SIGN_UP_PATHNAME}>Sign Up</Link>
      </Button>
      <p className="mt-4 p-4 text-center text-foreground text-red-500">
        {loginFormState?.message}
      </p>
    </form>
  );
}
