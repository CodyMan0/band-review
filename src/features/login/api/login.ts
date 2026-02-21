"use server";

import { User } from "@/entities/user/model/user.interface";
import { createClient } from "@/shared/utils/supabase/server";

export const login = async ({ email, password }: User) => {
  const supabase = await createClient();

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    return { message: `${loginError.message}` };
  }

  return { message: "SUCCESS" };
};
