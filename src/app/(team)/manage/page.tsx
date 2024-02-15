"use client";


import { api } from "@/trpc/react";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ManageTeam() {
    const router = useRouter()
    const [userName, setUserName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const session = useSession();

    const id = session.data?.user.id
    const senderUser = session.data?.user.email

    const sendRequest = api.user.sendFriendRequest.useMutation({
    
        onSuccess: () => {
            console.log("sent")
            setUserName("")
            router.refresh()
        },
        onError: (e) => {
          console.log("error", e.message)
          setError(e.message)
        }
    });


    console.log("id", id)
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