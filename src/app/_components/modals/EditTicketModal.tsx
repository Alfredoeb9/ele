import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

interface editNewTicketTypes {
    open: boolean;
    onOpenChange: () => void;
    handleModalPath: (path: string) => void;
    ticketId: string;
    ticketText: string;
    selectedCategory: string;
    sessionEmail: string | undefined;
    sessionId: string | undefined;
    editrUser: string | undefined;
}

export default function editNewTicket({
  open,
  onOpenChange,
  handleModalPath,
  ticketId,
  ticketText,
  selectedCategory,
  sessionEmail,
  sessionId,
  editrUser
}: editNewTicketTypes) {
  const { onClose } = useDisclosure();
  const [size] = useState<string>("md");
  const [text, setTicketText] = useState<string>(ticketText);
//   const [category, setSelectedCategory] = useState(selectedCategory);

  const utils = api.useUtils();

  const editTicket = api.ticket.editTicket.useMutation({
    onSuccess: async () => {
      await utils.user.getUserDataWithTickets.invalidate();
      await utils.user.getUniqueTicket.invalidate({ ticketId: ticketId });

      handleModalPath("");
      onOpenChange();
      
      toast(`Ticket has been editd`, {
        position: "bottom-right",
        autoClose: 4500,
        closeOnClick: true,
        draggable: false,
        type: "success",
        toastId: 76,
      });
    //   setTicketText("");
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

//   function handleTicketCatChange(e: string) {
//     setSelectedCategory(e);
//   }

  return (
    <>
      <Modal
        size={size as "md"}
        isOpen={open}
        onClose={() => {
          handleModalPath("");
          setTicketText(ticketText);
          onClose();
        }}
        onOpenChange={onOpenChange}
        classNames={{ wrapper: "h-[50dvh] sm:h-[100dvh]" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-red-600">
                Edit Ticket{" "}
              </ModalHeader>
              <ModalBody>
                {/* <Select label="Select Ticket Category" className="max-w-xs">
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
                </Select> */}
                <Textarea
                  placeholder="Enter your text here..."
                  onChange={(e) => setTicketText(e.target.value)}
                  value={text}
                />

                <div className="mt-2 flex justify-end gap-2 md:gap-3 xl:gap-4">
                  <button className="text-red-500" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    className="rounded-2xl bg-green-500 p-3 text-white"
                    disabled={editTicket.isPending}
                    onClick={(e) => {
                      e.preventDefault();

                      editTicket.mutate({
                        ticketId: ticketId,
                        userName: editrUser!,
                        userEmail: sessionEmail!,
                        userId: sessionId!,
                        cat: selectedCategory,
                        text: text,
                      });
                    }}
                  >
                    Edit Ticket
                  </button>
                </div>
              </ModalBody>
              <ToastContainer containerId={"edit-ticket-toast"} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
