import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
    const [size, setSize] = useState<string>('md')
    const [userName, setUserName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const utils = api.useUtils()

    const session = useSession();

    const id = session.data?.user.id
    const senderUser = session.data?.user.username

    const sendRequest = api.team.sendTeamInvite.useMutation({
        onSuccess: async (data) => {
            await utils.user.getNotifications.invalidate()
            setUserName("")
            toast(`Friend request sent to ${userName}`, {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 37
            })
        },

        onError: (e) => {
          setError(e.message)
          
          if (!toast.isActive(38, "friendRequest")) {
            toast(`User ${userName} does not exist`, {
                position: "bottom-right",
                autoClose: false,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 38
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
                                <form onSubmit={(e) => {
                                    e.preventDefault();

                                    sendRequest.mutate({
                                        inviteeUserName: userName,
                                        invitedBy: id as string,
                                        teamName: teamName,
                                        invitedByUserName: senderUser as string,
                                        game: game,
                                        teamId: teamId
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
                                    <button className="bg-green-500 p-3 rounded-2xl text-white">Send Team Invite</button>
                                </div>
                                
                            </form>
                            </ModalBody>
                            <ToastContainer containerId={"send-team-invite-modal"}/>
                        </>
                    )}
                    
                </ModalContent>
                
            </Modal>

            
        </>
    );
}