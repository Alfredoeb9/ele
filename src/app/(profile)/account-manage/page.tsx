'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// const CustomToastWithLink = () => (
//     <div>
//         User needs to <Link href="/sign-in" className="text-blue-600 hover:text-blue-500">sign in</Link> to subscribe. 
//     </div>
// );

export default function AccountSettings() {
    const session = useSession();
    const router = useRouter();
    const params = usePathname()
    const search = useSearchParams()
    const [currentKey, setCurrentKey] = useState<string>("account_settings")

    if (session.status === 'unauthenticated') return router.push('/');
    

    

    const getSingleUser = api.user.getSingleUser.useQuery({ email: session.data?.user.email as string}, { enabled: session.status === 'authenticated'});

    useEffect(() => {
        const doesHrefHaveId = window.location.href.split("#")
        if (doesHrefHaveId.length === 2) {
            if (doesHrefHaveId[1] == "connect-accounts") {
                return setCurrentKey("gamer_tags")
            } 
            return
        }

        return () => {
            setCurrentKey("")
        }
    }, [ router, window.location.href])

    if (getSingleUser.data === undefined) {
        router.push("/")
        return null
    }

    if (getSingleUser.data?.id !== session.data?.user.id) {
        router.push('/sign-in')
        return null
    }

    return (
        <div className="container m-auto py-4">
            <h1 className="text-white text-xl sm:text-2xl md:text-4xl">Account Settings</h1>

            <div className="text-white">
                <div className="flex w-full flex-col">
                    <Tabs aria-label="Options" color="primary" variant="underlined" classNames={{tab: "text-lg sm:text-xl"}} selectedKey={currentKey} onSelectionChange={(e) => setCurrentKey(e.toString())}>
                        <Tab key="account_settings" id="account-settings" title={<div className="text-neutral-200 text-base sm:text-lg">ACCOUNT SETTINGS</div>}>
                        <Card>
                            <CardBody>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </CardBody>
                        </Card>  
                        </Tab>
                        <Tab key="gamer_tags" id="connect-accounts" title={<div className="text-neutral-200 text-base sm:text-lg">GAMER TAGs/ IDs</div>}>
                        <Card>
                            <CardBody>
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </CardBody>
                        </Card>  
                        </Tab>
                        <Tab key="social_media"title={<div className="text-neutral-200 text-base sm:text-lg">SOCIAL MEDIA</div>}>
                        <Card>
                            <CardBody>
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </CardBody>
                        </Card>  
                        </Tab>
                    </Tabs>
                </div> 
            </div>
        </div>
    )
}