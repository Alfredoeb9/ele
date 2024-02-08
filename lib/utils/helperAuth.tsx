// import { serialize, parse } from "cookie";
// import React from "react";
// import { useRouter  } from "next/navigation";



// export const MAX_AGE = 60 * 60 * 24 * 30;

// interface CookieProps {
//   cookieName: string,
//   value: string,
//   age?: number
// }

// export function setCookie(cookieName: any, value: any, age: any) {
//   if (!age) age = MAX_AGE;
//   if (age === 0) {
//     // only set session cookie
//     document.cookie = `${cookieName}=${value};path=/;`;
//   } else {
//     const cookie = serialize(cookieName, value, {
//       maxAge: age,
//       expires: new Date(Date.now() + age * 1000),
//       secure: process.env.NODE_ENV === "production",
//       path: "/",
//       domain: process.env.REACT_APP_AUTH_DOMAIN,
//       sameSite: "lax",
//     });
//     document.cookie = cookie;
//   }
// }

// export function removeCookie(cookieName: string) {
//   const cookie = serialize(cookieName, "", {
//     maxAge: -1,
//     path: "/",
//   });
//   document.cookie = cookie;
// }

// export function getCookie(cookieName: string | number | any) {
//   let cookie = {} as any;
//   if (typeof window !== "undefined") {
//     cookie = parse(document.cookie);
//   }
//   /*
//       document.cookie.split(';').forEach(function (el) {
//         let [key, value] = el.split('=');
//         cookie[key.trim()] = value;
//       })
//       */
//   return cookie[cookieName];
// }

// export function handleRedirect(user: any, path: string) {
//   const router = useRouter();
  
//   setTimeout(() => {
//     if (!user) return window.location.replace("http://localhost:3000/login");
//     if (path === "profile") {
//       return router.push('/profile', {scroll: false});
//     }
//     if (user) {
//       return window.location.replace("http://localhost:3000/");
//     }
//   }, 200);
// }