"use client";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { api } from "@/trpc/react";
import { memo, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import dynamic from "next/dynamic";

const HomeFeaturedGames = memo(dynamic(() => import("./_components/home/HomeFeaturedGames")));
HomeFeaturedGames.displayName = 'HomeFeaturedGames';

const LoginBanner = memo(dynamic(() => import("./_components/LoginBanner")));
LoginBanner.displayName = 'LoginBanner';

const HomeMatchFinder = memo(dynamic(() => import("./_components/home/HomeMatchFinder")));
HomeMatchFinder.displayName = 'HomeMatchFinder';

const HomeMoneyMatch = memo(dynamic(() => import("./_components/home/HomeMoneyMatch")));
HomeMoneyMatch.displayName = 'HomeMoneyMatch';

const HomeTournamentMatchFinder = memo(dynamic(() => import("./_components/home/HomeTournamentMatchFinder")));
HomeTournamentMatchFinder.displayName = 'HomeTournamentMatchFinder';

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

  // const getGames = api.games.getAllGames.useQuery(undefined, {
  //   staleTime: 5 * 60 * 1000, // 5 minutes cache
  //   refetchOnWindowFocus: false,
  // });

  const homeData = api.home.getHomePageData.useQuery(
    undefined,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      refetchOnWindowFocus: true,
      refetchInterval: 30000,
    }
  );

  // Memoize derived data
  const { games, moneyMatches, nonMoneyMatches, tournaments } = useMemo(() => ({
    games: homeData.data?.games ?? [],
    moneyMatches: homeData.data?.moneyMatches ?? [],
    nonMoneyMatches: homeData.data?.nonMoneyMatches ?? [],
    tournaments: homeData.data?.tournaments ?? [],
  }), [homeData.data]);

  if (homeData.isError) {
    toast("There was an error loading the page", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: false,
      type: "error",
      toastId: "home-error",
    });
  }

  console.log('homeData', homeData.data?.moneyMatches);

  return (
    <main>
      <HeroSection session={session} />
      
      <HomeFeaturedGames 
        data={games}
        isLoading={homeData.isPending}
        isSuccess={homeData.isSuccess}
        isError={homeData.isError}
        error={homeData.isError ? "Failed to load games" : ""} 
      />

      <LoginBanner session={session} />

      <HomeMatchFinder 
        data={nonMoneyMatches}
        isLoading={homeData.isPending}
        isSuccess={homeData.isSuccess}
        isError={homeData.isError}
      />

      <HomeMoneyMatch 
        data={moneyMatches}
        isLoading={homeData.isPending}
        isSuccess={homeData.isSuccess}
        isError={homeData.isError}
      />

      <HomeTournamentMatchFinder 
        data={tournaments}
        isLoading={homeData.isPending}
        isSuccess={homeData.isSuccess}
        isError={homeData.isError}
      />

      <ToastContainer containerId={"home-page-toast"} />
    </main>
  );
}


const HeroSection = memo(({ session }: { session: any }) => (
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
));

HeroSection.displayName = 'HeroSection';