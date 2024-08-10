"use client";
import { type ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { api } from "@/trpc/react";
import { Card, CardBody, Input, Button } from "@nextui-org/react";

export interface GamerTagsTypes {
  label: string;
  value: string;
}

interface GamerTagsTabTypes {
  gamerTags: GamerTagsTypes[];
  setGamerTags: (value: GamerTagsTypes[]) => void;
}
export default function GamerTagTab({
  gamerTags,
  setGamerTags,
}: GamerTagsTabTypes) {
  const utils = api.useUtils();
  const session = useSession();

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

  return (
    <Card className="w-full sm:w-[65%]">
      <CardBody>
        By entering your Game IDs, you acknowledge that you are the owner of
        these accounts and that all your game IDs will be publicly visible on
        CMG for match use.
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
          disabled={updateGamerTag.isPending}
          onPress={() =>
            updateGamerTag.mutate({
              email: session.data?.user.email!,
              gamerTags: [...gamerTags],
            })
          }
        >
          Save Profile
        </Button>
      </CardBody>
    </Card>
  );
}
