"use client";
import Disband from "@/app/_components/modals/Disband";
import LeaveTeamModal from "@/app/_components/modals/LeaveTeamModal";
import { statusGameMap } from "@/lib/sharedData";
import { api } from "@/trpc/react";
import { useDisclosure } from "@nextui-org/react";

import { Button, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";

interface TeamRecord {
  teamId: string;
  teamName: string;
  matchType: string | null;
  wins: number | null;
  losses: number | null;
}

interface TeamMember {
  role: string;
  [key: string]: any; // Allow additional properties
}

interface Team {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string;
  gameId: string;
  gameTitle: string;
  team_name: string;
  teamCategory: string;
  record: TeamRecord;
  members: TeamMember[];
}

export default function TeamSettings() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const session = useSession();
  // const router = useRouter();
  const [teamName, setTeamName] = useState<string>("");
  const [teamId, setTeamId] = useState<string>("");
  const [modalPath, setModalPath] = useState<string>("");

  // const [error, setError] = useState<string>("");

  // if (session.status === "unauthenticated") router.push("/sign-in");

  const currentUser = api.user.getSingleUserWithTeamMembers.useQuery(
    { email: session.data?.user?.email! },
    { enabled: session.status === "authenticated" },
  );

  if (currentUser.isError) {
    toast(`There was a problem getting user data`, {
      position: "bottom-right",
      autoClose: false,
      closeOnClick: true,
      draggable: false,
      type: "error",
      toastId: 2,
    });
  }

  const handleModalPath = useCallback((path: string) => {
    switch (path) {
      case "friend":
        setModalPath("friend");
        break;
      case "remove friend":
        setModalPath("remove friend");
        break;
      default:
        setModalPath("");
        break;
    }
  }, []);

  if (currentUser.isLoading)
    return <Spinner label="Loading..." color="warning" />;

  if (currentUser.isError || currentUser.data === undefined) {
    return null;
  }

  const teams = currentUser.data.teams;

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center bg-stone-900 px-6 py-8 md:h-screen lg:py-0">
      <div className="flex min-h-full w-96 flex-1 flex-col px-5 py-8 sm:py-4 lg:px-7">
        <h1 className="mb-2 text-3xl font-bold text-white">MY TEAMS</h1>
        <div className="mb-4 flex flex-wrap justify-between gap-2">
          {teams.length <= 0 ? (
            <div className="text-lg text-white">
              No teams found. Go ahead and create a team
            </div>
          ) : (
            <>
              {teams.map(
                (team) => (
                  <div
                    className="w-[100%] rounded-xl bg-slate-800 p-2 text-white sm:w-[32.2%]"
                    key={team?.id}
                  >
                    <div className="tournament_info ml-4 w-full">
                      <h1 className="mb-2 text-lg font-bold md:text-xl lg:text-2xl">
                        {team.team_name}
                      </h1>
                      <p>
                        <span className="font-semibold">Team Category:</span>{" "}
                        {team.teamCategory.toUpperCase()}
                      </p>
                      <p className="font-semibold">
                        Game:{" "}
                        {team.gameTitle === "mw3" &&
                          statusGameMap[team?.gameTitle]}
                        {team.gameTitle === "fornite" &&
                          statusGameMap[team?.gameTitle]}
                        {team.gameTitle === "valorant" &&
                          statusGameMap[team?.gameTitle]}
                        {team.gameTitle === "apex" &&
                          statusGameMap[team?.gameTitle]}
                        {team.gameTitle === "csgo" &&
                          statusGameMap[team?.gameTitle]}
                        {team.gameTitle === "lol" &&
                          statusGameMap[team?.gameTitle]}
                        {team.gameTitle === "Black Ops 6" &&
                          statusGameMap[team?.gameTitle]}
                      </p>

                      <div>
                        Ladder squads | {team?.record?.wins ?? 0} W -{" "}
                        {team?.record?.losses ?? 0} L
                      </div>

                      <div className="mt-4 flex flex-wrap justify-start gap-2 md:gap-3 lg:gap-4">
                        {team.members[0].role === "member" && (
                          <>
                            <Button
                              className="text-green-500"
                              variant="bordered"
                            >
                              <Link href={`/team/${team?.id}`}>View</Link>
                            </Button>
                            <Button
                              className="text-red-500"
                              variant="bordered"
                              onPress={() => {
                                onOpen();
                                setModalPath("member");
                                setTeamName(team.team_name);
                              }}
                            >
                              Leave Team
                            </Button>
                          </>
                        )}

                        {team.members[0].role === "owner" && (
                          <>
                            <Button
                              className="text-green-500"
                              variant="bordered"
                            >
                              <Link href={`/team/${team?.id}`}>Manage</Link>
                            </Button>
                            <Button
                              className="text-red-500"
                              variant="bordered"
                              onPress={() => {
                                onOpen();
                                setModalPath("owner");
                                setTeamName(team.team_name);
                                setTeamId(team.id);
                              }}
                            >
                              Disband
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </>
          )}
        </div>

        <button className="w-64 rounded-3xl bg-green-500 p-4 text-white transition-all hover:bg-green-600">
          <Link href="/team-settings/create-team">Create a Team</Link>
        </button>

        {modalPath === "member" && (
          <LeaveTeamModal
            open={isOpen}
            onOpenChange={onOpenChange}
            handleModalPath={handleModalPath}
            userEmail={session.data?.user.email!}
            teamName={teamName}
            teamId={teamId}
          />
        )}

        {modalPath === "owner" && (
          <Disband
            open={isOpen}
            onOpenChange={onOpenChange}
            teamName={teamName}
            teamId={teamId}
          />
        )}
      </div>
    </div>
  );
}
