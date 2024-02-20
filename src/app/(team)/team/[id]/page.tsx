'use client';
import { api } from "@/trpc/react";
import { Avatar, Button, Divider } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import type { TeamMembersType } from "@/server/db/schema"

export default function Team() {
    const session = useSession();
    const pathname = usePathname()
    const [error, setError] = useState<string>("");
    const [isUserAdmin, setIsUserAdmin] = useState(false)
    const teamIdFromPath = pathname.split("/")[2]

    if (!teamIdFromPath) {
        setError("Please provide a user")
        toast('Please provide a user', {
            position: "bottom-right",
            autoClose: 5000,
            closeOnClick: true,
            draggable: false,
            type: "success",
            toastId: 15
        })
        return null
    }

    const getTeamData = api.team.getSingleTeam.useQuery({ id: teamIdFromPath})

    if (getTeamData.isError) {
        setError("Team does not exist")
    }

    const team = getTeamData?.data

    useEffect(() => {
        if ((team?.members as TeamMembersType[])?.length > 0) {
            team?.members?.map((member: { userId: string | null | undefined; role: string; }) => {
                if (member?.userId === session?.data?.user?.email) {
                    if(member?.role === 'admin') {
                        setIsUserAdmin(true)
                    }
                }
            })
        }
    }, [team, session.data])
    
    return (
        <div className="bg-neutral-600">
            <div className="w-full h-[300px] object-cover bg-mw3_team_background bg-no-repeat bg-cover after:relative after:block after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-br from-white to-neutral-400 after:opacity-50 z-0 relative"></div>

            <div className="relative mt-[-150px] ">
                <div className="container m-auto relative z-20">
                    
                    <div className="p-4 ">
                        <div className="flex justify-between pb-2">
                            
                            <div className="flex">
                                <Avatar />
                                <div className="text-white">
                                    <h2 className="text-3xl mb-2 font-bold">{team?.team_name}</h2>
                                    <p className="font-semibold">EST. {team?.createdAt.toLocaleDateString()}</p>
                                    <p>Call of Duty: Modern Warare 3 | Global SQUAD Ladder</p><h2 className="mb-2">{team?.team_name}</h2>
                                </div>
                                

                            </div>
                            

                            <div className="flex flex-col gap-1">
                                <Button color="success">Edit Background</Button>
                                <Button>Find Match</Button>
                                { isUserAdmin 
                                    ? 
                                        <Button color="danger">Disband Team</Button> 
                                    : 
                                        <Button color="danger">Leave Team</Button> 
                                }
                                
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
                </div>
                
            </div>
            <ToastContainer containerId="team_id" />
        </div>
    )
}