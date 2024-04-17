"use client";
import { api } from "@/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import { Button, Chip } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";

export default function UniqueTickets() {
  const router = useRouter();
  const utils = api.useUtils();
  const urlPath = usePathname();
  const ticketFromUrl = urlPath.split("/")[2];

  const { data } = api.user.getUniqueTicket.useQuery(
    { ticketId: ticketFromUrl },
    { enabled: ticketFromUrl.length > 0 },
  );

  const deleteTicket = api.user.deleteUniqueTicket.useMutation({
    onSuccess: async () => {
      await utils.user.getUserDataWithTickets.invalidate(),
        toast(`Ticket: ${ticketFromUrl} has been deleted.`, {
          position: "bottom-right",
          autoClose: 3000,
          closeOnClick: true,
          draggable: false,
          type: "success",
          toastId: 78,
        });

      setTimeout(() => {
        router.push("/tickets");
      }, 2800);
    },

    onError: () => {
      toast("There was an error deleting ticket, please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 79,
      });
    },
  });

  return (
    <div className="m-auto my-4 flex h-full max-w-7xl flex-col place-content-center items-start justify-center rounded-lg bg-white px-2 text-white sm:px-10">
      <div className="py-4">
        <h1 className="text-black">
          <span className="font-semibold">Created By:</span> {data?.createdById}
        </h1>
        <div className="flex gap-2">
          <Chip color="primary">{data?.category}</Chip>
          <Chip
            color={data?.status === "open" ? "success" : "danger"}
            className="text-black"
            classNames={{ content: "text-black", base: "text-black" }}
          >
            {data?.status}
          </Chip>
          <Chip classNames={{ base: "bg-slate-500 text-white" }}>
            {data?.id}
          </Chip>
        </div>
        <p className="py-4 text-black">{data?.body}</p>

        <div className="flex gap-2">
          <Button
            color="danger"
            size="sm"
            className="text-lg"
            onPress={() => deleteTicket.mutate({ ticketId: ticketFromUrl })}
          >
            Delete
          </Button>
          <Button color="primary" size="sm" className="text-lg">
            Edit
          </Button>
        </div>
      </div>

      <ToastContainer containerId={"unique-ticket-toast"} />
    </div>
  );
}
