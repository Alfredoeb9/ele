"use client";
import { type ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { api } from "@/trpc/react";
import { Card, CardBody, Input, Button } from "@nextui-org/react";

export interface SocialMediaTagsTypes {
  label: string;
  value: string;
}

interface SocialMediaTabTypes {
  socialTags: SocialMediaTagsTypes[];
  setSocialTags: (value: SocialMediaTagsTypes[]) => void;
}

export default function SocialMediaTab({
  socialTags,
  setSocialTags,
}: SocialMediaTabTypes) {
  const utils = api.useUtils();
  const session = useSession();

  //   const appendSocialMedia = (
  //     e: ChangeEvent<HTMLInputElement>,
  //     index: number,
  //   ) => {
  //     const { ariaLabel, value } = e.target;

  //     const list = [...socialTags];

  //     list[index].label = ariaLabel!;
  //     list[index].value = value;
  //     setSocialTags(list);
  //   };

  //   const updateSocialMedia = api.user.updateUsersGamerTags.useMutation({
  //     onSuccess: async () => {
  //       await utils.user.getSingleUserWithAccountInfo.invalidate();
  //       toast("GamerTag has been updated", {
  //         position: "bottom-right",
  //         autoClose: 5000,
  //         closeOnClick: true,
  //         draggable: false,
  //         type: "success",
  //         toastId: 35,
  //       });
  //     },

  //     onError: () => {
  //       toast("There was a problem updating your Gamer Tags", {
  //         position: "bottom-right",
  //         autoClose: 5000,
  //         closeOnClick: true,
  //         draggable: false,
  //         type: "error",
  //         toastId: 36,
  //       });
  //     },
  //   });

  return (
    <Card className="w-full sm:w-[65%]">
      <CardBody>
        By entering your Social Media IDs, you acknowledge that you are the
        owner of these accounts and that all your game IDs will be publicly
        visible on your ELE profile.
        <div className="flex flex-wrap gap-2">
          {socialTags.map((socialInputs, i) => (
            <div key={i} className="w-[49%] flex-wrap">
              <Input
                type="text"
                label={socialInputs.label}
                // onChange={(e) => appendSocialMedia(e, i)}
                placeholder={socialInputs.value}
              />
            </div>
          ))}
        </div>
        <Button
          className="mt-4 w-32"
          color="success"
          //   disabled={updateSocialMedia.isPending}
          //   onPress={() =>
          //     updateSocialMedia.mutate({
          //       email: session.data?.user.email!,
          //       gamerTags: [...socialTags],
          //     })
          //   }
        >
          Save Profile
        </Button>
      </CardBody>
    </Card>
  );
}
