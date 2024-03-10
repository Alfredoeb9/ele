import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";

interface SendTeamInvite {
    open: boolean;
    onOpenChange: () => void;
    newUsername: string;
    oldUsername: string;
}

export default function SendTeamInvite({ open, onOpenChange, oldUsername, newUsername }: SendTeamInvite) {
    const { onClose } = useDisclosure();
    const [size, ] = useState<string>('md')
    const [userName, setUserName] = useState<string>("");

    const utils = api.useUtils()

    const session = useSession();

    const id = session.data?.user.id
    const senderUser = session.data?.user.username

    const updateUsername = api.user.updateUsersUsername.useMutation({
        onSuccess: async() => {
            await session.update({ username: newUsername })
          await utils.user.getSingleUserWithAccountInfo.invalidate()
          toast("Username has been updated", {
            position: "bottom-right",
            autoClose: 5000,
            closeOnClick: true,
            draggable: false,
            type: "success",
            toastId: 55,
          })

        //   revalidatePath("/account-manage")
        },
    
        onError: () => {
          toast("There was an error updating your username", {
            position: "bottom-right",
            autoClose: 5000,
            closeOnClick: true,
            draggable: false,
            type: "error",
            toastId: 54,
          })
        }
      })

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
                            <ModalHeader className="flex flex-col gap-1 text-red-600">Update Username</ModalHeader>
                            <ModalBody>
                                FROM
                            <Input 
                                type="text" 
                                isReadOnly
                                label="Old Username"
                                placeholder={oldUsername}
                            /> 

                                <p>-------------{">"}</p>

                                TO
                                <Input 
                                    type="text"
                                    isReadOnly
                                    label="New Username"
                                    placeholder={newUsername}
                                />

                                <div className="flex gap-2 md:gap-3 xl:gap-4 justify-end mt-2">
                                    <Button className="text-red-500" onPress={onClose}>Cancel</Button>
                                    <Button className="bg-green-500 p-3 rounded-2xl text-white" onPress={() => {
                                    if (newUsername.length <= 0 || newUsername === oldUsername) {
                                        toast("Please update your username before submitting", {
                                          position: "bottom-right",
                                          autoClose: 5000,
                                          closeOnClick: true,
                                          draggable: false,
                                          type: "error",
                                          toastId: 56,
                                        })
                                      } else {
                                        updateUsername.mutate({
                                          userId: session.data?.user.id!,
                                          newUserName: newUsername
                                        })
                                      }
                                }}>Submit</Button>
                                </div>
                                
                            </ModalBody>
                            <ToastContainer containerId={"send-team-invite-modal"}/>
                        </>
                    )}
                    
                </ModalContent>
                
            </Modal>

            
        </>
    );
}