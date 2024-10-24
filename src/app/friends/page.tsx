"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  User,
  useDisclosure,
} from "@nextui-org/react";
import type { Selection, ChipProps, SortDescriptor } from "@nextui-org/react";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import {
  friendsVisibleColumns,
  statusOptions,
  friendsColumns,
} from "@/lib/sharedData";
import { VerticalDotsIcon } from "../../../public/svg/VerticalDotsIcon";
import { SearchIcon } from "./SearchIcon";
import type { UsersType } from "@/server/db/schema";
import RemoveFriendModal from "../_components/modals/RemoveFriendModal";
import SendFriendRequest from "../_components/modals/SendFriendRequest";
// import { useRouter } from "next/navigation";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function Friends() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const session = useSession();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(friendsVisibleColumns),
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "username",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [usernameState, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [modalPath, setModalPath] = useState<string>("");
  // const [error, setError] = useState("");
  // const router = useRouter();
  // const utils = api.useUtils()

  // if (session.status === "unauthenticated") router.push("/sign-in");

  const userFriendData = api.user.getUserWithFriends.useQuery(
    { id: session.data?.user.id! },
    { enabled: session.status === "authenticated" ? true : false },
  );

  const pages = Math.ceil(userFriendData.data?.length! / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredUsers = userFriendData.data;

    if (hasSearchFilter) {
      filteredUsers = filteredUsers?.filter((user) =>
        user[0].username?.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredUsers = filteredUsers?.filter((user) =>
    //     Array.from(statusFilter).includes(user?.status),
    //   );
    // }

    return filteredUsers;
  }, [userFriendData.data, filterValue, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems?.slice(start, end);
  }, [page, filteredItems, rowsPerPage, hasSearchFilter]);

  const sortedItems = useMemo(() => {
    return items?.sort((a: UsersType | any, b: UsersType | any) => {
      const first = a[sortDescriptor.column as keyof UsersType] as number;
      const second = b[sortDescriptor.column as keyof UsersType] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return friendsColumns;

    return friendsColumns.filter((column) =>
      Array.from(visibleColumns).includes(column.key),
    );
  }, [visibleColumns, userFriendData.data]);

  const renderCell = useCallback(
    (user: any, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UsersType];

      switch (columnKey) {
        case "id":
          return (
            <User
              avatarProps={{ radius: "full", size: "sm", src: user.avatar }}
              classNames={{
                description: "text-default-500",
              }}
              // description={user.email}
              name={user.username}
            />
          );
        case "username":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
              {/* <p className="text-bold text-tiny capitalize text-default-500">{user.team}</p> */}
            </div>
          );
        case "email":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{cellValue}</p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="gap-1 border-none capitalize text-default-600"
              color={statusColorMap[user.status]}
              size="sm"
              variant="dot"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-end gap-2">
              <Dropdown className="border-1 border-default-200 bg-background">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem href={`/profile/${user?.username}`}>
                    View
                  </DropdownItem>
                  <DropdownItem
                    onPress={() => {
                      onOpen();
                      setUsername(user.username);
                      setEmail(user.email);
                      setUserId(user.id);
                    }}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [userFriendData.data],
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by username..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  // endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  // endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
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
                {friendsColumns.map((column) => (
                  <DropdownItem key={column.key} className="capitalize">
                    {column.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-foreground text-background"
              // endContent={<PlusIcon />}
              size="sm"
              onPress={() => {
                setModalPath("friend");
                onOpen();
              }}
            >
              Add New Friend
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {items?.length} users
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
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    userFriendData.data?.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items?.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items?.length, page, pages, hasSearchFilter]);

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  const handleModalPath = useCallback((path: string) => {
    switch (path) {
      case "friend":
        setModalPath("friend");
        break;
      case "remove friend":
        setModalPath("remove friend");
        break;
      default:
        setModalPath("");
        break;
    }
  }, []);

  if (userFriendData.data === undefined) return null;

  return (
    <div className="m-auto mt-2 flex h-full max-w-7xl flex-col place-content-center items-start justify-center px-2 sm:px-10">
      <h1 className="mb-2 text-4xl font-bold text-white md:text-3xl lg:text-4xl">
        My Friends
      </h1>
      <Table
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        className="overflow-auto bg-white p-3"
        classNames={classNames}
        // selectedKeys={selectedKeys}
        // selectionMode="multiple"
        // sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item[0].id}>
              {(columnKey) => (
                <TableCell>{renderCell(item[0], columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {modalPath === "friend" ? (
        <SendFriendRequest
          open={isOpen}
          onOpenChange={onOpenChange}
          handleModalPath={handleModalPath}
        />
      ) : (
        <RemoveFriendModal
          open={isOpen}
          onOpenChange={onOpenChange}
          handleModalPath={handleModalPath}
          teamName={usernameState}
          email={email}
          id={userId}
        />
      )}
    </div>
  );
}
