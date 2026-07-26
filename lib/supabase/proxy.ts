import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";

export async function updateSession(request: NextRequest) {
  const { url, key } = getSupabaseConfig();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isSalesLoginPage = request.nextUrl.pathname === "/sales/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isSalesRoute = request.nextUrl.pathname.startsWith("/sales");

  if (isAdminRoute && !isLoginPage && !data?.claims) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (isSalesRoute && !isSalesLoginPage && !data?.claims) {
    return NextResponse.redirect(new URL("/sales/login", request.url));
  }

  if (isLoginPage && data?.claims) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (isSalesLoginPage && data?.claims) {
    return NextResponse.redirect(new URL("/sales", request.url));
  }

  return response;
}
