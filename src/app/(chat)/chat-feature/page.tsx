"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

function AddMessageForm({ onMessagePost }: { onMessagePost: () => void }) {
  const addPost = api.post.add.useMutation();
  const utils = api.useUtils();
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [enterToPostMessage, setEnterToPostMessage] = useState(true);

  async function postMessage() {
    const input = {
      text: message,
    };

    try {
      console.log("adding input", input);
      await addPost.mutateAsync(input);
      await utils.post.infinite.invalidate();
      setMessage("");
      onMessagePost();
    } catch {
      console.log("error has occured");
    }
  }

  const isTyping = api.post.isTyping.useMutation();

  const userName = session?.user.username;

  if (!userName) {
    return (
      <div className="flex w-full justify-between rounded bg-gray-800 px-3 py-2 text-lg text-gray-200">
        <p className="font-bold">
          You have to{" "}
          <button
            className="inline font-bold underline"
            // onClick={() => signIn()}
          >
            sign in
          </button>{" "}
          to write.
        </p>
        <button
          // onClick={() => signIn()}
          data-testid="signin"
          className="h-full rounded bg-indigo-500 px-4"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          /**
           * In a real app you probably don't want to use this manually
           * Checkout React Hook Form - it works great with tRPC
           * @see https://react-hook-form.com/
           */
          await postMessage();
        }}
      >
        <fieldset disabled={addPost.isPending} className="min-w-0">
          <div className="flex w-full items-end rounded bg-gray-500 px-3 py-2 text-lg text-gray-200">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={325}
              className={`max-h-40 flex-1 bg-transparent outline-0 ${message.length > 250 && "text-red-500"}`}
              rows={message.split(/\r|\n/).length}
              id="text"
              name="text"
              autoFocus
              onKeyDown={async (e) => {
                if (e.key === "Shift") {
                  setEnterToPostMessage(false);
                }
                if (e.key === "Enter" && enterToPostMessage) {
                  void postMessage();
                }
                isTyping.mutate({ typing: true });
              }}
              onKeyUp={(e) => {
                if (e.key === "Shift") {
                  setEnterToPostMessage(true);
                }
              }}
              onBlur={() => {
                setEnterToPostMessage(true);
                isTyping.mutate({ typing: false });
              }}
            />
            <div>
              <button
                disabled={message.length > 250}
                type="submit"
                className="rounded bg-indigo-500 px-4 py-1"
              >
                Submit
              </button>
            </div>
          </div>
        </fieldset>
        {addPost.error && (
          <p style={{ color: "red" }}>{addPost.error.message}</p>
        )}
        {message.length > 250 && (
          <p style={{ color: "red" }}>
            Message must be less than 250 characters.
          </p>
        )}
      </form>
    </>
  );
}

export default function ChatFeature() {
  const postsQuery = api.post.infinite.useInfiniteQuery(
    {},
    {
      getNextPageParam: (d) => d.nextCursor,
    },
  );

  const utils = api.useUtils();
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = postsQuery;
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  //lis of messages that are rendered
  const [messages, setMessages] = useState(() => {
    const msgs = postsQuery.data?.pages.map((page) => page.items).flat();
    return msgs;
  });

  type Post = NonNullable<typeof messages>[number];
  const { data: session } = useSession();
  const userName = session?.user?.username;
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  //fn to add a dedupe new messages onto state
  const addMessages = useCallback((incoming?: Post[]) => {
    setMessages((current) => {
      const map: Record<Post["id"], Post> = {};

      for (const msg of current ?? []) {
        map[msg.id] = msg;
      }

      for (const msg of incoming ?? []) {
        map[msg.id] = msg;
      }

      return Object.values(map).sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    });
  }, []);

  // when new data from 'useIfiniteQuery', merge with current state
  useEffect(() => {
    const msgs = postsQuery.data?.pages.map((page) => page.items).flat();
    addMessages(msgs);
  }, [postsQuery.data?.pages, addMessages]);

  const scrollToBottomOfList = useCallback(() => {
    if (scrollTargetRef.current == null) {
      return;
    }

    scrollTargetRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [scrollTargetRef]);

  useEffect(() => {
    scrollToBottomOfList();
  }, []);

  function timeFormatter(date: Date) {
    return format(date, "hh:mm aa");
  }

  function dateFormatter(date: Date) {
    return format(date, "do MMMM");
  }

  // subscribe to new posts and add
  api.post.onAdd.useSubscription(undefined, {
    enabled: true,
    onData: (data) => {
      console.log("Received new post:", data); // Add debugging
      // Convert timestamp if needed
      const formattedData = {
        ...data,
        createdAt: new Date(
          typeof data.createdAt === "number"
            ? data.createdAt * 1000
            : data.createdAt,
        ),
      };
      addMessages([data]);
      void utils.post.infinite.invalidate();
    },

    onError(err) {
      console.error("Subscription error:", err);

      // we might have missed a message - invalidate cache
      void utils.post.infinite.invalidate();
    },
  });

  api.post.whoIsTyping.useSubscription(undefined, {
    enabled: true,
    onData: (data) => {
      setTypingUsers(data);
    },
    onError(err) {
      console.error("Typing subscription error:", err);
    },
  });

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row">
        <section className="flex w-full flex-col bg-gray-800 md:w-72">
          <div className="flex-1 overflow-y-hidden">
            <div className="flex h-full flex-col divide-y divide-gray-700">
              <header className="p-4">
                <h1 className="text-3xl font-bold text-gray-50">
                  tRPC WebSocket
                </h1>
              </header>
              <div className="hidden flex-1 space-y-6 overflow-y-auto p-4 text-gray-400 md:block">
                {userName && (
                  <article>
                    <h2 className="text-lg text-gray-200">User information</h2>
                    <ul className="space-y-2">
                      <li className="text-lg">
                        You&apos;re{" "}
                        <input
                          id="name"
                          name="name"
                          type="text"
                          disabled
                          className="bg-transparent"
                          value={userName}
                        />
                      </li>
                    </ul>
                  </article>
                )}
              </div>
            </div>
          </div>
          <div className="hidden h-16 shrink-0 md:block"></div>
        </section>
        <div className="flex-1 overflow-y-hidden md:h-screen">
          <section className="flex h-full flex-col justify-end space-y-4 bg-gray-700 p-4">
            <div className="space-y-4 overflow-y-auto">
              <button
                data-testid="loadMore"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                className="rounded bg-indigo-500 px-4 py-2 text-white disabled:opacity-40"
              >
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                    ? "Load More"
                    : "Nothing more to load"}
              </button>
              <div className="space-y-4">
                {messages?.map((item) => (
                  <article key={item.id} className="text-gray-50">
                    <header className="flex space-x-2 text-sm">
                      <span className="text-gray-500">
                        {new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(item.createdAt))}
                      </span>
                    </header>
                    <p className="whitespace-pre-line text-xl leading-tight">
                      {item.message}
                    </p>
                  </article>
                ))}
                <div ref={scrollTargetRef}></div>
              </div>
            </div>
            <div className="w-full">
              <AddMessageForm onMessagePost={() => scrollToBottomOfList()} />
              <p className="h-2 italic text-gray-400">
                {typingUsers.length > 0
                  ? `${typingUsers.join(", ")} typing...`
                  : ""}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
