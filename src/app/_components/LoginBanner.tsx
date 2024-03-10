import { SessionContextValue } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface LoginBannerTypes {
    session: SessionContextValue
}

export default function LoginBanner({session}: LoginBannerTypes) {
    const router = useRouter()

    return (
        <section className="flex flex-row justify-center items-center p-8 bg-slate-900">
            <p className="text-white">JOIN THE FASTEST GROWING ESPORTS COMMUNITY</p>
            <button 
                className="text-base lg:text-xl text-white border-slate-500 w-44 sm:w-36 md:w-32 lg: bg-slate-500 rounded-sm py-2 px-4 ml-2 hover:scale-105 transition-all"
                onClick={() => {
                    if (session.status === 'authenticated') {
                        toast('You are already signed in', {
                            position: "bottom-right",
                            autoClose: 5000,
                            closeOnClick: true,
                            draggable: false,
                            type: "error",
                            toastId: 51
                        })
                        
                        return null
                    } else {
                        router.push("/sign-up")
                    }
                    
                }}
            >
                Join Now
            </button>
        </section>
    )
}