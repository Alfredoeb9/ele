import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";

interface RemoveFriendProps {
    open: boolean;
    onOpenChange: () => void;
    handleModalPath: (path: string) => void;
    teamName?: string;
    email: string;
    id: string;
}

export default function RemoveFriendModal({ open, onOpenChange, handleModalPath, teamName, email, id }: RemoveFriendProps) {
    const { onClose } = useDisclosure();
    const [size, ] = useState<string>('md')
    const utils = api.useUtils()

    const removeFriend = api.user.removeFriend.useMutation({
        onSuccess: async () => {
            await utils.user.getUserWithFriends.invalidate()
            toast('User has been removed as a friend', {
                position: "bottom-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 16
            })
        },

        onError: () => {
            toast('There was a service error please try again or open a support ticket', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 43
            })
        }
    })

    return (
        <>
            <Modal 
                size={size as 'md'} 
                isOpen={open} 
                onClose={() => {
                    onClose() 
                    handleModalPath("")
                }}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-red-600">Remove Friend</ModalHeader>
                            <ModalBody>
                                <p> 
                                Are you sure you want to remove <span className="text-red-500">{teamName}</span> as a friend? This action cannot be reverted.
                                User will not be notified if you have removed them as a friend.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                Close
                                </Button>
                                <Button color="primary"
                                    disabled={removeFriend.isPending}
                                    onClick={() => { 
                                        removeFriend.mutate({ id: id, email: email})
                                        onClose()
                                    }}
                                >
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <ToastContainer />
        </>
    );
}