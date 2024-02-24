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
    const senderUser = session.data?.user.email

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
                                        variant="bordered"
                                        autoFocus
                                        type="text" 
                                        placeholder="username" 
                                        onChange={(e) => setUserName(e.target.value)}
                                        value={userName}
                                    />

                                    <div id="modal-footer" className="mt-2 flex gap-2 justify-end">
                                        <Button color="danger" variant="light" onPress={() => {
                                            handleModalPath("")
                                            setUserName("")
                                            onClose()
                                        }}>
                                            Close
                                        </Button>
                                        <Button type="button" variant="bordered" color="success">Send Request</Button>
                                    </div>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <ToastContainer containerId={"friendRequest"}/>
        </>
    );
}