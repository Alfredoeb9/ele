"use client";
import React, { useEffect, useState } from "react";
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

export interface Participant {
  teamId?: string;
  teamName: string;
  score: number;
  createdAt?: Date;
  updatedAt?: Date | null;
  id?: string;
}

export default function Match({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const session = useSession();
  const [matchId] = useState<string>(id);
  const [matchType, setMatchType] = useState("");
  const [matchEntry, setMatchEntry] = useState(0);

  const matchData = api.matches.getSingleMatch.useQuery(
    { matchId: matchId },
    { enabled: matchId.length >= 0 },
  );

  const CustomToastWithLink = () => (
    <div>
      User needs to{" "}
      <Link href="/sign-in" className="text-blue-600 hover:text-blue-500">
        sign in
      </Link>{" "}
      to accept match.
    </div>
  );

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
        setMatchType(match.matchType);
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

  const rules = matchData.data[0].rules as [{ value: string }];

  //http://localhost:3000/match/enroll?id=44c08fc3-b2b5-4fee-ba94-601365c674cd

  return (
    <div>
      <div
        className={`h-[300px] w-full bg-${matchData?.data && matchData?.data[0].gameTitle.toLowerCase()}_team_background bg-cover bg-fixed bg-center bg-no-repeat`}
      />

      <main className="relative mt-[-150px] px-4">
        <div className="w-full">
          <div
            id="tournament_info-block"
            className="rounded-xl bg-slate-400 p-1"
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
                    {/* <CardFooter className="absolute bottom-0 z-10 border-t-1 border-default-600 bg-black/40 dark:border-default-100">
                      <div className="flex w-full items-center justify-between">
                        <p className="text-sm text-white/60">
                          Match Entry: ${match?.matchEntry}
                        </p>
                        <p className="text-sm text-white/60">NA + EU</p>
                      </div>
                    </CardFooter> */}
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
                      {/* <div>
                        <h5 className="font-bold">ENTRY/PLAYER</h5>
                        <p>$ {match?.matchEntry}</p>
                      </div>
                      <Divider
                        orientation="vertical"
                        className="mx-1 h-20 w-0.5 bg-white text-white"
                      /> */}
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
                  <MatchTimer d1={d1} d2={d2} color={"text-slate-800"} />
                </p>
              </div>
              <Button
                // isDisabled={d2.valueOf() <= d1.valueOf() ? false : true}
                className="px-4 py-3 text-sm font-bold sm:text-lg"
                color="success"
                variant="solid"
                size="lg"
                radius="md"
                onPress={() => {
                  if (session.status === "unauthenticated") {
                    toast(CustomToastWithLink, {
                      position: "bottom-right",
                      autoClose: 4500,
                      closeOnClick: true,
                      draggable: false,
                      type: "error",
                      toastId: 68,
                    });
                  }

                  if (d2.valueOf() >= d1.valueOf()) {
                    toast("Match has rolled passed its time", {
                      position: "bottom-right",
                      autoClose: 4500,
                      closeOnClick: true,
                      draggable: false,
                      type: "error",
                      toastId: 69,
                    });
                  }
                }}
              >
                <Link
                  href={{
                    pathname: `/match/enroll`,
                    query: { id: matchId, cat: matchType },
                  }}
                  // style={{
                  //   pointerEvents:
                  //     session.status === "unauthenticated" ? "none" : "auto",
                  // }}
                >
                  Enroll Now
                </Link>
              </Button>
              <Link
                href={"/friends"}
                className="rounded-2xl border border-solid border-black px-4 py-3 text-sm font-bold sm:text-lg"
              >
                Find Teammates
              </Link>
            </div>
          </div>

          <div className="tournament_body">
            <Tabs aria-label="Options">
              <Tab key="info" title="INFO">
                <Card>
                  <CardBody className="scrollbar">
                    <p>
                      <span className="font-semibold">IMPORTANT:</span> Winner
                      takes prize per teammate.
                    </p>

                    <div className="flex justify-evenly">
                      {trophys
                        ?.filter((trophy) => trophy.id === "gold")
                        .map((trophy) => (
                          <div key={trophy.id} className="block text-center">
                            <GrTrophy
                              key={trophy.id}
                              style={{ color: `${trophy.color}` }}
                              className="h-[175px] w-[175px] border-4 border-solid border-slate-300 p-4 text-8xl"
                            />
                            <p className="mt-2 text-2xl font-bold sm:text-5xl">
                              ${matchEntry}
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
                    {rules.length > 0 ? (
                      rules.map((rule, i) => (
                        <div key={i}>
                          <p>
                            <span className="font-semibold uppercase">
                              {Object.keys(rule)[0]}:
                            </span>{" "}
                            {Object.values(rule)[0]}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>
                        There are no rules posted for this match. That seems
                        like a problem please report this match.
                      </p>
                    )}
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

              {/* <Tab key="team" title="TEAM">
                <Card>
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab> */}
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
