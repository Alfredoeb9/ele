"use client";
import { api } from "@/trpc/react";
import { SessionContextValue, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { FaCog } from "react-icons/fa";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomUpdateUserEmailButton from "@/app/_components/modals/modalButtons/CustomUpdateEmailButton";
import CustomUpdateUsernameButton from "@/app/_components/modals/modalButtons/CutsomUpdateUserName";
import SocialMediaTab from "./SocialMediaTab";
import GamerTagTab from "./GamerTagTab";

export interface GamerTagsTypes {
  label: string;
  value: string;
}

export default function AccountSettings() {
  const session = useSession();
  const router = useRouter();
  const [currentKey, setCurrentKey] = useState<string>("account_settings");
  const [changeUsername, setChangeUserName] = useState<string>("");
  const [changeEmail, setChangeEmail] = useState<string>("");
  const [gamerTags, setGamerTags] = useState<Array<GamerTagsTypes>>([
    { label: "PSN ID", value: "" },
    { label: "Xbox Live ID", value: "" },
    { label: "EPIC Display Name", value: "" },
    { label: "Battle.net", value: "" },
    { label: "Switch Friend Code", value: "" },
    { label: "Activision ID", value: "" },
    { label: "2K ID", value: "" },
    { label: "Steam Friend Code", value: "" },
  ]);

  if (session.status === "unauthenticated") router.push("/");

  // useEffect(() => {
  //     if (gamerTags.length < currentInput) {
  //         setGamerTags((oldTags) => [...oldTags, {label: "", value: ""}])
  //     }
  // }, [currentInput, gamerTags])

  const getSingleUser = api.user.getSingleUserWithAccountInfo.useQuery(
    { email: session.data?.user.email! },
    { enabled: session.status === "authenticated" },
  );

  useEffect(() => {
    // would only be logged when words is changed.
    if (getSingleUser.data && getSingleUser.data?.gamerTags.length > 0) {
      setChangeUserName(getSingleUser.data.username!);
      const list = [...gamerTags];

      getSingleUser.data.gamerTags.map(
        (gamer: { type: string; gamerTag: string }, i: number) => {
          list[i].label = gamer.type;
          list[i].value = gamer.gamerTag;
          setGamerTags(list);
        },
      );
    }
  }, [getSingleUser.data]);

  useEffect(() => {
    const doesHrefHaveId = window.location.href.split("#");
    if (doesHrefHaveId.length === 2) {
      if (doesHrefHaveId[1] == "connect-accounts") {
        return setCurrentKey("gamer_tags");
      }
      return;
    }

    return () => {
      setCurrentKey("");
    };
  }, [router]);

  if (getSingleUser.isError === undefined) {
    router.push("/");
    return null;
  }

  if (
    getSingleUser.data &&
    session.data &&
    getSingleUser.data?.id !== session.data?.user.id
  ) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="container m-auto py-4">
      <h1 className="text-xl text-white sm:text-2xl md:text-4xl">
        Account Settings
      </h1>

      <div className="text-white">
        <div className="flex flex-col">
          <Tabs
            aria-label="Options"
            color="primary"
            variant="underlined"
            classNames={{ tab: "text-lg sm:text-xl" }}
            selectedKey={currentKey}
            onSelectionChange={(e) => setCurrentKey(e.toString())}
          >
            <Tab
              key="account_settings"
              id="account-settings"
              title={
                <div className="text-base text-neutral-200 sm:text-lg">
                  ACCOUNT SETTINGS
                </div>
              }
            >
              <Card className="w-full sm:w-[65%]">
                <CardBody>
                  <h3 className="pb-4 text-xl font-semibold">ACCOUNT INFO</h3>

                  <div className="block w-full gap-6 sm:flex">
                    <div className="w-[95%] sm:w-[49%]">
                      <div className="flex items-center">
                        <Input
                          type="text"
                          label="Username"
                          size="sm"
                          placeholder={session.data?.user.username}
                          onChange={(e) => setChangeUserName(e.target.value)}
                        />

                        <CustomUpdateUsernameButton
                          newUsername={changeUsername}
                          oldUsername={session.data?.user.username!}
                          session={session}
                          credits={getSingleUser.data?.credits}
                        />
                      </div>

                      <p className="w-[90%] pb-4 pt-2 text-sm text-neutral-400 sm:pt-4">
                        Updating username requires{" "}
                        <span className="font-semibold text-red-600">
                          5 credits
                        </span>
                        . If you do not have enough credits, you will be sent to
                        the buy credits page.
                      </p>
                    </div>

                    <div className="w-[95%] sm:w-[50%]">
                      <div className="flex items-center">
                        <Input
                          type="text"
                          label="Email"
                          size="sm"
                          placeholder={session.data?.user.email!}
                          onChange={(e) => setChangeEmail(e.target.value)}
                        />
                        <CustomUpdateUserEmailButton
                          newEmail={changeEmail}
                          oldEmail={session.data?.user.email!}
                          session={session}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center pt-4">
                    <Input
                      type="text"
                      label="Phone Number"
                      size="sm"
                      className="w-[95%] sm:w-[35%]"
                      placeholder={"(000) 000-0000"}
                    />
                    <Button variant="bordered" color="success" className="ml-2">
                      Save
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab
              key="gamer_tags"
              id="connect-accounts"
              title={
                <div className="text-base text-neutral-200 sm:text-lg">
                  GAMER TAGs/ IDs
                </div>
              }
            >
              <GamerTagTab gamerTags={gamerTags} setGamerTags={setGamerTags} />
            </Tab>

            <Tab
              key="social_media"
              title={
                <div className="text-base text-neutral-200 sm:text-lg">
                  SOCIAL MEDIA
                </div>
              }
            >
              <SocialMediaTab />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
