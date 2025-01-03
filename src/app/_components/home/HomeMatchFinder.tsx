import { api } from "@/trpc/react";
import { Spinner } from "@nextui-org/react";
import { MatchFinderTable } from "./MatchFinderTable";

export default function HomeMatchFinder() {
  const matches = api.matches.getAllNonMoneyMatches.useQuery();

  if (matches.isPending) return <Spinner label="Loading..." color="warning" />;

  return (
    <section className="m-auto flex w-full max-w-7xl flex-col items-center justify-center p-8">
      <div className="m-auto flex w-full max-w-7xl flex-row justify-center">
        <div className="mr-4 h-10 w-2 bg-red-400" />

        <div className="w-full overflow-auto text-white">
          <h2 className="text-3xl lg:text-4xl">Match Finder</h2>
          <p className="mb-2 text-base">
            Head to head matches where you pick the game, rules and prize.
          </p>

          {matches.isSuccess && <MatchFinderTable data={matches.data} />}
          {matches.isError && <p>Please refresh again!</p>}
        </div>
      </div>
    </section>
  );
}
