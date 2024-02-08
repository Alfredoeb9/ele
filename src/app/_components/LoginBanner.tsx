import { useRouter } from "next/navigation";


export default function LoginBanner() {
    const router = useRouter()
    return (
        <section className="flex flex-row justify-center items-center p-8 bg-slate-900">
            <p className="text-white">JOIN THE FASTEST GROWING ESPORTS COMMUNITY</p>
            <button 
                className="text-base lg:text-xl text-white border-slate-500 w-44 sm:w-36 md:w-32 lg: bg-slate-500 rounded-sm py-2 px-4 ml-2 hover:scale-105 transition-all"
                onClick={() => {
                    router.push("/auth/sign-up")
                }}
            >
                Join Now
            </button>
        </section>
    )
}