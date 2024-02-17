"use client";
// import React, { useCallback, useMemo, useState } from "react";
// import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps, getKeyValue, Button} from "@nextui-org/react";
// import {EditIcon} from "./EditIcon";
// import {DeleteIcon} from "./DeleteIcon";
// import {EyeIcon} from "./EyeIcon";
// import {columns, users} from "./data";
// import Link from "next/link";
// import { api } from "@/trpc/react";
// import { useSession } from "next-auth/react";

// const statusColorMap: Record<string, ChipProps["color"]>  = {
//   active: "success",
//   paused: "danger",
//   vacation: "warning",
// };

// type User = typeof users[0];

// export default function Friends() {
//     const session = useSession()
//     const [rowsPerPage, setRowsPerPage] = useState<number>(5);
//     const [page, setPage] = useState<number>(1);
//     const [currentSet, setCurrentSet] = useState<number[]>([0,0])
//     const [error, setError] = useState("")

//     const userFriendData = api.user.getUserWithFriends.useQuery({ id: session.data && session.data.user.id as string | any})

//     console.log("user", userFriendData)
//     // if(!userFriendData.data) {
//     //     console.log("help")
//     // }

//     // if (userFriendData.isError) {
//     //     setError("No Friends")

//     // }

//     const items = useMemo(() => {
//         const start = (page - 1) * rowsPerPage;
//         const end = start + rowsPerPage;

//         setCurrentSet([start, end])
        
//         return users.slice(start, end);
//     }, [page, users, rowsPerPage]);


//     const pages = Math.ceil(users.length / rowsPerPage);

//     console.log("pages", pages)

//     const onNextPage = useCallback(() => {
//         if (page < pages) {
//             setPage(page + 1);
//         }
//     }, [page, pages]);

//     const onPreviousPage = useCallback(() => {
//         if (page > 1) {
//             setPage(page - 1);
//         }
//     }, [page]);

//     const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
//         const cellValue = user[columnKey as keyof User];

//         switch (columnKey) {
//         case "name":
//             return (
//             <User
//                 avatarProps={{radius: "lg", src: user.avatar}}
//                 description={user.email}
//                 name={cellValue}
//             >
//                 {user.email}
//             </User>
//             );
//         case "role":
//             return (
//             <div className="flex flex-col">
//                 <p className="text-bold text-sm capitalize">{cellValue}</p>
//                 <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
//             </div>
//             );
//         case "status":
//             return (
//             <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
//                 {cellValue}
//             </Chip>
//             );
//         case "actions":
//             return (
//             <div className="relative flex items-center gap-2">
//                 <Tooltip content="Details">
//                 <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
//                     {/* <Link href={`/user/${friend.id}`}><EyeIcon /></Link> */}
//                 </span>
//                 </Tooltip>
//                 <Tooltip content="Edit user">
//                 <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
//                     <EditIcon />
//                 </span>
//                 </Tooltip>
//                 <Tooltip color="danger" content="Delete user">
//                 <span className="text-lg text-danger cursor-pointer active:opacity-50">
//                     <DeleteIcon />
//                 </span>
//                 </Tooltip>
//             </div>
//             );
//         default:
//             return cellValue;
//         }
//     }, []);

//     const bottomContent = useMemo(() => {
//         return (
//             <div className="py-2 px-2 block items-center">
//                 <div className="flex justify-between">
//                     <p>{currentSet[0]} out of {users.length} cash matches</p>
//                     <div className="flex gap-2">
//                         <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
//                             Previous
//                         </Button>
//                         <Button isDisabled={pages === 1} size="sm" variant="solid" onPress={onNextPage}>
//                             Next
//                         </Button>
//                     </div>
                    
//                 </div>
//             </div>
//         );
//     }, [ items?.length, page, pages, currentSet]);

//     return (
//         <div>
//             <h1 className="text-2xl md:text-3xl lg:text-4xl text-white">Friends List</h1>
//             <Table 
//                 aria-label="Friends list" 
//                 bottomContent={bottomContent}
//             >
//                 <TableHeader columns={columns}>
//                     {(column) => (
//                     <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
//                         {column.name}
//                     </TableColumn>
//                     )}
//                 </TableHeader>
//                 <TableBody items={users}>
//                     {(item) => (
//                     <TableRow key={item.id}>
//                         {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
//                     </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//         </div>
        
//     );
// }


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
    Selection,
    ChipProps,
    SortDescriptor,
    User,
    useDisclosure
  } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { friendsVisibleColumns, statusOptions, friendsColumns } from "@/lib/sharedData";
import Link from "next/link";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { SearchIcon } from "./SearchIcon";
import type { Users } from "@/server/db/schema"
import RemoveFriendModal from "../_components/RemoveFriendModal";
  
  const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };  
 
  export default function Friends() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const session = useSession();
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(friendsVisibleColumns));
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
    const [error, setError] = useState("");
    const utils = api.useUtils()

    const userFriendData = api.user.getUserWithFriends.useQuery({ id: session.data?.user.id as string }, { enabled: session.status === "authenticated" ? true : false})
  
    const pages = Math.ceil(userFriendData.data?.length as number / rowsPerPage);
  
    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
      let filteredUsers = userFriendData.data;
      
      if (hasSearchFilter) {
        filteredUsers = filteredUsers?.filter((user) => 
          user[0].username?.toLowerCase().includes(filterValue.toLowerCase())
        )
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
    }, [page, filteredItems, rowsPerPage]);


    const sortedItems = useMemo(() => {
      return items?.sort((a: Users | any, b: Users | any) => {
        const first = a[sortDescriptor.column as keyof Users] as number;
        const second = b[sortDescriptor.column as keyof Users] as number;
        const cmp = first < second ? -1 : first > second ? 1 : 0;
  
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    }, [sortDescriptor, items]);
 
    const headerColumns = useMemo(() => {
      if (visibleColumns === "all") return friendsColumns;
  
      return friendsColumns.filter((column) => Array.from(visibleColumns).includes(column.key));
    }, [visibleColumns, userFriendData.data]);
  
    const renderCell = useCallback((user: any, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof Users];
  
      switch (columnKey) {
        case "id":
          return (
            <User
              avatarProps={{radius: "full", size: "sm", src: user.avatar}}
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
              className="capitalize border-none gap-1 text-default-600"
              color={statusColorMap[user.status]}
              size="sm"
              variant="dot"
            >
              {cellValue}
            </Chip>
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
                  <DropdownItem><Link href={`/user/${user.id}`}>View</Link></DropdownItem>
                  <DropdownItem 
                    onPress={ () => { 
                      onOpen()
                      setUsername(user.username)
                      setEmail(user.email)
                      setUserId(user.id)
                    }}
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
    
  
    const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    }, []);
  
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
          <div className="flex justify-between gap-3 items-end">
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
              >
                <Link href={"/manage"}>
                  Add New Friend
                </Link>
                
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">Total {items?.length} users</span>
            <label className="flex items-center text-default-400 text-small">
              Rows per page:
              <select
                className="bg-transparent outline-none text-default-400 text-small"
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
        <div className="py-2 px-2 flex justify-between items-center">
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

    if (userFriendData.data === undefined) return null
  
    return (
      <div className="flex h-full flex-col items-start justify-center place-content-center m-auto max-w-7xl px-10 mt-2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">My Friends</h1>
        <Table
          isCompact
          removeWrapper
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          checkboxesProps={{
            classNames: {
              wrapper: "after:bg-foreground after:text-background text-background",
            },
          }}
          className="bg-white p-3"
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
                {(columnKey) => <TableCell>{renderCell(item[0], columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <RemoveFriendModal open={isOpen} onOpenChange={onOpenChange} teamName={usernameState} email={email} id={userId} />
      </div>
    );
  }
  