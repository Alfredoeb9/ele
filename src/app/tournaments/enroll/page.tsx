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
import Link from "next/link";

export default function Enroll() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const session = useSession();
    const [error, setError] = useState<any>(null);
    const [selectedGames, setSelectedGames] = useState<string>("");
    const [teamName, setTeamName] = useState<string>("");
    const { getuser, error2, isLoading2 } = useGetUser();

    if (session?.data === null) return router.push("/sign-in")

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
        onSuccess: (data) => {
            return true
        },

        onError: (error) => {
            setError(error.message)
        }
    })

    useEffect(() => {
        if (session?.data?.user && tournament?.data) {
            currentUser.mutate({ email: session?.data?.user.email as string, gameId: tournament?.data[0]?.id})
        }
    }, [session.data, tournament.data])

    const enrollTeam = api.matches.enrollTeamToTournament.useMutation({
        onSuccess: () => {
            toast(`${teamName} has been enrolled into ${tournament?.data![0]?.name} tournament`, {
                position: "bottom-right",
                autoClose: 5000,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 23
            })
            setSelectedGames("")
            setTeamName("")
            // router.push("/")
        },

        onError:(error) => {
            if (error.message.includes("cannot enroll team in tournament")) {
                toast(`${teamName} is already enrolled into ${tournament?.data![0]?.name} tournament`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    draggable: false,
                    type: "error",
                    toastId: 24
                })
            }
        }
    })

    const CustomToastWithLink = () => (
        <div>
            Please <Link href="/team-settings" className="text-blue-600">create a team</Link> for this game category. 
        </div>
      );
    
    if ( currentUser?.data && tournament?.data ) {
        if (Number(tournament.data[0].entry.replace(/[^0-9]/g,"")) > Number(currentUser.data.credits)) {
            router.push("/pricing")
        }
    }

    if(tournament.isLoading || currentUser.isLoading) return <Spinner label="Loading..." color="warning" />

    return (
        <div className="container m-auto pt-2 px-4">
            <h1 className="text-white text-4xl md:text-3xl lg:text-4xl font-bold pb-4">Match Confirmation</h1>
            <p className="text-white mb-2"><span className="font-semibold">Attention:</span> Before accepting match read our 
                <Link href={"/refund-policy"} className="text-blue-500"> refund policy</Link>, 
                we are currently not accepting any refunds at this time and
                current match/tournament rules.
            </p>

            <p className="text-white mb-2">This Match/ Tournament will cost <span className="text-blue-500 font-semibold">{tournament?.data && tournament?.data[0]?.entry}</span></p>
            <form onSubmit={(e) => {
                e.preventDefault();
                enrollTeam.mutate({
                    tournamentId: tournament.data && tournament.data[0]?.id as string | any,
                    teamId: selectedGames,
                    teamName: teamName
                });
            }}>
                <div>
                    <Select 
                    label="Select a Team" 
                    className="max-w-xs"
                    onClick={() => {
                        if (currentUser.data && currentUser.data.teams && currentUser.data.teams.length <= 0 ) {
                            toast.error(CustomToastWithLink, {
                                position: "bottom-right",
                                autoClose: 5000,
                                closeOnClick: true,
                                draggable: false,
                                type: "error",
                                toastId: 6 
                            })
                        }
                    }}
                    onSelectionChange={(e) => setSelectedGames(Object.values(e)[0]) }
                    required
                    >
                        {currentUser.data?.teams?.map((match) => (
                            <SelectItem key={match.teamId} onClick={() => setTeamName(match.teamName)} value={match.teamName}>
                                {match.teamName}
                            </SelectItem>
                        )) as []}
                
                    </Select>
                </div>

                <button
                    className='mt-4 flex w-64 justify-center rounded-md m-auto bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500'
                    disabled={ (currentUser?.data?.teams && currentUser.data.teams.length <= 0) ?? selectedGames.length <= 0}
                >
                    Enroll 
                </button>

            </form>
            <ToastContainer />
        </div>
    )
}