import {Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Input} from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";

import 'react-toastify/dist/ReactToastify.css';


interface SendFriendProps {
    open: boolean;
    onOpenChange: () => void;
    handleModalPath: (path: string) => void;
}

export default function SendFriendRequest({ open, onOpenChange, handleModalPath }: SendFriendProps) {
    const { onClose } = useDisclosure();
    const [size, ] = useState<string>('md')
    const [userName, setUserName] = useState<string>("");

    const utils = api.useUtils()

    const session = useSession();

    const id = session.data?.user.id
    const senderUser = session.data?.user.username

    const sendRequest = api.user.sendFriendRequest.useMutation({
        onSuccess: async () => {
            await utils.user.getNotifications.invalidate()
            toast(`Friend request sent to ${userName}`, {
                position: "bottom-right",
                autoClose: 5000,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 27          
            })
            setUserName("")
        },

        onError: (e) => {
            if (e.data?.zodError) {
                e.data?.zodError?.fieldErrors.userName?.map((error) => {    
                    if (error.includes("String must contain at least 1")) {
                        toast('Please insert a username', {
                            position: "bottom-right",
                            autoClose: 5000,
                            closeOnClick: true,
                            draggable: false,
                            type: "error",
                            toastId: 39
                        })
                    }
                })
            } else if (e.message.includes("already sent user a friend request")) {
                toast('You have already sent user a friend request', {
                    position: "bottom-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    draggable: false,
                    type: "error",
                    toastId: 25          
                })
            } else if(e.message.includes("No user found")) {
                toast(`User ${userName} does not exist`, {
                    position: "bottom-right",
                    autoClose: 5000,
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

                            <Input 
                                type="text" 
                                placeholder="username" 
                                onChange={(e) => setUserName(e.target.value)}
                                value={userName}
                            />

                            <div className="flex gap-2 md:gap-3 xl:gap-4 justify-end mt-2">
                                <button className="text-red-500" onClick={onClose}>Cancel</button>
                                <button className="bg-green-500 p-3 rounded-2xl text-white" disabled={sendRequest.isPending} onClick={(e) => {
                                e.preventDefault();

                                sendRequest.mutate({
                                    userName,
                                    id: id as string,
                                    senderUserName: senderUser as string
                                });
                            }}>Send Request</button>
                            </div>
                                
                            </ModalBody>
                            <ToastContainer />
                        </>
                    )}
                    
                </ModalContent>
                
            </Modal>

        </>
    );
}