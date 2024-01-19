import { createServerClient } from '@supabase/ssr'
// import { type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  );

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/", request.url), {
    status: 302,
  });
}

// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const supabase = createRouteHandlerClient({ cookies });

//   // Check if we have a session
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (session) {
//     await supabase.auth.signOut();
//   }

//   return NextResponse.redirect(new URL("/", req.url), {
//     status: 302,
//   });
// }
