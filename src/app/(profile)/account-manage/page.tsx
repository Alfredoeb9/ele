'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// const CustomToastWithLink = () => (
//     <div>
//         User needs to <Link href="/sign-in" className="text-blue-600 hover:text-blue-500">sign in</Link> to subscribe. 
//     </div>
// );

export default function AccountSettings() {
    const session = useSession();
    const router = useRouter()

    if (session.status === 'unauthenticated') return router.push('/')

    const getSingleUser = api.user.getSingleUser.useQuery({ email: session.data?.user.email as string}, { enabled: session.status === 'authenticated'});

    if (getSingleUser.data === undefined) {
        router.push("/")
        return null
    }

    if (getSingleUser.data?.id !== session.data?.user.id) {
        router.push('/sign-in')
        return null
    }

    return (
        <div className="container m-auto">
            <h1 className="text-white text-xl md:text-2xl">Account Settings</h1>

            <div id="connect-accounts" className="text-white">
                {getSingleUser.data.email}
            </div>
        </div>
    )
}