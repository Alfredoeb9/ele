import { Button, useDisclosure } from "@nextui-org/react";
import { SessionContextValue } from "next-auth/react";
import { FaCog } from "react-icons/fa";
import UpdateEmailModal from "../UpdateEmailModal";

interface CustomUpdateUserEmailButtonTypes {
  newEmail: string;
  oldEmail: string;
  session: SessionContextValue;
}

export default function CustomUpdateUserEmailButton({
  oldEmail,
  newEmail,
  session,
}: CustomUpdateUserEmailButtonTypes) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        isIconOnly
        variant="light"
        className="ml-2"
        onPress={() => {
          onOpen();
        }}
      >
        <FaCog className="w-[50px] text-xl sm:text-2xl md:text-3xl" />
      </Button>

      <UpdateEmailModal
        open={isOpen}
        onOpenChange={onOpenChange}
        newEmail={newEmail}
        oldEmail={oldEmail}
        session={session}
      />
    </>
  );
}
