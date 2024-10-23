/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";
import { useEffect, useState } from "react";
import {
  Checkbox,
  CheckboxGroup,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { api } from "@/trpc/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Rules, gameTitles, teamSizeRender } from "@/lib/sharedData";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

// interface CreateMatchType {
//   mw3: {
//     solo: number;
//     duo: number;
//     trios: number;
//     quads: number;
//   };
//   fornite: {
//     solo: number;
//     duo: number;
//     trios: number;
//     quads: number;
//   };
// }

export default function CreateMatch() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const searchParamsNext = useSearchParams();
  const teamName = searchParamsNext.get("teamName");
  const teamIdNext = searchParamsNext.get("teamId");
  const teamCatNext = searchParamsNext.get("teamCategory");
  // const searchParams = new URLSearchParams(location.search);
  // const formattedParmas = searchParams.toString().split("&");
  const [loading] = useState<boolean>(false);
  // const [error, setError] = useState<string>("");
  // const [previousGameName, setPreviousGameName] = useState<string>("");
  const [selectedGames, setSelectedGames] = useState<string>(
    pathname.split("/")[3],
  );
  // const [teamId, setTeamId] = useState(formattedParmas[0]?.split("=")[1] || "");
  // const [teamCat, setTeamCat] = useState(
  //   formattedParmas[1]?.split("=")[1] || "",
  // );
  const [confirmedGameRules, setConfirmedGameRules] = useState<any>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [gameRules, setGameRules] = useState<any>([]);
  const [gameTitle, setGameTitles] = useState<any[]>([]);
  const [teamSize, setTeamSize] = useState(null);
  const [matchEntry, setMatchEntry] = useState<number | string>(1);
  const [startTime, setStartTime] = useState(
    `${new Date().toISOString().slice(0, -8)}`,
  );
  const [selectedGameTitle, setSelectedGameTitle] = useState<string | null>("");

  // if (session.status === "unauthenticated") {
  //   toast("Player must be signed in", {
  //     position: "bottom-right",
  //     autoClose: 2800,
  //     closeOnClick: true,
  //     draggable: false,
  //     type: "error",
  //     toastId: 66,
  //   });
  //   router.push("/sign-in");
  // }

  if (teamCatNext === "trios" || teamIdNext === undefined) {
    toast("Seems to be an error please try again", {
      position: "bottom-right",
      autoClose: 2800,
      closeOnClick: true,
      draggable: false,
      type: "error",
      toastId: 80,
    });

    router.push(`/team/${teamIdNext}`);
  }

  const getSingleGame = api.games.getSingleGame.useQuery(
    { gameName: selectedGames },
    { enabled: selectedGames.length > 0 && session.status === "authenticated" },
  );

  const createGame = api.create.createMoneyMatch.useMutation({
    onSuccess: () => {
      toast("Money match created", {
        position: "bottom-right",
        autoClose: 3500,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 67,
      });
      setTeamSize(null);
      setGameTitles([]);
      setSelectedPlatforms([]);
      setConfirmedGameRules([]);
      setMatchEntry(1);
      setStartTime(`${new Date().toISOString().slice(0, -8)}`);
      setTimeout(() => {
        router.push(`/team/${teamIdNext}`);
      });
    },

    onError: (error) => {
      if (
        error.message.includes(
          "ele_money_match.ele_money_match_created_by_start_time_unique",
        )
      ) {
        toast("Team alreay has a match for following time and team", {
          position: "bottom-right",
          autoClose: 3500,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 64,
        });
      } else {
        toast(
          "Create money match service is down please refresh and try again",
          {
            position: "bottom-right",
            autoClose: 3500,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 65,
          },
        );
      }
    },
  });

  function handleRuleChange(e: string, rule: string) {
    const setRule = {
      [rule]: e,
    };
    const findExistingItem = confirmedGameRules.find(
      (item: Record<string, unknown> | ArrayLike<unknown>) => {
        return Object.entries(item)[0][0] === rule;
      },
    );

    // if user changes value lets update correct array else create new array
    if (findExistingItem) {
      confirmedGameRules.map(() => {
        setConfirmedGameRules((prevState: any[]) => {
          // Loop over your list
          return prevState.map((item) => {
            // Check for the item with the specified id and update it
            return item === findExistingItem ? { ...item, [rule]: e } : item;
          });
        });
      });
    } else {
      setConfirmedGameRules((confirmedGameRules: any) => [
        ...confirmedGameRules,
        setRule,
      ]);
    }
  }

  function filterByID(item: { game: string }) {
    if (selectedGames === item?.game) {
      return true;
    }
  }

  const arrById: any = getSingleGame.data?.filter(filterByID);

  // useEffect(() => {
  //   if (formattedParmas.length > 0) {
  //     setTeamId(formattedParmas[0]?.split("=")[1]);
  //     setTeamCat(formattedParmas[1]?.split("=")[1]);
  //   }
  // }, [formattedParmas]);

  useEffect(() => {
    if (arrById === undefined) return;

    if (selectedGames.length > 0) {
      Rules.find((ele: any) => setGameRules(ele[arrById[0]?.game]));
      gameTitles.find((title: any) =>
        setGameTitles(title[arrById[0]?.game][teamCatNext!]),
      );
      //@ts-expect-error using dynamic values to render value
      setTeamSize(teamSizeRender[0][`${selectedGames}`][teamCatNext]);
    } else {
      setSelectedGames(pathname.split("/")[3]);
    }
  }, [selectedGames, gameRules, arrById, pathname, teamCatNext]);

  if (teamIdNext!.length <= 0 || teamCatNext!.length <= 0) return null;

  if (arrById === undefined) return null;

  return (
    <div className="m-auto flex min-h-full w-96 flex-1 flex-col justify-center px-6 py-12 dark:bg-slate-800 lg:px-8">
      <section className="w-full sm:max-w-md md:mt-0">
        <h1 className="my-8 text-center text-2xl font-bold leading-9 tracking-tight text-white sm:text-3xl">
          Create Money Match
        </h1>

        <h2 className="text-white">
          <span className="font-semibold">Creating Match For:</span> {teamName}
        </h2>
        <h2 className="pb-4 text-white">
          <span className="font-semibold">Game Title:</span> {selectedGames}
        </h2>

        <div className="mb-2">
          <Select label="Match Title Name" className="max-w-xs" required>
            {gameTitle?.map((type: any, i: number) => (
              <SelectItem
                onClick={(e) =>
                  setSelectedGameTitle((e?.target as HTMLElement).textContent)
                }
                key={i}
                value={type}
              >
                {type}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="mb-2">
          <label
            className="block text-lg font-medium leading-6 text-white sm:text-xl"
            htmlFor={"start-time"}
          >
            Start Time:
          </label>
          {startTime.length > 0 && (
            <input
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="datetime-local"
              id="start-time"
              name="start-time"
              min={`${startTime}`}
              onChange={(e) => setStartTime(e.target.value)}
              value={startTime}
            />
          )}
        </div>

        <div className="mt-2 text-white">
          <label
            className="block text-lg font-medium leading-6 text-white sm:text-xl"
            htmlFor={"start-time"}
          >
            Match Entry:
          </label>
          <p className="pb-2">Note: this entry is per player</p>
          <Input
            placeholder="0.00"
            min={1}
            defaultValue={"1"}
            value={matchEntry as string}
            onChange={(e) => setMatchEntry(e.target.value)}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-small text-default-500">$</span>
              </div>
            }
            type="number"
          />
        </div>

        <div className="mt-2">
          <Input
            label="Team Size"
            type="text"
            readOnly
            //@ts-expect-error using dynamic values to render value
            value={teamSizeRender[0][`${selectedGames}`][teamCatNext]}
          />
        </div>

        <CheckboxGroup
          label="Select platforms:"
          className="block pt-2 text-sm font-medium leading-6"
          value={selectedPlatforms}
          onValueChange={setSelectedPlatforms}
          isRequired
        >
          {arrById[0]?.platforms.map((platform: any, i: number) => (
            <Checkbox
              key={i}
              value={platform}
              className="text-white"
              classNames={{
                label: "text-white",
              }}
            >
              {platform}
            </Checkbox>
          ))}
        </CheckboxGroup>

        <div className="my-4">
          <label className="block pb-2 text-lg font-medium leading-6 text-white sm:text-xl">
            Rules:
          </label>

          {Object?.entries(gameRules)?.map((rule: any, key: number) => (
            <Select
              label={rule[0].charAt(0).toUpperCase() + rule[0].slice(1)}
              key={key}
              id={`${key}`}
              classNames={{ base: "pb-2" }}
            >
              {rule[1].map(
                (
                  option: string | number | readonly string[] | undefined,
                  i: number,
                ) => (
                  <SelectItem
                    value={option}
                    key={i}
                    onPress={(e) =>
                      handleRuleChange(
                        (e.target as HTMLElement).innerText,
                        rule[0],
                      )
                    }
                  >
                    {option}
                  </SelectItem>
                ),
              )}
            </Select>
          ))}
        </div>

        <button
          className="mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500"
          disabled={
            selectedGames.length === 0 ||
            gameRules.length <= 0 ||
            selectedGameTitle === null ||
            selectedGameTitle.length <= 0 ||
            matchEntry === 0 ||
            loading
          }
          onClick={(e) => {
            e.preventDefault();
            createGame.mutate({
              gameTitle: selectedGames,
              matchTitle: selectedGameTitle!,
              rules: confirmedGameRules,
              teamCategory: teamCatNext!,
              teamName: teamIdNext!,
              createdBy: session?.data?.user.username!,
              teamSize: String(teamSize),
              matchEntry: Number(matchEntry),
              startTime: startTime,
              platforms: selectedPlatforms,
            });
          }}
        >
          Create Money Match
        </button>

        {/* {error && <div className="pt-2 font-bold text-red-600">{error}</div>} */}
      </section>

      <ToastContainer containerId={"create-money-match"} />
    </div>
  );
}
