"use client";


import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ManageTeam() {
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
        <div>
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
        </div>
    )
}