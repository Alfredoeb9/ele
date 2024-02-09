"use client";
import React, { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, useEffect, useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CheckboxGroup, Checkbox, Select, SelectItem, Spinner } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetUser } from "../../hooks/getUser";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import { api } from "@/trpc/react";

export default function Enroll() {
    const queryClient = useQueryClient();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const session = useSession();
    const [error, setError] = useState<any>(null);
    const [selectedGames, setSelectedGames] = useState<string>("");
    const { getuser, error2, isLoading2 } = useGetUser();

    // if (!session?.data) return router.push("/sign-in")

    const search = searchParams.get('id')

    const tournament = api.matches.getSingleMatch.useMutation({
        onSuccess: () => {
            console.log("success")
        },

        onError: (error) => {
            console.log("Error", error.message)
        },
    })

    useEffect(() => {
        if (search) {
            tournament.mutate({ id: search })
        }
    }, [search])

    const currentUser = api.user.getSingleUserByTeamId.useMutation({
        onSuccess: () => {
            console.log("user retrieved")
        },

        onError: (error) => {
            setError(error.message)
            console.log("no user")
        }
    })

    useEffect(() => {
        if (session.data?.user && tournament?.data) {
            console.log("test", tournament?.data[0]?.id)
            currentUser.mutate({ email: session.data?.user.email as string, gameId: tournament?.data[0]?.id})
        }
    }, [session.data, tournament.data])

    console.log("currentUser", currentUser.data) 
    
    // if ( currentUser?.data && tournament?.data ) {
    //     if (Number(tournament.data[0].entry.replace(/[^0-9]/g,"")) > Number(currentUser.data.credits)) {
    //         router.push("/pricing")
    //     }
    // }

    // if(tournament.isLoading || currentUser.isLoading) return <Spinner label="Loading..." color="warning" />

    return (
        <div>
            <h1>Match Confirmation</h1>
            <p>Attention: Before accepting match read our refund policy, as well as the current match/tournament rules.</p>

            <p>This Match/ Tournament will cost {tournament?.data && tournament?.data[0]?.entry}</p>
            <form onSubmit={(e) => {
                // e.preventDefault();
                // createTournament.mutate({
                //     gameCategoryId: arrById[0]?.id,
                //     game: arrById[0]?.game,
                //     name: title,
                //     platforms: selected,
                //     tournament_type: String(selectedTournamentType),
                //     entry: entry,
                //     team_size: teamSize,
                //     max_teams: maxTeams,
                //     enrolled: Number(enrolled),
                //     start_time: startTime,
                //     rules: confirmedGameRules,
                //     created_by: session?.data?.user?.email as string
                // });
            }}>
            <div className='mb-2'>
                {/* <label className='block text-sm font-medium leading-6'>Title:</label>
                <input
                required
                className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type='text'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                /> */}
            </div>
            <div>
                <Select 
                label="Select a Team" 
                className="max-w-xs"
                onSelectionChange={(e) => setSelectedGames(Object.values(e)[0]) }
                required
                >
                    {currentUser.data?.teams?.map((match) => (
                        <SelectItem key={match.id} value={match.game}>
                            {match.game}
                        </SelectItem>
                    )) as []}
              
                </Select>
            </div>

            {/* <CheckboxGroup
                label='Select platforms:'
                className='block pt-2 text-sm font-medium leading-6'
                value={selected}
                onValueChange={setSelected}
                isRequired
            >
                {arrById[0]?.platforms.map((platform: any, i: number) => (
                <Checkbox key={i} value={platform}>{platform}</Checkbox>
                ))}
            </CheckboxGroup> */}

            {/* <div className='mb-2'>
                <label className='block text-sm font-medium leading-6' htmlFor={"start-time"} >Start Time:</label>
                <input
                required
                className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type="datetime-local"
                id="start-time"
                name="start-time"
                min="2024-01-07T00:00"
                onChange={(e) => setStartTime(e.target.value)}
                value={startTime}
                />
            </div> */}

            {/* <div className='mb-2'>
                <Select 
                label="Tournament Type" 
                className="max-w-xs"
                required
                >
                {tournamentType.map((type: any, i: number) => (
                    <SelectItem onClick={(e) => setSelectedTournamentType((e?.target as HTMLElement).textContent)} key={i} value={type}>
                    {type}
                    </SelectItem>
                ))}
                </Select>
            </div> */}

            {/* <div className='mb-2'>
                <label className='block text-sm font-medium leading-6'>Entry:</label>
                <input
                required
                className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type='text'
                onChange={(e) => setEntry(e.target.value)}
                value={entry}
                />
            </div> */}

            {/* <div className='mb-2'>
                <label className='block text-sm font-medium leading-6'>Team Size:</label>
                <input
                required
                className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type='text'
                onChange={(e) => setTeamSize(e.target.value)}
                value={teamSize}
                />
            </div> */}

            {/* <div className='mb-2'>
                <label className='block text-sm font-medium leading-6'>Max Teams:</label>
                <input
                required
                min={2}
                className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type='number'
                onChange={(e) => setMaxTeams(Number(e.target.value))}
                value={maxTeams}
                />
            </div> */}

            {/* <div className='mb-2'>
                <label className='block text-sm font-medium leading-6'>Rules:</label>
                
                {Object.entries(gameRules).map((rule, key: number) => (
                <Select label={rule[0].charAt(0).toUpperCase() + rule[0].slice(1)} key={key} id={`${key}`} className='flex'>
                    {rule[1].map((option: any, i: number) => (
                        <SelectItem value={option} key={i} onPress={(e) => handleRuleChange((e.target as HTMLElement).innerText, rule[0], i)}>
                        {option}
                        </SelectItem>
                    ))}
                </Select>
                ))}
            </div> */}

            {/* <div className='mb-2'>
                <label className='block text-sm font-medium leading-6'>Enrolled:</label>
                <input
                required              
                className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type='number'
                onChange={(e) => setEnrolled(Number(e.target.value))}
                value={enrolled}
                />
            </div> */}

            <button
                className='mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500'
                // disabled={
                //     title.length === 0 ||
                //     selected.length === 0 ||
                //     createTournament.isLoading
                // }
            >
                Enroll 
            </button>

            {/* {createTournament.isError && <div className='pt-2 font-bold text-red-600'>{createTournament.error.message}</div>} */}
            </form>
            {/* <button 
                onClick={(e) => {
                e.preventDefault();
                    
                }}
            >
                Enroll
            </button> */}

            <ToastContainer />
        </div>
    )
}