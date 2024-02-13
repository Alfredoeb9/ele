"use client";
import { api } from "@/trpc/react";
import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';


export default function SignUp() {
    const router = useRouter();
    const session = useSession();
    const [teamName, setTeamName] = useState<string>("");

    const [error, setError] = useState<string>("");
    const [selectedGames, setSelectedGames] = useState<string>("");

    const currentUser = api.user.getSingleUserWithTeamMembers.useMutation({
        onError: (error) => {
            // setError(error.message)
            toast(`There was a problem getting user data`, {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 2                             
            })
        }
    })
    
    const createTeam = api.create.createTeam.useMutation({
        
        onSuccess: () => {
            router.refresh();
            setTeamName("");
        },

        onError: (e) => {
            console.log("error", e.message)
            setError(e.message)
        }
    });

    useEffect(() => {
        if (session.data?.user) {
            currentUser.mutate({ email: session.data?.user.email as string})
        }
    }, [session.data])

    // const gameCategory = api.games.getOnlyGames.useQuery();

    if (createTeam.isLoading) return <Spinner label="Loading..." color="warning" />

    console.log("currentuser", currentUser.data)

    return (
        <div className="flex bg-stone-900 min-h-screen flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="flex min-h-full flex-1 flex-col justify-center w-96 px-6 py-12 lg:px-8">
                <h1 className="text-white text-3xl font-bold">MY TEAMS</h1>
                {currentUser.data && currentUser.data?.teamMembers.length <= 0 ? (
                    <div className="text-white text-lg">No teams found. Go ahead and create a team</div>
                ) : (
                    <>
                        {
                            currentUser.data?.teamMembers.map((team) => (
                                <div className="text-white" key={team.teamId}>
                                    {team.game}                                    
                                </div>
                            ))
                        }
                    </>  
                )}

                <Button className="text-white ml-2" href="/team-settings/create-team" color="success"><Link href="/team-settings/create-team">Create a Team</Link></Button>


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
            </div>
        </div>
    )
}