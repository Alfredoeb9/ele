"use client";
import { api } from "@/trpc/react";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';


export default function CreateTeam() {
    const router = useRouter();
    const session = useSession();
    const [teamName, setTeamName] = useState<string>("");

    const [error, setError] = useState<string>("");
    const [selectedGameId, setSelectedGameId] = useState<string>("");
    const [selectedGame, setSelectedGame] = useState<string>("");

    if (session.status === 'unauthenticated') router.push("/sign-in")

    const createTeam = api.create.createTeam.useMutation({
        
        onSuccess: () => {
            setTeamName("");
            router.push("/team-settings");
        },

        onError: (e) => {
            if (e.data?.stack?.includes("rpc error: code = AlreadyExists")) {
                setError("Team name already exists")
            }
        }
    });

    const gameCategory = api.games.getOnlyGames.useQuery();

    if (gameCategory.isError) {
        setError("Service is down, please refresh or submit a ticket")
        toast(`Service is down, please refresh or submit a ticket`, {
            position: "bottom-right",
            autoClose: false,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 12                             
        })
    }

    if (createTeam.isLoading) return <Spinner label="Loading..." color="warning" />

    return (
        <div className="flex bg-stone-900 min-h-screen flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="flex min-h-full flex-1 flex-col justify-center w-96 px-6 py-12 lg:px-8">
                <h1 className="text-white text-3xl font-bold text-center mb-2">Create A Team</h1>


                <form className="create-team" onSubmit={(e) => {
                        e.preventDefault();
                        createTeam.mutate({
                            gameId: selectedGameId,
                            gameText:selectedGame,
                            teamName: teamName,
                            email: session.data?.user.email as string,
                            userName: session.data?.user.username as string
                        });
                    }}
                >

                    <Select 
                        label="Select a Game" 
                        className="max-w-xs"
                        disabled={gameCategory.isError}
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
                        onSelectionChange={(e) => setSelectedGameId(Object.values(e)[0]) }
                        required
                        >
                            {gameCategory.data?.map((match) => (
                                <SelectItem key={match.id} onClick={(e) => setSelectedGame((e.target as HTMLElement).outerText)} value={match.game}>
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
                        disabled={ gameCategory.isError || selectedGame === "" || selectedGame.length <= 0 }
                        className="flex w-full justify-center rounded-md mt-4 bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500"
                    >
                        Create
                    </button>

                    {createTeam.isError && <div className="text-white">{error}</div>}

                    <ToastContainer limit={1}/>
                </form>
            </div>
        </div>
    )
}