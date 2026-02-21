"use server";

import { headers } from "next/headers";

import { User } from "@/entities/user/model/user.interface";
import { createClient } from "@/shared/utils/supabase/server";

export const createUser = async ({ email, password }: User) => {
  const headersRes = await headers();
  const origin = headersRes.get("origin");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { message: `${error.message}` };
  }

  return { message: "SUCCESS" };
};
