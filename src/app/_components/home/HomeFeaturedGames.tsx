import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { GameCategoryType } from "@/server/db/schema";
import { fromGameNameFromData } from "@/lib/utils/utils";

interface HomeDataProps {
  data: GameCategoryType[];
  error: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function HomeFeaturedGames({ data, error, isLoading, isSuccess, isError }: HomeDataProps) {
  if (isLoading) return <h2>Loading...</h2>;

  return (
    <section className="m-auto flex flex-col items-center justify-center bg-black p-8">
      <div className="m-auto flex flex-row justify-center">
        <div className="mr-4 h-10 w-2 bg-red-400" />

        <div>
          <h2 className="text-xl text-white lg:text-2xl">GAMES</h2>
          <p className="mb-4 text-base text-white lg:text-lg">
            Select a game and then choose how you want to play.
          </p>
          <div>
            {error ? (
              <p>{error}</p>
            ) : (
              <div className="md:flex md:flex-row md:gap-3">
                <div className="flex flex-wrap">
                  {data
                    ?.slice(0, 4)
                    .map((set: { id: React.Key; game: string }) => (
                      <Link
                        key={set.id}
                        href={`/game/${set?.game.replaceAll(" ", "-").toLowerCase()}?tab=community+tournaments`}
                        className={`h-[150px] w-[150px] border-2 border-slate-500 text-white`}
                      >
                        <Image
                          src={`/images/${fromGameNameFromData(set?.game)}.png`}
                          width={150}
                          height={150}
                          style={{ height: "100%" }}
                          alt={`${set?.game} game placeholder`}
                        />
                      </Link>
                    ))}
                </div>

                <Link
                  href={"/tournaments"}
                  className="mt-4 flex h-[50px] w-[150px] items-center justify-center border-2 border-slate-500 text-white  md:h-[100px]"
                >
                  SEE ALL GAMES
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
