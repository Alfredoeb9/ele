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
  { key: "email", label: "EMAIL", sortable: true },
  { key: "status", label: "STATUS", sortable: true },
  { key: "actions", label: "ACTIONS" },
];

export const friendsVisibleColumns = ["id", "username", "email", "actions", "status"];

export const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
  {name: "Inactive", uid: "inactive"},
];

export const tabs = [
  {
    id: "community tournaments",
    label: "Community Tournaments"
  },
  {
    id: "cash matches",
    label: "Cash Matches"
  },
  {
    id: "xp matches",
    label: "XP Matches"
  }
];