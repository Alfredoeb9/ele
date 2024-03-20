"use client";
import { api } from "@/trpc/react";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { Key, useCallback, useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import type { TeamMembersType, TeamRecordType } from "@/server/db/schema";
import { friendTableColumn, statusGameMap } from "@/lib/sharedData";
import Disband from "@/app/_components/modals/Disband";
import { VerticalDotsIcon } from "@/app/friends/VerticalDotsIcon";
import SendTeamInvite from "@/app/_components/modals/SendTeamInvite";
import LeaveTeamModal from "@/app/_components/modals/LeaveTeamModal";

export default function Team() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  // const [error, setError] = useState<string>("");
  const [rowsPerPage] = useState<number>(5);
  const [page] = useState<number>(1);
  const [currentSet, setCurrentSet] = useState<number[]>([0, 0]);
  const [isUserOwner, setIsUserOwner] = useState(false);
  const [isUserMember, setIsUserMember] = useState(false);
  const teamIdFromPath = pathname.split("/")[2];

  if (!teamIdFromPath) {
    // setError("Please provide a user")
    toast("Please provide a user", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: false,
      type: "success",
      toastId: 15,
    });
    return null;
  }

  const getTeamData = api.team.getSingleTeam.useQuery(
    { id: teamIdFromPath },
    { enabled: teamIdFromPath.length > 0 },
  );

  if (getTeamData?.isError) {
    toast("Error retreving team data", {
      position: "bottom-right",
      autoClose: 2400,
      closeOnClick: true,
      draggable: false,
      type: "error",
      toastId: 28,
    });

    setTimeout(() => [router.push("/")], 2500);
  }

  const team = getTeamData?.data;
  //@ts-expect-error members should be present
  const members: TeamMembersType[] = team?.members,
    //@ts-expect-error members should be present
    teamRecord: TeamRecordType = team?.record;

  type User = typeof members;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    setCurrentSet([start, end]);

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

  const renderCell = useCallback((user: { [x: string]: any; userName: string; }, columnKey: React.Key) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const cellValue = user[columnKey as number];

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
        return <div className="flex flex-col">{cellValue}</div>;
      case "actions":
        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown className="border-1 border-default-200 bg-background">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="teammates">
                <DropdownItem
                  href={`/profile/${user?.userName}`}
                  aria-label="view"
                >
                  View
                </DropdownItem>
                <DropdownItem
                  //   onPress={ () => {
                  //     onOpen()
                  //     setUsername(user.username)
                  //     setEmail(user.email)
                  //     setUserId(user.id)
                  //   }}
                  aria-label="delete"
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
      <div className="block items-center px-2 py-2">
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
  }, []);

  useEffect(() => {
    //@ts-expect-error members is expected
    if ((team?.members && (team?.members as TeamMembersType[]))?.length > 0) {
      team?.members?.map(
        (member: { userId: string | null | undefined; role: string }) => {
          if (member?.userId === session?.data?.user?.email) {
            if (member?.role === "owner") {
              setIsUserOwner(true);
            } else if (member?.role === "member") {
              setIsUserMember(true);
            }
          }
        },
      );
    }
  }, [team, session.data]);

  return (
    <div className="bg-neutral-600">
      <div className="relative z-0 h-[300px] w-full bg-mw3_team_background from-white to-neutral-400 bg-cover bg-no-repeat object-cover after:relative after:left-0 after:top-0 after:block after:h-full after:w-full after:bg-gradient-to-br after:opacity-50"></div>

      <div className="relative mt-[-150px] ">
        <div className="container relative z-20 m-auto">
          <div className="p-4 ">
            <div className="flex justify-between pb-2">
              <div className="flex">
                <Avatar />
                <div className="text-white ml-2">
                  <h2 className="mb-2 text-3xl font-bold">{team?.team_name}</h2>
                  <p className="font-semibold"><span className="font-bold">Team Category:</span> {team?.teamCategory.toUpperCase()}</p>
                  <p className="font-semibold">
                    EST. {team?.createdAt.toLocaleDateString()}
                  </p>
                  {team?.gameTitle.toLowerCase() === "mw3" &&
                    statusGameMap[team?.gameTitle]}
                  {team?.gameTitle.toLowerCase() === "fornite" &&
                    statusGameMap[team?.gameTitle]}
                  <h2 className="mb-2">{team?.team_name}</h2>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {isUserOwner && (
                  <>
                    <Button
                      onPress={() => [
                        router.push(`/game/${team?.gameTitle.toLowerCase()}`),
                      ]}
                    >
                      Find Match
                    </Button>
                    <Button
                      color="success"
                      onPress={() => [
                        router.push(`/match/create/${team?.gameTitle.toLowerCase()}`),
                      ]}
                    >
                      Create Money Match
                    </Button>
                    <CustomButton
                      teamName={team?.team_name!}
                      game={team?.gameTitle!}
                      teamId={team?.id!}
                    />
                    <Button
                      color="danger"
                      onPress={() => {
                        onOpen();
                      }}
                    >
                      Disband Team
                    </Button>
                  </>
                )}

                {isUserMember && (
                  <CustomLeaveTeamButton
                    teamName={team?.team_name!}
                    userEmail={session.data?.user.email!}
                    teamId={team?.id!}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-evenly bg-neutral-800">
              <div className="flex text-center text-white">
                <div>
                  Image
                  {/* Image */}
                </div>
                <div className="flex flex-col">
                  <h3>Rank</h3>
                  <p>0 | 0 XP</p>
                </div>
              </div>

              <Divider
                orientation="vertical"
                className="mx-1 h-20 w-0.5 bg-white text-white"
              />

              <div className="text-center text-white">
                <h3>CAREER RECORD</h3>
                <p>
                  {teamRecord?.wins}W - {teamRecord?.losses}L
                </p>
                <p>
                  {teamRecord?.wins && teamRecord?.losses
                    ? (
                        (teamRecord?.wins /
                          (teamRecord?.wins + teamRecord?.losses)) *
                        100
                      ).toFixed(2)
                    : 0}
                  % WIN RATE
                </p>
              </div>

              <Divider
                orientation="vertical"
                className="mx-1 h-20 w-0.5 bg-white text-white"
              />

              <div className="text-center text-white">
                <h3>RECENT MATCHES</h3>
                <p>No Matches</p>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="pb-2 text-xl font-semibold text-white sm:text-2xl md:text-3xl">
                Teammates
              </h2>
              <Table
                className="overflow-auto bg-white text-black"
                aria-label="Cash Match Finder"
                bottomContent={bottomContent}
                removeWrapper
                // onSelectionChange={setSelectedKeys}
              >
                <TableHeader columns={friendTableColumn}>
                  {(column: { key: string; label: string }) => (
                    <TableColumn
                      key={column.key}
                      className="text-center font-semibold"
                    >
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={items ?? []} emptyContent={"No users found"}>
                  {(item) => (
                    <TableRow key={item?.userId}>
                      {(columnKey: Key) => (
                        <TableCell className="text-center">
                          {renderCell(item, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <Disband
        open={isOpen}
        onOpenChange={onOpenChange}
        teamName={team?.team_name}
        teamId={team?.id}
      />
      <ToastContainer containerId="team_id" />
    </div>
  );
}

interface CustomButtonTypes {
  teamName: string;
  game: string;
  teamId: string;
}

function CustomButton({ teamName, game, teamId }: CustomButtonTypes) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="primary"
        onPress={() => {
          onOpen();
        }}
      >
        Invite User
      </Button>

      <SendTeamInvite
        open={isOpen}
        onOpenChange={onOpenChange}
        teamName={teamName}
        game={game}
        teamId={teamId}
      />
    </>
  );
}

interface CustomeLeaveTeamButtonTypes {
  teamName: string;
  userEmail: string;
  teamId: string;
}

function CustomLeaveTeamButton({
  teamName,
  teamId,
  userEmail,
}: CustomeLeaveTeamButtonTypes) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="danger"
        onPress={() => {
          onOpen();
        }}
      >
        Leave Team
      </Button>

      <LeaveTeamModal
        open={isOpen}
        onOpenChange={onOpenChange}
        teamName={teamName}
        userEmail={userEmail}
        teamId={teamId}
      />
    </>
  );
}
