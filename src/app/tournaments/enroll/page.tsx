"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Select, SelectItem } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { api } from "@/trpc/react";
import Link from "next/link";

export default function Enroll() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();
  // const [error, setError] = useState<any>(null);
  const [gameIdError, setGameIdError] = useState<boolean>(false);
  const [selectedGames, setSelectedGames] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");

  if (session.status === "unauthenticated") router.push("/sign-in");

  const search = searchParams.get("id");

  if (!search) {
    toast("There was a problem returning data", {
      position: "bottom-right",
      autoClose: 3000,
      closeOnClick: true,
      draggable: false,
      type: "error",
      toastId: 45,
    });
    router.push("/");
    return null;
  }

  const tournament = api.matches.getSingleTournament.useQuery(
    { id: search },
    { enabled: search.length > 0 },
  );

  useEffect(() => {
    if (tournament.isError) {
      if (tournament.error.message.includes("Tournament was not found")) {
        setGameIdError(true);
        toast(`Please enroll in a supported match`, {
          position: "bottom-right",
          autoClose: 5000,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 47,
        });
      }
    }
  }, [tournament.isError]);

  const currentUser = api.user.getSingleUserByTeamId.useQuery(
    {
      email: session?.data?.user.email!,
      gameId: tournament.data && (tournament?.data[0]?.game as string | any),
    },
    {
      enabled:
        tournament.data !== undefined &&
        gameIdError === false &&
        tournament.data.length > 0,
    },
  );

  useEffect(() => {
    if (currentUser.isError) {
      if (currentUser.error.message.includes("gameId")) {
        setGameIdError(true);
        toast(`Please enroll in a supported match`, {
          position: "bottom-right",
          autoClose: 5000,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 46,
        });
      }
    }
  }, [currentUser.isError]);

  const enrollTeam = api.matches.enrollTeamToTournament.useMutation({
    onSuccess: () => {
      toast(
        `${teamName} has been enrolled into ${tournament?.data![0]?.name} tournament`,
        {
          position: "bottom-right",
          autoClose: 3500,
          closeOnClick: true,
          draggable: false,
          type: "success",
          toastId: 23,
        },
      );
      setSelectedGames("");
      setTeamName("");
      setTimeout(() => {
        router.push("/");
      }, 4000);
    },

    onError: (error) => {
      if (error.message.includes("cannot enroll team in tournament")) {
        toast(
          `${teamName} is already enrolled into ${tournament?.data![0]?.name} tournament`,
          {
            position: "bottom-right",
            autoClose: 5000,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 24,
          },
        );
      }
    },
  });

  const CustomToastWithLink = () => (
    <div>
      Please{" "}
      <Link href="/team-settings" className="text-blue-600">
        create a team
      </Link>{" "}
      for this game category.
    </div>
  );

  if (currentUser?.data && tournament?.data) {
    if (
      Number(tournament.data[0].entry.replace(/[^0-9]/g, "")) >
      Number(currentUser.data.credits)
    ) {
      router.push("/pricing");
    }
  }

  const data = currentUser?.data;
  const teams = data?.teams;

  console.log('teams', teams);
  return (
    <div className="container m-auto px-4 pt-2">
      <div className="px-4">
        <h1 className="pb-4 text-4xl font-bold text-white md:text-3xl lg:text-4xl">
          Match Confirmation
        </h1>
        <p className="mb-2 text-white">
          <span className="font-semibold">Attention:</span> Before accepting
          match read our
          <Link href={"/refund-policy"} className="text-blue-500">
            {" "}
            refund policy
          </Link>
          , we are currently not accepting any refunds at this time and current
          match/tournament rules.
        </p>

        <p className="mb-2 text-white">
          This Match/ Tournament will cost{" "}
          <span className="font-semibold text-blue-500">
            {tournament?.data && tournament?.data[0]?.entry}
          </span>
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              selectedGames.length <= 0 ||
              teamName.length <= 0 ||
              (tournament.data && tournament?.data[0]?.id.length <= 0)
            ) {
              toast(`Please fill in necessary details to enter`, {
                position: "bottom-right",
                autoClose: 5000,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 48,
              });
              return null;
            } else {
              enrollTeam.mutate({
                tournamentId:
                  tournament.data && (tournament.data[0]?.id as string | any),
                teamId: selectedGames,
                teamName: teamName,
              });
            }
          }}
        >
          <div>
            <Select
              label="Select a Team"
              className="max-w-xs"
              onClick={() => {
                if (currentUser.data && teams && teams.length <= 0) {
                  toast.error(CustomToastWithLink, {
                    position: "bottom-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    draggable: false,
                    type: "error",
                    toastId: 6,
                  });
                }
              }}
              onSelectionChange={(e) => setSelectedGames(Object.values(e)[0])}
              required
            >
              <>
              hello
              </>
              {/* {
                teams?.map((match: { teamId: string; teamName: string }) => (
                  <SelectItem
                    key={match.teamId}
                    onClick={() => setTeamName(match.teamName)}
                    value={match.teamName}
                  >
                    {match.teamName}
                  </SelectItem>
                )) as []
              } */}
            </Select>
          </div>

          <button
            className="m-auto mt-4 flex w-64 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500"
            disabled={
              (enrollTeam.isPending || (teams && teams.length <= 0)) ??
              selectedGames.length <= 0
            }
          >
            Enroll
          </button>
        </form>
      </div>

      <ToastContainer containerId={"enroll-toast"} />
    </div>
  );
}
