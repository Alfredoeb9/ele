// 'use client';
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { verifyEmail } from "@/redux/features/AuthContext";

// type FetchVerifyProps = {
//     params: any
// }

// export const useFetchVerify = (params: string) => {
//   const dispatch = useDispatch();
//   const [error2, setError] = useState<any>(null);
//   const [isLoading2, setIsLoading] = useState<boolean>(false);

//   const verify = async (e: any, email: string, path: string) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     const response = await fetch(
//       '/api/auth/verify-email',
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token: params }),
//       }
//     );

//     const json = await response.json();

//     if (!response.ok) {
//       console.log("error33", json.error)
//       setIsLoading(false);
//       setError(json.error);
//     }

//     if (response.ok) {
//       // save to localStorage

//       // localStorage.setItem("user", JSON.stringify(json));
//       dispatch(verifyEmail());
//       setIsLoading(false);
//     }
//   };

//   return { verify, error2, isLoading2 };
// };