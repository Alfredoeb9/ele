'use client';
import { api } from "@/trpc/react";
import { Avatar, Button, Divider } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import type { TeamMembersType } from "@/server/db/schema"
import { statusGameMap } from "@/lib/sharedData";

// const statusColorMap: Record<string, any["name"]>  = {
//     "mw3": "Call of Duty: Modern Warare 3",
//     "fornite": "Fornite"
// };

export default function Team() {
    const session = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isUserOwner, setIsUserOwner] = useState(false)
    const [isUserMember, setIsUserMember] = useState(false)
    const teamIdFromPath = pathname.split("/")[2]

    if (!teamIdFromPath) {
        // setError("Please provide a user")
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

    const getTeamData = api.team.getSingleTeam.useQuery({ id: teamIdFromPath}, { enabled: teamIdFromPath.length > 0})

    if (getTeamData?.isError) {
        toast('Error retreving team data', {
            position: "bottom-right",
            autoClose: 2400,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 28                          
        })

        setTimeout(() => [
            router.push("/")
        ], 2500)
        
    }

    const team = getTeamData?.data

    useEffect(() => {
        //@ts-expect-error members is expected
        if ((team?.members && team?.members as TeamMembersType[])?.length > 0) {
            //@ts-expect-error members is expected
            team?.members?.map((member: { userId: string | null | undefined; role: string; }) => {
                if (member?.userId === session?.data?.user?.email) {
                    if( member?.role === 'owner' ) {
                        setIsUserOwner(true)
                    } else if (member?.role === 'member')  {
                        setIsUserMember(true)
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
                                    { team?.gameTitle.toLowerCase() === 'mw3' ?  statusGameMap[team?.gameTitle] : "Call of Duty: Modern Warare 3" }
                                    { team?.gameTitle.toLowerCase() === 'fornite' ?  statusGameMap[team?.gameTitle] : "Fornite" }
                                    <h2 className="mb-2">{team?.team_name}</h2>
                                </div>
                                

                            </div>
                            

                            <div className="flex flex-col gap-1">
                                
                                { isUserOwner &&
                                    <>
                                        <Button color="success">Edit Background</Button>
                                        <Button>Find Match</Button>
                                        <Button color="danger">Disband Team</Button> 
                                    </>
                                }
                                
                                { isUserMember && <Button color="danger">Leave Team</Button> }                                             
                                
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