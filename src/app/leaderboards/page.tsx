"use client";
import { api } from "@/trpc/react";

export default function Leaderboards() {
  const leaderboardData = api.user.getAllUsersRecords.useQuery();

  console.log("leader", leaderboardData);
  return (
    <div>
      <h1>this is the leaderboards</h1>
    </div>
  );
}
