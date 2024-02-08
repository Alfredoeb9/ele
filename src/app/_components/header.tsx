"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useGetUser } from "../hooks/getUser";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import { api } from "@/trpc/react";

export default function Header() {
    const { getuser, error2, isLoading2 } = useGetUser();
    const [error, setError] = useState("");
    const session = useSession();

    const router = useRouter();

    console.log("session", session)

    // const {data, isFetching, isError } = useQuery<any>({
    //     queryKey: ["get-user"],
    //     queryFn: 
    //     () => getuser(session?.data as any),
        
    //     // async () => {
    //     //     const data = await fetch('/api/user', {
    //     //         method: 'POST', 
    //     //         headers: {
    //     //             'Content-Type': 'application/json',
    //     //         },
    //     //         body: JSON.stringify({email: session?.data?.user?.email})
    //     //     });
            
    //     //     const json = await data.json();

    //     //     if (data.status == 500) {
    //     //         return setError(true)
    //     //     }
        
    //     //     if (data.status === 201) {
    //     //         return json;    
    //     //     }
              
    //     // },

    //     enabled: session.data?.user !== undefined ? true : false,
    //     retry: 2,
    //     refetchOnWindowFocus: false,
    // });

    const currentUser = api.user.getSingleUser.useMutation({
        onSuccess: () => {
            console.log("user retrieved")
        },

        onError: (error) => {
            setError(error.message)
        }
    })

    useEffect(() => {
        if (session.data?.user) {
            currentUser.mutate({ email: session.data?.user.email as string})
        }
    }, [session.data])


    // if (isError) {
    //     toast(`There was problem retrieving your credits, please refresh and try agian. If this problem presist please reach out to customer service`, {
    //         position: "bottom-right",
    //         autoClose: false,
    //         closeOnClick: true,
    //         draggable: false,
    //         type: "error",
    //         toastId: 0                             
    //     })
    // }

    // if (!session.data) return null

    // console.log("currentUser", currentUser?.data[0]?.credits)

    return (
        <header className="nav">
            <div className="w-full h-16 px-4 flex items-center justify-between bg-gray-200 dark:bg-gray-800 rounded-b-lg">
                <nav className="h-12 flex gap-x-4 items-center">
                    <Link className="text-md font-semibold text-zinc-100" href={"/"}>MLG</Link>
                    <Link className="text-md font-bold text-zinc-900" href="/">Home</Link>
                    <Link className="text-md font-bold text-zinc-900" href="/profile">Profile</Link>
                    <Link className="text-md font-bold text-zinc-900" href="/protected">Protected</Link>
                </nav>
                <div>
                    {session.status !== "authenticated" ? (
                        <div className="flex flex-row">
                            <Link
                                href={`/sign-in`}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
                            >
                                Sign in
                            </Link>
                            <Link
                                href={`/sign-up`}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
                            >
                                Sign up
                            </Link>
                        </div>
                    ) : (
                        <div>
                            
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="secondary"
                                    name={session.data.user.firstName + ' ' + session?.data.user.lastName}
                                    size="sm"
                                    />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" disabledKeys={["profile", "credits"]}>
                                    <DropdownItem key="profile" className="h-14 gap-2">
                                        <p className="font-semibold">Signed in as</p>
                                        <p className="font-semibold">{session?.data.user.email}</p>
                                    </DropdownItem>
                                    <DropdownItem key="credits"><span className="font-black">Credits: </span> <span className="font-semibold">{ currentUser.data == undefined || currentUser.isError ? "Err" : (currentUser?.data as any)[0]?.credits}</span></DropdownItem>
                                    <DropdownItem key="settings">My Settings</DropdownItem>
                                    
                                    <DropdownItem key="team_settings"><Link href="/team-settings">Team Settings</Link></DropdownItem>
                                    <DropdownItem key="analytics">Stats</DropdownItem>
                                    <DropdownItem key="buy_credits"><Link href={"/pricing"}>Buy Credits</Link></DropdownItem>
                                    <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                                    <DropdownItem key="logout" color="danger" onClick={async (e) => {
                                                e.preventDefault();
                                                await signOut();
                                                router.push("/");
                                            }}>
                                    Log Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                                
                        </div>
                    )}
                </div>
			</div>
            <ToastContainer limit={1} />
            {/* {error && <ErrorComponent message="There was problem retrieving your credits, please refresh and try agian. If this problem presist please reach out to customer service"/>} */}
        </header>
    )
}