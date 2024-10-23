import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";

interface SendFriendProps {
  open: boolean;
  onOpenChange: () => void;
  handleModalPath?: (path: string) => void;
  teamName: string;
  userEmail: string;
  teamId: string;
}

export default function LeaveTeamModal({
  open,
  onOpenChange,
  handleModalPath,
  teamName,
  userEmail,
  teamId,
}: SendFriendProps) {
  const { onClose } = useDisclosure();
  const [size] = useState<string>("md");
  const [userName, setUserName] = useState<string>("");

  const utils = api.useUtils();

  const leaveTeam = api.team.leaveTeam.useMutation({
    onSuccess: async () => {
      await utils.user.getSingleUserWithTeamMembers.invalidate();
      setUserName("");
      toast("You have left the team", {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 44,
      });
    },
    onError: (e) => {
      toast(`User ${userName} does not exist`, {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 25,
      });
    },
  });

  return (
    <>
      <Modal
        size={size as "md"}
        isOpen={open}
        onClose={() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          handleModalPath !== undefined && handleModalPath("");
          setUserName("");
          onClose();
        }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-red-600">
                Leave Team
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to leave the{" "}
                  <span className="text-red-500">{teamName}</span> team
                  permanently? This action cannot be reverted.
                </p>
                <p className="text-slate-400">
                  <span className="pt-1 font-semibold text-red-500">
                    {" "}
                    Important:
                  </span>
                  Your record as part of this team will be deleted and cannot be
                  returned.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  disabled={leaveTeam.isPending}
                  onPress={() =>
                    leaveTeam.mutate({
                      userEmail: userEmail,
                      teamId: teamId,
                    })
                  }
                >
                  Action
                </Button>
              </ModalFooter>
              <ToastContainer />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
