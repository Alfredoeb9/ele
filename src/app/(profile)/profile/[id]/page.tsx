'use client';
import { api } from "@/trpc/react";
import { usePathname, useRouter } from 'next/navigation'
import { Avatar, Button, Divider } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { SetStateAction } from "react";
import { ToastContainer, toast } from "react-toastify";
import type { UsersRecordType, Match, FollowsType } from '@/server/db/schema'
import Link from "next/link";

export default function Profile() {
    const router = useRouter()
    const utils = api.useUtils()
    const pathname = usePathname()
    const session = useSession();
    const [error, setError] = useState<string>("");
    const [path, ] = useState<string>("profile");
    const [areFriends, setAreFriends] = useState<boolean>(false);

    const userFromPath = pathname.split("/")[2]

    useEffect(() => {
        if (!userFromPath || userFromPath === 'undefined') {
            toast('User does not exist', {
                position: "bottom-right",
                autoClose: 4500,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 26                     
            })
            setTimeout(() => {
                router.push("/")
            }, 5000);
            return setError("User does not exist")
        }
    }, [userFromPath, router])

    const userSession = session.data?.user

    const getUserData = api.user.getSingleUserWithTeams.useQuery({ username: userFromPath, path: path}, { enabled: path.length <= 0 && path === 'undefined' ? false : true})

    useEffect(() => {
        if (getUserData.isError) {
            toast('User does not exist', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 26                     
            })
            setTimeout(() => {
                router.push("/")
            }, 5000);
            return setError("User does not exist")
        }
    }, [getUserData, router])

    const user = getUserData?.data

    //@ts-expect-error follows table should be available
    const usersFriends: FollowsType[] =  user?.follows
    //@ts-expect-error user record table should be available
    const usersRecord: UsersRecordType = user?.userRecord
    //@ts-expect-error user matches table should be available
    const usersUpcomingMatches: Match[] = user?.matches

    useEffect(() => {
      usersFriends?.map((friend: { targetUser: string | undefined; }) => {
            if (friend?.targetUser === user?.id){
                setAreFriends(true)
            }
      })
    }, [usersFriends, user])

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
        onError: (e: { message: SetStateAction<string>; }) => {
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

    // finalize how i want to grab recent matches, if on profile path (which means viewing users) 
    //then we can grab only solo games or find a way to get all teams users is assigned to (solo, duos, teams, etc...)
    // and then display upcoming matches
    // const getUpcomingGames = api.matches.getLatestUsersMatches.useQuery({userId: userSession?.id as string, tournamentId: usersUpcomingMatches}, { enabled: usersUpcomingMatches?.length > 0 })

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
                                        <p className="font-semibold">PROFILE VIEWS: {user?.profileViews}</p>
                                        <p className="font-semibold">JOINED: 02/12/24</p>
                                        <div className="flex">
                                            <h4 className="pr-1 font-semibold">Game ID:</h4>
                                            <div>
                                                <p>Playstation: {user?.username}</p>
                                                <p>Battlenet: {user?.username}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    { userSession?.username === user?.username ? (
                                        <>
                                            <Link href={"/account-manage#connect-accounts"} className="text-base bg-neutral-300 py-2 px-2 rounded-xl hover:bg-neutral-400 transition-all">Connect Accounts</Link>
                                        </>
                                    ) : (
                                        <Button color="success" disabled={userSession?.username === user?.username} onClick={(e: { preventDefault: () => void; }) => {
                                            e.preventDefault();
                                            if (areFriends) {
                                                toast('You are already friends with this user', {
                                                    position: "bottom-right",
                                                    autoClose: 5000,
                                                    closeOnClick: true,
                                                    draggable: false,
                                                    type: "error",
                                                    toastId: 17
                                                })
                                                return null;
                                            } else {
                                                sendRequest.mutate({
                                                    userName: user?.username as string,
                                                    id: userSession?.id as string,
                                                    senderUserName: user?.email as string
                                                })
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
                                        <h3 className="font-bold">Rank</h3>
                                        <p>0 | 0 XP</p>
                                    </div>
                                    
                                </div>

                                <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1" />

                                <div className="text-white text-center">
                                    <h3 className="font-bold">CAREER RECORD</h3>
                                    <p>{usersRecord ? usersRecord?.wins : 0}W - {usersRecord ? usersRecord?.losses : 0}L</p>
                                    <p>{usersRecord?.wins && usersRecord?.losses ? ((usersRecord?.wins / (usersRecord?.wins + usersRecord?.losses)) * 100).toFixed(2) : 0 }% WIN RATE</p>
                                </div>

                                <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1" />

                                <div className="text-white text-center">
                                    <h3 className="font-bold">UPCOMING MATCHES</h3>
                                    

                                    { userSession?.username === user?.username ? (
                                        <div className="flex flex-col">
                                            {usersUpcomingMatches?.map((match: {id: string, teamId: string | null}) => (
                                                <>
                                                    <Link href={`/tournaments/${match.id}`} key={match.id}>
                                                        View Tournament 
                                                    </Link>
                                                </>
                                            ))}
                                        </div>
                                        
                                    ) : (
                                        <>
                                            {usersUpcomingMatches?.length}
                                        </>
                                        
                                    )}
                                    
                                </div>
                            </div>
                        </div>
                    )}
                    
                    
                </div>
                
            </div>
            <ToastContainer containerId={"profile-toast"} />
        </div>
    )
}