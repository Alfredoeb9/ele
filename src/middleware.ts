import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("next-auth.session-token")?.value;

  const host = request.headers.get("host");
  const wwwRegex = /^www\./;
  // This redirect will only take effect on a production website (on a non-localhost domain)
  if (
    host?.startsWith("www.") &&
    !request.headers.get("host")?.includes("localhost")
  ) {
    const newHost = host.replace(wwwRegex, "");
    return NextResponse.redirect(
      `https://${newHost}${request.nextUrl.pathname}`,
      301,
    );
  }

  const currentPath = request.nextUrl.pathname;

  const isProtectedRoute = (path: string): boolean => {
    const protectedPatterns = [
      /^\/friends(\/.*)?$/,                    // /friends and /friends/*
      /^\/team-settings(\/.*)?$/,              // /team-settings and /team-settings/*
      /^\/match\/enroll(\/.*)?$/,              // /match/enroll and /match/enroll/*
      /^\/tickets(\/.*)?$/,                    // /tickets and /tickets/*
      /^\/account-manage(\/.*)?$/,             // /account-manage and /account-manage/*
      /^\/chat-feature(\/.*)?$/,               // /chat-feature and /chat-feature/*
      /^\/profile\/[^\/]+$/,                   // /profile/[id]
      /^\/money-match\/[^\/]+$/,               // /money-match/[id]
    ];

    return protectedPatterns.some(pattern => pattern.test(path));
  };

  if (isProtectedRoute(currentPath)) {
    if (!sessionCookie) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('callbackUrl', currentPath);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();

}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|svg).*)",
  ],
};

/*
    Middleware
    
    It's common to use Middleware for authentication or other purposes that involve rewriting the user to a different page. In order for the <Link /> 
    component to properly prefetch links with rewrites via Middleware, you need to tell Next.js both the URL to display and the URL to prefetch. 
    This is required to avoid un-necessary fetches to middleware to know the correct route to prefetch.

    For example, if you want to serve a /dashboard route that has authenticated and visitor views, you may add something similar to the following 
    in your Middleware to redirect the user to the correct page:

    https://nextjs.org/docs/pages/api-reference/components/link

*/

// export function middleware(req) {
//     const nextUrl = req.nextUrl
//     if (nextUrl.pathname === '/dashboard') {
//       if (req.cookies.authToken) {
//         return NextResponse.rewrite(new URL('/auth/dashboard', req.url))
//       } else {
//         return NextResponse.rewrite(new URL('/public/dashboard', req.url))
//       }
//     }
// }

/*
    Good to know: If you're using Dynamic Routes, you'll need to adapt your as and href props. For example, if you have a Dynamic Route like /dashboard/[user] 
    that you want to present differently via middleware, you would write: <Link href={{ pathname: '/dashboard/authed/[user]', query: { user: username } }} as="/dashboard/[user]">Profile</Link>

*/
