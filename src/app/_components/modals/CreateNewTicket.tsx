import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Textarea,
  Select,
  SelectItem,
  SelectSection,
} from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";

import "react-toastify/dist/ReactToastify.css";
import { ticketOptions } from "@/lib/sharedData";

interface CreateNewTicketTypes {
  open: boolean;
  onOpenChange: () => void;
  handleModalPath: (path: string) => void;
}

export default function CreateNewTicket({
  open,
  onOpenChange,
  handleModalPath,
}: CreateNewTicketTypes) {
  const { onClose } = useDisclosure();
  const [size] = useState<string>("md");
  const [ticketText, setTicketText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const utils = api.useUtils();

  const session = useSession();

  const sessionUser = session.data?.user;

  const createrUser = session.data?.user.username;

  const createTicket = api.create.createNewTicket.useMutation({
    onSuccess: async () => {
      await utils.user.getUserDataWithTickets.invalidate();
      onClose();
      toast(`Ticket has been created`, {
        position: "bottom-right",
        autoClose: 4500,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 76,
      });
      setTicketText("");
    },

    onError: (e) => {
      if (e.data?.zodError) {
        e.data?.zodError?.fieldErrors.userName?.map((error) => {
          if (error.includes("String must contain at least 1")) {
            toast("Please insert a text in the body", {
              position: "bottom-right",
              autoClose: 4500,
              closeOnClick: true,
              draggable: false,
              type: "error",
              toastId: 73,
            });
          }
        });
      } else if (e.message.includes("already sent user a friend request")) {
        toast("You have already sent user a friend request", {
          position: "bottom-right",
          autoClose: 4500,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 74,
        });
      } else if (e.message.includes("No user found")) {
        toast(`User does not exist`, {
          position: "bottom-right",
          autoClose: 4500,
          closeOnClick: true,
          draggable: false,
          type: "error",
          toastId: 75,
        });
      }
    },
  });

  function handleTicketCatChange(e: string) {
    setSelectedCategory(e);
  }

  return (
    <>
      <Modal
        size={size as "md"}
        isOpen={open}
        onClose={() => {
          handleModalPath("");
          setTicketText("");
          onClose();
        }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-red-600">
                Create New Ticket{" "}
              </ModalHeader>
              <ModalBody>
                <Select label="Select Ticket Category" className="max-w-xs">
                  {ticketOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      onPress={(e) =>
                        handleTicketCatChange(
                          (e.target as HTMLElement).innerText,
                        )
                      }
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Textarea
                  placeholder="Enter your text here..."
                  onChange={(e) => setTicketText(e.target.value)}
                  value={ticketText}
                />

                <div className="mt-2 flex justify-end gap-2 md:gap-3 xl:gap-4">
                  <button className="text-red-500" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    className="rounded-2xl bg-green-500 p-3 text-white"
                    disabled={createTicket.isPending}
                    onClick={(e) => {
                      e.preventDefault();

                      createTicket.mutate({
                        userName: createrUser!,
                        userEmail: sessionUser?.email!,
                        userId: sessionUser?.id!,
                        cat: selectedCategory,
                        text: ticketText,
                      });
                    }}
                  >
                    Create Ticket
                  </button>
                </div>
              </ModalBody>
              <ToastContainer containerId={"create-ticket-toast"} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
