"use client";
import { api } from "@/trpc/react";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function CreateTeam() {
  const router = useRouter();
  const session = useSession();
  const [teamName, setTeamName] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<string>("");

  if (session.status === "unauthenticated") router.push("/sign-in");

  const createTeam = api.create.createTeam.useMutation({
    onSuccess: () => {
      setTeamName("");
      router.push("/team-settings");
    },

    onError: (e) => {
      if (
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        e.data?.stack?.includes("rpc error: code = AlreadyExists") ||
        e.message.includes("'ele_team.ele_team_game_id_team_name_unique'")
      ) {
        setError("Team name already exists");
        setTeamName("");
        setSelectedGame("");
        setSelectedGameId("");
        toast(
          `Team name ${teamName} already exists for ${selectedGame}, please choose another`,
          {
            position: "bottom-right",
            autoClose: 3500,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 61,
          },
        );
      }
    },
  });

  const gameCategory = api.games.getOnlyGames.useQuery();

  if (gameCategory.isError) {
    setError("Service is down, please refresh or submit a ticket");
    toast(`Service is down, please refresh or submit a ticket`, {
      position: "bottom-right",
      autoClose: 3500,
      closeOnClick: true,
      draggable: false,
      type: "error",
      toastId: 12,
    });
  }

  if (createTeam.isPending)
    return <Spinner label="Loading..." color="warning" />;
  const headingClasses = "text-lg sm: text-xl";

  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-center bg-stone-900 px-6 py-8 md:h-screen lg:py-0">
      <div className="flex min-h-full w-96 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <h1 className="mb-3 text-center text-4xl font-bold text-white">
          Create A Team
        </h1>

        <Select
          label="Select a Game"
          className="mb-3 max-w-xs"
          classNames={{
            label: headingClasses,
          }}
          size="md"
          disabled={gameCategory.isError}
          onClick={() => {
            if (gameCategory.isError) {
              toast("There was an error with this service.", {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 7,
              });
            }
          }}
          onSelectionChange={(e) => setSelectedGameId(Object.values(e)[0])}
          required
        >
          {
            gameCategory.data?.map((match) => (
              <SelectItem
                key={match.id}
                onClick={(e) =>
                  setSelectedGame((e.target as HTMLElement).outerText)
                }
                value={match.game}
                classNames={{
                  title: headingClasses,
                }}
              >
                {match.game}
              </SelectItem>
            )) as []
          }
        </Select>

        <label
          htmlFor="team_name"
          className="block text-xl font-medium leading-6 text-white sm:text-lg"
        >
          Team Name:
        </label>
        <input
          className="mt-2 block w-full rounded-md border-0 px-1 py-2 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xl sm:leading-6"
          onChange={(e) => setTeamName(e.target.value)}
          value={teamName}
        />

        <button
          disabled={
            gameCategory.isError ||
            selectedGame === "" ||
            selectedGame.length <= 0
          }
          onClick={() => {
            createTeam.mutate({
              gameId: selectedGameId,
              gameText: selectedGame,
              teamName: teamName,
              email: session.data?.user.email!,
              userName: session.data?.user.username!,
            });
          }}
          className="mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-2xl font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500 sm:text-xl"
        >
          Create
        </button>

        {createTeam.isError && (
          <div className="font-xl sm:font-2xl font-semibold text-red-400">
            {error}
          </div>
        )}

        <ToastContainer containerId={"create-team-toast"} limit={1} />
      </div>
    </div>
  );
}
