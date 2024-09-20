"use client";
import { api } from "@/trpc/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/react";
import { leaderBoardColumns } from "@/lib/sharedData";

export default function Leaderboards() {
  const columns = leaderBoardColumns;
  const leaderboardData = api.user.getAllUsersRecords.useQuery();

  if (!leaderboardData.data) {
    return <Spinner size="lg" />;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto w-full max-w-[960px]  py-10">
        <h1 className="pb-5 text-6xl font-bold">Leaderboard</h1>
        <Table aria-label="ELE Leaderboard Page">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={leaderboardData.data}
            loadingContent={<Spinner size="lg" label="Loading..." />}
          >
            {(item) => (
              <TableRow key={item.userId}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
