import { api } from "@/trpc/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";


interface DisbandProps {
    open: boolean;
    onOpenChange: () => void;
    teamName?: string;
    teamId?: string;
}

export default function Disband({ open, onOpenChange, teamName, teamId }: DisbandProps) {
  const { onClose } = useDisclosure();
  const [size, ] = useState<string>('md')

  const utils = api.useUtils()

  const disbandTeam = api.team.disbandTeam.useMutation({
    onSuccess: async () => {
        await utils.user.getSingleUserWithTeamMembers.invalidate()
        toast(`Team ${teamName} has been deleted.`, {
          position: "bottom-right",
          autoClose: false,
          closeOnClick: true,
          draggable: false,
          type: "success",
          toastId: 31
      })
      
    },
    onError: () => {      
      toast(`Error occured before team ${teamName} could be disbanded.`, {
          position: "bottom-right",
          autoClose: false,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 30          
      })
    }
  });

  return (
    <>
      <Modal 
        size={size as 'md'} 
        isOpen={open} 
        onClose={onClose} 
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-red-600">DISBAND TEAM</ModalHeader>
              <ModalBody>
                <p> 
                  Are you sure you want to delete the <span className="text-red-500">{teamName}</span> team permanently? This action cannot be reverted.
                  Your team members will receive a loss for any scheduled/disputed matches.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" 
                  onPress={() => {
                    disbandTeam.mutate({
                      teamId: teamId as string
                    })
                    onClose()
                  }}
                  >
                  Action
                </Button>
              </ModalFooter>

              <ToastContainer containerId={"disband-team-modal"} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}