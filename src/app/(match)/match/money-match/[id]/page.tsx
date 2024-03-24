"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Spinner,
  Image,
  Divider,
  Tabs,
  Tab,
  CardBody,
} from "@nextui-org/react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { statusGameMap, trophys } from "@/lib/sharedData";
import { GrTrophy } from "react-icons/gr";
import MatchTimer from "@/app/_components/MatchTimer";
import BracketGenerator from "@/app/_components/BracketGenerator";

export interface Participant {
  teamId?: string;
  teamName: string;
  score: number;
  createdAt?: Date;
  updatedAt?: Date | null;
  id?: string;
}

export default function Tournaments({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const [matchId] = useState<string>(id);
  const [, setPrize] = useState<number>(0);
  const [prizeTest] = useState<number[]>([5, 0, 0]);

  const matchData = api.matches.getSingleMoneyMatch.useQuery(
    { matchId: matchId },
    { enabled: matchId.length >= 0 },
  );

  // ENABLE THIS ONLY WHEN THE TOURNAMENT TIMER IS DONE / 0
  // const teamsEnrolled = api.matches.getEnrolledTeams.useQuery(
  //   { tournamentId: tournamentId },
  //   { enabled: tournamentId.length >= 0 },
  // );

  if (matchData.isError) {
    toast("There was an error returning tournament data", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: false,
      type: "error",
      toastId: 50,
    });
  }

  useEffect(() => {
    if (matchData.data) {
      matchData?.data.map((match) => {
        console.log("match", match);
      });
    }
  }, [matchData?.data]);

  if (matchData.data === undefined) return null;

  if (matchData.isLoading)
    return <Spinner label="Loading..." color="warning" />;

  const d1 = new Date(`${matchData.data && matchData.data[0]?.startTime}`),
    d2 = new Date();

  const pstDate = d1.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });

  return (
    <div>
      <div
        className={`h-[300px] w-full bg-${matchData?.data && matchData?.data[0].gameTitle.toLowerCase()}_team_background bg-cover bg-fixed bg-center bg-no-repeat`}
      />

      <main className=" relative mt-[-150px] px-4">
        <div className="w-full sm:w-[65%]">
          <div
            id="tournament_info-block"
            className="rounded-xl bg-slate-400  p-1"
          >
            <div className="block sm:flex">
              {matchData.data?.map((match) => (
                <div key={match.matchId} className="flex">
                  <Card
                    isFooterBlurred
                    className="col-span-12 h-[300px] w-full from-white to-neutral-400 after:absolute after:left-0 after:top-0 after:h-full after:w-full after:bg-gradient-to-br after:opacity-30 sm:col-span-7 sm:w-56"
                  >
                    <Image
                      removeWrapper
                      alt={`${match?.gameTitle} game poster`}
                      className="z-0 h-full w-full object-cover"
                      src={`/images/${match?.gameTitle}.png`}
                      width={400}
                    />
                    <CardFooter className="absolute bottom-0 z-10 border-t-1 border-default-600 bg-black/40 dark:border-default-100">
                      <div className="flex w-full items-center justify-between ">
                        <p className="text-sm text-white/60">
                          Match Entry: ${match?.matchEntry}
                        </p>
                        <p className="text-sm text-white/60">NA + EU</p>
                      </div>
                    </CardFooter>
                  </Card>

                  <div className="tournament_info w-full p-2 sm:ml-4">
                    {match.gameTitle.toLowerCase() === "mw3" && (
                      <h1 className="text-3xl font-bold">
                        {statusGameMap[match?.gameTitle]}
                      </h1>
                    )}
                    {match.gameTitle.toLowerCase() === "fornite" && (
                      <h1 className="text-3xl font-bold">
                        {statusGameMap[match?.gameTitle]}
                      </h1>
                    )}

                    <div className="mb-4 flex w-full items-center justify-around">
                      <div>
                        <p className="block font-bold">{match?.matchName}</p>
                        {/* <p className="block">{match?.tournament_type}</p> */}
                      </div>

                      <Divider
                        orientation="vertical"
                        className="mx-1 h-20 w-0.5 bg-white text-white"
                      />

                      <div>
                        <p className="font-bold">Platforms:</p>
                        <p>
                          {match?.platform ? (
                            "Cross Platform"
                          ) : (
                            <span className="text-bold text-small capitalize">
                              {match?.platform as string}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="m-auto flex w-[90%] gap-1">
                      <Card className="grow">
                        <CardHeader>
                          <div>
                            <p className="font-semibold">REGISTRATION OPENS</p>
                            <p>
                              {d2.valueOf() <= d1.valueOf()
                                ? "OPEN NOW"
                                : "CLOSED"}
                            </p>
                          </div>
                        </CardHeader>
                      </Card>

                      <Card className="grow">
                        <CardHeader>
                          <div>
                            <p className="font-semibold">Start Time</p>
                            <p>{pstDate} PST</p>
                          </div>
                        </CardHeader>
                      </Card>
                    </div>

                    <div className="mt-4 flex w-full flex-wrap justify-evenly">
                      <div>
                        <h5 className="font-bold">ENTRY/PLAYER</h5>
                        <p>$ {match?.matchEntry}</p>
                      </div>
                      <Divider
                        orientation="vertical"
                        className="mx-1 h-20 w-0.5 bg-white text-white"
                      />
                      <div>
                        <h5 className="font-bold">TEAM SIZE</h5>
                        <p>{match?.teamSize}</p>
                      </div>
                      <Divider
                        orientation="vertical"
                        className="mx-1 h-20 w-0.5 bg-white text-white"
                      />
                      {/* <div>
                        <h5 className="font-bold">ENROLLED</h5>
                        <p>{match?.enrolled}</p>
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 px-3 py-5">
              <div>
                <p className="text-base sm:text-lg">
                  <span className="font-bold underline">Match Starts in: </span>
                  <MatchTimer d1={d1} d2={d2} />
                </p>
              </div>
              <Button
                isDisabled={d2.valueOf() <= d1.valueOf() ? false : true}
                className="sm:text-lgtext-lg px-4 py-3 text-sm font-bold"
                color="success"
                variant="solid"
                size="lg"
                radius="md"
              >
                <Link href={`/tournaments/enroll?id=${matchId}`}>
                  Enroll Now
                </Link>
              </Button>
              <Button
                className="px-4 py-3 text-sm font-semibold sm:text-lg"
                variant="bordered"
                size="lg"
                radius="md"
              >
                Find {<br />} Teammates
              </Button>
            </div>
          </div>

          <div className="tournament_body">
            <Tabs aria-label="Options">
              <Tab key="info" title="INFO">
                <Card>
                  <CardBody className="scrollbar">
                    <p>
                      <span className="font-semibold">IMPORTANT:</span> Final
                      prize will be adjusted based on the total number of
                      eligible teams seeded into the bracket.
                    </p>

                    <div className="flex justify-evenly ">
                      {trophys?.map((trophy, i) => (
                        <div key={trophy.id} className="block text-center">
                          <GrTrophy
                            key={trophy.id}
                            style={{ color: `${trophy.color}` }}
                            className="h-[175px] w-[175px] border-4 border-solid border-slate-300 p-4 text-8xl"
                          />
                          <p className="mt-2 text-2xl font-bold sm:text-5xl">
                            ${prizeTest[i]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </Tab>

              <Tab key="rules" title="RULES">
                <Card>
                  <CardBody>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur.
                  </CardBody>
                </Card>
              </Tab>

              {/* <Tab key="bracket" title="BRACKET">
                <Card>
                  <CardBody>
                    <Tournament participants={teamsEnrolled.data as any} />
                  </CardBody>
                </Card>
              </Tab> */}

              <Tab key="teams" title="TEAMS">
                <Card>
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
            <div className="tournament_body_info_bar"></div>
            <div className="tournament_body_prizes"></div>
          </div>
        </div>
        <div className="tournament_details_tab_prizes"></div>

        {matchData.isError && (
          <p className="font-bold text-red-400">{matchData.error.message}</p>
        )}
      </main>
    </div>
  );
}
