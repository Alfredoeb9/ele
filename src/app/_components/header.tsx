/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import { FaBell } from "react-icons/fa";
import type { NotificationType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import AddCashModal from "./modals/AddCashModal";
import OnboardToStripe from "./modals/OnboardToStripe";

export default function Header() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const utils = api.useUtils();
  const [modalPath, setModalPath] = useState("");
  const session = useSession();

  const router = useRouter();

  const sessionUser = session.data?.user;

  const currentUser = api.user.getSingleUser.useQuery(
    { email: session.data?.user?.email! },
    { enabled: session.status === "authenticated" ? true : false },
  );

  // const CustomToastWithLink = () => (
  //   <div>
  //     There was a problem adding cash to account please create a{" "}
  //     <Link href="/tickets" className="text-blue-600 hover:text-blue-500">
  //       Tickets
  //     </Link>{" "}
  //     in which one of our team members will help.
  //   </div>
  // );

  if (currentUser.isError) {
    toast(`There was a problem getting user data`, {
      position: "bottom-right",
      autoClose: 3000,
      closeOnClick: true,
      draggable: false,
      type: "error",
      toastId: 10,
    });
  }

  const userData = currentUser?.data;

  const usersNotifications = api.user.getNotifications.useQuery(
    { id: session.data?.user?.id! },
    {
      enabled: currentUser.isSuccess,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  );

  if (usersNotifications.isError) {
    toast("Notification Service is down, please reach out to admin", {
      position: "bottom-right",
      autoClose: 3000,
      closeOnClick: true,
      draggable: false,
      type: "error",
      toastId: 8,
    });
  }

  if (userData && userData.credits === undefined) {
    toast(
      `There was problem retrieving your credits, please refresh and try agian. If this problem presist please reach out to customer service`,
      {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 3,
      },
    );
  }

  const acceptRequest = api.user.acceptFriendRequest.useMutation({
    onSuccess: async () => {
      await utils.user.getNotifications.invalidate();
      await utils.user.getUserWithFriends.invalidate();
      toast("Request has been accepted", {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 18,
      });
    },

    onError: () => {
      toast("Error on accepting friend request, please try again", {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 20,
      });
    },
  });

  const messageRead = api.user.messageRead.useMutation({
    onSuccess: async () => {
      await utils.user.getNotifications.invalidate();
    },

    onError: () => {
      toast("Error setting message as read, please create a support ticket", {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 29,
      });
    },
  });

  const declineFriendRequest = api.user.declineRequest.useMutation({
    onSuccess: async () => {
      await utils.user.getNotifications.invalidate();
      toast("Friend request declined", {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 21,
      });
    },

    onError: () => {
      toast("Error on declining friend request, please try again", {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 22,
      });
    },
  });

  // const withdrawCash = api.user.updateUsersStripeData.useMutation({
  //   onSuccess: async () => {
  //     toast("Cash has been withdrawn", {
  //       position: "bottom-right",
  //       autoClose: 3000,
  //       closeOnClick: true,
  //       draggable: false,
  //       type: "success",
  //       toastId: 71,
  //     });
  //   },

  //   onError: (error) => {
  //     toast("Error withdrawing cash", {
  //       position: "bottom-right",
  //       autoClose: 3000,
  //       closeOnClick: true,
  //       draggable: false,
  //       type: "success",
  //       toastId: 72,
  //     });
  //   },
  // });

  const sub = userData?.subscription;
  const stripeAccount = userData?.stripeAccount;

  return (
    <header className="nav">
      <nav className="flex h-16 w-full items-center justify-between rounded-b-lg bg-gray-200 px-4 dark:bg-gray-800">
        <nav className="flex h-12 items-center gap-x-4">
          <Link
            className="text-md roun rounded-lg bg-gradient-to-br from-red-700 to-sky-800 px-3 py-1 font-semibold text-zinc-300"
            href={"/"}
          >
            <span>E</span>
            <span>L</span>
            <span>E</span>
          </Link>
          <Link className="text-md font-bold text-zinc-900" href="/">
            Home
          </Link>
          {session.status === "authenticated" && (
            <Link
              className="text-md font-bold text-zinc-900"
              href={`/profile/${sessionUser?.username}`}
            >
              Profile
            </Link>
          )}
        </nav>
        <div>
          {session.status !== "authenticated" ? (
            <div className="flex flex-row gap-1">
              <Link
                href={`/sign-in`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-4 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
              >
                Sign in
              </Link>
              <Link
                href={`/sign-up`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <div>
                {sub?.id === null ||
                  (sub?.id === "" && (
                    <Link
                      href={"/subscription"}
                      className="mr-2 hidden rounded-xl bg-cyan-500 px-2 py-2 font-semibold text-white sm:inline-flex"
                    >
                      Upgrade
                    </Link>
                  ))}

                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button variant="bordered">
                      <FaBell />
                      {usersNotifications?.data?.length}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Notification Actions"
                    closeOnSelect={false}
                  >
                    {(usersNotifications?.data as NotificationType[])?.map(
                      (notification: {
                        userName: string;
                        from: string;
                        id: string;
                        isRead: boolean | null;
                        type: string;
                        metaData: any;
                      }) => (
                        <DropdownItem
                          key={notification?.id + notification?.userName}
                          textValue="notifications"
                        >
                          {!notification.isRead && (
                            <span className="absolute -left-1 inline-block h-[10px] w-[10px] rounded-full bg-blue-500"></span>
                          )}

                          <div
                            onClick={() => {
                              if (notification.isRead) return null;

                              messageRead.mutate({
                                isRead: true,
                                notificationId: notification.id,
                              });
                            }}
                          >
                            {notification.type === "invite" && (
                              <>
                                {notification.userName} wants to be your friend
                              </>
                            )}
                            {notification.type === "team-invite" && (
                              <>
                                {notification.userName} wants you to join team{" "}
                                {notification.metaData.teamName}
                              </>
                            )}

                            <div className="flex justify-end gap-2">
                              <Button
                                variant="solid"
                                size="sm"
                                color="success"
                                disabled={
                                  acceptRequest.isPending ||
                                  declineFriendRequest.isPending
                                }
                                onPress={() => {
                                  acceptRequest.mutate({
                                    userId: sessionUser?.id!,
                                    targetId: notification.from,
                                    id: notification.id,
                                    type: notification.type,
                                    teamId: notification.metaData.teamId,
                                    game: notification.metaData.game,
                                    teamName: notification.metaData.teamName,
                                    targetEmail: sessionUser?.email!,
                                    userName: sessionUser?.username!,
                                  });
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="solid"
                                size="sm"
                                color="danger"
                                disabled={
                                  acceptRequest.isPending ||
                                  declineFriendRequest.isPending
                                }
                                onPress={() => {
                                  declineFriendRequest.mutate({
                                    userId: session?.data?.user?.id,
                                    targetId: notification.from,
                                    notificationID: notification.id,
                                  });
                                }}
                              >
                                Decline
                              </Button>
                            </div>
                          </div>
                        </DropdownItem>
                      ),
                    )}
                  </DropdownMenu>
                </Dropdown>
              </div>

              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="text-elg-white transition-transform"
                    classNames={{
                      base: "bg-elg-red",
                      // img: "bg-elg-white",
                      icon: "text-elg-white",
                    }}
                    // color="success"
                    name={sessionUser?.firstName + " " + sessionUser?.lastName}
                    size="sm"
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Profile Actions"
                  disabledKeys={[
                    "profile",
                    "credits",
                    "cash_balance",
                    "stats",
                    "help_and_feedback",
                  ]}
                >
                  <DropdownItem
                    key="profile"
                    textValue={sessionUser?.email! || "example@gmail.com"}
                    className="h-14 gap-2"
                  >
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{sessionUser?.email}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="credits"
                    textValue={
                      userData !== undefined &&
                      currentUser?.isSuccess &&
                      (userData as any).credits
                    }
                  >
                    <span className="font-black">Credits: </span>{" "}
                    <span className="font-semibold">
                      {userData == undefined || currentUser.isError
                        ? "Err"
                        : userData?.credits}
                    </span>
                  </DropdownItem>
                  <DropdownItem
                    key="cash_balance"
                    textValue={stripeAccount?.balance?.toString() || "0"}
                    className="h-14 gap-2"
                  >
                    <p className="font-semibold">Cash Balance:</p>
                    <p className="font-semibold">
                      {stripeAccount?.balance || "Err"}
                    </p>
                  </DropdownItem>
                  <DropdownItem
                    key="settings"
                    textValue="my settings"
                    href="/account-manage"
                  >
                    My Settings
                  </DropdownItem>

                  <DropdownItem
                    key="team_settings"
                    textValue="team-settings"
                    href="/team-settings"
                  >
                    Team Settings
                  </DropdownItem>
                  <DropdownItem
                    key="leaderboards"
                    textValue="leaderboards"
                    href="/leaderboards"
                  >
                    Leaderboards
                  </DropdownItem>
                  <DropdownItem
                    key="friends"
                    textValue="friends"
                    href="/friends"
                  >
                    Friends
                  </DropdownItem>
                  <DropdownItem
                    key="add_cash"
                    textValue="pricing"
                    onPress={async () => {
                      if (
                        stripeAccount !== undefined &&
                        stripeAccount !== null
                      ) {
                        setModalPath("add_cash");
                        onOpen();
                      } else {
                        setModalPath("stripe_connect_onboarding");
                        onOpen();
                      }
                    }}
                  >
                    Add Cash
                  </DropdownItem>

                  {/* <DropdownItem
                    key="add_cash"
                    textValue="pricing"
                    // href={`${process.env.STRIPE_BASE_API}/v1/accounts`}
                    // onPress={() =>
                    //   withdrawCash.mutate({
                    //     userId: sessionUser?.id!,
                    //     userName: sessionUser?.username!,
                    //     stripeId: "jkljlj",
                    //   })
                    // }
                  >
                    Withdraw Cash
                  </DropdownItem> */}
                  <DropdownItem
                    key="buy_credits"
                    textValue="pricing"
                    href="/pricing"
                  >
                    Buy Credits
                  </DropdownItem>
                  <DropdownItem
                    key="upgrade"
                    textValue="upgrade"
                    className="mt-1 bg-cyan-500 text-white transition-all"
                    href="/subscription"
                  >
                    Upgrade
                  </DropdownItem>
                  <DropdownItem
                    key="help_and_feedback"
                    textValue="help_&_feedback"
                  >
                    Help & Feedback
                  </DropdownItem>

                  <DropdownItem
                    key="tickets"
                    textValue="tickets"
                    href="/tickets"
                  >
                    Tickets
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    textValue="log_out"
                    onPress={async () => {
                      await signOut();
                      router.push("/");
                    }}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </div>
      </nav>
      <ToastContainer containerId={"header-toast"} />
      {/* {error && <ErrorComponent message="There was problem retrieving your credits, please refresh and try agian. If this problem presist please reach out to customer service"/>} */}
      {modalPath === "add_cash" && isOpen && (
        <AddCashModal
          open={isOpen}
          onOpenChange={onOpenChange}
          userId={sessionUser?.id!}
        />
      )}

      {modalPath === "stripe_connect_onboarding" && isOpen && (
        <OnboardToStripe
          open={isOpen}
          onOpenChange={onOpenChange}
          userId={sessionUser?.id!}
        />
      )}
    </header>
  );
}
