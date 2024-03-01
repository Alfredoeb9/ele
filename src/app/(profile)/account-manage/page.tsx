'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, Tab, Card, CardBody, Input, Button } from "@nextui-org/react";
import { FaCog } from "react-icons/fa";
import { useEffect, useState } from "react";
import { gameIdsInputs } from "@/lib/sharedData";
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
    }, [ router])

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
                <div className="flex flex-col w-[65%]">
                    <Tabs aria-label="Options" color="primary" variant="underlined" classNames={{tab: "text-lg sm:text-xl"}} selectedKey={currentKey} onSelectionChange={(e) => setCurrentKey(e.toString())}>
                        <Tab key="account_settings" id="account-settings" title={<div className="text-neutral-200 text-base sm:text-lg">ACCOUNT SETTINGS</div>}>
                        <Card>
                            <CardBody>
                                <h3 className="font-semibold text-xl pb-4">ACCOUNT INFO</h3>

                                <div className="flex gap-6 w-full">
                                    <div className="w-[49%]">
                                        <div className="flex items-center">
                                            <Input type="text" label="Username" size="sm" placeholder={session.data.user.username} />
                                            <Button isIconOnly variant="light" className="ml-2">
                                                <FaCog className="w-[50px] text-2xl sm:text-3xl" />
                                            </Button>
                                        </div>
                                        
                                        <p className="text-sm text-neutral-400 pt-4">Name Change package is required to edit. If you do not have one in your inventory, you will be prompted to purchase one before continuing.</p>
                                    </div>

                                    <div className="w-[50%]">
                                        <div className="flex items-center">
                                            <Input type="text" label="Dmail" size="sm" placeholder={session.data?.user.email as string} />
                                            <Button isIconOnly variant="light" className="ml-2">
                                                <FaCog className="w-[50px] text-2xl sm:text-3xl" />
                                            </Button>
                                            
                                        </div>
                                    </div>
                                    
                                </div>

                                <div className="flex items-center pt-4">
                                    <Input type="text" label="Phone Number" size="sm" className="w-[35%]" placeholder={"(000) 000-0000"} />
                                    <Button variant="bordered" color="success" className="ml-2">
                                        Save
                                    </Button>
                                            
                                </div>
                                
                                
                            </CardBody>
                        </Card>  
                        </Tab>
                        <Tab key="gamer_tags" id="connect-accounts" title={<div className="text-neutral-200 text-base sm:text-lg">GAMER TAGs/ IDs</div>}>
                        <Card>
                            <CardBody>
                            By entering your Game IDs, you acknowledge that you are the owner of these accounts and that all your game IDs will be publicly visible on CMG for match use.

                            <div className="flex flex-wrap gap-2">
                                {gameIdsInputs.map((gameInput) => (
                                    <div key={gameInput.key} className="w-[49%] flex-wrap">
                                        <Input type="text" label={gameInput.label} />
                                    </div>
                                ))}
                                <Button className=" flex flex-end" color="success">Save Profile</Button>
                            </div>
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