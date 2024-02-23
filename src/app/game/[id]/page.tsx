"use client";

import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";

export default function Game() {
    const pathname = usePathname()
    const gameFromPath = pathname.split("/")[2]

    // get data from params
    const gameData = api.games.getSingleGame.useQuery({ gameName: gameFromPath})

    console.log("data", gameData.data)

    return (
        <main className="bg-neutral-600">
            <div className="w-full h-[300px] object-cover bg-mw3_team_background bg-no-repeat bg-cover after:relative after:block after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-br from-white to-neutral-400 after:opacity-50 z-0 relative"></div>

            <div className="relative mt-[-150px]">
                <div className="container m-auto relative z-20">

                </div>
            </div>
        </main>
    )
}