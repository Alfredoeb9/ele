"use client";


import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ManageTeam() {
    const [userName, setUserName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const utils = api.useUtils()

    const session = useSession();

    const id = session.data?.user.id
    const senderUser = session.data?.user.email

    const sendRequest = api.user.sendFriendRequest.useMutation({
    
        onSuccess: () => {
            utils.user.getNotifications.invalidate()
            setUserName("")
        },
        onError: (e) => {
          setError(e.message)
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
            
        </div>
    )
}