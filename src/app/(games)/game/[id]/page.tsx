"use client";

import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import { SelectItem, Select } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { tabs } from "@/lib/sharedData";
import GameTabs from "./GameTabs";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";

interface GameDataTypes {
  id: string;
  name: string;
  start_time: string;
  game: string;
  prize: string;
  matchEntry: number;
  startTime: string;
  matchName: string;
  gameTitle: string;
}

export default function Game() {
  const [value, setValue] = useState("Community Tournaments");
  const [renderData, setRenderData] = useState<any[]>([]);
  const pathname = usePathname();
  const gameFromPath = pathname.split("/")[2];
  const [active, setActive] = useState<string>("community tournaments");

  // get data from params
  const gameData = api.games.getSingleGame.useQuery(
    { gameName: gameFromPath },
    { enabled: gameFromPath.length > 0 },
  );

  useEffect(() => {
    if (value === "Community Tournaments" && gameData.data) {
      setRenderData(gameData?.data[0]?.tournaments);
    } else if (value === "Cash Matches" && gameData.data) {
      setRenderData(gameData?.data[0]?.moneyMatch);
    } else if (value === "XP Matches" && gameData.data) {
      setRenderData([]);
    }
  }, [value, gameData.data]);

  if (gameData.isError) {
    toast(
      "There was an error was this service, please refresh or submit a support ticket",
      {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 63,
      },
    );
  }

  return (
    <main className="bg-neutral-600">
      <div
        style={{
          backgroundImage: `url(/images/${gameFromPath}_team_background.png)`,
        }}
        className={`relative z-0 h-[300px] w-full  from-white to-neutral-400 bg-cover bg-no-repeat object-cover after:relative after:left-0 after:top-0 after:block after:h-full after:w-full after:bg-gradient-to-br after:opacity-50`}
      ></div>

      <div className="relative mt-[-150px] py-3">
        <div className="container relative z-20 m-auto">
          <div className="relative">
            <ul className="flex flex-row justify-center gap-3">
              {tabs.map((tab) => (
                <GameTabs
                  key={tab.id}
                  {...tab}
                  isActive={active === tab.id}
                  setActive={setActive}
                  setValue={setValue}
                />
              ))}
            </ul>

            <div className="absolute right-5 flex w-36 justify-end">
              <Select
                label="Game Drop down"
                defaultSelectedKeys={[gameFromPath]}
                disabledKeys={[gameFromPath]}
                selectionMode="single"
              >
                <SelectItem href={`/game/mw3`} key={"mw3"} value={"mw3"}>
                  mw3
                </SelectItem>
                <SelectItem
                  href={`/game/fornite`}
                  key={"fornite"}
                  value={"fornite"}
                >
                  fornite
                </SelectItem>
              </Select>
            </div>

            <div className="pt-4">
              <h2 className="text-xl font-bold text-white md:text-2xl lg:text-3xl">
                UPCOMING {value.toUpperCase()}
              </h2>
              <div className="block gap-2 pt-4 md:flex">
                {renderData.length <= 0 ? (
                  <p>
                    There are no {value.split(" ")[1]} at this time. Please
                    check back later
                  </p>
                ) : (
                  <>
                    {renderData?.map((data: GameDataTypes) => (
                      <div
                        key={data.id}
                        className="m-3 flex h-[200px] rounded-xl bg-slate-800 p-2 md:w-[32.3%]"
                      >
                        <Image
                          src={`/images/${data.game || data.gameTitle}.png`}
                          alt={`${data.game} placeholder image`}
                          width={50}
                          height={50}
                          className="mr-2 w-[25%] rounded-md object-contain"
                        />
                        <div className="m-auto w-[84%] text-white">
                          <h2 className="text-base ">
                            <span className="pr-1 font-semibold text-white">
                              Name:
                            </span>
                            {data.name || data.matchName}
                          </h2>
                          <p className="text-slate-200">
                            <span className="font-semibold text-white">
                              Date:{" "}
                            </span>
                            {new Date(
                              data.start_time || data.startTime,
                            ).toDateString()}
                          </p>
                          <p className="text-slate-200">
                            <span className="font-semibold text-white">
                              Time:
                            </span>{" "}
                            {new Date(
                              data.start_time || data.startTime,
                            ).toLocaleTimeString()}
                          </p>
                          <p className="pb-4 text-slate-200">
                            <span className="font-semibold text-white">
                              Prize:
                            </span>{" "}
                            ${data.prize || data?.matchEntry || 0}
                          </p>
                          <Link
                            href={`/tournaments/${data.id}`}
                            className="rounded-xl bg-red-500 p-2 text-sm sm:p-1 sm:text-base "
                          >
                            View {value.split(" ")[1]}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer containerId={"game-toast-container"} />
    </main>
  );
}
