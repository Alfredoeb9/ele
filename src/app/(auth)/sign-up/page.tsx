"use client";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SignUp() {
    const user = useSession();
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [isVerified, ] = useState<boolean>(false);
    // const [spinnerLoading, setSpinnerLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [show, setShow] = useState({ password: false });
    // const { signup, error, isLoading } = useSignup();
    // const { resend, error2, isLoading2 } = useResend();
    // const user = useSelector(selectUserAuth);
    // const { message } = useSelector((state) => state.user);
    

    // const handleSubmit = async (e: FormEvent) => {
    //     e.preventDefault();
    //     setError("")
        

    //     if (email === "") return setError("Please provide a proper email");
    //     if (password === "") return setError("Please provide a proper password");
    //     if (username === "") return setError("Please provide a proper username");
    //     if (firstName === "") return setError("Please provide a proper first name");
    //     if (lastName === "") return setError("Please provide a proper last name");
    
    //     const user = {
    //       username,
    //       firstName,
    //       lastName,
    //       email,
    //       password,
    //     };
    
    //     try {
    //         const data = await fetch("/api/auth/register", {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(user)
    //         })

    //         if (!data.ok) {
    //             setError(data.)
    //         }

    //         await data.json()

    //         dispatch(register());
    //         redirect('/auth/sign-in')
    //     } catch (error) {
    //         return error
    //     }
    // };

    useEffect(() => {
        if (user.data !== null) {
            redirect("/")
        }
    }, [user])

    

  const createUser = api.user.create.useMutation({
    
    onSuccess: () => {
      router.refresh();
      setEmail("");
      setPassword("");
      setUsername("");
      setFirstName("");
      setLastName("");
      setError("");
      setShow({ password: false });
    },
    onError: (e) => {
      console.log("error", e.message)
      setError(e.message)
    }
  });

    return (
        <div className="flex bg-stone-900 min-h-screen flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            {isVerified ? (
                <div>This is a loadeer</div>
            ) : (
                <div className="flex min-h-full flex-1 flex-col justify-center w-96 px-6 py-12 lg:px-8">
                    <form className="signup" onSubmit={(e) => {
                        e.preventDefault();
                            createUser.mutate({
                                email,
                                password,
                                username,
                                firstName,
                                lastName
                            });
                        }}
                    >
                        <h3 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign up</h3>

                        <label className="block text-sm font-medium leading-6 text-white">Email:</label>
                        <input
                            className="block w-full rounded-md border-0 py-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />

                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Password:</label>
                            <span
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                                onClick={() => setShow({ ...show, password: !show.password })}
                            >
                                <p className="font-semibold text-indigo-600 hover:text-indigo-500">Show Password</p>
                            </span>
                            
                        </div>
                        <input
                            className="block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type={`${show.password ? "text" : "password"}`}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />

                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">Username:</label>
                        <input
                            className="block w-full rounded-md border-0 py-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="name"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />

                        <label htmlFor="fist name" className="block text-sm font-medium leading-6 text-white">First Name:</label>
                        <input
                            className="block w-full rounded-md border-0 py-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="name"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                        />

                        <label htmlFor="last name" className="block text-sm font-medium leading-6 text-white">Last Name:</label>
                        <input
                            className="block w-full rounded-md border-0 py-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="name"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                        />

                        <button
                            disabled={email.length === 0 || username.length === 0 || firstName.length === 0 || lastName.length === 0 || password.length === 0}
                            className="flex w-full justify-center rounded-md mt-4 bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500"
                        >
                            Sign Up
                        </button>

                        {error && <div className="text-red-500">{error.toString()}</div>}
                    </form>
                </div>
            )}
        </div>
    )
}