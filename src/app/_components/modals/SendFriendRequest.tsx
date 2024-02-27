import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface SendFriendProps {
    open: boolean;
    onOpenChange: () => void;
    handleModalPath: (path: string) => void;
}

export default function SendFriendRequest({ open, onOpenChange, handleModalPath }: SendFriendProps) {
    const { onClose } = useDisclosure();
    const [size, setSize] = useState<string>('md')
    const [userName, setUserName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const utils = api.useUtils()

    const session = useSession();

    const id = session.data?.user.id
    const senderUser = session.data?.user.username

    const sendRequest = api.user.sendFriendRequest.useMutation({
        onSuccess: async () => {
            await utils.user.getNotifications.invalidate()
            setUserName("")
            toast(`Friend request sent to ${userName}`, {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 27          
            })
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
                    handleModalPath("")
                    setUserName("")
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
                                <Input 
                                    type="text" 
                                    placeholder="username" 
                                    onChange={(e) => setUserName(e.target.value)}
                                    value={userName}
                                />

                                <div className="flex gap-2 md:gap-3 xl:gap-4 justify-end mt-2">
                                    <button className="text-red-500">Cancel</button>
                                    <button className="bg-green-500 p-3 rounded-2xl text-white">Send Request</button>
                                </div>
                                
                            </form>
                            </ModalBody>
                            <ToastContainer containerId={"send-friend-modal"}/>
                        </>
                    )}
                    
                </ModalContent>
                
            </Modal>

            
        </>
    );
}