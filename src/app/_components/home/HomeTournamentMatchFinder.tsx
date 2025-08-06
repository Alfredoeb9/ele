import { Spinner } from "@nextui-org/react";
import { TournamentMatchFinderTable } from "./TournamentMatchFinderTable";
import { api } from "@/trpc/react";

interface HomeTournamentMatchFinderProps {
  data: any[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function HomeTournamentMatchFinder({ data, isLoading, isSuccess, isError }: HomeTournamentMatchFinderProps) {
  if (isLoading)
    return <Spinner label="Loading..." color="warning" />;

  return (
    <section className="m-auto flex w-full max-w-7xl flex-col items-center justify-center p-8">
      <div className="m-auto flex w-full max-w-7xl flex-row justify-center">
        <div className="mr-4 h-10 w-2 bg-red-400" />

        <div className="w-full overflow-auto text-white">
          <h2 className="text-3xl lg:text-4xl">Tournament Match Finder</h2>
          <p className="mb-2 text-base">
            Head to head matches where you pick the game, rules and prize.
          </p>

          {isSuccess && (
            <TournamentMatchFinderTable data={data} />
          )}
          {isError && <p>Please refresh again!</p>}
        </div>
      </div>
    </section>
  );
}
