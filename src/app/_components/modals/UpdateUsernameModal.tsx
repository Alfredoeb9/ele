import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface SendTeamInvite {
  open: boolean;
  onOpenChange: () => void;
  newUsername: string;
  oldUsername: string;
}

export default function SendTeamInvite({
  open,
  onOpenChange,
  oldUsername,
  newUsername,
}: SendTeamInvite) {
  const { onClose } = useDisclosure();
  const [size] = useState<string>("md");
  const [userName, setUserName] = useState<string>("");

  const utils = api.useUtils();

  const session = useSession();

  const updateUsername = api.user.updateUsersUsername.useMutation({
    onSuccess: async () => {
      await session.update({ username: newUsername });
      await utils.user.getSingleUserWithAccountInfo.invalidate();
      toast("Username has been updated", {
        position: "bottom-right",
        autoClose: 3400,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 55,
      });

      setTimeout(() => {
        onClose();
      }, 3500);
    },

    onError: () => {
      toast("There was an error updating your username", {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 54,
      });
    },
  });

  return (
    <>
      <Modal
        size={size as "md"}
        isOpen={open}
        onClose={() => {
          setUserName("");
          onClose();
        }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text- flex flex-col gap-1 text-red-600">
                UPDATE USERNAME
              </ModalHeader>
              <ModalBody>
                <div>
                  <span className="font-semibold text-red-600">NOTE:</span>
                  <p className="text-sm text-neutral-400">
                    Please make sure the following username is as wanted as
                    there is no refund for this update.
                  </p>
                </div>

                <span className="font-semibold">FROM:</span>
                <Input
                  type="text"
                  isReadOnly
                  label="Old Username"
                  placeholder={oldUsername}
                />

                <span className="font-semibold">TO:</span>
                <Input
                  type="text"
                  isReadOnly
                  label="New Username"
                  placeholder={newUsername}
                />

                <div className="mt-2 flex justify-end gap-8 md:gap-3 xl:gap-4">
                  <Button
                    className="text-md text-red-500 sm:text-lg"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="text-md bg-green-500 p-3 text-lg text-white"
                    onPress={() => {
                      if (
                        newUsername.length <= 0 ||
                        newUsername === oldUsername
                      ) {
                        toast("Please update your username before submitting", {
                          position: "bottom-right",
                          autoClose: 5000,
                          closeOnClick: true,
                          draggable: false,
                          type: "error",
                          toastId: 57,
                        });
                      } else {
                        updateUsername.mutate({
                          userId: session.data?.user.id!,
                          newUserName: newUsername,
                        });
                      }
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </ModalBody>

              <ToastContainer containerId={"send-team-invite-modal"} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
