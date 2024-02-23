"use client";

import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react";
import type { GameCategoryType, Tournament } from "@/server/db/schema"
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { tabs } from "@/lib/sharedData"
  
export default function Game() {
    const [value, setValue] = useState("Community Tournaments")
    const [renderData, setRenderData] = useState<any>([])
    const pathname = usePathname()
    const gameFromPath = pathname.split("/")[2]

    // get data from params
    const gameData = api.games.getSingleGame.useQuery({ gameName: gameFromPath})

    // if (gameData.data === undefined) return null 

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

    console.log("redner", renderData)

    return (
        <main className="bg-neutral-600">
            <div className="w-full h-[300px] object-cover bg-mw3_team_background bg-no-repeat bg-cover after:relative after:block after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-br from-white to-neutral-400 after:opacity-50 z-0 relative"></div>

            <div className="relative mt-[-150px]">
                <div className="container m-auto relative z-20">
                    <div>
                        <ul className="flex flex-row gap-3">
                            {tabs.map((tab) => (
                                <li key={tab.id}><button type="button" onClick={() => setValue(tab.label)}>{tab.label}</button></li>
                            ))}

                            {renderData?.map((data: { id: string }) => (
                                <div key={data.id}>
                                    {data.id}
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    )
}