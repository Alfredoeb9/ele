import {NextResponse} from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Assume a 'Cookie:nextjs=fast' header to be present on the incoming request
    // Getting cookies from the request using the 'RequestCookies' API
    // console.log("testing")
    const {pathname, searchParams} = request.nextUrl;
    
    // console.log(pathname)
    // console.log(searchParams)
    const cookie = request.cookies.get('next-auth.csrf-token')?.value

    // console.log('cookie', cookie)
    const allCookies = request.cookies.getAll()
    // console.log('allCookies', allCookies)

    return NextResponse.next()
}

export const config = {
    matcher: '/'
}

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