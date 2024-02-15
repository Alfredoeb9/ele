"use client";
import Disband from "@/app/_components/Disband";
import { api } from "@/trpc/react";
import { useDisclosure } from "@nextui-org/react";

import { Button, Card, CardHeader, Divider, Select, SelectItem, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';


export default function TeamSettings() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const router = useRouter();
    const session = useSession();
    const [teamName, setTeamName] = useState<string>("");

    const [error, setError] = useState<string>("");

    const currentUser = api.user.getSingleUserWithTeamMembers.useQuery({ email: session?.data && session.data?.user?.email as string | any })
    
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

    if (currentUser.isLoading) return <Spinner label="Loading..." color="warning" />

    return (
        <div className="flex bg-stone-900 min-h-screen items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="flex min-h-full flex-1 flex-col justify-center w-96 px-6 py-12 lg:px-8">
                <h1 className="text-white text-3xl font-bold mb-2">MY TEAMS</h1>
                <div className="flex gap-2 justify-between mb-4">
                    {/* {currentUser.data && currentUser.data?.teamMembers.length <= 0 ? (
                        <div className="text-white text-lg">No teams found. Go ahead and create a team</div>
                    ) : (
                        <>
                            {
                                currentUser.data?.teamMembers.map((team) => (
                                    <div className="text-white bg-slate-800 w-full p-2" key={team.teamId}>
                                        <div className="tournament_info w-full ml-4">
                                            <h1 className="text-3xl font-bold">{team.teamName}</h1>
                                            <p>{team.game}</p>
                                        
                                            <div>
                                                Ladder squads | 0W - 0L
                                            </div>
                                        
                                        
                                            <div className="flex flex-wrap justify-start mt-4 gap-2 md:gap-3 lg:gap-4">
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
                                                        setTeamName(team.teamName)
                                            
                                                    }}>
                                                        Disband
                                                </Button>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    
                                ))
                            }
                        </>  
                    )} */}

                </div>
                

                <button className="text-white w-64 bg-green-500 rounded-3xl p-4 hover:bg-green-600 transition-all"><Link href="/team-settings/create-team">Create a Team</Link></button>

                <Disband open={isOpen} onOpenChange={onOpenChange} teamName={teamName} />
                {/* RETURN A LIST OF USERS TEAMS */}
                {/* <form className="create-team" onSubmit={(e) => {
                    e.preventDefault();
                        createTeam.mutate({
                            game: selectedGames,
                            teamName: teamName
                        });
                    }}
                >
                    <h3 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Create a Team</h3>

                    <Select 
                        label="Select a Game" 
                        className="max-w-xs"
                        onClick={() => {
                            if (gameCategory.isError) {
                                toast('There was an error with this service.', {
                                    position: "bottom-right",
                                    autoClose: false,
                                    closeOnClick: true,
                                    draggable: false,
                                    type: "error",
                                    toastId: 7 
                                })
                            }
                        }}
                        onSelectionChange={(e) => setSelectedGames(Object.values(e)[0]) }
                        required
                        >
                            {gameCategory.data?.map((match) => (
                                <SelectItem key={match.id} value={match.game}>
                                    {match.game}
                                </SelectItem>
                            )) as []}
                    
                    </Select>


                    <label htmlFor="team_name" className="block text-sm font-medium leading-6 text-white">Team Name:</label>
                    <input
                            className="block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(e) => setTeamName(e.target.value)}
                            value={teamName}
                        />

                    <button
                        disabled={gameCategory.isError}
                        className="flex w-full justify-center rounded-md mt-4 bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500"
                    >
                        Create
                    </button>

                    <ToastContainer limit={1}/>
                </form> */}
                
{/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p> 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                  dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. 
                  Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. 
                  Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur 
                  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
            </div>
        </div>
    )
}