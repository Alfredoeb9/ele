"use client";
import { api } from "@/trpc/react";
import { SessionContextValue, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, Card, CardBody, Input, Button, useDisclosure } from "@nextui-org/react";
import { FaCog } from "react-icons/fa";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import UpdateUsernameModal from "@/app/_components/modals/UpdateUsernameModal";


export interface GamerTagsTypes {
  label: string;
  value: string;
}

export default function AccountSettings() {
  const utils = api.useUtils();
  const session = useSession();
  const router = useRouter();
  const [currentKey, setCurrentKey] = useState<string>("account_settings");
  const [changeUsername, setChangeUserName] = useState<string>("")
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
      setChangeUserName(getSingleUser.data.username as string)
      const list = [...gamerTags];

      getSingleUser.data.gamerTags.map((gamer, i) => {
        list[i].label = gamer.type;
        list[i].value = gamer.gamerTag;
        setGamerTags(list);
      });
    }
  }, [getSingleUser.data]);

  const appendGamerTag = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { ariaLabel, value } = e.target;

    const list = [...gamerTags];

    list[index].label = ariaLabel!;
    list[index].value = value;
    setGamerTags(list);
  };

  const updateGamerTag = api.user.updateUsersGamerTags.useMutation({
    onSuccess: async () => {
      await utils.user.getSingleUserWithAccountInfo.invalidate();
      toast("GamerTag has been updated", {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 35,
      });
    },

    onError: () => {
      toast("There was a problem updating your Gamer Tags", {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 36,
      });
    },
  });

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
              <Card className="w-[65%]">
                <CardBody>
                  <h3 className="pb-4 text-xl font-semibold">ACCOUNT INFO</h3>

                  <div className="flex w-full gap-6">
                    <div className="w-[49%]">
                      <div className="flex items-center">
                        <Input
                          type="text"
                          label="Username"
                          size="sm"
                          placeholder={session.data?.user.username}
                          onChange={(e) => setChangeUserName(e.target.value)}
                        />
                        
                        <CustomUpdateUsernameButton newUsername={changeUsername} oldUsername={session.data?.user.username as string} session={session} />
                      </div>

                      <p className="pt-4 text-sm text-neutral-400">
                        Updating username requires 5 credits. If you do not have enough credits, you will be sent to the 
                        buy credits page.
                      </p>
                    </div>

                    <div className="w-[50%]">
                      <div className="flex items-center">
                        <Input
                          type="text"
                          label="Email"
                          size="sm"
                          placeholder={session.data?.user.email as string}
                        />
                        <Button isIconOnly variant="light" className="ml-2">
                          <FaCog className="w-[50px] text-xl sm:text-2xl md:text-3xl" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center pt-4">
                    <Input
                      type="text"
                      label="Phone Number"
                      size="sm"
                      className="w-[35%]"
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
              <Card className="w-[65%]">
                <CardBody>
                  By entering your Game IDs, you acknowledge that you are the
                  owner of these accounts and that all your game IDs will be
                  publicly visible on CMG for match use.
                  <div className="flex flex-wrap gap-2">
                    {gamerTags.map((gameInput, i) => (
                      <div key={i} className="w-[49%] flex-wrap">
                        <Input
                          type="text"
                          label={gameInput.label}
                          onChange={(e) => appendGamerTag(e, i)}
                          placeholder={gameInput.value}
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    className="mt-4 w-32"
                    color="success"
                    disabled={ updateGamerTag.isPending }
                    onPress={() =>
                      updateGamerTag.mutate({
                        email: session.data?.user.email as string,
                        gamerTags: [...gamerTags],
                      })
                    }
                  >
                    Save Profile
                  </Button>
                </CardBody>
              </Card>
            </Tab>

            <Tab
              key="social_media"
              title={
                <div className="text-base text-neutral-200 sm:text-lg">
                  SOCIAL MEDIA
                </div>
              }
            >
              <Card className="w-[65%]">
                <CardBody>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
      
    </div>
  );
}


interface CustomeLeaveTeamButtonTypes {
  newUsername: string;
  oldUsername: string;
  session: SessionContextValue
}

function CustomUpdateUsernameButton({ oldUsername, newUsername, session }: CustomeLeaveTeamButtonTypes) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
      <>
          <Button isIconOnly variant="light" className="ml-2" onPress={() => {
          onOpen()
          }}>
              <FaCog className="w-[50px] text-xl sm:text-2xl md:text-3xl" />
            </Button>

          <UpdateUsernameModal open={isOpen} onOpenChange={onOpenChange} newUsername={newUsername} oldUsername={oldUsername}  />
      </>
  )
}