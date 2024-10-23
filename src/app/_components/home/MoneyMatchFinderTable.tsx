"use client";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  type ChipProps,
  Tooltip,
} from "@nextui-org/react";
import { moneyMatchColumns } from "@/lib/sharedData";
import Link from "next/link";
import Image from "next/image";

interface MatchFinderTableProps {
  matchId: string;
  // game: string;
  platform: any;
  matchEntry: number;
  // entry: string;
  // team_size: string;
  tournament_type?: string;
  rules: any;
  startTime: string | number | Date;
  gameTitle: string;
  support?: string;
  starting?: string;
  info?: MatchFinderInfoProps[];
}

interface MatchListProps {
  data: MatchFinderTableProps[];
}

interface MatchFinderInfoProps {
  pc_players: string;
  snipers: string;
  snaking: string;
  allowed_input: string;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
  "available now": "success",
  "not available": "danger",
};

export const MoneyMatchFinderTable = ({ data }: MatchListProps) => {
  if (!data) return null;

  type Match = MatchFinderTableProps;

  // const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [currentSet, setCurrentSet] = useState<number[]>([0, 0]);

  // const filteredItems = useMemo(() => {
  //     let filteredUsers = [...data];

  //     if (hasSearchFilter) {
  //       filteredUsers = filteredUsers.filter((user) =>
  //         user.name.toLowerCase().includes(filterValue.toLowerCase()),
  //       );
  //     }
  //     if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
  //       filteredUsers = filteredUsers.filter((user) =>
  //         Array.from(statusFilter).includes(user.status),
  //       );
  //     }

  //     return filteredUsers;
  // }, [users, filterValue, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    setCurrentSet([start, end]);

    return data.slice(start, end);
  }, [page, data, rowsPerPage]);

  const pages = Math.ceil(data.length / rowsPerPage);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const renderToolTip = (
    data: (Record<string, string> | ArrayLike<ReactNode>)[] | undefined,
  ) => {
    if (!data || data === undefined) return null;

    return (
      <div>
        <ul>
          {data.map(
            (
              rule: Record<string, string> | ArrayLike<ReactNode>,
              i: number,
            ) => (
              <li key={i}>
                <span className="font-bold">{Object.keys(rule)[0]}:</span>{" "}
                {Object.values(rule)}
              </li>
            ),
          )}
        </ul>
      </div>
    );
  };

  const renderCell = useCallback(
    (moneyMatch: Match, columnKey: React.Key): React.ReactNode => {
      const cellValue = moneyMatch[columnKey as keyof Match];

      const d1 = new Date(moneyMatch.startTime),
        d2 = new Date();

      switch (columnKey) {
        case "game":
          return (
            <div>
              <Image
                src={`/images/${moneyMatch.gameTitle}.png`} // Route of the image file
                height={40} // Desired size with correct aspect ratio
                width={40} // Desired size with correct aspect ratio
                alt={`${moneyMatch.gameTitle} placeholder image`}
              />
            </div>
          );
        case "platforms":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {moneyMatch?.platform.join(", ")}
              </p>
            </div>
          );
        case "start_time":
          return (
            <Chip
              className="gap-1 border-none capitalize text-default-600"
              color={
                d2.valueOf() <= d1.valueOf()
                  ? statusColorMap["available now"]
                  : statusColorMap["not available"]
              }
              size="sm"
              variant="dot"
            >
              {d2.valueOf() <= d1.valueOf() ? "Available Now" : "Not Available"}
            </Chip>
          );
        case "support":
          return <div>Live Support</div>;
        case "matchEntry":
          return <div>$ {moneyMatch?.matchEntry}</div>;
        case "rules":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip
                classNames={{
                  content: [
                    "py-2 px-4 shadow-xl",
                    "text-black bg-gradient-to-br from-white to-neutral-400",
                  ],
                }}
                content={renderToolTip(moneyMatch?.rules)}
              >
                <button className="rounded-full bg-gray-400 px-2 py-1 text-center">
                  i
                </button>
              </Tooltip>
            </div>
          );
        case "link":
          return (
            <div className="flex">
              <Button
                isDisabled={d2.valueOf() >= d1.valueOf() ? true : false}
                className="rounded-2xl  bg-green-600 p-2"
              >
                <Link href={`/money-match/${moneyMatch.matchId}`}>Accept</Link>
              </Button>
            </div>
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [],
  );

  const bottomContent = useMemo(() => {
    return (
      <div className="block items-center px-2 py-2">
        <div className="flex justify-between">
          <p>
            {currentSet[0]} out of {data.length} cash matches
          </p>
          <div className="flex gap-2">
            <Button
              isDisabled={pages === 1}
              size="sm"
              variant="flat"
              onPress={onPreviousPage}
            >
              Previous
            </Button>
            <Button
              isDisabled={pages === 1}
              size="sm"
              variant="solid"
              onPress={onNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }, [items.length, page, pages, currentSet]);

  return (
    <Table
      className="overflow-auto bg-white text-black"
      aria-label="Cash Match Finder"
      bottomContent={bottomContent}
      removeWrapper
      // onSelectionChange={setSelectedKeys}
    >
      <TableHeader columns={moneyMatchColumns}>
        {(column) => (
          <TableColumn key={column.key} className="text-center">
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={items}>
        {(item: Match) => (
          <TableRow key={item?.matchId}>
            {(columnKey) => (
              <TableCell className="text-center">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
