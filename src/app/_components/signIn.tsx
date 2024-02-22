"use client";
import { useSession, signIn, getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
// import { getSession, signIn } from "next-auth/react";
// import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { login } from "@/redux/features/AuthContext";
// import {  redirect } from "next/navigation";
import { useResend } from "../hooks/resend"
import Link from "next/link";
import { login } from "../redux/features/AuthContext";
import { Session } from "next-auth";


const SignIn = () => {
	const user = useSession();
	const dispatch = useAppDispatch()
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
	const [spinnerLoading, setSpinnerLoading] = useState<boolean>(false);
	const [verifyEmail, setVerifyEmail] = useState<boolean>(false);
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");
	const { resend, error2, isLoading2 } = useResend();
	const [show, setShow] = useState({ password: false });


	if (user?.data !== null) {
		redirect("/")
	}
	
	useEffect(() => {
		if (error2) {	
			setError(error2)
		}
	}, [resend, error2])

    const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
        try {
			if (email === "" || password === "") {
				return setError("Please provide a email and password")
			}
			const signInData = await signIn("credentials", 
				{ email: email, password: password, redirect: false
			}).then(async (res) => {
				setVerifyEmail(false);
				if (!res) return null;

				if (res?.ok === false) {
					if (!res.error) return null
					setError(res?.error)
					if (res?.error.includes("Email is not verified")) {
						setVerifyEmail(true);
					}
					return null
				}

				const session = await getSession();

				if (!session) return setError(`Error: cannot find user`)

				setError("");
				setVerifyEmail(false);
				dispatch(login(session as any));
				return session
			}).catch((error) => {
				console.log("error", error)
				return setError(error);
			});
		
			return signInData;
			
		} catch (error) {
			return setError(error as string)		
		}
    }

	const resendEmail = async (e: FormEvent) => {
		e.preventDefault()
		try {
		  	await resend(e, email, "resend");

		} catch (error) {
			setError(error as string)
		}
	};

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center w-96 px-6 py-12 lg:px-8">
			{/* <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">Email:</label>
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
								name="password"
								required
								type={`${show.password ? "text" : "password"}`}
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								className="block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							/>	

<button 
							className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500" 
							// disabled={isLoading2 || email === "" || password === "" || email.length === 0}
							onClick={(e) => handleSubmit(e)}
						>
							Log in
						</button> */}
			{ isLoading2 || spinnerLoading ? (
				<p>this is suppose to be a spinner</p>
			) : (
				<section className="w-full rounded-lg px-2.5 shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
					<h3 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Log In</h3>
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<label htmlFor="email" className="block text-sm font-medium leading-6 text-white">Email:</label>
							<input
								className="block w-full rounded-md border-0 py-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								type="email"
								onChange={(e) => setEmail(e.target.value)}
								value={email}
							/>
						</div>
						
						<div>
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
								name="password"
								required
								type={`${show.password ? "text" : "password"}`}
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								className="block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							/>		
						</div>

						<button 
							className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500" 
							disabled={isLoading2 || email === "" || password === "" || email.length === 0}
						>
							Log in
						</button>

						{error && <div className="text-red-500">{error.toString()}</div>}
					</form>

					<p className="hover:text-white mt-10text-sm text-white">
						<Link href={"/auth/forgot-password"}>Forgot Password?</Link>
					</p>

					{verifyEmail && (
						<div className="mt-10 text-center text-sm text-white">
							Your email is not verified. Please click on the Verify Email link in the email registered
							with or click resend email to receive a new email.
							<br />
							<button className="px-3 py-1.5 mt-2 font-semibold leading-6 bg-indigo-600 text-white rounded-md hover:text-indigo-500" onClick={resendEmail}>RESEND EMAIL</button>
						</div>
					)}
				</section>
			)}
			<p className="mt-10 text-center text-sm text-white">
				Don't have an account? <Link className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" href={"/auth/sign-up"}>Sign up</Link>
			</p>
		</div>
    )
}

export default SignIn;