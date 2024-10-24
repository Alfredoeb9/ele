import { useEffect, useRef, useState } from "react";
import type { Participant } from "../tournaments/[id]/page";

interface BracketGeneratorTypes {
  participants: Participant[];
  totalRounds: number;
  reaminingTeams: Participant[];
}

export default function BracketGenerator({
  participants,
  totalRounds,
  reaminingTeams,
}: BracketGeneratorTypes) {
  const round1Ref = useRef<HTMLInputElement>(null);
  const round2Ref = useRef<HTMLInputElement>(null);
  const round3Ref = useRef<HTMLInputElement>(null);
  const round4Ref = useRef<HTMLInputElement>(null);
  const round5Ref = useRef<HTMLInputElement>(null);
  const [ran, setRan] = useState(0);
  const [firstLoop, setFirstLoop] = useState("undone");
  const [secondLoop, setSecondLoop] = useState("undone");
  const [thirdLoop, setThirdLoop] = useState("undone");
  const [fourthLoop, setFourthLoop] = useState("undone");
  const [fifthLoop, setFifthLoop] = useState("undone");
  // const [roundTracker, setRoundTracker] = useState(totalRounds);
  const [teams, setTeams] = useState(reaminingTeams);
  const [, setWinnerBracket] = useState(reaminingTeams.length === 1);
  const winnerElement = document.createElement("div");

  const [loop, setLoop] = useState<number>(0);

  useEffect(() => {
    setRan(1);
    setTeams(reaminingTeams);
  }, [reaminingTeams, reaminingTeams.length]);

  useEffect(() => {
    if (reaminingTeams.length === 1) setWinnerBracket(true);
  }, [reaminingTeams.length]);

  useEffect(() => {
    if (ran === 1) {
      // LOOP THROUGH PARTICIPANTS AND CREATE THE EVEN BRACKET
      for (let i = 0; i < participants.length - 1; i++) {
        if (i % 2 === 0) {
          const createDiv = document.createElement("div");
          const createVSElement = document.createElement("div");
          const createUl = document.createElement("ul");
          const createLiParticipant1 = document.createElement("li");
          const createLiParticipant2 = document.createElement("li");

          // STYLES
          createDiv.style.display = "flex";
          createDiv.style.flexDirection = "column";
          createDiv.style.justifyContent = "center";
          createDiv.style.margin = "0 22px 40px 22px";
          createDiv.style.flexGrow = "1";
          createDiv.style.position = "relative";

          createLiParticipant1.style.display = "flex";
          createLiParticipant1.style.alignContent = "center";
          createLiParticipant1.style.width = "190px";
          createLiParticipant1.style.height = "50px";
          createLiParticipant1.style.borderRadius = "4px";
          createLiParticipant1.style.border = "2px solid #0000FF";

          createUl.style.display = "flex";
          createUl.style.flexDirection = "column";
          createUl.style.gap = "10px";

          createLiParticipant2.style.display = "flex";
          createLiParticipant2.style.alignContent = "center";
          createLiParticipant2.style.width = "190px";
          createLiParticipant2.style.height = "50px";
          createLiParticipant2.style.borderRadius = "4px";
          createLiParticipant2.style.border = "2px solid #0000FF";

          createLiParticipant1.innerHTML = participants[i].teamName;
          createLiParticipant2.innerHTML = participants[i + 1].teamName;

          createVSElement.innerHTML = "VS";

          const input = round1Ref.current
            ?.appendChild(createDiv)
            .appendChild(createUl);

          input
            ?.appendChild(createLiParticipant1)
            .setAttribute("id", participants[i].teamName);

          input?.appendChild(createVSElement);
          input
            ?.appendChild(createLiParticipant2)
            .setAttribute("id", participants[i + 1].teamName);
        }
        setLoop(i);
        continue;
      }

      setFirstLoop("done");
    }
  }, [participants, ran]);

  useEffect(() => {
    // IF THEIR ARE UNEVEN AMOUNT OF TEAMS CREATE THE DIV FOR THAT

    if (firstLoop === "done" && participants.length % 2 !== 0) {
      const createDiv = document.createElement("div");
      const createUl = document.createElement("ul");
      const createLiParticipant1 = document.createElement("li");

      createDiv.style.display = "flex";
      createDiv.style.flexDirection = "column";
      createDiv.style.justifyContent = "center";
      createDiv.style.margin = "0 22px";
      createDiv.style.flexGrow = "1";
      createDiv.style.position = "relative";

      createLiParticipant1.style.display = "flex";
      createLiParticipant1.style.alignContent = "center";
      createLiParticipant1.style.width = "190px";
      createLiParticipant1.style.height = "50px";
      createLiParticipant1.style.borderRadius = "4px";
      createLiParticipant1.style.border = "2px solid #0000FF";

      createLiParticipant1.innerHTML = participants[loop + 1].teamName;

      const input = round1Ref.current
        ?.appendChild(createDiv)
        .appendChild(createUl);

      input
        ?.appendChild(createLiParticipant1)
        .setAttribute("id", participants[loop + 1].teamName);
    }
  }, [firstLoop, participants]);

  // SECOND ROUND
  useEffect(() => {
    if (firstLoop === "done" && reaminingTeams && secondLoop === "undone") {
      for (let i = 0; i <= reaminingTeams.length - 1; i++) {
        if (i % 2 === 0) {
          const createDiv = document.createElement("div");
          const createVSElement = document.createElement("div");
          const createUl = document.createElement("ul");
          const createLiParticipant1 = document.createElement("li");
          const createLiParticipant2 = document.createElement("li");

          // STYLES
          createDiv.style.display = "flex";
          createDiv.style.flexDirection = "column";
          createDiv.style.justifyContent = "center";
          createDiv.style.margin = "0 22px 40px 22px";
          createDiv.style.flexGrow = "1";
          createDiv.style.position = "relative";

          createLiParticipant1.style.display = "flex";
          createLiParticipant1.style.alignContent = "center";
          createLiParticipant1.style.width = "190px";
          createLiParticipant1.style.height = "50px";
          createLiParticipant1.style.borderRadius = "4px";
          createLiParticipant1.style.border = "2px solid #0000FF";

          createUl.style.display = "flex";
          createUl.style.flexDirection = "column";
          createUl.style.gap = "10px";

          createLiParticipant2.style.display = "flex";
          createLiParticipant2.style.alignContent = "center";
          createLiParticipant2.style.width = "190px";
          createLiParticipant2.style.height = "50px";
          createLiParticipant2.style.borderRadius = "4px";
          createLiParticipant2.style.border = "2px solid #0000FF";

          createLiParticipant1.innerHTML = reaminingTeams[i].teamName;

          createVSElement.innerHTML = "VS";

          const input = round2Ref?.current
            ?.appendChild(createDiv)
            .appendChild(createUl);

          if (reaminingTeams.length === 1) {
            winnerElement.innerHTML = "WINNER!";

            input?.appendChild(winnerElement);
            input
              ?.appendChild(createLiParticipant1)
              .setAttribute("id", reaminingTeams[i].teamName);
          } else {
            if (reaminingTeams[i + 1]?.teamName !== undefined) {
              createLiParticipant2.innerHTML = reaminingTeams[i + 1]?.teamName;
              input
                ?.appendChild(createLiParticipant1)
                .setAttribute("id", reaminingTeams[i].teamName);

              input?.appendChild(createVSElement);
              input
                ?.appendChild(createLiParticipant2)
                .setAttribute("id", reaminingTeams[i + 1]?.teamName);
            }
          }
          setLoop(i);
        }

        // totalRounds++;
        setSecondLoop("done");
        // setRoundTracker(totalRounds);
        // setLoop(i + 1);
        continue;
      }

      // console.log("reaminingTeams", reaminingTeams);
      // console.log("loop22", loop);

      // CREATE THE NEXT BRACKETS DEPENDING ON THE TOTALROUNDS AFTER THE INITIAL
      // ROUND IS CREATED
      if (reaminingTeams.length % 2 !== 0) {
        // console.log("reaming", reaminingTeams);
        // console.log("loop", loop - 2);
        const createDiv = document.createElement("div");
        const createUl = document.createElement("ul");
        const createLiParticipant1 = document.createElement("li");

        createDiv.style.display = "flex";
        createDiv.style.flexDirection = "column";
        createDiv.style.justifyContent = "center";
        createDiv.style.margin = "0 22px";
        createDiv.style.flexGrow = "1";
        createDiv.style.position = "relative";

        createLiParticipant1.style.display = "flex";
        createLiParticipant1.style.alignContent = "center";
        createLiParticipant1.style.width = "190px";
        createLiParticipant1.style.height = "50px";
        createLiParticipant1.style.borderRadius = "4px";
        createLiParticipant1.style.border = "2px solid #0000FF";

        // console.log(
        //   loop !== reaminingTeams.length
        //     ? loop - reaminingTeams.length
        //     : loop - reaminingTeams.length + 2,
        // );

        if (reaminingTeams.length === 1) {
          createLiParticipant1.innerHTML = reaminingTeams[loop].teamName;
        } else {
          // console.log("data", reaminingTeams);
          // console.log("inside else", loop);
          createLiParticipant1.innerHTML =
            reaminingTeams[reaminingTeams.length - 1].teamName;

          const input = round2Ref.current
            ?.appendChild(createDiv)
            .appendChild(createUl);

          input
            ?.appendChild(createLiParticipant1)
            .setAttribute(
              "id",
              reaminingTeams[
                loop !== reaminingTeams.length
                  ? loop - reaminingTeams.length
                  : loop - reaminingTeams.length
              ].teamName,
            );

          setLoop(loop - reaminingTeams.length);
        }
      }
    }
  }, [firstLoop, reaminingTeams]);

  // THIRD ROUND
  useEffect(() => {
    if (
      secondLoop === "done" &&
      teams.length !== reaminingTeams.length &&
      thirdLoop === "undone"
    ) {
      for (let i = 0; i <= reaminingTeams.length - 1; i++) {
        if (i % 2 === 0) {
          const createDiv = document.createElement("div");
          const createVSElement = document.createElement("div");
          const createUl = document.createElement("ul");
          const createLiParticipant1 = document.createElement("li");
          const createLiParticipant2 = document.createElement("li");

          // STYLES
          createDiv.style.display = "flex";
          createDiv.style.flexDirection = "column";
          createDiv.style.justifyContent = "center";
          createDiv.style.margin = "0 22px 40px 22px";
          createDiv.style.flexGrow = "1";
          createDiv.style.position = "relative";

          createLiParticipant1.style.display = "flex";
          createLiParticipant1.style.alignContent = "center";
          createLiParticipant1.style.width = "190px";
          createLiParticipant1.style.height = "50px";
          createLiParticipant1.style.borderRadius = "4px";
          createLiParticipant1.style.border = "2px solid #0000FF";

          createUl.style.display = "flex";
          createUl.style.flexDirection = "column";
          createUl.style.gap = "10px";

          createLiParticipant2.style.display = "flex";
          createLiParticipant2.style.alignContent = "center";
          createLiParticipant2.style.width = "190px";
          createLiParticipant2.style.height = "50px";
          createLiParticipant2.style.borderRadius = "4px";
          createLiParticipant2.style.border = "2px solid #0000FF";

          createLiParticipant1.innerHTML = reaminingTeams[i].teamName;

          createVSElement.innerHTML = "VS";

          const input = round3Ref?.current
            ?.appendChild(createDiv)
            .appendChild(createUl);

          if (reaminingTeams.length === 1) {
            winnerElement.innerHTML = "WINNER!";

            input?.appendChild(winnerElement);
            input
              ?.appendChild(createLiParticipant1)
              .setAttribute("id", reaminingTeams[i].teamName);
          } else {
            if (reaminingTeams[i + 1]?.teamName !== undefined) {
              createLiParticipant2.innerHTML = reaminingTeams[i + 1]?.teamName;
              input
                ?.appendChild(createLiParticipant1)
                .setAttribute("id", reaminingTeams[i].teamName);

              input?.appendChild(createVSElement);
              input
                ?.appendChild(createLiParticipant2)
                .setAttribute("id", reaminingTeams[i + 1].teamName);
            }
          }

          setLoop(i + 1);
        }
        setThirdLoop("done");
        continue;
      }

      // CREATE THE NEXT BRACKETS DEPENDING ON THE TOTALROUNDS AFTER THE INITIAL
      // ROUND IS CREATED

      if (
        secondLoop === "done" &&
        reaminingTeams.length % 2 !== 0 &&
        reaminingTeams.length !== 1
      ) {
        // console.log("reaming", reaminingTeams);
        // console.log("loop 3rd", loop);
        const createDiv = document.createElement("div");
        const createUl = document.createElement("ul");
        const createLiParticipant1 = document.createElement("li");

        createDiv.style.display = "flex";
        createDiv.style.flexDirection = "column";
        createDiv.style.justifyContent = "center";
        createDiv.style.margin = "0 22px";
        createDiv.style.flexGrow = "1";
        createDiv.style.position = "relative";

        createLiParticipant1.style.display = "flex";
        createLiParticipant1.style.alignContent = "center";
        createLiParticipant1.style.width = "190px";
        createLiParticipant1.style.height = "50px";
        createLiParticipant1.style.borderRadius = "4px";
        createLiParticipant1.style.border = "2px solid #0000FF";

        createLiParticipant1.innerHTML =
          reaminingTeams[reaminingTeams.length - 1].teamName;

        const input = round3Ref.current
          ?.appendChild(createDiv)
          .appendChild(createUl);

        input
          ?.appendChild(createLiParticipant1)
          .setAttribute(
            "id",
            reaminingTeams[
              loop !== reaminingTeams.length
                ? reaminingTeams.length - 1
                : loop - reaminingTeams.length
            ].teamName,
          );

        setLoop(loop - reaminingTeams.length);
      }
    }
  }, [secondLoop, reaminingTeams]);

  // Four ROUND
  useEffect(() => {
    if (
      thirdLoop === "done" &&
      teams.length !== reaminingTeams.length &&
      fourthLoop === "undone"
    ) {
      for (let i = 0; i <= reaminingTeams.length - 1; i++) {
        if (i % 2 === 0) {
          // console.log("is this running");
          const createDiv = document.createElement("div");
          const createVSElement = document.createElement("div");
          const createUl = document.createElement("ul");
          const createLiParticipant1 = document.createElement("li");
          const createLiParticipant2 = document.createElement("li");

          // STYLES
          createDiv.style.display = "flex";
          createDiv.style.flexDirection = "column";
          createDiv.style.justifyContent = "center";
          createDiv.style.margin = "0 22px 40px 22px";
          createDiv.style.flexGrow = "1";
          createDiv.style.position = "relative";

          createLiParticipant1.style.display = "flex";
          createLiParticipant1.style.alignContent = "center";
          createLiParticipant1.style.width = "190px";
          createLiParticipant1.style.height = "50px";
          createLiParticipant1.style.borderRadius = "4px";
          createLiParticipant1.style.border = "2px solid #0000FF";

          createUl.style.display = "flex";
          createUl.style.flexDirection = "column";
          createUl.style.gap = "10px";

          createLiParticipant2.style.display = "flex";
          createLiParticipant2.style.alignContent = "center";
          createLiParticipant2.style.width = "190px";
          createLiParticipant2.style.height = "50px";
          createLiParticipant2.style.borderRadius = "4px";
          createLiParticipant2.style.border = "2px solid #0000FF";

          createLiParticipant1.innerHTML = reaminingTeams[i].teamName;

          createVSElement.innerHTML = "VS";

          const input = round4Ref?.current
            ?.appendChild(createDiv)
            .appendChild(createUl);

          if (reaminingTeams.length === 1) {
            // console.log("runing");
            winnerElement.innerHTML = "WINNER!";

            input?.appendChild(winnerElement);
            input
              ?.appendChild(createLiParticipant1)
              .setAttribute("id", reaminingTeams[i].teamName);

            input?.classList.add(
              "font-text-2xl",
              "text-red-500",
              "text-center",
            );
          } else {
            if (reaminingTeams[i + 1]?.teamName !== undefined) {
              createLiParticipant2.innerHTML = reaminingTeams[i + 1]?.teamName;

              input
                ?.appendChild(createLiParticipant1)
                .setAttribute("id", reaminingTeams[i].teamName);

              input?.appendChild(createVSElement);
              input
                ?.appendChild(createLiParticipant2)
                .setAttribute("id", reaminingTeams[i + 1]?.teamName);
            }
          }

          // setLoop(i + 1);
        }
        setFourthLoop("done");
        continue;
      }

      // CREATE THE NEXT BRACKETS DEPENDING ON THE TOTALROUNDS AFTER THE INITIAL
      // ROUND IS CREATED

      if (
        secondLoop === "done" &&
        reaminingTeams.length % 2 !== 0 &&
        reaminingTeams.length !== 1
      ) {
        // console.log("reaming", reaminingTeams);
        // console.log("loop", loop - 2);
        const createDiv = document.createElement("div");
        const createUl = document.createElement("ul");
        const createLiParticipant1 = document.createElement("li");

        createDiv.style.display = "flex";
        createDiv.style.flexDirection = "column";
        createDiv.style.justifyContent = "center";
        createDiv.style.margin = "0 22px";
        createDiv.style.flexGrow = "1";
        createDiv.style.position = "relative";

        createLiParticipant1.style.display = "flex";
        createLiParticipant1.style.alignContent = "center";
        createLiParticipant1.style.width = "190px";
        createLiParticipant1.style.height = "50px";
        createLiParticipant1.style.borderRadius = "4px";
        createLiParticipant1.style.border = "2px solid #0000FF";

        createLiParticipant1.innerHTML = reaminingTeams[loop - 2].teamName;

        const input = round4Ref.current
          ?.appendChild(createDiv)
          .appendChild(createUl);

        input
          ?.appendChild(createLiParticipant1)
          .setAttribute("id", reaminingTeams[loop - 2].teamName);
      }
    }
  }, [thirdLoop, reaminingTeams]);

  // Fifth ROUND
  useEffect(() => {
    if (
      fourthLoop === "done" &&
      teams.length !== reaminingTeams.length &&
      fifthLoop === "undone"
    ) {
      totalRounds = 2;
      // console.log("reaminingTeams1", reaminingTeams);
      for (let i = 0; i <= reaminingTeams.length - 1; i++) {
        // console.log("reaminingTeams2", reaminingTeams);
        if (i % 2 === 0) {
          const createDiv = document.createElement("div");
          const createVSElement = document.createElement("div");
          const createUl = document.createElement("ul");
          const createLiParticipant1 = document.createElement("li");
          const createLiParticipant2 = document.createElement("li");

          // STYLES
          createDiv.style.display = "flex";
          createDiv.style.flexDirection = "column";
          createDiv.style.justifyContent = "center";
          createDiv.style.margin = "0 22px 40px 22px";
          createDiv.style.flexGrow = "1";
          createDiv.style.position = "relative";

          createLiParticipant1.style.display = "flex";
          createLiParticipant1.style.alignContent = "center";
          createLiParticipant1.style.width = "190px";
          createLiParticipant1.style.height = "50px";
          createLiParticipant1.style.borderRadius = "4px";
          createLiParticipant1.style.border = "2px solid #0000FF";

          createUl.style.display = "flex";
          createUl.style.flexDirection = "column";
          createUl.style.gap = "10px";

          createLiParticipant2.style.display = "flex";
          createLiParticipant2.style.alignContent = "center";
          createLiParticipant2.style.width = "190px";
          createLiParticipant2.style.height = "50px";
          createLiParticipant2.style.borderRadius = "4px";
          createLiParticipant2.style.border = "2px solid #0000FF";

          createLiParticipant1.innerHTML = reaminingTeams[i].teamName;

          createVSElement.innerHTML = "VS";

          const input = round5Ref?.current
            ?.appendChild(createDiv)
            .appendChild(createUl);

          // console.log("winnerrrrrr", winnerBracket);
          if (reaminingTeams.length === 1) {
            winnerElement.innerHTML = "WINNER!";

            input?.appendChild(winnerElement);
            input
              ?.appendChild(createLiParticipant1)
              .setAttribute("id", reaminingTeams[i].teamName);

            input?.classList.add(
              "font-text-2xl",
              "text-red-500",
              "text-center",
            );
            // input?.classList.add("text-center");
          } else {
            if (reaminingTeams[i + 1]?.teamName !== undefined) {
              createLiParticipant2.innerHTML = reaminingTeams[i + 1]?.teamName;

              input
                ?.appendChild(createLiParticipant1)
                .setAttribute("id", reaminingTeams[i].teamName);

              input?.appendChild(createVSElement);
              input
                ?.appendChild(createLiParticipant2)
                .setAttribute("id", reaminingTeams[i + 1]?.teamName);
            }
          }

          // setLoop(i + 1);
        }
        setFifthLoop("done");
        continue;
      }

      // CREATE THE NEXT BRACKETS DEPENDING ON THE TOTALROUNDS AFTER THE INITIAL
      // ROUND IS CREATED
      if (
        secondLoop === "done" &&
        reaminingTeams.length % 2 !== 0 &&
        reaminingTeams.length !== 1
      ) {
        // console.log("reaming", reaminingTeams);
        // console.log("loop", loop - 2);
        const createDiv = document.createElement("div");
        const createUl = document.createElement("ul");
        const createLiParticipant1 = document.createElement("li");

        createDiv.style.display = "flex";
        createDiv.style.flexDirection = "column";
        createDiv.style.justifyContent = "center";
        createDiv.style.margin = "0 22px";
        createDiv.style.flexGrow = "1";
        createDiv.style.position = "relative";

        createLiParticipant1.style.display = "flex";
        createLiParticipant1.style.alignContent = "center";
        createLiParticipant1.style.width = "190px";
        createLiParticipant1.style.height = "50px";
        createLiParticipant1.style.borderRadius = "4px";
        createLiParticipant1.style.border = "2px solid #0000FF";

        createLiParticipant1.innerHTML = reaminingTeams[loop - 2].teamName;

        const input = round5Ref.current
          ?.appendChild(createDiv)
          .appendChild(createUl);

        input
          ?.appendChild(createLiParticipant1)
          .setAttribute("id", reaminingTeams[loop - 2].teamName);
      }
    }
  }, [fourthLoop, reaminingTeams]);

  return (
    <div id="main" className="flex">
      <div className="round-one flex flex-col" ref={round1Ref}>
        <h1>Round One</h1>
      </div>
      <div className="round-two flex flex-col" ref={round2Ref}>
        <h1>Round Two</h1>
      </div>
      <div className="round-three flex flex-col" ref={round3Ref}>
        <h1>Round Three</h1>
      </div>
      <div className="round-four flex flex-col" ref={round4Ref}>
        <h1>Round Four</h1>
      </div>
      <div className="round-five flex flex-col" ref={round5Ref}>
        <h1>Round Five</h1>
      </div>
    </div>
  );
}
