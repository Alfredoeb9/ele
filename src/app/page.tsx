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
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  // const session = await getServerAuthSession();
  const session = useSession();
  const [error, setError] = useState<string>("");

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
      <section className="min-h-128 m-auto flex h-[80vh] w-full max-w-7xl flex-col place-content-center items-start justify-center px-10 sm:h-lvh">
        <div className="flex max-h-full flex-row place-content-start">
          <div className="mr-4 h-52 w-2 bg-red-400" />
          <div>
            <h1 className="text-4xl text-white md:text-5xl	lg:text-6xl">
              WELCOME TO YOUR NEW COMPETITIVE JOURNEY
            </h1>
            <h1 className="text-3xl text-gray-400 md:text-4xl	lg:text-5xl">
              COMPETE FOR CASH.
            </h1>
            <h1 className="text-3xl text-gray-400 md:text-4xl	lg:text-5xl">
              COMPETE FOR ...
            </h1>

            <Link
              href={"/sign-up"}
              className="mt-6 inline-block border-2 border-slate-300 px-12 py-4 text-center text-lg text-white transition-all hover:scale-105 hover:border-slate-200"
            >
              JOIN MLG
            </Link>
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
    // <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
    //   <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
    //     <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
    //       Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
    //     </h1>
    //     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
    //       <Link
    //         className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
    //         href="https://create.t3.gg/en/usage/first-steps"
    //         target="_blank"
    //       >
    //         <h3 className="text-2xl font-bold">First Steps →</h3>
    //         <div className="text-lg">
    //           Just the basics - Everything you need to know to set up your
    //           database and authentication.
    //         </div>
    //       </Link>
    //       <Link
    //         className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
    //         href="https://create.t3.gg/en/introduction"
    //         target="_blank"
    //       >
    //         <h3 className="text-2xl font-bold">Documentation →</h3>
    //         <div className="text-lg">
    //           Learn more about Create T3 App, the libraries it uses, and how to
    //           deploy it.
    //         </div>
    //       </Link>
    //     </div>
    //     <div className="flex flex-col items-center gap-2">
    //       <p className="text-2xl text-white">
    //         {hello ? hello.greeting : "Loading tRPC query..."}
    //       </p>

    //       <div className="flex flex-col items-center justify-center gap-4">
    //         <p className="text-center text-2xl text-white">
    //           {session && <span>Logged in as {session.user?.name}</span>}
    //         </p>
    //         <Link
    //           href={session ? "/api/auth/signout" : "/api/auth/signin"}
    //           className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
    //         >
    //           {session ? "Sign out" : "Sign in"}
    //         </Link>
    //       </div>
    //     </div>

    //     <CrudShowcase />
    //   </div>
    // </main>
  );
}

// async function CrudShowcase() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest.query();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
