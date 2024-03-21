/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { api } from "@/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import { Rules, gameTitles } from "@/lib/sharedData";
import { useSession } from "next-auth/react";

export default function CreateMatch() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const [game, setGame] = useState<string>("");
  const searchParams = new URLSearchParams(location.search);
  const formattedParmas = searchParams.toString().split("&");

  console.log("formattedParmas", formattedParmas);

  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [previousGameName, setPreviousGameName] = useState<string>("");
  const [selectedGames, setSelectedGames] = useState<string>(
    pathname.split("/")[3],
  );

  const [teamId, setTeamId] = useState(formattedParmas[0]?.split("=")[1]);
  const [teamCat, setTeamCat] = useState(formattedParmas[1]?.split("=")[1]);

  console.log("cat", teamCat);

  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [confirmedGameRules, setConfirmedGameRules] = useState<any>([]);
  const [gameRules, setGameRules] = useState<any[]>([]);
  const [gameTitle, setGameTitles] = useState<any[]>([]);
  const [teamSize, setTeamSize] = useState<string>("");
  const [matchEntry, setMatchEntry] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const [startTime, setStartTime] = useState(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `${new Date().toISOString().slice(0, -8)}`,
  );
  const [selectedGameTitle, setSelectedGameTitle] = useState<string | null>("");

  const getSingleGame = api.games.getSingleGame.useQuery(
    { gameName: selectedGames },
    { enabled: selectedGames.length > 0 },
  );

  const createGame = api.create.createMoneyMatch.useMutation({
    onSuccess: () => {
      setGame("");
      setPreviousGameName(""), setSubCategory([]);
      setSelected([]);
      const allSubs = document.querySelectorAll(".sub-category-child");

      allSubs.forEach((sub) => {
        sub.remove();
      });
      router.refresh();
    },

    onError: (error: { message: string }) => {
      console.log("error", error.message);
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

  const arrById = getSingleGame.data?.filter(filterByID);

  useEffect(() => {
    if (formattedParmas.length > 0) {
      setTeamId(formattedParmas[0]?.split("=")[1]);
      setTeamCat(formattedParmas[1]?.split("=")[1]);
    }
  }, [formattedParmas]);

  useEffect(() => {
    if (arrById === undefined) return;

    if (selectedGames.length > 0) {
      Rules.find((ele: any) => setGameRules(ele[arrById[0]?.game]));
      gameTitles.find((title: any) =>
        setGameTitles(title[arrById[0]?.game][teamCat as any]),
      );
    }
  }, [selectedGames, gameRules, arrById, teamCat]);

  return (
    <div className="m-auto flex min-h-full w-96 flex-1 flex-col justify-center px-6 py-12 dark:bg-slate-800 lg:px-8">
      <section className="w-full sm:max-w-md md:mt-0">
        <h1 className="my-8 text-center text-2xl font-bold leading-9 tracking-tight text-white sm:text-3xl">
          Create Money Match
        </h1>

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
            className="block text-sm font-medium leading-6"
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

        <div className="my-4">
          <label className="block pb-2 text-xl font-medium leading-6 text-white">
            Rules:
          </label>

          {Object?.entries(gameRules)?.map((rule, key: number) => (
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
            game.length === 0 ||
            selected.length === 0 ||
            loading ||
            error.includes("Please change the name")
          }
          onClick={(e) => {
            e.preventDefault();
            createGame.mutate({
              gameTitle: game,
              matchTitle: selectedGameTitle!,
              rules: gameRules,
              teamCategory: teamCat,
              teamName: teamId,
              createdBy: session?.data?.user.username!,
              teamSize: teamSize,
              matchEntry: matchEntry,
              startTime: startTime,
            });
          }}
        >
          Create Money Match
        </button>

        {error && <div className="pt-2 font-bold text-red-600">{error}</div>}
      </section>
    </div>
  );
}
