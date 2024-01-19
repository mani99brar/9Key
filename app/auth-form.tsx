"use client";

import { createBrowserClient } from '@supabase/ssr'
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const CALLBACK_URL = `${BASE_URL}/auth/callback`;

export default function AuthForm() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <Auth
      supabaseClient={supabase}
      view="magic_link"
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      showLinks={false}
      providers={[]}
      redirectTo={CALLBACK_URL}
    />
  );
}