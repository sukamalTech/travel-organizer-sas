// // src/proxy.ts
// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// export async function proxy(request: NextRequest) {
//   let response = NextResponse.next({ request });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) =>
//             request.cookies.set(name, value),
//           );
//           response = NextResponse.next({ request });
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options),
//           );
//         },
//       },
//     },
//   );

//   const { data } = await supabase.auth.getClaims();
//   const user = data?.claims;

//   const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
//   const isProtectedLegacyRoute =
//     request.nextUrl.pathname.startsWith("/protected");
//   const isAuthRoute =
//     request.nextUrl.pathname.startsWith("/login") ||
//     request.nextUrl.pathname.startsWith("/signup");

//   // 1. Unauthenticated users trying to access protected routes -> send to login
//   if ((isDashboardRoute || isProtectedLegacyRoute) && !user) {
//     const redirectUrl = request.nextUrl.clone();
//     redirectUrl.pathname = "/login";
//     return NextResponse.redirect(redirectUrl);
//   }

//   // 2. Authenticated users trying to access login/signup/protected -> send to dashboard gateway
//   if ((isAuthRoute || isProtectedLegacyRoute) && user) {
//     const redirectUrl = request.nextUrl.clone();
//     redirectUrl.pathname = "/dashboard";
//     return NextResponse.redirect(redirectUrl);
//   }

//   return response;
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

// src/proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");

  if (isDashboardRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
