import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface SendFriendProps {
    open: boolean;
    onOpenChange: () => void;
    handleModalPath?: (path: string) => void;
    teamName: string;
    userEmail: string;
}

export default function LeaveTeamModal({ open, onOpenChange, handleModalPath, teamName, userEmail }: SendFriendProps) {
    const { onClose } = useDisclosure();
    const [size, setSize] = useState<string>('md')
    const [userName, setUserName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const utils = api.useUtils()

    const leaveTeam = api.team.leaveTeam.useMutation({
        onSuccess: async () => {
            await utils.user.getSingleUserWithTeamMembers.invalidate()
            setUserName("")
        },
        onError: (e) => {
          setError(e.message)
          
          if (!toast.isActive(25, "friendRequest")) {
            toast(`User ${userName} does not exist`, {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 25          
            })
          }
        }
    });

    return (
        <>
            <Modal 
                size={size as 'md'} 
                isOpen={open} 
                onClose={() => {
                    handleModalPath && handleModalPath("")
                    setUserName("")
                    onClose()
                }} 
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-red-600">Leave Team</ModalHeader>
                            <ModalBody>
                                <p> 
                                    Are you sure you want to leave the <span className="text-red-500">{teamName}</span> team permanently? This action cannot be reverted.
                                </p>
                                <p className="text-slate-400">
                                    <span className="text-red-500 font-semibold pt-1"> Important:</span>  
                                    Your record as part of this team will be deleted and cannot be returned.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                Close
                                </Button>
                                <Button color="primary" onPress={() => leaveTeam.mutate({
                                    userEmail: userEmail
                                })}>
                                Action
                                </Button>
                            </ModalFooter>
                            <ToastContainer/>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}