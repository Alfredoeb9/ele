import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useState } from "react";

interface DisbandProps {
    open: boolean;
    onOpenChange: () => void;
    teamName?: string;
}

export default function Disband({ open, onOpenChange, teamName }: DisbandProps) {
  const { onClose } = useDisclosure();
  const [size, setSize] = useState<string>('md')



    function disBandTeam() {
        console.log("team is disbanded")
    }

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
                Are you sure you want to delete the {teamName} team permanently? This action cannot be reverted.
                Your team members will receive a loss for any scheduled/disputed matches.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => disBandTeam()}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}