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
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";
import { SessionContextValue, useSession } from "next-auth/react";

interface SendTeamInvite {
  open: boolean;
  onOpenChange: () => void;
  newEmail: string;
  oldEmail: string;
  session: SessionContextValue;
}

export default function SendTeamInvite({
  open,
  onOpenChange,
  oldEmail,
  newEmail,
  session,
}: SendTeamInvite) {
  const { onClose } = useDisclosure();
  const [size] = useState<string>("md");
  const [userNewEmail, setNewEmail] = useState<string>(newEmail);

  const utils = api.useUtils();

  useEffect(() => {
    setNewEmail(newEmail);
  }, [open]);

  const updateUsername = api.user.updateUsersEmail.useMutation({
    onSuccess: async () => {
      await session.update({ email: newEmail });
      await utils.user.getSingleUserWithAccountInfo.invalidate();
      toast("Email has been updated", {
        position: "bottom-right",
        autoClose: 3400,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 59,
      });

      setTimeout(() => {
        onClose();
      }, 3500);
    },

    onError: (e) => {
      if (e.data?.stack?.includes("User does not exist")) {
        toast("User does not exist", {
          position: "bottom-right",
          autoClose: 3500,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 60,
        });
      } else {
        toast("There was an error updating email, please try again", {
          position: "bottom-right",
          autoClose: 3500,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 58,
        });
      }
    },
  });

  return (
    <>
      <Modal
        size={size as "md"}
        isOpen={open}
        onClose={() => {
          setNewEmail("");
          onClose();
        }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl font-bold text-elg-blue">
                UPDATE EMAIL
              </ModalHeader>
              <ModalBody>
                <span className="font-semibold">FROM:</span>
                <Input
                  type="text"
                  isReadOnly
                  label="Old Email"
                  placeholder={oldEmail}
                />

                <span className="font-semibold">TO:</span>
                <Input
                  type="text"
                  isReadOnly
                  label="New Email"
                  placeholder={userNewEmail}
                />

                <div className="mt-2 flex justify-end gap-8 md:gap-3 xl:gap-4">
                  <Button
                    className="text-base text-red-500 sm:text-lg"
                    onPress={() => {
                      setNewEmail("");
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="rounded-2xl bg-green-500 p-3 text-base text-white sm:text-lg"
                    onPress={() => {
                      if (newEmail.length <= 0 || newEmail === oldEmail) {
                        toast("Please update your username before submitting", {
                          position: "bottom-right",
                          autoClose: 5000,
                          closeOnClick: true,
                          draggable: false,
                          type: "error",
                          toastId: 56,
                        });
                      } else {
                        updateUsername.mutate({
                          userId: session.data?.user.id!,
                          newEmail: newEmail,
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
