"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import { FaBell } from "react-icons/fa";
import type { NotificationType } from "@/server/db/schema"


import 'react-toastify/dist/ReactToastify.css';
import { api } from "@/trpc/react";

export default function Header() {
    const utils = api.useUtils()
    const [error, setError] = useState("");
    const session = useSession();

    const router = useRouter();

    const currentUser = api.user.getSingleUser.useQuery({ email: session.data?.user?.email as string }, { enabled: session.status === "authenticated" ? true : false })

    if (currentUser.isError) {
        toast(`There was a problem getting user data`, {
            position: "bottom-right",
            autoClose: false,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 10                             
        })
    }

    const usersNotifications = api.user.getNotifications.useQuery({ id: session.data?.user?.id as string }, { enabled: currentUser.isSuccess, refetchOnMount: true, refetchOnReconnect: true, refetchOnWindowFocus: true })

    if (usersNotifications.isError) {
        toast('Notification Service is down, please reach out to admin', {
            position: "bottom-right",
            autoClose: false,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 8  
        })
    }


    if (currentUser?.data && currentUser?.data?.credits === undefined) {
        toast(`There was problem retrieving your credits, please refresh and try agian. If this problem presist please reach out to customer service`, {
            position: "bottom-right",
            autoClose: false,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 3                             
        })
    }

    const acceptRequest = api.user.acceptFriendRequest.useMutation({
        onSuccess: async () => {
            await utils.user.getNotifications.invalidate()
            await utils.user.getUserWithFriends.invalidate()
            toast('Friend request accepted', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 18
            })
        },

        onError: (error) => {
            toast('Error on accepting friend request, please try again', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 20
            })
        }
    })

    const messageRead = api.user.messageRead.useMutation({
        onSuccess: async () => {
            await utils.user.getNotifications.invalidate()
        },

        onError: (error) => {
            toast('Error setting message as read, please create a support ticket', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 29
            })
        }
    })

    const declineFriendRequest = api.user.declineFriendRequest.useMutation({
        onSuccess: async () => {
            await utils.user.getNotifications.invalidate()
            toast('Friend request declined', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 21
            })
        },

        onError: (error) => {
            toast('Error on declining friend request, please try again', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 22
            })
        }
    })

    return (
        <header className="nav">
            <nav className="w-full h-16 px-4 flex items-center justify-between bg-gray-200 dark:bg-gray-800 rounded-b-lg">
                <nav className="h-12 flex gap-x-4 items-center">
                    <Link className="text-md font-semibold text-zinc-300" href={"/"}>ELE</Link>
                    <Link className="text-md font-bold text-zinc-900" href="/">Home</Link>
                    <Link className="text-md font-bold text-zinc-900" href={`/profile/${session.data?.user.username}`}>Profile</Link>
                    {/* <Link className="text-md font-bold text-zinc-900" href="/protected">Protected</Link> */}
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
                        <div className="flex gap-2">
                            <div>
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger>
                                        <Button variant="bordered">
                                            <FaBell />
                                            {usersNotifications?.data?.length}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Notification Actions" closeOnSelect={false}>
                                        {(usersNotifications?.data as NotificationType[])?.map((notification: {userName: string, from: string, id: string, isRead: boolean | null}) => (
                                            <DropdownItem key={notification.id + notification.userName}>
                                                {!notification.isRead && (
                                                    <span className="h-[10px] w-[10px] bg-blue-500 inline-block rounded-full absolute -left-1"></span>
                                                )}

                                                <div  onClick={() => {
                                                    if (notification.isRead) return null

                                                    messageRead.mutate({
                                                        isRead: true,
                                                        id: session?.data.user.id
                                                    })
                                                }}>
                                                    {notification.userName} wants to be your friend

                                                    <div className="flex gap-2 justify-end">
                                                        <Button variant="solid" size="sm" color="success" onPress={() => {
                                                            acceptRequest.mutate({
                                                                userId: session?.data?.user?.id,
                                                                targetId: notification.from,
                                                                id: notification.id
                                                            })
                                                            }}>
                                                                Accept
                                                        </Button>
                                                        <Button variant="solid" size="sm" color="danger" onPress={() => {
                                                            declineFriendRequest.mutate({
                                                                userId: session?.data?.user?.id,
                                                                targetId: notification.from
                                                            })
                                                        }}>Decline</Button>

                                                    </div>

                                                </div>
                                                
                                                
                                            </DropdownItem>
                                        ))}
                                </DropdownMenu>
                            </Dropdown>
                            </div>
                            
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="secondary"
                                    name={session?.data?.user?.firstName + ' ' + session?.data?.user?.lastName}
                                    size="sm"
                                    />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" disabledKeys={["profile", "credits"]}>
                                    <DropdownItem key="profile" textValue={session?.data?.user?.email as string} className="h-14 gap-2">
                                        <p className="font-semibold">Signed in as</p>
                                        <p className="font-semibold">{session?.data.user.email}</p>
                                    </DropdownItem>
                                    <DropdownItem key="credits" textValue={currentUser.data !== undefined && currentUser.isSuccess && (currentUser?.data as any).credits}><span className="font-black">Credits: </span> <span className="font-semibold">{ currentUser.data == undefined || currentUser.isError ? "Err" : (currentUser?.data as any).credits}</span></DropdownItem>
                                    <DropdownItem key="settings" textValue="my settings">My Settings</DropdownItem>
                                    
                                    <DropdownItem key="team_settings" textValue="team-settings" href="/team-settings">Team Settings</DropdownItem>
                                    <DropdownItem key="friends" textValue="friends"><Link href="/friends">Friends</Link></DropdownItem>
                                    <DropdownItem key="analytics" textValue="stats">Stats</DropdownItem>
                                    <DropdownItem key="buy_credits" textValue="pricing"><Link href={"/pricing"}>Buy Credits</Link></DropdownItem>
                                    <DropdownItem key="help_and_feedback" textValue="help & feedback">Help & Feedback</DropdownItem>                                    
                                    <DropdownItem 
                                        key="logout" 
                                        color="danger"
                                        textValue="log out"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            await signOut();
                                            router.push("/");
                                        }}
                                    >
                                        Log Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                                
                        </div>
                    )}
                </div>
			</nav>
            <ToastContainer containerId={'header-toast'} />
            {/* {error && <ErrorComponent message="There was problem retrieving your credits, please refresh and try agian. If this problem presist please reach out to customer service"/>} */}
        </header>
    )
}