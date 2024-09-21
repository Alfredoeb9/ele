"use client";
import { api } from "@/trpc/react";
import {
  Spinner,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { leaderBoardColumns } from "@/lib/sharedData";
import { type SetStateAction, useMemo, useState } from "react";

export default function Leaderboards() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  const columns = leaderBoardColumns;
  const leaderboardData = api.user.getAllUsersRecords.useQuery();

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return leaderboardData.data?.slice(start, end);
  }, [page, leaderboardData.data]);

  if (!leaderboardData.data) {
    return <Spinner size="lg" />;
  }

  const pages = Math.ceil(leaderboardData.data.length / rowsPerPage);

  return (
    <div className="bg-white">
      <div className="mx-auto w-full max-w-[960px]  py-10">
        <h1 className="pb-5 text-6xl font-bold">Leaderboard</h1>
        <Table
          aria-label="ELE Leaderboard Page"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page: SetStateAction<number>) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={items}
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
