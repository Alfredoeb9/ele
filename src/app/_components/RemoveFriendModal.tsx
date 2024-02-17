import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";

interface RemoveFriendProps {
    open: boolean;
    onOpenChange: () => void;
    teamName?: string;
    email: string;
    id: string;
}

export default function RemoveFriendModal({ open, onOpenChange, teamName, email, id }: RemoveFriendProps) {
    const { onClose } = useDisclosure();
    const [size, setSize] = useState<string>('md')
    const utils = api.useUtils()

    const removeFriend = api.user.removeFriend.useMutation({
        onSuccess: async () => {
            await utils.user.getUserWithFriends.invalidate()
            toast('User has been removed as a friend', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 14                     
            })
        }
    })

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