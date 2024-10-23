"use client";
import { api } from "@/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Button, Divider, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { SetStateAction } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  type UsersRecordType,
  type Match,
  type FollowsType,
  type TeamTypes,
  type UsersType,
} from "@/server/db/schema";
import Link from "next/link";
import WithDrawCash from "@/app/_components/modals/WithdrawCash";

interface gamerTagDataTypes {
  gamerTagData: [{ type: string; gamerTag: string }];
}

export default function Profile() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const utils = api.useUtils();
  const pathname = usePathname();
  const session = useSession();
  const [error, setError] = useState<string>("");
  const [path] = useState<string>("profile");
  const [areFriends, setAreFriends] = useState<boolean>(false);
  const [tournaments, setTournaments] = useState([]);

  let userFromPath = pathname.split("/")[2];

  if (userFromPath.includes("%20")) {
    userFromPath = userFromPath.replace("%20", " ");
  }

  useEffect(() => {
    if (!userFromPath || userFromPath === "undefined") {
      toast("User does not exist", {
        position: "bottom-right",
        autoClose: 4500,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 26,
      });
      setTimeout(() => {
        router.push("/");
      }, 5000);
      return setError("User does not exist");
    }
  }, [userFromPath, router]);

  const userSession = session.data?.user;

  const getUserData = api.user.getSingleUserWithTeams.useQuery(
    { username: userFromPath, path: path },
    { enabled: path.length <= 0 && path === "undefined" ? false : true },
  );

  useEffect(() => {
    if (getUserData.isError) {
      toast("User does not exist", {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 26,
      });
      setTimeout(() => {
        router.push("/");
      }, 5000);
      return setError("User does not exist");
    }
  }, [getUserData, router]);

  const user = getUserData?.data as UsersType & {
    teams: TeamTypes[];
    matches: Match[];
    follows: FollowsType[];
    userRecord: UsersRecordType;
    gamerTags: gamerTagDataTypes["gamerTagData"];
    stripeAccount: { balance: number };
  };

  const usersFriends = user?.follows;
  const usersRecord = user?.userRecord;
  const usersUpcomingMatches = user?.matches;
  const stripeAccount = user?.stripeAccount;
  const usersTeams = user?.teams;

  useEffect(() => {
    usersTeams?.map(
      (team: {
        id: string;
        createdAt: number;
        updatedAt: Date | null;
        userId: string;
        gameId: string;
        gameTitle: string;
        team_name: string;
        teamCategory: string;
        tournamentsEnrolled?: SetStateAction<never[]>;
      }) => {
        if (
          team?.tournamentsEnrolled === undefined ||
          !team?.tournamentsEnrolled
        )
          return null;
        setTournaments(team.tournamentsEnrolled);
      },
    );
  }, [usersTeams]);

  useEffect(() => {
    usersFriends?.map((friend: { targetUser: string | undefined }) => {
      if (friend?.targetUser === user?.id) {
        setAreFriends(true);
      }
    });
  }, [usersFriends, user]);

  const sendRequest = api.user.sendFriendRequest.useMutation({
    onSuccess: async () => {
      await utils.user.getNotifications.invalidate();
      toast("Friend request sent", {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 14,
      });
    },
    onError: (e: { message: SetStateAction<string> }) => {
      setError(e.message);

      if (!toast.isActive(13, "friendRequest")) {
        toast("Error sending request user, please refresh and try again", {
          position: "bottom-right",
          autoClose: false,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 13,
        });
      }
    },
  });

  const gamerTagData = user?.gamerTags;
  const gamerTags = [
    {
      "Battle.net": "",
      Playstation: "",
    },
  ];

  if (gamerTagData?.length > 0) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < gamerTagData?.length; i++) {
      if (gamerTagData[i].type === "Battle.net") {
        gamerTags[0]["Battle.net"] = gamerTagData[i].gamerTag;
      }

      if (gamerTagData[i].type === "Playstation") {
        gamerTags[0].Playstation = gamerTagData[i].gamerTag;
      }
    }
  }

  // finalize how i want to grab recent matches, if on profile path (which means viewing users)
  //then we can grab only solo games or find a way to get all teams users is assigned to (solo, duos, teams, etc...)
  // and then display upcoming matches
  // const getUpcomingGames = api.matches.getLatestUsersMatches.useQuery({userId: userSession?.id as string, tournamentId: usersUpcomingMatches}, { enabled: usersUpcomingMatches?.length > 0 })

  return (
    <div className="bg-neutral-600">
      <div className="relative z-0 h-[300px] w-full bg-mw3_team_background from-white to-neutral-400 bg-cover bg-no-repeat object-cover after:relative after:left-0 after:top-0 after:block after:h-full after:w-full after:bg-gradient-to-br after:opacity-50"></div>

      <div className="relative mt-[-150px]">
        <div className="relative z-20 m-auto">
          {getUserData.isError ? (
            <p>{error}</p>
          ) : (
            <div className="p-4">
              <div className="flex justify-between pb-2">
                <div className="flex">
                  <Avatar />
                  <div className="pl-2 text-white">
                    <h2 className="mb-2 text-3xl font-bold">
                      {user?.username}
                    </h2>
                    <p>
                      <span className="font-semibold">PROFILE VIEWS:</span>{" "}
                      {user?.profileViews}
                    </p>
                    <p className="font-semibold">JOINED: 02/12/24</p>
                    <div className="flex">
                      <h4 className="pr-1 font-semibold">Game ID:</h4>
                      <div className="">
                        <p className="flex">
                          <span className="font-semibold">Playstation:</span>{" "}
                          {gamerTags[0]?.Playstation}
                        </p>
                        <p className="flex">
                          <span className="font-semibold">Battlenet:</span>{" "}
                          {gamerTags[0]["Battle.net"]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-center">
                  {userSession?.username === user?.username ? (
                    <>
                      <Link
                        href={"/account-manage#connect-accounts"}
                        className="rounded-xl bg-neutral-300 px-2 py-2 text-base transition-all hover:bg-neutral-400"
                      >
                        Connect Accounts
                      </Link>
                      <Button
                        color="success"
                        className="text-white"
                        onPress={() => onOpen()}
                      >
                        Withdraw Cash
                      </Button>
                    </>
                  ) : (
                    <Button
                      color="success"
                      disabled={
                        userSession?.username === user?.username ||
                        sendRequest.isPending
                      }
                      onClick={(e: { preventDefault: () => void }) => {
                        e.preventDefault();
                        if (areFriends) {
                          toast("You are already friends with this user", {
                            position: "bottom-right",
                            autoClose: 5000,
                            closeOnClick: true,
                            draggable: false,
                            type: "error",
                            toastId: 17,
                          });
                          return null;
                        } else {
                          sendRequest.mutate({
                            userName: user?.username!,
                            id: userSession?.id!,
                            senderUserName: user?.email,
                          });
                        }
                      }}
                    >
                      Send Friend Request
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex justify-evenly bg-neutral-800">
                <div className="flex text-center text-white">
                  <div>
                    Image
                    {/* Image */}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold">Rank</h3>
                    <p>0 | 0 XP</p>
                  </div>
                </div>

                <Divider
                  orientation="vertical"
                  className="mx-1 h-20 w-0.5 bg-white text-white"
                />

                <div className="text-center text-white">
                  <h3 className="font-bold">CAREER RECORD</h3>
                  <p>
                    {usersRecord ? usersRecord?.wins : 0}W -{" "}
                    {usersRecord ? usersRecord?.losses : 0}L
                  </p>
                  <p>
                    {usersRecord?.wins && usersRecord?.losses
                      ? (
                          (usersRecord?.wins /
                            (usersRecord?.wins + usersRecord?.losses)) *
                          100
                        ).toFixed(2)
                      : 0}
                    % WIN RATE
                  </p>
                </div>

                <Divider
                  orientation="vertical"
                  className="mx-1 h-20 w-0.5 bg-white text-white"
                />

                <div className="text-center text-white">
                  <h3 className="font-bold">UPCOMING MATCHES</h3>

                  {userSession?.username === user?.username ? (
                    <div className="flex flex-col">
                      {tournaments.map(
                        (tourney: {
                          team_id: string;
                          tournament_id: string;
                        }) => (
                          <>
                            <Link
                              href={`/tournaments/${tourney.tournament_id}`}
                              key={tourney.tournament_id}
                            >
                              View Tournament
                            </Link>
                          </>
                        ),
                      )}
                      {usersUpcomingMatches?.map(
                        (match: { id: string; teamId: string | null }) => (
                          <>
                            <Link
                              href={`/tournaments/${match.id}`}
                              key={match.id}
                            >
                              View Match
                            </Link>
                          </>
                        ),
                      )}
                    </div>
                  ) : (
                    <>{usersUpcomingMatches?.length}</>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer containerId={"profile-toast"} />
      {isOpen && (
        <WithDrawCash
          open={isOpen}
          onOpenChange={onOpenChange}
          userId={userSession?.id!}
          balance={stripeAccount?.balance}
        />
      )}
    </div>
  );
}
