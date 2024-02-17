'use client';
import { api } from "@/trpc/react";
import { usePathname } from 'next/navigation'
import { Avatar, Button, Divider } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Profile() {
    const utils = api.useUtils()
    const pathname = usePathname()
    const session = useSession();
    const [error, setError] = useState<string>("");
    const [userName, setUserName] = useState<string>("");

    const userFromPath = pathname.split("/")[2]

    if (!userFromPath) {
        return setError("Please provide a user")
    }

    const userSession = session.data?.user

    const getUserData = api.user.getSingleUserWithTeams.useQuery({ username: userFromPath})

    if (getUserData.isError) {
        setError("User does not exist")
    }

    const user = getUserData?.data

    const sendRequest = api.user.sendFriendRequest.useMutation({
    
        onSuccess: async () => {
            await utils.user.getNotifications.invalidate()
            toast('Friend request sent', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 14                      
            })
        },
        onError: (e) => {
          setError(e.message)
          
          if (!toast.isActive(13, "friendRequest")) {
            toast('Error sending request user, please refresh and try again', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 13                      
            })
          }
        }
    });

    return (
        <div className="bg-neutral-600">
            <div className="w-full h-[300px] object-cover bg-mw3_team_background bg-no-repeat bg-cover after:relative after:block after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-br from-white to-neutral-400 after:opacity-50 z-0 relative"></div>

            <div className="relative mt-[-150px] ">
                <div className="container m-auto relative z-20">

                    {getUserData.isError ? (
                        <p>{error}</p>
                    ) : (
                        <div className="p-4 ">
                            <div className="flex justify-between pb-2">
                                
                                <div className="flex">
                                    <Avatar />
                                    <div className="text-white pl-2">
                                        <h2 className="text-3xl mb-2 font-bold">{user?.username}</h2>
                                        <p className="font-semibold">PROFILE VIEWS: </p>
                                        <p className="font-semibold">JOINED: 02/12/24</p>
                                        <div className="flex">
                                            <h4 className="pr-1 font-semibold">Game ID:</h4>
                                            <div>
                                                <p>Playstation: Abstracts</p>
                                                <p>Battlenet: Abstractss_</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    { userSession?.id === user?.id ? (
                                        <>
                                            <Button color="success" disabled={userSession?.id !== user?.id}>Edit Background</Button>
                                            <Button disabled={userSession?.id !== user?.id}>Find Match</Button>
                                            <Button color="danger" disabled={userSession?.id !== user?.id}>Disband Team</Button>
                                        </>
                                    ) : (
                                        <Button color="success" disabled={userSession?.id === user?.id} onClick={(e) => {
                                            e.preventDefault();
                                            sendRequest.mutate({
                                                userName: user?.username as string,
                                                id: userSession?.id as string,
                                                senderUserName: user?.email as string
                                            })
                                            if (sendRequest.isSuccess) {

                                            }
                                        }}>Send Friend Request</Button>
                                    )}
                                    
                                </div>
                            </div>
                            
                            <div className="flex bg-neutral-800 justify-evenly">
                                <div className="flex text-white text-center">
                                    <div>
                                        Image
                                        {/* Image */}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3>Rank</h3>
                                        <p>0 | 0 XP</p>
                                    </div>
                                    
                                </div>

                                <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1" />

                                <div className="text-white text-center">
                                    <h3>CAREER RECORD</h3>
                                    <p>0W - 0L</p>
                                    <p>0% WIN RATE</p>
                                </div>

                                <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1" />

                                <div className="text-white text-center">
                                    <h3>RECENT MATCHES</h3>
                                    <p>No Matches</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    
                </div>
                
            </div>
            <ToastContainer />
        </div>
    )
}