"use client";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import HomeFeaturedGames from "./_components/home/HomeFeaturedGames";
import LoginBanner from "./_components/LoginBanner";
import HomeMatchFinder from "./_components/home/HomeMatchFinder";
import { api } from "@/trpc/react";
import { useState } from "react";
import { useSession } from "next-auth/react";

function singleEliminationTournament(players: string | any[]) {
  let rounds = [];
  let numberOfRounds = Math.log2(players.length);
  
  // Generate the initial round with players
  rounds.push(players);

  // Simulate each round
  for (let i = 0; i < numberOfRounds; i++) {
      let currentRound = rounds[rounds.length - 1];
      let nextRound = [];

      // Pair players for the next round
      for (let j = 0; j < currentRound.length; j += 2) {
          let match = [currentRound[j], currentRound[j + 1]];
          nextRound.push(match);
      }

      rounds.push(nextRound);
  }

  return rounds;
}

class Participant {
  name: any;
  score: number;
  constructor(name: any) {
      this.name = name;
      this.score = 0;
  }

  // Method to increase score
  increaseScore() {
      this.score++;
  }
}

class Tournament {
  participants: any;
  constructor(participants: any) {
      this.participants = participants;
  }

  // Method to simulate a single round of the tournament
  playRound() {
      // Randomly shuffle participants for fairness
      this.shuffleParticipants();

      // Pair participants for matches
      for (let i = 0; i < this.participants.length; i += 2) {
          const participant1 = this.participants[i];
          const participant2 = this.participants[i + 1];
          
          // Simulate match and increase score of winner
          const winner = this.simulateMatch(participant1, participant2);
          winner.increaseScore();
      }
  }

  // Method to shuffle participants
  shuffleParticipants() {
      for (let i = this.participants.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.participants[i], this.participants[j]] = [this.participants[j], this.participants[i]];
      }
  }

  // Method to simulate a match between two participants
  simulateMatch(participant1: any, participant2: any) {
      // Simulate match result (assuming participant1 wins with 50% probability)
      const randomNumber = Math.random();
      return randomNumber < 0.5 ? participant1 : participant2;
  }

  // Method to display the scores of all participants
  displayScores() {
      console.log("Tournament Results:");
      this.participants.forEach((participant: { name: any; score: any; }) => {
          console.log(`${participant.name}: ${participant.score} points`);
      });
  }
}

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
const participants = [
  new Participant("Player 1"),
  new Participant("Player 2"),
  new Participant("Player 3"),
  new Participant("Player 4")
];

const tournament = new Tournament(participants);

// Play a single round
tournament.playRound();

// Display scores after the round
tournament.displayScores();
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

  const tournamentMatches = api.matches.getAllMatches.useQuery()

  const getGames = api.games.getAllGames.useQuery()

  if (tournamentMatches.isError) {
    setError("Match server is down, please reach out to admin")
  }
  return (
    <main>
      
      <section className='flex min-h-128 w-full h-[80vh] sm:h-lvh flex-col items-start justify-center place-content-center m-auto max-w-7xl px-10'>
        <div className='flex flex-row place-content-start max-h-full'>
          <div className="bg-red-400 h-52 w-2 mr-4" />
          <div>
            <h1 className='text-4xl md:text-5xl lg:text-6xl	text-white'>WELCOME TO YOUR NEW COMPETITIVE JOURNEY</h1>
            <h1 className='text-3xl md:text-4xl lg:text-5xl	text-gray-400'>COMPETE FOR CASH.</h1>
            <h1 className='text-3xl md:text-4xl lg:text-5xl	text-gray-400'>COMPETE FOR ...</h1>

            <Link 
              href={"/sign-up"}
              className="inline-block text-center mt-6 py-4 px-12 border-2 border-slate-300 text-white text-lg hover:scale-105 hover:border-slate-200 transition-all"
            >
              JOIN MLG
            </Link>
          </div>
        </div>
      </section>
      
      
      <HomeFeaturedGames data={getGames?.isSuccess && getGames?.data} error={error} />

      <LoginBanner />

      <HomeMatchFinder />

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
