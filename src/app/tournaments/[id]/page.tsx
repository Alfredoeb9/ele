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
import { toast } from "react-toastify";
import { statusGameMap, trophys } from "@/lib/sharedData";
import { GrTrophy } from "react-icons/gr";
import MatchTimer from "@/app/_components/MatchTimer";
import BracketGenerator from "@/app/_components/BracketGenerator";

// ANOTHER WAY TO DO TOURNAMENTS
/*

    function singleEliminationTournament(players) {
    let rounds = [];
    let numberOfRounds = Math.log2(players.length);
    
    // Generate the initial round with players
    rounds.push(players);

    // Simulate each round
    for (let i = 0; i < numberOfRounds; i++) {
        let currentRound = rounds[rounds.length - 1];
        let nextRound = [];

        // Pair players for the next round
        for (let j = 0; j < currentRound.length; j += 2) {
            let match = [currentRound[j], currentRound[j + 1]];
            nextRound.push(match);
        }

        rounds.push(nextRound);
    }

    return rounds;
}

// Example usage
let players = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8"];
let tournament = singleEliminationTournament(players);

console.log(tournament);


*/

// class Participant {
//   name: string;
//   score: number;
//   constructor(name: string) {
//     this.name = name;
//     this.score = 0;
//   }

//   // Method to increase score
//   increaseScore() {
//     this.score++;
//   }
// }

// class Tournament {
//   participants: Participant[];

//   constructor(participants: Participant[]) {
//     this.participants = participants;
//   }

//   // Method to simulate a single round of the tournament
//   playRound() {
//     // Randomly shuffle participants for fairness
//     this.shuffleParticipants();

//     // Pair participants for matches
//     for (let i = 0; i < this.participants.length - 1; i += 2) {
//       const participant1 = this.participants[i];
//       const participant2 = this.participants[i + 1];

//       // Check if there is an odd number of participants
//       if (this.participants.length % 2 !== 0) {
//         // One participant gets a bye
//         const byeParticipant = this.participants[this.participants.length - 1];
//         console.log("bye", byeParticipant);
//         byeParticipant.increaseScore();
//       }

//       console.log("par1", participant1);
//       console.log("--- vs ---");
//       console.log("par2", participant2);

//       // Simulate match and increase score of winner
//       const winner: Participant = this.simulateMatch(
//         participant1,
//         participant2,
//       );
//       winner.increaseScore();
//     }
//   }

//   // Method to shuffle participants
//   shuffleParticipants() {
//     for (let i = this.participants.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [this.participants[i], this.participants[j]] = [
//         this.participants[j],
//         this.participants[i],
//       ];
//     }
//   }

//   // Method to simulate a match between two participants
//   simulateMatch(participant1: Participant, participant2: Participant) {
//     // Simulate match result (assuming participant1 wins with 50% probability)
//     const randomNumber = Math.random();
//     return randomNumber < 0.5 ? participant1 : participant2;
//   }

//   // Method to display the scores of all participants
//   displayScores() {
//     console.log("Tournament Results:");
//     this.participants.forEach(
//       (participant: { name: string; score: number }) => {
//         console.log(`${participant.name}: ${participant.score} points`);
//       },
//     );
//   }

//   // Method to check if there is a single winner
//   hasSingleWinner() {
//     return this.participants.length === 1;
//   }

//   // Method to get the winner
//   getWinner() {
//     return this.participants[0];
//   }
// }

// function playNextRound(
//   remainingParticipants: Participant[],
//   setWinner: (arg0: Participant) => void,
//   round: number,
// ) {
//   if (remainingParticipants == undefined) return null;
//   round++;
//   console.log("re", remainingParticipants);
//   console.log("round", round);
//   for (let i = 0; i < remainingParticipants.length - 1; i += 2) {
//     const part1 = remainingParticipants[i];
//     const part2 = remainingParticipants[i + 1];

//     // Simulate match and increase score of winner
//     const winningParticipant = Math.random() < 0.5 ? part1 : part2;
//     console.log("iwn", winningParticipant.score);
//     winningParticipant.score = winningParticipant.score + 1;

//     console.log("winnin", winningParticipant);
//   }
//   // round = round + 1;
//   console.log(remainingParticipants);

//   // Check if there is an odd number of participants
//   if (remainingParticipants.length % 2 !== 0) {
//     // One participant gets a bye
//     const byeParticipant =
//       remainingParticipants[remainingParticipants.length - 1];
//     byeParticipant.score++;
//   }

//   // Check if there is a single winner
//   const remainingParticipants2 = remainingParticipants.filter(
//     (participant) => participant.score > round,
//   );

//   console.log("rem2", remainingParticipants2);
//   if (remainingParticipants2.length === 1) {
//     console.log(remainingParticipants2[0]);
//     setWinner(remainingParticipants2[0]);
//   } else {
//     playNextRound(remainingParticipants, setWinner, (round = round + 1));
//   }
// }

export interface Participant {
  teamId?: string;
  teamName: string;
  score: number;
  createdAt?: Date;
  updatedAt?: Date | null;
  id?: string;
}

// interface RulesTypes {
//   value: string;
// }

// const ParticipantComponent: React.FC<{
//   participant: Participant;
//   increaseScore: () => void;
// }> = ({ participant, increaseScore }) => {
//   return (
//     <div>
//       <h3>{participant.teamName}</h3>
//       <p>Score: {participant.score}</p>
//       {/* <button onClick={increaseScore}>Increase Score</button> */}
//     </div>
//   );
// };

const Tournament: React.FC<{ participants: Participant[] }> = ({
  participants,
}) => {
  const [winner, setWinner] = useState<Participant | null>(null);
  const [totalRounds, setTotalRounds] = useState(0);
  const [round, setRound] = useState(0);
  const [reaminingTeams, setReaminingTeams] = useState<Participant[]>([]);
  const [activateTournament, setActivateTournament] = useState<boolean>(false);

  function getRoundsCount(participants: Participant[]) {
    const tRounds = Math.ceil(Math.log(participants.length) / Math.log(2));

    return tRounds;
  }

  const playRound = () => {
    if (!winner) return null;
    // const count = getRoundsCount(participants);

    setActivateTournament(true);
    // Shuffle participants
    const shuffledParticipants = [...participants].sort(
      () => Math.random() - 0.5,
    );

    // Check if there is an odd number of participants
    if (shuffledParticipants.length % 2 !== 0) {
      // One participant gets a bye
      if (round === 0) {
        const byeParticipant =
          shuffledParticipants[shuffledParticipants.length - 1];
        byeParticipant.score++;
      } else if (reaminingTeams.length % 2 !== 0) {
        const byeParticipant = reaminingTeams[reaminingTeams.length - 1];
        byeParticipant.score++;
      }
    } else if (reaminingTeams.length % 2 !== 0) {
      const byeParticipant = reaminingTeams[reaminingTeams.length - 1];
      byeParticipant.score++;
    }

    // Pair participants for matches
    if (round === 0) {
      for (let i = 0; i < shuffledParticipants.length - 1; i += 2) {
        shuffledParticipants[i].score = 0;
        shuffledParticipants[i + 1].score = 0;
        if (
          shuffledParticipants[i].score === round &&
          shuffledParticipants[i + 1].score === round
        ) {
          const participant1 = shuffledParticipants[i];
          const participant2 = shuffledParticipants[i + 1];

          // Simulate match and increase score of winner
          const winningParticipant =
            Math.random() >= 0.5 ? participant1 : participant2;

          winningParticipant.score = winningParticipant.score + 1;
        }
      }
    } else {
      for (let i = 0; i < reaminingTeams.length - 1; i += 2) {
        if (
          reaminingTeams[i].score === round &&
          reaminingTeams[i + 1].score === round
        ) {
          const participant1 = reaminingTeams[i];
          const participant2 = reaminingTeams[i + 1];

          // Simulate match and increase score of winner
          const winningParticipant =
            Math.random() >= 0.5 ? participant1 : participant2;

          winningParticipant.score = winningParticipant.score + 1;
        }
      }
    }
    // Check if there is a single winner

    if (round === 0) {
      const remainingParticipants = shuffledParticipants.filter(
        (participant) => participant.score > round,
      );

      setReaminingTeams(remainingParticipants);

      setRound(round + 1);

      if (remainingParticipants.length === 1) {
        console.log(remainingParticipants[0]);
        setWinner(remainingParticipants[0]);
      }
    } else {
      const remainingParticipants = reaminingTeams.filter(
        (participant) => participant.score > round,
      );

      setReaminingTeams(remainingParticipants);

      setRound(round + 1);

      if (remainingParticipants.length === 1) {
        console.log(remainingParticipants[0]);
        setWinner(remainingParticipants[0]);
      }
    }
  };

  if (participants.length <= 0)
    return <p>There are no current Teams enrolled</p>;

  return (
    <div>
      <h2>Tournament</h2>
      <p>Round: {round}</p>
      {activateTournament && (
        <>
          <BracketGenerator
            participants={participants}
            totalRounds={totalRounds}
            reaminingTeams={reaminingTeams}
          />
          {/* {participants.map((participant) => (
            <ParticipantComponent
              key={participant.name}
              participant={participant}
              increaseScore={() => participant.score++}
            />
          ))} */}
        </>
      )}

      <button
        onClick={() => {
          setTotalRounds(getRoundsCount(participants));
          setActivateTournament(true);
        }}
      >
        Start Tournament
      </button>

      <button
        onClick={() => {
          playRound();
        }}
      >
        Play Round
      </button>
      {winner && <h2>Winner: {winner.teamName}</h2>}
    </div>
  );
};

export default function Tournaments({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const [tournamentId] = useState<string>(id);
  const [, setPrize] = useState<number>(0);
  const [prizeTest] = useState<number[]>([5, 0, 0]);

  const tournamentData = api.matches.getSingleTournament.useQuery(
    { id: tournamentId },
    { enabled: tournamentId.length >= 0 },
  );

  // ENABLE THIS ONLY WHEN THE TOURNAMENT TIMER IS DONE / 0
  const teamsEnrolled = api.matches.getEnrolledTeams.useQuery(
    { tournamentId: tournamentId },
    { enabled: tournamentId.length >= 0 },
  );

  if (tournamentData.isError) {
    toast("There was an error returning tournament data", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: false,
      type: "error",
      toastId: 50,
    });
  }

  const teamsData = teamsEnrolled?.data!;

  useEffect(() => {
    if (tournamentData.data) {
      tournamentData?.data.map(
        (tourney: { prize: React.SetStateAction<number> }) => {
          setPrize(tourney.prize);
        },
      );
    }
  }, [tournamentData?.data]);

  if (tournamentData.data === undefined) return null;

  const tournament = tournamentData.data;
  const tournamentRules = tournament[0].rules;

  if (tournamentData.isLoading)
    return <Spinner label="Loading..." color="warning" />;

  const d1 = new Date(
      `${tournamentData.data && tournamentData.data[0]?.start_time}`,
    ),
    d2 = new Date();

  const pstDate = d1.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });

  return (
    <div>
      <div
        className={`h-[300px] w-full bg-${tournament[0].game.toLowerCase()}_team_background bg-cover bg-fixed bg-center bg-no-repeat`}
      />

      <main className="relative mt-[-150px] px-4">
        <div className="w-full sm:w-[65%]">
          <div
            id="tournament_info-block"
            className="rounded-xl bg-slate-400 p-1"
          >
            <div className="block sm:flex">
              {tournament?.map((tournament) => (
                <div key={tournament.id} className="flex">
                  <Card
                    isFooterBlurred
                    className="col-span-12 h-[300px] w-full from-white to-neutral-400 after:absolute after:left-0 after:top-0 after:h-full after:w-full after:bg-gradient-to-br after:opacity-30 sm:col-span-7 sm:w-56"
                  >
                    <Image
                      removeWrapper
                      alt={`${tournament?.game} game poster`}
                      className="z-0 h-full w-full object-cover"
                      src={`/images/${tournament?.game}.png`}
                      width={400}
                    />
                    <CardFooter className="absolute bottom-0 z-10 border-t-1 border-default-600 bg-black/40 dark:border-default-100">
                      <div className="flex w-full items-center justify-between">
                        <p className="text-sm text-white/60">
                          Prize: ${tournament?.prize}
                        </p>
                        <p className="text-sm text-white/60">NA + EU</p>
                      </div>
                    </CardFooter>
                  </Card>

                  <div className="tournament_info w-full p-2 sm:ml-4">
                    {tournament.game.toLowerCase() === "mw3" && (
                      <h1 className="text-3xl font-bold">
                        {statusGameMap[tournament?.game]}
                      </h1>
                    )}
                    {tournament.game.toLowerCase() === "fortnite" && (
                      <h1 className="text-3xl font-bold">
                        {statusGameMap[tournament?.game]}
                      </h1>
                    )}

                    <div className="mb-4 flex w-full items-center justify-around">
                      <div>
                        <p className="block font-bold">{tournament?.name}</p>
                        <p className="block">{tournament?.tournament_type}</p>
                      </div>

                      <Divider
                        orientation="vertical"
                        className="mx-1 h-20 w-0.5 bg-white text-white"
                      />

                      <div>
                        <p className="font-bold">Platforms:</p>
                        <p>
                          {tournament?.platform ? (
                            "Cross Platform"
                          ) : (
                            <span className="text-bold text-small capitalize">
                              {tournament?.platform as string}
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
                        <p>{tournament?.entry}</p>
                      </div>
                      <Divider
                        orientation="vertical"
                        className="mx-1 h-20 w-0.5 bg-white text-white"
                      />
                      <div>
                        <h5 className="font-bold">TEAM SIZE</h5>
                        <p>{tournament?.team_size}</p>
                      </div>
                      <Divider
                        orientation="vertical"
                        className="mx-1 h-20 w-0.5 bg-white text-white"
                      />
                      <div>
                        <h5 className="font-bold">MAX TEAMS</h5>
                        <p>{tournament?.max_teams}</p>
                      </div>
                      <Divider
                        orientation="vertical"
                        className="mx-1 h-20 w-0.5 bg-white text-white"
                      />
                      <div>
                        <h5 className="font-bold">ENROLLED</h5>
                        <p>{tournament?.enrolled}</p>
                      </div>
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
                isDisabled={d2.valueOf() <= d1.valueOf() ? false : true}
                className="sm:text-lgtext-lg px-4 py-3 text-sm font-bold"
                color="success"
                variant="solid"
                size="lg"
                radius="md"
              >
                <Link href={`/tournaments/enroll?id=${tournamentId}`}>
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

                    <div className="flex justify-evenly">
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
                    {tournamentRules.map((rule, i) => (
                      <div key={i}>
                        <p className="text-slate-800">
                          <span className="font-semibold uppercase text-red-600">
                            {Object.keys(rule)[0]}:
                          </span>{" "}
                          {Object.values(rule)[0]}
                        </p>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </Tab>

              <Tab key="bracket" title="BRACKET">
                <Card>
                  <CardBody>
                    <Tournament participants={teamsEnrolled?.data as any} />
                  </CardBody>
                </Card>
              </Tab>

              <Tab key="teams" title="TEAMS">
                <Card>
                  <CardBody>
                    {teamsData?.length <= 0 && (
                      <p>There are no current teams enrolled</p>
                    )}
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
            <div className="tournament_body_info_bar"></div>
            <div className="tournament_body_prizes"></div>
          </div>
        </div>
        <div className="tournament_details_tab_prizes"></div>

        {tournamentData.isError && (
          <p className="font-bold text-red-400">
            {tournamentData.error.message}
          </p>
        )}
      </main>
    </div>
  );
}
