
// import { Users } from "@/lib/sharedData"
import {MatchFinderTable} from "./MatchFinderTable"
import { useQuery } from "@tanstack/react-query"
import {Spinner} from "@nextui-org/react";
import { api } from "@/trpc/react";

export default function HomeMatchFinder() {
    // const { data: matches, isLoading, isError, isSuccess} = useQuery<any>({
    //     queryKey: ["match-finder"],
    //     queryFn: () => 
    //         fetch('/api/match-finder').then((res) =>
    //             res.json()
    //         ),
    //     retry: 3
    // })

    const tournamentMatches = api.matches.getAllMatches.useQuery()

    console.log("tour", tournamentMatches.data);

    // if (tournamentMatches.isLoading) return <Spinner label="Loading..." color="warning" />

    return (
        <section className="flex flex-col items-center justify-center m-auto p-8 max-w-7xl w-full">
            <div className="flex flex-row justify-center m-auto max-w-7xl w-full">
                <div className="bg-red-400 h-10 w-2 mr-4" />

                <div className="text-white w-full overflow-auto">
                    <h2 className="text-3xl lg:text-4xl">MatchFinder</h2>
                    <p className="text-base mb-2">Head to head matches where you pick the game, rules and prize.</p>

                    { tournamentMatches.isSuccess && <MatchFinderTable data={tournamentMatches.data} />}
                    { tournamentMatches.isError && <p>Please refresh again!</p>}
                    
                </div>
                
            </div>
        </section>
    )
}