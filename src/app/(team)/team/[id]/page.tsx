'use client';
import { api } from "@/trpc/react";
import { Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import type { TeamMembersType, TeamRecordType } from "@/server/db/schema"
import { friendTableColumn, statusGameMap } from "@/lib/sharedData";
import Disband from "@/app/_components/modals/Disband";
import { VerticalDotsIcon } from "@/app/friends/VerticalDotsIcon";

export default function Team() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const session = useSession();
    const pathname = usePathname();
    const router = useRouter();
    // const [error, setError] = useState<string>("");
    const [rowsPerPage, ] = useState<number>(5);
    const [page, ] = useState<number>(1);
    const [currentSet, setCurrentSet] = useState<number[]>([0,0]);
    const [isUserOwner, setIsUserOwner] = useState(false)
    const [isUserMember, setIsUserMember] = useState(false)
    const teamIdFromPath = pathname.split("/")[2]

    if (!teamIdFromPath) {
        // setError("Please provide a user")
        toast('Please provide a user', {
            position: "bottom-right",
            autoClose: 5000,
            closeOnClick: true,
            draggable: false,
            type: "success",
            toastId: 15
        })
        return null
    }

    const getTeamData = api.team.getSingleTeam.useQuery({ id: teamIdFromPath}, { enabled: teamIdFromPath.length > 0})

    if (getTeamData?.isError) {
        toast('Error retreving team data', {
            position: "bottom-right",
            autoClose: 2400,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 28                          
        })

        setTimeout(() => [
            router.push("/")
        ], 2500)
        
    }

    const team = getTeamData?.data
    //@ts-expect-error members should be present
    const members: TeamMembersType[] = team?.members,
    //@ts-expect-error members should be present
          teamRecord: TeamRecordType = team?.record

    type User = typeof members;


    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        setCurrentSet([start, end])

        return members?.slice(start, end);
      }, [page, members, rowsPerPage]);


    const pages = Math.ceil(members?.length / rowsPerPage);

    // const onNextPage = useCallback(() => {
    //     if (page < pages) {
    //         setPage(page + 1);
    //     }
    // }, [page, pages]);

    // const onPreviousPage = useCallback(() => {
    //     if (page > 1) {
    //         setPage(page - 1);
    //     }
    // }, [page]);

    // const renderToolTip = ((data: ( Record<string, string> | ArrayLike<ReactNode>)[] | undefined) => {
    //     if (!data || data === undefined) return null;
        
    //     return (
    //         <div>
    //             <ul>
    //                 {data?.map((rule: Record<string, string> | ArrayLike<ReactNode>, i: number) => (
    //                     <li key={i}><span className="font-bold">{Object.keys(rule)[0]}:</span> {Object.values(rule)}</li>
    //                 ))}
    //             </ul>
    //         </div>
    //     )
    // })

    const renderCell = useCallback((user: any, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];

        switch (columnKey) {
            case "userId":
                return (
                    <div>
                        {cellValue}
                         {/* <Image
                            src={`/images/${user.game}.png`} // Route of the image file
                            height={40} // Desired size with correct aspect ratio
                            width={40} // Desired size with correct aspect ratio
                            alt={`${user.game} placeholder image`}
                        /> */}
                    </div>
                
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        {cellValue}
                    </div>
                );
            case "actions":
                    return (
                      <div className="relative flex justify-end items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                          <DropdownTrigger>
                            <Button isIconOnly radius="full" size="sm" variant="light">
                              <VerticalDotsIcon className="text-default-400" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem href={`/profile${user?.username}`}>View</DropdownItem>
                            <DropdownItem 
                            //   onPress={ () => { 
                            //     onOpen()
                            //     setUsername(user.username)
                            //     setEmail(user.email)
                            //     setUserId(user.id)
                            //   }}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 block items-center">
                <div className="flex justify-between">
                    {/* <p>{currentSet[0]} out of {items?.length} cash matches</p>
                    <div className="flex gap-2">
                        <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                            Previous
                        </Button>
                        <Button isDisabled={pages === 1} size="sm" variant="solid" onPress={onNextPage}>
                            Next
                        </Button>
                    </div> */}
                    
                </div>
            </div>
        );
    }, [ items?.length, page, pages, currentSet]);

    useEffect(() => {
        //@ts-expect-error members is expected
        if ((team?.members && team?.members as TeamMembersType[])?.length > 0) {
            //@ts-expect-error members is expected
            team?.members?.map((member: { userId: string | null | undefined; role: string; }) => {
                if (member?.userId === session?.data?.user?.email) {
                    if( member?.role === 'owner' ) {
                        setIsUserOwner(true)
                    } else if (member?.role === 'member')  {
                        setIsUserMember(true)
                    }
                }
            })
        }
    }, [team, session.data])
    
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
                                    <h2 className="text-3xl mb-2 font-bold">{team?.team_name}</h2>
                                    <p className="font-semibold">EST. {team?.createdAt.toLocaleDateString()}</p>
                                    { team?.gameTitle.toLowerCase() === 'mw3' &&  statusGameMap[team?.gameTitle] }
                                    { team?.gameTitle.toLowerCase() === 'fornite' &&  statusGameMap[team?.gameTitle] }
                                    <h2 className="mb-2">{team?.team_name}</h2>
                                </div>
                                

                            </div>
                            

                            <div className="flex flex-col gap-1">
                                
                                { isUserOwner &&
                                    <>
                                        <Button color="success">Edit Background</Button>
                                        <Button onPress={() => [
                                            router.push(`/game/${team?.gameTitle.toLowerCase()}`)
                                        ]}>Find Match</Button>
                                        <Button color="danger" onPress={() => {
                                            onOpen()
                                        }}>Disband Team</Button> 
                                    </>
                                }
                                
                                { isUserMember && <Button color="danger">Leave Team</Button> }                                             
                                
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
                                <p>{teamRecord?.wins}W - {teamRecord?.losses}L</p>
                                <p>{teamRecord?.wins && teamRecord?.losses ? ((teamRecord?.wins / (teamRecord?.wins + teamRecord?.losses)) * 100).toFixed(2) : 0 }% WIN RATE</p>

                            </div>

                            <Divider orientation="vertical" className="w-0.5 h-20 text-white bg-white mx-1" />

                            <div className="text-white text-center">
                                <h3>RECENT MATCHES</h3>
                                <p>No Matches</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h2 className="text-white font-semibold text-xl sm:text-2xl md:text-3xl pb-2">Teammates</h2>
                            <Table 
                                className="bg-white text-black overflow-auto" 
                                aria-label="Cash Match Finder" 
                                bottomContent={bottomContent}
                                removeWrapper
                                // onSelectionChange={setSelectedKeys}
                            >
                                <TableHeader columns={friendTableColumn}>
                                    {(column) => <TableColumn key={column.key} className="text-center font-semibold">{column.label}</TableColumn>}
                                </TableHeader>
                                <TableBody items={items ?? []} emptyContent={"No users found"}>
                                    {(item: any) => (
                                    <TableRow key={item?.id ?? ""}>
                                        {(columnKey) => <TableCell className="text-center">{renderCell(item, columnKey)}</TableCell>}
                                    </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                
            </div>
            <Disband open={isOpen} onOpenChange={onOpenChange} teamName={team?.team_name} teamId={team?.id} />
            <ToastContainer containerId="team_id" />
        </div>
    )
}