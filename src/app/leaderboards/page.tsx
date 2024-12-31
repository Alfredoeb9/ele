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
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { leaderBoardColumns } from "@/lib/sharedData";
import { type SetStateAction, useMemo, useState, useCallback } from "react";
import { type Key } from "@react-types/shared";
import { toast } from "react-toastify";
import { type UsersRecordType } from "@/server/db/schema";
import { SearchIcon } from "public/svg/SearchIcon";
import { ChevronDownIcon } from "public/svg/CheveroIcon";
import { capitalize } from "@/lib/utils/capitalizeString";

export const statusOptions = [
  { name: "Tournament", uid: "tournament" },
  { name: "Money Match", uid: "money-match" },
  { name: "Regular Match", uid: "regular-match" },
];

export const teamSizeOptions = [
  { name: "Solo", uid: "solo" },
  { name: "Duos", uid: "duos" },
  { name: "Trios", uid: "trios" },
  { name: "Quads", uid: "quads" },
];

export default function Leaderboards() {
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [statusFilter, setStatusFilter] = useState<Set<React.Key> | "all">(
    "all",
  );

  const [teamSizeFilter, setTeamSizeFilter] = useState<Set<React.Key> | "all">(
    "all",
  );
  const [page, setPage] = useState(1);
  const columns = leaderBoardColumns;
  const { data, isError, isLoading } = api.user.getAllUsersRecords.useQuery();

  if (isError) {
    toast(
      "There was an error was this service, please refresh or submit a support ticket",
      {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 96,
      },
    );
  }

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredUsers: UsersRecordType[] = data ?? [];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.userName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.matchType?.replace(/ /g, "-")!),
      );
    }

    return filteredUsers;
  }, [data, filterValue, hasSearchFilter, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems?.slice(start, end);
  }, [page, rowsPerPage, filteredItems]);

  const onRowsPerPageChange = useCallback((e: { target: { value: any } }) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: SetStateAction<string>) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />

          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Team Size
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={teamSizeFilter as Iterable<Key>}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setTeamSizeFilter(
                    keys === "all"
                      ? "all"
                      : new Set(keys as Iterable<React.Key>),
                  )
                }
              >
                {teamSizeOptions.map((teamSize) => (
                  <DropdownItem key={teamSize.uid} className="capitalize">
                    {capitalize(teamSize.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter as Iterable<Key>}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  console.log("keys", keys);
                  setStatusFilter(
                    keys === "all"
                      ? "all"
                      : new Set(keys as Iterable<React.Key>),
                  );
                }}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
            </Button> */}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {data?.length} users
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    statusFilter,
    data?.length,
    onRowsPerPageChange,
    onClear,
  ]);

  if (!data) {
    return <Spinner size="lg" />;
  }

  if (isLoading) {
    <Spinner label="Loading..." color="warning" />;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto w-full max-w-[960px] py-10">
        <h1 className="pb-5 text-6xl font-bold">Leaderboard</h1>
        <Table
          aria-label="ELE Leaderboard Page"
          topContent={topContent}
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
