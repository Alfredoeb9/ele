'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, Tab, Card, CardBody, Input, Button } from "@nextui-org/react";
import { FaCog } from "react-icons/fa";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { gameIdsInputs } from "@/lib/sharedData";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";

// const CustomToastWithLink = () => (
//     <div>
//         User needs to <Link href="/sign-in" className="text-blue-600 hover:text-blue-500">sign in</Link> to subscribe. 
//     </div>
// );

export interface GamerTagsTypes {
    label: string;
    value: string
}

export default function AccountSettings() {
    const session = useSession();
    const router = useRouter();
    const [currentKey, setCurrentKey] = useState<string>("account_settings");
    const [ gamerTags, setGamerTags ] = useState<Array<GamerTagsTypes>>([{ label: "PSN ID", value: "" }, { label: "Xbox Live ID", value: "" },{ label: "EPIC Display Name", value: "" }, { label: "Battle.net", value: "" },{ label: "Switch Friend Code", value: "" }, { label: "Activision ID", value: "" },{ label: "2K ID", value: "" }, { label: "Steam Friend Code", value: "" }]);

    if (session.status === 'unauthenticated') return router.push('/');

    // useEffect(() => {
    //     if (gamerTags.length < currentInput) {
    //         setGamerTags((oldTags) => [...oldTags, {label: "", value: ""}])
    //     }
    // }, [currentInput, gamerTags])
    
    const getSingleUser = api.user.getSingleUserWithAccountInfo.useQuery({ email: session.data?.user.email as string}, { enabled: session.status === 'authenticated'});

    useEffect(() => {
        // would only be logged when words is changed.
        if (getSingleUser.data && getSingleUser.data?.gamerTags.length > 0) {
            const list: any = [...gamerTags] 

            getSingleUser.data.gamerTags.map((gamer, i) => {
                list[i].label = gamer.type
                list[i].value = gamer.gamerTag
                setGamerTags(list)
            })

            
        }
    }, [getSingleUser.data])

    const appendGamerTag = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { ariaLabel, value } = e.target

        const list: any = [...gamerTags] 

        list[index].label = ariaLabel
        list[index].value = value
        setGamerTags(list)
    };

    const updateGamerTag = api.user.updateUsersGamerTags.useMutation({
        onSuccess: () => {
            toast('GamerTag has been updated', {
                position: "bottom-right",
                autoClose: 5000,
                closeOnClick: true,
                draggable: false,
                type: "success",
                toastId: 35
            })
        },

        onError: () => {
            toast('There was a problem updating your Gamer Tags', {
                position: "bottom-right",
                autoClose: 5000,
                closeOnClick: true,
                draggable: false,
                type: "error",
                toastId: 36
            })
        }
    })

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

    if (getSingleUser.isError === undefined) {
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
                <div className="flex flex-col">
                    <Tabs aria-label="Options" color="primary" variant="underlined" classNames={{tab: "text-lg sm:text-xl"}} selectedKey={currentKey} onSelectionChange={(e) => setCurrentKey(e.toString())}>
                        <Tab key="account_settings" id="account-settings" title={<div className="text-neutral-200 text-base sm:text-lg">ACCOUNT SETTINGS</div>}>
                            <Card className="w-[65%]">
                                <CardBody>
                                    <h3 className="font-semibold text-xl pb-4">ACCOUNT INFO</h3>

                                    <div className="flex gap-6 w-full">
                                        <div className="w-[49%]">
                                            <div className="flex items-center">
                                                <Input type="text" label="Username" size="sm" placeholder={session.data?.user.username} />
                                                <Button isIconOnly variant="light" className="ml-2">
                                                    <FaCog className="w-[50px] text-xl sm:text-2xl md:text-3xl" />
                                                </Button>
                                            </div>
                                            
                                            <p className="text-sm text-neutral-400 pt-4">Name Change package is required to edit. If you do not have one in your inventory, you will be prompted to purchase one before continuing.</p>
                                        </div>

                                        <div className="w-[50%]">
                                            <div className="flex items-center">
                                                <Input type="text" label="Dmail" size="sm" placeholder={session.data?.user.email as string} />
                                                <Button isIconOnly variant="light" className="ml-2">
                                                    <FaCog className="w-[50px] text-xl sm:text-2xl md:text-3xl" />
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
                            <Card className="w-[65%]">
                                <CardBody>
                                    By entering your Game IDs, you acknowledge that you are the owner of these accounts and that all your game IDs will be publicly visible on CMG for match use.

                                    <div className="flex flex-wrap gap-2">
                                        {gamerTags.map((gameInput, i) => (
                                            <div key={i} className="w-[49%] flex-wrap">
                                                <Input type="text" label={gameInput.label} onChange={(e) => appendGamerTag(e, i)} placeholder={gameInput.value} />
                                            </div>
                                        ))}
                                        
                                    </div>

                                    <Button className="w-32 mt-4" color="success" onPress={() => updateGamerTag.mutate({
                                        email: session.data?.user.email as string,
                                        gamerTags: [...gamerTags]
                                    })}>Save Profile</Button>
                                </CardBody>
                            </Card>  
                        </Tab>

                        <Tab key="social_media"title={<div className="text-neutral-200 text-base sm:text-lg">SOCIAL MEDIA</div>}>
                            <Card className="w-[65%]">
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