import Link from "next/link";
import React from "react";

interface HomeDataProps {
    data: any,
    error: string
}

export default function HomeFeaturedGames({ data, error }: HomeDataProps) {

    if (!data) return (
        <h2>Please refresh and try again!</h2>
    )

    return (
        <section className='flex flex-col items-center justify-center m-auto bg-black p-8'>
            <div className='flex flex-row justify-center m-auto'>
                
                <div className="bg-red-400 h-10 w-2 mr-4" />
                
                <div>
                    <h2 className='text-xl lg:text-2xl text-white'>GAMES</h2>
                    <p className='text-base lg:text-lg text-white mb-2'>Select a game and then choose how you want to play.</p>
                    <div className='flex flex-row  gap-3'>
                        { error ? (
                            <p>{ error }</p>
                        ) : (
                            <>
                                {data?.slice(0,4).map((set: { id: React.Key | null | undefined; game: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }) => (
                                    <Link href={`/game/${set.game}`} key={set.id} className="flex items-center border-2 border-slate-500 h-20 text-white">
                                        {set.game}
                                    </Link>
                                ))}
                                
                                <Link href={"/tournaments"} className="flex items-center border-2 border-slate-500 h-20 text-white">
                                    SEE ALL GAMES
                                </Link>
                            </>
                        )}
                        
                    </div>
                </div>
            </div>
        </section>
    )
}