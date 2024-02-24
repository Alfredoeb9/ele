import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface SendFriendProps {
    open: boolean;
    onOpenChange: () => void;
    handleModalPath: (path: string) => void;
    // teamName?: string;
    // email: string;
    // id: string;
}

export default function SendFriendRequest({ open, onOpenChange, handleModalPath }: SendFriendProps) {
    const { onClose } = useDisclosure();
    const [size, setSize] = useState<string>('md')
    const [userName, setUserName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const utils = api.useUtils()

    const session = useSession();

    const id = session.data?.user.id
    const senderUser = session.data?.user.email

    const removeFriend = api.user.removeFriend.useMutation({
        onSuccess: async () => {
            await utils.user.getUserWithFriends.invalidate()
            toast('User has been removed as a friend', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 16                     
            })
        }
    })

    const sendRequest = api.user.sendFriendRequest.useMutation({
    
        onSuccess: async () => {
            await utils.user.getNotifications.invalidate()
            setUserName("")
        },
        onError: (e) => {
          setError(e.message)
          
          if (!toast.isActive(13, "friendRequest")) {
            toast('User does not exist', {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 19           
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
                    handleModalPath("")
                    onClose()
                }} 
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-red-600">Send Friend Request </ModalHeader>
                            <ModalBody>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                    sendRequest.mutate({
                                        userName,
                                        id: id as string,
                                        senderUserName: senderUser as string
                                    });
                                }}>
                                <label>Invite User</label>
                                <input 
                                    type="text" 
                                    placeholder="username" 
                                    onChange={(e) => setUserName(e.target.value)}
                                    value={userName}
                                />

                                <button>SEND</button>
                            </form>
            <ToastContainer containerId={"friendRequest"} />
                            </ModalBody>
                            {/* <ModalFooter>
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
                            </ModalFooter> */}
                        </>
                    )}
                </ModalContent>
            </Modal>

            <ToastContainer />
        </>
    );
}