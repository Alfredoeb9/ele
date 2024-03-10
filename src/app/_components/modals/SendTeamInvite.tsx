import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface SendTeamInvite {
    open: boolean;
    onOpenChange: () => void;
    teamName: string;
    game: string;
    teamId: string;
}

export default function SendTeamInvite({ open, onOpenChange, teamName, game, teamId }: SendTeamInvite) {
    const { onClose } = useDisclosure();
    const [size, ] = useState<string>('md')
    const [userName, setUserName] = useState<string>("");

    const utils = api.useUtils()

    const session = useSession();

    const id = session.data?.user.id
    const senderUser = session.data?.user.username

    const sendRequest = api.team.sendTeamInvite.useMutation({
        onSuccess: async () => {
            await utils.user.getNotifications.invalidate()
            setUserName("")
            toast(`Friend request sent to ${userName}`, {
                position: "bottom-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 37
            })
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
                            toastId: 40
                        })
                    }
                })
            } else if (e.message.includes("No user found")) {
                toast(`User ${userName} does not exist`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    draggable: false,
                    type: "error",
                    toastId: 41
                })
            } else {
                toast('There was a service error please try again or open a support ticket', {
                    position: "bottom-right",
                    autoClose: false,
                    closeOnClick: true,
                    draggable: false,
                    type: "error",
                    toastId: 42
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
                    setUserName("")
                    onClose()
                }} 
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-red-600">Send Team Invite </ModalHeader>
                            <ModalBody>
                                {/* <form> */}
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
                                        inviteeUserName: userName,
                                        invitedBy: id as string,
                                        teamName: teamName,
                                        invitedByUserName: senderUser as string,
                                        game: game,
                                        teamId: teamId
                                    });
                                }}>Send Team Invite</button>
                                </div>
                                
                            {/* </form> */}
                            </ModalBody>
                            <ToastContainer containerId={"send-team-invite-modal"}/>
                        </>
                    )}
                    
                </ModalContent>
                
            </Modal>

            
        </>
    );
}