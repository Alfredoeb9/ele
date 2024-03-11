import { Button, useDisclosure } from "@nextui-org/react";
import { SessionContextValue } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaCog } from "react-icons/fa";
import UpdateUsernameModal from "../UpdateUsernameModal";

interface CustomeLeaveTeamButtonTypes {
  newUsername: string;
  oldUsername: string;
  session: SessionContextValue;
  credits: number | null | undefined;
}

export default function CustomUpdateUsernameButton({
  oldUsername,
  newUsername,
  credits,
}: CustomeLeaveTeamButtonTypes) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  return (
    <>
      <Button
        isIconOnly
        variant="light"
        className="ml-2"
        onPress={() => {
          if (Number(5) > Number(credits)) {
            router.push("/pricing");
          } else {
            onOpen();
          }
        }}
      >
        <FaCog className="w-[50px] text-xl sm:text-2xl md:text-3xl" />
      </Button>

      <UpdateUsernameModal
        open={isOpen}
        onOpenChange={onOpenChange}
        newUsername={newUsername}
        oldUsername={oldUsername}
      />
    </>
  );
}
