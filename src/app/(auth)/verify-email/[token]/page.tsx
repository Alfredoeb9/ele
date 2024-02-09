"use client";
import React, { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {useAppDispatch} from "@/redux/hooks"
// import authAPI from "@/redux/api/authAPI";
import { verifyEmail } from "@/redux/features/AuthContext";
import { useQuery } from "@tanstack/react-query";
// import { useFetchVerify } from "@/app/hooks/fetchVerify";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";
// import {handler} from "../../../../../lib/auth"
// // import authAPI from "../../app/api/authApi";
// // import { verifyEmail } from "../../app/features/AuthContext";
// // import CircularIndeterminate from "../../components/spinner/Spinner";

import 'react-toastify/dist/ReactToastify.css';

export default function VerifyEmail() {
  const dispatch = useAppDispatch()
  const params = useParams();
  const router = useRouter();

  // const { Header } = Layout;
//   const dispatch = useDispatch();
  // const { isLoading, isError, isSuccess } = useAppSelector((state) => state.user.user);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  console.log("params", params?.token)

  // const {data, isFetching } = useQuery<any>({
  //   queryKey: ["get-user"],
  //   queryFn: 
  //   () => useFetchVerify(params.token!.toString()),
    
  //   // async () => {
  //   //     const data = await fetch('/api/user', {
  //   //         method: 'POST', 
  //   //         headers: {
  //   //             'Content-Type': 'application/json',
  //   //         },
  //   //         body: JSON.stringify({email: session?.data?.user?.email})
  //   //     });
        
  //   //     const json = await data.json();

  //   //     if (data.status == 500) {
  //   //         return setError(true)
  //   //     }
    
  //   //     if (data.status === 201) {
  //   //         return json;    
  //   //     }
          
  //   // },

  //   enabled: session.data?.user !== undefined ? true : false,
  //   retry: 2,
  //   refetchOnWindowFocus: false,
  // });

  // const fetchVerify = async () => {
  //   try {
      
  //     await fetch("/api/auth/verify-email", {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         token: params.token!.toString()
  //       })
  //     })

  //     if(!verify.ok) {
  //       throw new Error("Error fetching verify email")
  //     }

  //     const data = await verify.json()
  //     // if (verify.ok) {
  //       dispatch(verifyEmail());
  //       setIsSuccess(true);
  //       setIsLoading(false);
  //     // }
  //     return data

  //   } catch (error) {
  //     setIsLoading(false);
  //     return setIsError(true);
  //   //   if (error.response && error.response.data && error.response.data.message)
  //   //     setMessage(error.response.data.message);
  //   //   else {
  //   //     setMessage("Error in verifying email!");
  //   //   }
  //   }
  // };


  // useEffect(() => {
  //   setIsLoading(true);
  //   if (params.token!.toString()) {
  //     console.log("running")
  //     fetchVerify().then(() => {
  //       redirect('/auth/sign-in')
  //     }).catch((error: Error) => {
  //       console.log("fetch Error", error)
  //     })

      
      
  //   } else {
  //     setIsError(true);
  //     setMessage("Error in verifying email!");
  //   }

  //   return () => {
  //     setIsLoading(false);
  //   }
  // }, []);

  // const updateVerifyUser = api.post.create.useMutation({
  //   onSuccess: () => {
  //     router.refresh();
  //     setName("");
  //   },
  // });

  const verifyUser = api.user.verifyUser.useMutation({
    onSuccess: () => {
      toast('Thank you for verifying', {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 4 
      })

      setTimeout(() => {
        router.push("/")
      }, 6000)
      
      
    },

    onError: (error) => {
      toast('Error Verifying account please try again', {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 4 
      })
      setError(error.message)
    }
  })

  useEffect(() => {
    verifyUser.mutate({ token: params.token?.toString() })
  }, [params?.token])

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <>
        <header className='h-20 relative container mx-auto'>
          <div className='flex items-center justify-between pt-2'>
            <div>
              <Link href='/auth/sign-in'>
                <img
                  // src={logo}
                  alt='logo'
                  style={{
                    width: 100
                  }}
                />
              </Link>
            </div>
          </div>
        </header>
        <div className="verify-email__container">
          {verifyUser.isSuccess && (
            <div className="email-verified text-lg">
              <div className="pb-12">
                <div style={{ fontSize: "4rem", color: "#82e082" }} />
              </div>
              <span className="font-bold">
                {" "}
                Thank you for verifying your email.{" "}
              </span>
              <br />
              Please <Link className="font-bold text-xl" href={`/sign-in`}>sign-in</Link> to access your
              account.
            </div>
          )}
          {verifyUser.isError && (
            <div className="verified-error text-lg">
              <div className="pb-12">
                <div style={{ fontSize: "4rem", color: "#FD8282" }} />
              </div>
              <span style={{ fontWeight: "bold" }}> {message} </span>
            </div>
          )}
        </div>
      </>
      <ToastContainer />
    </div>
  );
}


