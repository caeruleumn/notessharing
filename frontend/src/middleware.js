import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token") || req.headers.get("authorization");

  // daftar halaman yang butuh login
  const protectedPaths = ["/notes", "/notes/create", "/notes/edit"];
  const url = req.nextUrl.pathname;

  const needAuth = protectedPaths.some((path) => url.startsWith(path));

  if (needAuth && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect logged-in users away from /login and /register
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) => url.startsWith(path));

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/notes", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/notes/edit/:path*", "/notes/create", "/login", "/register"],
};
