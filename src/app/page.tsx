"use client";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import HomeFeaturedGames from "./_components/home/HomeFeaturedGames";
import LoginBanner from "./_components/LoginBanner";
import { api } from "@/trpc/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import HomeMoneyMatch from "./_components/home/HomeMoneyMatch";
import HomeTournamentMatchFinder from "./_components/home/HomeTournamentMatchFinder";

// function singleEliminationTournament(players: string | any[]) {
//   const rounds = [];
//   const numberOfRounds = Math.log2(players.length);

//   // Generate the initial round with players
//   rounds.push(players);

//   // Simulate each round
//   for (let i = 0; i < numberOfRounds; i++) {
//     const currentRound: string | unknown[] = rounds[rounds.length - 1];
//     const nextRound = [];

//     // Pair players for the next round
//     for (let j = 0; j < currentRound.length; j += 2) {
//       const match: string | unknown[] = [currentRound[j], currentRound[j + 1]];
//       nextRound.push(match);
//     }

//     rounds.push(nextRound);
//   }

//   return rounds;
// }

export default function Home() {
  noStore();
  // const session = await getServerAuthSession();
  const session = useSession();
  const [error] = useState<string>("");

  // Example usage
  // let players = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8"];
  // let tournament = singleEliminationTournament(players);

  // console.log('tie', tournament);

  // Example usage

  // const { data, isPending, isError, isSuccess } = useQuery<any>({
  //   queryKey: ["game-finder"],
  //   queryFn: () =>
  //       fetch('/api/games').then(async (res) => {

  //         if( res.status === 500) return <ErrorComponent />

  //         return await res.json()
  //       }),
  //   retry: 3
  // })

  // const currentUser = api.user.getSingleUser.useMutation({
  //   onSuccess: () => {
  //       console.log("user retrieved")
  //   },

  //   onError: (error) => {
  //       setError(error.message)
  //   }
  // })

  // useEffect(() => {
  //     if (session.data?.user) {
  //         currentUser.mutate({ email: session.data?.user.email as string})
  //     }
  // }, [session.data])

  // const tournamentMatches = api.matches.getAllMatches.useQuery();

  const getGames = api.games.getAllGames.useQuery();

  // if (tournamentMatches.isError) {
  //   setError("Match server is down, please reach out to admin");
  //   return null;
  // }

  if (getGames.isError) {
    toast("There was an error with getting all games service", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: false,
      type: "error",
      toastId: 53,
    });
  }

  return (
    <main>
      <section className="min-h-128 m-auto flex h-[80vh] w-full flex-col place-content-center items-start justify-center bg-hero_bg bg-cover bg-no-repeat object-cover px-12 sm:h-lvh">
        <div className="flex max-h-full flex-row place-content-start">
          <div className="mr-4 h-52 w-2 bg-red-400" />
          <div>
            <h1 className="text-4xl text-white md:text-5xl lg:text-6xl">
              WELCOME TO YOUR NEW COMPETITIVE JOURNEY
            </h1>
            <h1 className="text-3xl text-gray-400 md:text-4xl lg:text-5xl">
              COMPETE FOR CASH.
            </h1>
            <h1 className="text-3xl text-gray-400 md:text-4xl lg:text-5xl">
              COMPETE FOR ...
            </h1>

            {session.data ? (
              <Link
                href={"/team-settings"}
                className="mt-6 inline-block border-2 border-slate-300 px-12 py-4 text-center text-lg text-white transition-all hover:scale-105 hover:border-slate-200"
              >
                GO TO DASHBOARD
              </Link>
            ) : (
              <Link
                href={"/sign-up"}
                className="mt-6 inline-block border-2 border-slate-300 px-12 py-4 text-center text-lg text-white transition-all hover:scale-105 hover:border-slate-200"
              >
                JOIN MLG
              </Link>
            )}
          </div>
        </div>
      </section>

      <HomeFeaturedGames
        data={getGames.isSuccess ? getGames?.data : []}
        error={error}
      />

      <LoginBanner session={session} />

      <HomeMoneyMatch />

      <HomeTournamentMatchFinder />

      <ToastContainer containerId={"home-page-toast"} />
    </main>
  );
}
