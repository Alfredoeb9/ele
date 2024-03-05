"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { Button, Card, CardFooter, CardHeader, Spinner, Image } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { statusGameMap } from "@/lib/sharedData";

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
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const session = useSession()

    const tournament = api.matches.getSingleMatch.useQuery({ id: tournamentId }, { enabled: tournamentId.length >= 0 })

    if (tournament.isError) {
        toast('There was an error returning tournament data', {
            position: "bottom-right",
            autoClose: 5000,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 45
        })
    }

    const t1 = new Date(`${tournament.data && tournament.data[0]?.start_time}`).valueOf() // end
        const t2 = new Date().valueOf()

    useEffect(() => {
        const totalSeconds = (t1 - t2) / 1000;
        const i = setInterval(() => {
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
    
    if ( tournament.isLoading ) return <Spinner label="Loading..." color="warning" />

    const d1 = new Date(`${tournament.data && tournament.data[0]?.start_time}`), 
        d2 = new Date();

    const pstDate = d1.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        })

    return (
        <div>
            <div className={`w-full h-[300px] bg-${tournament?.data && tournament?.data[0].game.toLowerCase()}_team_background bg-no-repeat bg-cover bg-center bg-fixed`} />

            <main className=" px-4 relative mt-[-150px]">
                <div id="tournament_info-block" className="bg-slate-400 rounded-xl w-full sm:w-[65%] p-1">
                    <div className="block sm:flex">
                        {tournament.data?.map((tournament) => (
                            <>
                                <Card isFooterBlurred className="w-full sm:w-56 h-[300px] col-span-12 sm:col-span-7 after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-br from-white to-neutral-400 after:opacity-30">
                                    <Image
                                        removeWrapper
                                        alt={`${tournament?.game} game poster`}
                                        className="z-0 w-full h-full object-cover"
                                        src={`/images/${tournament?.game}.png`}
                                        width={400}
                                    />
                                    <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                                        <div className="flex w-full justify-between items-center ">
                                            <p className="text-sm text-white/60">Prize: ${tournament?.prize}</p>
                                            <p className="text-sm text-white/60">NA + EU</p>
                                        </div>
                                    </CardFooter>
                                </Card>

                                <div className="tournament_info w-full p-2 sm:ml-4">
                                    {tournament.game.toLowerCase() === 'mw3' && <h1 className="text-3xl font-bold">{statusGameMap[tournament?.game]}</h1>}
                                    {tournament.game.toLowerCase() === 'fornite' && <h1 className="text-3xl font-bold">{statusGameMap[tournament?.game]}</h1>}

                                    <div className="flex mb-4 items-center justify-around w-full">
                                        <div>
                                            <p className="block font-bold">{tournament?.name}</p>
                                            <p className="block">{tournament?.tournament_type}</p>
                                        </div>

                                        <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1"/>
                                    
                                        <div>
                                            <p className="font-bold">Platforms:</p>
                                            <p>{tournament?.platform ? "Cross Platform" : <span className="text-bold text-small capitalize">{tournament?.platform as any}</span>}</p>
                                        </div>
                                    </div>
                                
                                    <div className="flex gap-1 w-[90%] m-auto">
                                        <Card className="grow">
                                            <CardHeader>
                                                <div>
                                                    <p className="font-semibold">REGISTRATION OPENS</p>
                                                    <p>{d2.valueOf() <= d1.valueOf() ? "OPEN NOW" : "CLOSED"}</p>
                                                </div>
                                            </CardHeader>
                                        </Card>

                                        <Card className="grow">
                                            <CardHeader>
                                                <div>
                                                    <p className="font-semibold">Start Time</p>
                                                    <p>{pstDate} PST</p>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    </div>
                                
                                    
                                    <div className="flex flex-wrap justify-evenly w-full mt-4">
                                        <div className="">
                                            <h5 className="font-bold">ENTRY/PLAYER</h5>
                                            <p>{tournament?.entry}</p>
                                        </div>
                                        <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1"/>
                                        <div className="">
                                            <h5 className="font-bold">TEAM SIZE</h5>
                                            <p>{tournament?.team_size}</p>
                                        </div>
                                        <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1"/>
                                        <div className="">
                                            <h5 className="font-bold">MAX TEAMS</h5>
                                            <p>{tournament?.max_teams}</p>
                                        </div>
                                        <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1"/>
                                        <div className="">
                                            <h5 className="font-bold">ENROLLED</h5>
                                            <p>{tournament?.enrolled}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                    
                    <div className="flex px-3 py-5 gap-2">
                        <div>
                            <p className="text-base sm:text-lg">
                                <span className="underline font-bold">Match Starts in: </span>
                                { d2.valueOf() <= d1.valueOf() ? ( 
                                    <span className="text-xl sm:text-2xl">{days > 0 && days + "D"} {hours > 0 && hours + "H"} {minutes > 0 && minutes + "M"} {seconds > 0 && seconds + "S"}</span>
                                ) : (
                                    <span className="text-xl sm:text-2xl">Match Started</span>   
                                )
                                }
                            </p>            
                        </div>
                        <Button isDisabled={d2.valueOf() <= d1.valueOf() ? false : true} className="px-4 py-3 font-bold text-sm sm:text-lgtext-lg" color="success" variant="solid" size="lg" radius="md"><Link href={`/tournaments/enroll?id=${tournamentId}`}>Enroll Now</Link></Button>
                        <Button className="px-4 py-3 text-sm sm:text-lg font-semibold" variant="bordered" size="lg" radius="md">Find {<br/>} Teammates</Button>
                    </div>
                </div>

                <div className="tournament_body">
                    <div className="tournament_body_info_bar"></div>
                    <div className="tournament_body_prizes"></div>
                </div>

                <div className="tournament_details_tab_prizes"></div>

                {tournament.isError && <p className="text-red-400 font-bold">{tournament.error.message}</p>}
            </main>
        </div>
    )
}