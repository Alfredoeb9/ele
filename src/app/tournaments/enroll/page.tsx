"use client";
import React, { useEffect, useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import ErrorComponent from "@/components/ErrorComponent";
import { useGetUser } from "../../hooks/getUser";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import { api } from "@/trpc/react";

export default function Enroll() {
    const queryClient = useQueryClient();
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const session = useSession();
    const [error, setError] = useState<any>(null)
    const { getuser, error2, isLoading2 } = useGetUser();

    if (!session?.data) toast('Please sign in to enroll')

    const search = searchParams.get('id')

    // const {data: user} = useQuery<any>({
    //     queryKey: ["user"],
    //     queryFn: () => getuser(session?.data),
    //     retry: 2
    // })

    const tournament = api.matches.getSingleMatch.useMutation({
        onSuccess: () => {
            console.log("success")
        },

        onError: (error) => {
            console.log("Error", error.message)
        }
    })

    useEffect(() => {
        if (search) {
            tournament.mutate({ id: search })
        }
    }, [search])

    const currentUser = api.user.getSingleUser.useMutation({
        onSuccess: () => {
            console.log("user retrieved")
        },

        onError: (error) => {
            setError(error.message)
        }
    })

    useEffect(() => {
        if (session.data?.user) {
            currentUser.mutate({ email: session.data?.user.email as string})
        }
    }, [session.data])

    console.log("tournament", tournament.data)

    // const { data: tournament } = useQuery<any>({
    //     queryKey: ["tournament-finder"],
    //     queryFn: () => 
    //         fetch(`/api/match-finder/${search}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(search)
    //         }).then((res) =>
    //             res.json()
    //         ).catch(() => {
    //             console.log("catch ran up")
    //         }),
    //     retry: 3
    // })

    // const fetchEnroll = async () => {
    //     let credits = tournament?.data.entry.replace(/[^0-9]/g,"")
    //     try {
    //         const res = await fetch(`/api/tournament`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({search: search, credits, email: session?.data?.user.email })
    //         })

    //         const data = await res.json();

    //         if (!res.ok) {
    //             return setError(data?.error)
    //         }

    //         toast('Team has enrolled in Tournament, Good Luck!', {
    //             position: "bottom-right",
    //             autoClose: false,
    //             closeOnClick: true,
    //             draggable: false,
    //             type: "success",
    //             toastId: 3
    //         })

    //         return data;
    //         // .then(async (res) => {

    //         //     let data = await res.json()

    //         //     if (res.status >= 500) return setError(data?.message)

    //         //     if (res.status === 201) {
    //         //         router.push(`/`)
    //         //         return data;
    //         //     };         
    //         // }).catch((error) => {
    //         //     console.error("error", error)
    //         //     setError(true);
    //         // })
    //     } catch (error) {
    //         setError(error)
    //     }
        
    // };

    // useMutation is what we can use to trigger a refetch on the useQuery hook
    // const { mutateAsync: addTodoMutation } = useMutation({
    //     mutationFn: fetchEnroll,
    //     onSuccess: () => {
            
    //         // pass in the key that needs to get refetched
    //         queryClient.invalidateQueries({ queryKey: ["get-user"]})

    //         setTimeout(() => {
    //             router.push('/')
    //         }, 3000)
            
    //     }
    // })

    // if (!session?.data) return router.push("/sign-in")
    // @ts-ignore: Object is possibly 'null'.
    if (currentUser?.data && currentUser?.data[0] !== null && tournament?.data[0]?.entry.replace(/[^0-9]/g,"") > currentUser?.data[0]?.credits) router.push("/pricing")

    return (
        <div>
            <h1>Match Confirmation</h1>
            <p>Attention: Before accepting match read our refund policy, as well as the current match/tournament rules.</p>

            {/* <p>This Match/ Tournament will cost {tournament?.data.entry}</p> */}

            <button onClick={(e) => {
                e.preventDefault();

            }}>Enroll</button>

            <ToastContainer />
        </div>
    )
}