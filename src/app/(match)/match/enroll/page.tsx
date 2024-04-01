/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Checkbox,
  CheckboxGroup,
  Divider,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { api } from "@/trpc/react";
import Link from "next/link";
import { type MoneyMatchType } from "@/server/db/schema";
import MatchTimer from "@/app/_components/MatchTimer";

interface RulesTypes {
  value: string;
}

export default function Enroll() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();
  // const [error, setError] = useState<any>(null);
  const [gameIdError, setGameIdError] = useState<boolean>(false);
  const [pathname] = useState<string>("enroll");
  const [selectedGames, setSelectedGames] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState({});
  const [availableTeamMembers, setAvailableTeamMembers] = useState([""]);
  const [idx] = useState(0);

  if (session.status === "unauthenticated") router.push("/sign-in");

  const search = searchParams.get("id");
  const category = searchParams.get("cat");

  if (!search || search.length <= 0) {
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

  const moneyMatch = api.matches.getSingleMoneyMatch.useQuery(
    { matchId: search },
    { enabled: search.length > 0 },
  );

  if (moneyMatch.isError) {
    if (moneyMatch.error.message.includes("Match was not found")) {
      toast(`Please enroll in a supported match`, {
        position: "bottom-right",
        autoClose: 4500,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 47,
      });
    } else {
      toast("There was a problem retreiving the match data", {
        position: "bottom-right",
        autoClose: 4500,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 69,
      });
    }
  }

  const match = moneyMatch?.data as MoneyMatchType[];

  let matchRules: RulesTypes[] = [];
  let gameT = "";
  let startTime = "";

  if (match !== undefined && match?.length > 0) {
    for (const ele of match) {
      matchRules = ele.rules as RulesTypes[];
      gameT = ele.gameTitle;
      startTime = ele.startTime;
    }
  }

  const currentUser = api.user.getSingleUserByTeamId.useQuery(
    {
      email: session?.data?.user.email!,
      gameId: gameT,
      pathname: pathname,
      cat: category!,
    },
    {
      enabled:
        gameT.length > 0 &&
        moneyMatch.data !== undefined &&
        gameIdError === false &&
        moneyMatch.data.length > 0,
    },
  );

  const arrById = currentUser?.data?.teams?.filter(
    //@ts-expect-error team_name is there
    (item: { team_name: string }) => item.team_name === teamName,
  );

  if (currentUser.isError) {
    if (currentUser.error.message.includes("gameId")) {
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

  const enrollTeam = api.matches.enrollTeamToMoneyMatch.useMutation({
    onSuccess: () => {
      toast(
        `${teamName} has been enrolled into ${moneyMatch?.data![0]?.matchName} money match`,
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
      if (error.message.includes("cannot enroll team in money match")) {
        toast(
          `${teamName} is already enrolled into ${moneyMatch?.data![0]?.matchName} money match`,
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

  if (currentUser?.data && moneyMatch?.data) {
    if (
      Number(moneyMatch.data[0].matchEntry) > Number(currentUser.data.credits)
    ) {
      router.push("/pricing");
    }
  }

  return (
    <div className="container m-auto px-4 pt-2">
      <h1 className="pb-4 text-4xl font-bold text-white md:text-3xl lg:text-4xl">
        Match Confirmation
      </h1>
      <div className="flex">
        <div className="w-[60%]">
          <p className="mb-2 text-white">
            <span className="font-semibold">Attention:</span> Before accepting
            match read our
            <Link href={"/refund-policy"} className="text-blue-500">
              {" "}
              refund policy
            </Link>
            , we are currently not accepting any refunds at this time and
            current match rules.
          </p>

          <p className="mb-2 text-white">
            This Match will cost $
            <span className="font-semibold text-blue-500">
              {moneyMatch?.data && moneyMatch?.data[0]?.matchEntry}
            </span>{" "}
            per player
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                selectedGames.length <= 0 ||
                teamName.length <= 0 ||
                (moneyMatch.data && moneyMatch?.data[0]?.matchId.length <= 0)
              ) {
                toast(`Please fill in necessary details to enter`, {
                  position: "bottom-right",
                  autoClose: 4500,
                  closeOnClick: true,
                  draggable: false,
                  type: "error",
                  toastId: 48,
                });
                return null;
              } else {
                // enrollTeam.mutate({
                //   matchId:
                //     moneyMatch.data &&
                //     (moneyMatch.data[0]?.matchId as string | any),
                //   acceptingTeamId: selectedGames,
                //   teamName: teamName,
                // });
              }
            }}
          >
            <div>
              <Select
                label="Select a Team"
                className="max-w-xs"
                onClick={() => {
                  if (
                    currentUser.data &&
                    currentUser.data.teams &&
                    currentUser.data.teams.length <= 0
                  ) {
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
                {
                  currentUser.data?.teams?.map((team) => (
                    <SelectItem
                      //@ts-expect-error id is present
                      key={team.id}
                      //@ts-expect-error team_name is present
                      onClick={() => setTeamName(team.team_name)}
                      //@ts-expect-error team_name is present
                      value={team.team_name}
                    >
                      {/* @ts-expect-error id is present */}
                      {team.team_name}
                    </SelectItem>
                  )) as []
                }
              </Select>

              <CheckboxGroup
                label="Select members to play in match:"
                className="block pt-2 text-sm font-medium leading-6"
                value={availableTeamMembers}
                onValueChange={setAvailableTeamMembers}
                isRequired
              >
                {arrById &&
                  // @ts-expect-error members is part of data
                  (arrById[idx]?.members.map(
                    (member: { userName: string }, i: number) => (
                      <Checkbox
                        key={i}
                        value={member.userName}
                        className="text-white"
                        classNames={{
                          label: "text-white",
                        }}
                      >
                        {member.userName}
                      </Checkbox>
                    ),
                  ) as [])}
              </CheckboxGroup>
            </div>

            <button
              className="m-auto mt-4 flex w-64 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500"
              disabled={
                (enrollTeam.isPending ||
                  (currentUser?.data?.teams &&
                    currentUser.data.teams.length <= 0)) ??
                selectedGames.length <= 0
              }
            >
              Enroll
            </button>
          </form>
        </div>

        <Divider
          orientation="vertical"
          className="h-inherit mx-1 h-auto w-0.5 bg-white text-white"
        />

        <div>
          <div>
            <h3 className="text-xl font-semibold text-red-600">Rules:</h3>

            {moneyMatch.isPending ? (
              <Spinner label="Loading..." color="warning" />
            ) : (
              <>
                {matchRules.map((rule, i: number) => (
                  <div key={i}>
                    <p className="text-white">
                      <span className="font-semibold uppercase text-red-300">
                        {Object.keys(rule)[0]}:
                      </span>{" "}
                      {Object.values(rule)[0] as unknown as string}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="pt-4">
            <h3 className="text-xl font-semibold text-white">Match Starts:</h3>

            <MatchTimer
              d2={new Date()}
              d1={new Date(startTime)}
              color="text-slate-100"
            />
          </div>
        </div>
      </div>

      <ToastContainer containerId={"enroll-toast"} />
    </div>
  );
}
