import Image from 'next/image'
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
                    <p className='text-base lg:text-lg text-white mb-4'>Select a game and then choose how you want to play.</p>
                    <div>
                        { error ? (
                            <p>{ error }</p>
                        ) : (
                            <div className='md:flex md:flex-row md:gap-3'>
                                <div className='flex flex-wrap'>
                                    {data?.slice(0,4).map((set: { id: React.Key, game: string }) => (
                                        
                                        <Link key={set.id} href={`/game/${set?.game}`} className={`border-2 border-slate-500 h-[150px] w-[150px] text-white`}>
                                            <Image src={`/images/${set?.game}.png`} width={150} height={150} style={{height: '100%'}} alt={`${set?.game} game placeholder`}/>
                                        </Link>
                                    
                                    ))}
                                </div>
                                
                                
                                <Link href={"/tournaments"} className="h-[50px] w-[150px] md:h-[100px] flex items-center justify-center mt-4 border-2 border-slate-500  text-white">
                                    SEE ALL GAMES
                                </Link>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </section>
    )
}