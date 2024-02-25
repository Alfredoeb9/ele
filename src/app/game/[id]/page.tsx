"use client";

import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react";
import type { GameCategoryType, Tournament } from "@/server/db/schema"
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, SetStateAction, useCallback, useEffect, useState } from "react";
import { tabs } from "@/lib/sharedData"
import GameTabs from "./GameTabs";
import Link from "next/link";
import Image from "next/image";
  
export default function Game() {
    const [value, setValue] = useState("Community Tournaments")
    const [renderData, setRenderData] = useState<any[]>([])
    const pathname = usePathname()
    const gameFromPath = pathname.split("/")[2]
    const [active, setActive] = useState<string>("community tournaments");
    const [d1, setD1] = useState();
    const [d2, setD2] = useState();
    const [pstDate, setPstDate] = useState();
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [t1, setT1] = useState<any>();
    const [t2, setT2] = useState<any>();

    // const navigate = (id: string) => {
        // setActive(id);
    // };

    // get data from params
    const gameData = api.games.getSingleGame.useQuery({ gameName: gameFromPath})

    // if (gameData.data === undefined) return null 

    // const t1 = new Date(`${tournament.data && tournament.data[0]?.start_time}`).valueOf() // end
    //     const t2 = new Date().valueOf()

    // function formatTime(time: any) {
    //     return time < 10 ? `0${time}` : time
    // }

    // useEffect(() => {
    //     const totalSeconds = (t1 - t2) / 1000;
    //     const i = setInterval(() => {
    //         setDays(formatTime(Math.floor(totalSeconds / 3600 / 24)));
    //         setHours(Math.floor(totalSeconds / 3600) % 24);
    //         setMinutes(Math.floor(totalSeconds / 60) % 60);
    //         setSeconds(Math.floor(totalSeconds % 60));
    //     }, 1000)

    //     return () => clearInterval(i);
    // }, [t2])

    useEffect(() => {
        if (value === "Community Tournaments" && gameData.data) {
            setRenderData(gameData?.data[0]?.tournaments)
        } else if (value === "Cash Matches" && gameData.data) {
            setRenderData([])
            // setRenderData(gameData?.data[0]?.cashMatches)
        } else if (value === "XP Matches" && gameData.data) {
            setRenderData([])
            // setRenderData(gameData?.data[0]?.xpMatches)
        }

    }, [value, gameData.data])

    

    // console.log("dat", renderData)

    // useEffect(() => {

    // }, [])

    // const d1 = new Date(`${tournament.data && tournament.data[0]?.start_time}`), 
    //     d2 = new Date();


    // const pstDate = d1.toLocaleString("en-US", {
    //         timeZone: "America/Los_Angeles"
    //     })
                    // data time / current time
    // function renderTime(time1: Date, time2: Date) {
    //     console.log("time1", time1)
    //     console.log("time2", time2)

    //     if (time2.valueOf() <= time1.valueOf()) {

    //     }
    //     // setT1(time1.valueOf())
    //     // setT2(time2.valueOf())
    // }

    // const renderTime = useCallback((time1: Date, time2: Date) => {
    //     setT1(time1.valueOf())?
    // }, [])

    return (
        <main className="bg-neutral-600">
            <div className="w-full h-[300px] object-cover bg-mw3_team_background bg-no-repeat bg-cover after:relative after:block after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-br from-white to-neutral-400 after:opacity-50 z-0 relative"></div>

            <div className="relative mt-[-150px]">
                <div className="container m-auto relative z-20">
                    <div>
                        <ul className="flex flex-row gap-3 justify-center">
                            {tabs.map((tab) => (
                                <GameTabs key={tab.id} {...tab} isActive={active === tab.id} setActive={setActive} setValue={setValue} />
                            ))}
                        </ul>
                        
                        <div className="pt-4">
                            <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold">UPCOMING {value.toUpperCase()}</h2>
                            <div className="flex gap-2 pt-4">
                                {renderData.length <= 0 ? (
                                    <p>There are no {value.split(" ")[1]} at this time. Please check back later</p>
                                ) : (
                                    <>
                                        {renderData?.map((data: { id: string, name: string, start_time: string, game: string }) => (
                                            <div key={data.id} className="flex bg-slate-800 w-[32.3%] p-2 h-[200px] rounded-xl m-auto">
                                                <Image src={`/images/${data.game}.png`} alt={`${data.game} placeholder image`} width={50} height={50} className="w-[25%] mr-2 object-contain rounded-md" />
                                                <div className="w-[84%] text-white m-auto">
                                                    <h2 className="text-base md:text-lg"><span className="text-white font-semibold pr-1">Name:</span>{data.name}</h2>
                                                    <p className="text-slate-200"><span className="text-white font-semibold">Date: </span>{new Date(data.start_time).toDateString()}</p>
                                                    <p className="text-slate-200 pb-4"><span className="text-white font-semibold">Time:</span> {new Date(data.start_time).toLocaleTimeString()}</p>
                                                    <Link href={`/tournaments/${data.id}`} className="bg-green-500 p-2 rounded-xl text-xs md:text-base xl:text-lg">View {value.split(" ")[1]}</Link>
                                                    {/* <>{new Date(data.start_time).getDay() + " D " + new Date(data.start_time).getHours() + " H " + new Date(data.start_time).getMinutes() + " M " + new Date(data.start_time).getSeconds() + " S "}</> */}

                                                    {/* { d2.valueOf() <= d1.valueOf() ? ( 
                                                            <span className="text-2xl">{days > 0 && days + "D"} {hours > 0 && hours + "H"} {minutes > 0 && minutes + "M"} {seconds > 0 && seconds + "S"}</span>
                                                        ) : (
                                                            <span className="text-2xl">Match Started</span>   
                                                        )
                                                    } */}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}