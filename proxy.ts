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
//   const isAuthRoute =
//     request.nextUrl.pathname.startsWith("/login") ||
//     request.nextUrl.pathname.startsWith("/signup");

//   if (isDashboardRoute && !user) {
//     const redirectUrl = request.nextUrl.clone();
//     redirectUrl.pathname = "/login";
//     redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
//     return NextResponse.redirect(redirectUrl);
//   }

//   if (isAuthRoute && user) {
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

  const pathname = request.nextUrl.pathname;

  // Bypass auth network checks for offline fallback, service worker, and manifest
  if (
    pathname === "/~offline" ||
    pathname === "/sw.js" ||
    pathname === "/manifest.webmanifest" ||
    pathname.startsWith("/workbox-")
  ) {
    return response;
  }

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  try {
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

    const { data, error } = await supabase.auth.getClaims();

    // If offline/network error occurs while fetching JWKS/claims, allow cached page shell to render
    if (error && (error.message?.includes("fetch") || error.status === 0)) {
      return response;
    }

    const user = data?.claims;

    if (isDashboardRoute && !user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (isAuthRoute && user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  } catch {
    // Device is offline — let the PWA Service Worker serve the cached page
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw\\.js|workbox-.*\\.js|manifest\\.webmanifest|~offline|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
