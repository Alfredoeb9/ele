export const columns = [
    {
      key: "game",
      label: "GAME",
    },
    {
      key: "platforms",
      label: "PLATFORMS",
    },
    {
      key: "entry",
      label: "ENTRY",
    },
    {
      key: "team_size",
      label: "TEAM SIZE",
    },
    {
      key: "tournament_type",
      label: "COMPETITION",
    },
    {
      key: "support",
      label: "SUPPORT",
    },
    {
      key: "start_time",
      label: "STARTING"
    },
    {
      key: "rules",
      label: "RULES",
    },
    {
      key: "link",
      label: "Run It",
    },
];
  
export const friendsColumns = [
  { key: "id", label: "ID",sortable: true },
  { key: "username", label: "USERNAME", sortable: true },
  { key: "email", label: "EMAIL", sortable: true }
];

export const friendsVisibleColumns = ["id", "username", "email"];

export const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
  {name: "Vacation", uid: "vacation"},
];