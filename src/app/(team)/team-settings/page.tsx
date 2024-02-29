"use client";
import Disband from "@/app/_components/modals/Disband";
import LeaveTeamModal from "@/app/_components/modals/LeaveTeamModal";
import { statusGameMap } from "@/lib/sharedData";
import { api } from "@/trpc/react";
import { useDisclosure } from "@nextui-org/react";

import { Button, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';


export default function TeamSettings() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const session = useSession();
    const [teamName, setTeamName] = useState<string>("");
    const [teamId, setTeamId] = useState<string>("");
    const [modalPath, setModalPath] = useState<string>("");

    // const [error, setError] = useState<string>("");

    const currentUser = api.user.getSingleUserWithTeamMembers.useQuery({ email: session.data?.user?.email as string }, { enabled: session.status === "authenticated"})
    
    if (currentUser.isError) {
        toast(`There was a problem getting user data`, {
            position: "bottom-right",
            autoClose: false,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 2
        })
    }

    const handleModalPath = useCallback((path: string) => {
        switch (path) {
          case "friend":
            setModalPath("friend")
            break;
          case "remove friend":
            setModalPath("remove friend")
            break;
          default:
            setModalPath("")
            break;
        }
      }, [])

    if (currentUser.isLoading) return <Spinner label="Loading..." color="warning" />

    return (
        <div className="flex bg-stone-900 min-h-screen items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="flex min-h-full flex-1 flex-col w-96 px-5 py-8 sm:py-4 lg:px-7">
                <h1 className="text-white text-3xl font-bold mb-2">MY TEAMS</h1>
                <div className="flex flex-wrap gap-2 justify-between mb-4">
                    {currentUser.data && currentUser.data?.teamMembers.length <= 0 ? (
                        <div className="text-white text-lg">No teams found. Go ahead and create a team</div>
                    ) : (
                        <>
                            {
                                currentUser.data?.teamMembers.map((team) => (
                                    <div className="text-white bg-slate-800 w-[100%] sm:w-[32.2%] p-2 rounded-xl" key={team.teamId}>
                                        <div className="tournament_info w-full ml-4">
                                            <h1 className="text-lg md:text-xl lg:text-2xl font-bold">{team.teamName}</h1>
                                            <p className="font-semibold">{team.game === 'mw3' && statusGameMap[team?.game]}</p>
                                        
                                            <div>
                                                Ladder squads | {team?.record?.wins ?? 0} W - {team?.record?.losses ?? 0} L
                                            </div>
                                        
                                        
                                            <div className="flex flex-wrap justify-start mt-4 gap-2 md:gap-3 lg:gap-4">
                                                { team.role === 'member' && (
                                                    <>
                                                    <Button 
                                                        className="text-green-500" 
                                                        variant="bordered">
                                                        <Link href={`/team/${team.teamId}`}>View</Link>
                                                    </Button>
                                                    <Button 
                                                        className="text-red-500" 
                                                        variant="bordered" 
                                                        onPress={() => {
                                                            onOpen(),
                                                            setModalPath("member")
                                                            setTeamName(team.teamName)
                                                        }}>
                                                            Leave Team
                                                    </Button>
                                                    </>
                                                )}

                                                { team.role === 'owner' && (
                                                    <>
                                                        <Button 
                                                            className="text-green-500" 
                                                            variant="bordered">
                                                                <Link href={`/team/${team.teamId}`}>Manage</Link>
                                                        </Button>
                                                        <Button 
                                                            className="text-red-500" 
                                                            variant="bordered" 
                                                            onPress={() => {
                                                                onOpen(),
                                                                setModalPath("owner")
                                                                setTeamName(team.teamName)
                                                                setTeamId(team.teamId)
                                                            }}>
                                                                Disband
                                                        </Button>
                                                    </>
                                                )}
                                                
                                            </div>
                                        </div>
                                        
                                    </div>
                                    
                                ))
                            }
                        </>  
                    )}

                </div>
                

                <button className="text-white w-64 bg-green-500 rounded-3xl p-4 hover:bg-green-600 transition-all"><Link href="/team-settings/create-team">Create a Team</Link></button>
                
                { modalPath === "member" && (
                    <LeaveTeamModal  open={isOpen} onOpenChange={onOpenChange} handleModalPath={handleModalPath} userEmail={session.data?.user.email as string} teamName={teamName} />
                )}

                { modalPath === "owner" && (
                    <Disband open={isOpen} onOpenChange={onOpenChange} teamName={teamName} teamId={teamId} />
                )}
            </div>
        </div>
    )
}