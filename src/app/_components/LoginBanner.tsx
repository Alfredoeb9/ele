import { type SessionContextValue } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface LoginBannerTypes {
  session: SessionContextValue;
}

export default function LoginBanner({ session }: LoginBannerTypes) {
  const router = useRouter();

  return (
    <section className="flex flex-row items-center justify-center bg-slate-900 p-8">
      <p className="text-white">JOIN THE FASTEST GROWING ESPORTS COMMUNITY</p>
      <button
        className="lg: ml-2 w-44 rounded-sm border-slate-500 bg-slate-500 px-4 py-2 text-base text-white transition-all hover:scale-105 sm:w-36 md:w-32 lg:text-xl"
        onClick={() => {
          if (session.status === "authenticated") {
            toast("You are already signed in", {
              position: "bottom-right",
              autoClose: 5000,
              closeOnClick: true,
              draggable: false,
              type: "error",
              toastId: 51,
            });

            return null;
          } else {
            router.push("/sign-up");
          }
        }}
      >
        Join Now
      </button>
    </section>
  );
}
