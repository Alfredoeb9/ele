import { Avatar, Button, Divider } from "@nextui-org/react";

export default function Team() {
    return (
        <div className="bg-neutral-600">
            <div className="w-full h-[300px] object-cover bg-mw3_team_background bg-no-repeat bg-cover after:relative after:block after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-br from-white to-neutral-400 after:opacity-50 z-0 relative"></div>

            <div className="relative mt-[-150px] ">
                <div className="container m-auto relative z-20">
                    
                    <div className="p-4 ">
                        <div className="flex justify-between pb-2">
                            
                            <div className="flex">
                                <Avatar />
                                <div className="text-white">
                                    <h2 className="text-3xl mb-2 font-bold">The Rookies</h2>
                                    <p className="font-semibold">EST. 02/12/24</p>
                                    <p>Call of Duty: Modern Warare 3 | Global SQUAD Ladder</p><h2 className="mb-2">The Rookies</h2>
                                </div>
                                

                            </div>
                            

                            <div className="flex flex-col gap-1">
                                <Button color="success">Edit Background</Button>
                                <Button>Find Match</Button>
                                <Button color="danger">Disband Team</Button>
                            </div>
                        </div>
                        

                        <div className="flex bg-neutral-800 justify-evenly">
                            <div className="flex text-white text-center">
                                <div>
                                    Image
                                    {/* Image */}
                                </div>
                                <div className="flex flex-col">
                                    <h3>Rank</h3>
                                    <p>0 | 0 XP</p>
                                </div>
                                
                            </div>

                            <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1" />

                            <div className="text-white text-center">
                                <h3>CAREER RECORD</h3>
                                <p>0W - 0L</p>
                                <p>0% WIN RATE</p>
                            </div>

                            <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1" />

                            <div className="text-white text-center">
                                <h3>RECENT MATCHES</h3>
                                <p>No Matches</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}