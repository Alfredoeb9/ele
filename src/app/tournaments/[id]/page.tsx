"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from "@tanstack/react-query";
import { Button, Card, CardBody, CardFooter, CardHeader, Spinner, Image } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
// import ErrorComponent from "@/components/ErrorComponent";
import Link from "next/link";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
// import Image from "next/image";

export default function Tournaments({
    params: { id },
}: {
    params: {
        id: string;
    }
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [ tournamentId, setTournamentId ] = useState<string>(id);
    const [ error, setError ] = useState<any>(null);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const session = useSession()

    // const { data: tournament, isSuccess, isLoading, isError } = useQuery<any>({
    //     queryKey: ["tournament-finder"],
    //     queryFn: () => 
    //         fetch(`/api/match-finder/${tournamentId}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(tournamentId)
    //         }).then((res) =>
    //             res.json()
    //         ).catch(() => {
    //             console.log("catch ran up")
    //         }),
    //     retry: 3
    // })

    const tournament = api.matches.getSingleMatch.useMutation({
        onSuccess: () => {
            console.log("success")
        },

        onError: (error) => {
            console.log("Error", error.message)
        }
    })

    useEffect(() => {
        if (tournamentId) {
            tournament.mutate({ id: tournamentId })
        }
    }, [tournamentId])

    // if (!tournament.data) console.log("this is atest")
    tournament.data?.map((tour: any) => {
        console.log("tour", tour )
    })

    // const tourney = tournament.data[0]

    // if (tournament?.data[0]?.start_time == undefined) throw new Error("this is a test")

    // const t1 = new Date(tournament.data[0].start_time).valueOf() // end
    const t1 = new Date(`${tournament.data && tournament.data[0]?.start_time}`).valueOf() // end
        const t2 = new Date().valueOf()

        console.log("rand", )

    useEffect(() => {
        const totalSeconds = (t1 - t2) / 1000;
        console.log('totalSeconds', totalSeconds)
        let i = setInterval(() => {
            setDays(formatTime(Math.floor(totalSeconds / 3600 / 24)));
            setHours(Math.floor(totalSeconds / 3600) % 24);
            setMinutes(Math.floor(totalSeconds / 60) % 60);
            setSeconds(Math.floor(totalSeconds % 60));
        }, 1000)

        return () => clearInterval(i);
    }, [t2])

    

    function formatTime(time: any) {
        return time < 10 ? `0${time}` : time
    }

    // const fetchEnroll = async () => {
    //     try {
    //         await fetch(`/api/tournament`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(tournamentId)
    //         }).then(async (res) => {

    //             let data = await res.json()

    //             if (res.status >= 500) return setError(data?.message)

    //             if (res.status === 201) {
    //                 router.push(`/tournaments/enroll?id=${tournamentId}`)
    //                 return data;
    //             };
    //         }).catch(() => {
    //             setError(true);
    //         })
    //     } catch (error) {
    //         setError(error)
    //     }
        
    // }
    
    // if ( isLoading ) return <Spinner label="Loading..." color="warning" />

    // if ( isError || tournament == undefined || tournament == null || tournament.isError || tournament.message.includes("does not exist")) return <p>Error</p>

    const d1 = new Date(`${tournament.data && tournament.data[0]?.start_time}`), 
        d2 = new Date();

        console.log("d1", d1)
        console.log("d2", d2)

    const pstDate = d1.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        })

    return (
        <div className="">
            <div className="tournament_backgroundHeader h-24 bg-mw3 bg-no-repeat bg-cover bg-center bg-fixed" />
            <main className=" px-4">
                <div id="tournament_info-block" className="bg-slate-400 rounded-xl">
                    <div className="flex">
                        <Card isFooterBlurred className="w-56 h-[300px] col-span-12 sm:col-span-7">
                            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                                <p className="text-tiny text-white/60 uppercase font-bold">Your day your way</p>
                                <h4 className="text-white/90 font-medium text-xl">Your checklist for better sleep</h4>
                            </CardHeader>
                            <Image
                                removeWrapper
                                alt="Relaxing app background"
                                className="z-0 w-full h-full object-cover"
                                src={`/images/${tournament?.data && tournament?.data[0]?.game}.png`}
                                width={400}
                            />
                            <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                                <div className="flex w-full justify-between items-center ">
                                    {/* <Image
                                        alt="Breathing app icon"
                                        className="rounded-full w-10 h-11 bg-black"
                                        src="/images/breathing-app-icon.jpeg"
                                    /> */}
                                    {/* <div className="flex flex-col"> */}
                                        <p className="text-sm text-white/60">Prize: $200</p>
                                        
                                    {/* </div> */}

                                    <p className="text-sm text-white/60">NA + EU</p>
                                </div>
                                {/* <Button radius="full" size="sm">Get App</Button> */}
                            </CardFooter>
                        </Card>

                        <div className="tournament_info w-full ml-4">
                            <h1 className="text-3xl font-bold">{tournament?.data &&  tournament.data[0]?.game}</h1>
                            <div className="flex mb-4 items-center justify-around w-1/2">
                                <div>
                                    <p className="block font-bold">{tournament?.data &&  tournament.data[0]?.name}</p>
                                    <p className="block">{tournament?.data && tournament.data[0]?.tournament_type}</p>
                                </div>

                                <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1"/>
                                
                                <div>
                                <p className="font-bold">Platforms:</p>
                                <p>{tournament?.data && tournament?.data[0]?.platform ? "Cross Platform" : <span className="text-bold text-small capitalize">{tournament.data && tournament?.data[0]?.platform as any}</span>}</p>
                                </div>
                                
                            </div>
                            
                            <div className="flex gap-1 w-1/2">
                                <Card className="w-40 grow">
                                    <CardHeader>
                                        <div>
                                            <p>REGISTRATION OPENS</p>
                                            <p>{d2.valueOf() <= d1.valueOf() ? "OPEN NOW" : "CLOSED"}</p>
                                        </div>
                                    </CardHeader>
                                    {/* <CardBody>
                                        <p></p>
                                    </CardBody> */}
                                </Card>

                                <Card className="w-40 grow">
                                    <CardHeader>
                                        <div>
                                            <p>Start Time</p>
                                            <p>{pstDate} PST</p>
                                        </div>
                                    </CardHeader>
                                    {/* <CardBody>
                                        <p></p>
                                    </CardBody> */}
                                </Card>
                            </div>
                            
                            
                            <div className="flex flex-wrap justify-evenly w-1/2 mt-4">
                                <div className="">
                                    <h5 className="font-bold">ENTRY/PLAYER</h5>
                                    <p>{tournament?.data && tournament?.data[0]?.entry}</p>
                                </div>
                                <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1"/>
                                <div className="">
                                    <h5 className="font-bold">TEAM SIZE</h5>
                                    <p>{tournament?.data && tournament?.data[0]?.team_size}</p>
                                </div>
                                <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1"/>
                                <div className="">
                                    <h5 className="font-bold">MAX TEAMS</h5>
                                    <p>{tournament?.data && tournament?.data[0]?.max_teams}</p>
                                </div>
                                <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1"/>
                                <div className="">
                                    <h5 className="font-bold">ENROLLED</h5>
                                    <p>{tournament?.data && tournament?.data[0]?.enrolled}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex px-3 py-5 gap-2">
                        { d2.valueOf() <= d1.valueOf() ? (
                            <div>
                                <p className="text-lg un">
                                    <span className="underline">Match Starts in: </span>
                                    <span className="text-2xl">{days > 0 && days + "D"} {hours > 0 && hours + "H"} {minutes > 0 && minutes + "M"} {seconds > 0 && seconds + "S"}</span>
                                </p>            
                            </div>
                        ) : (
                            <div>
                                <p className="text-lg un"><span className="underline">Match Starts in: </span><span className="text-2xl">Match Started</span></p>
                            </div>
                        )}
                        <Button isDisabled={d2.valueOf() <= d1.valueOf() ? false : true} className="px-4 py-3 font-bold text-lg" color="success" variant="solid" size="lg" radius="md"><Link href={`/tournaments/enroll?id=${tournamentId}`}>Enroll Now</Link></Button>
                        <Button className="px-4 py-3 text-lg font-semibold" variant="bordered" size="lg" radius="md">Find Teammates</Button>
                    </div>
                </div>

                <div className="tournament_body">
                    <div className="tournament_body_info_bar"></div>
                    <div className="tournament_body_prizes"></div>
                </div>

                <div className="tournament_details_tab_prizes"></div>

                {error && <p className="text-red-400 font-bold">{error}</p>}
            </main>
        </div>
    )
}