import { GrTrophy } from "react-icons/gr";

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
    label: "STARTING",
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
  { key: "id", label: "ID", sortable: true },
  { key: "username", label: "USERNAME", sortable: true },
  { key: "email", label: "EMAIL", sortable: true },
  { key: "status", label: "STATUS", sortable: true },
  { key: "actions", label: "ACTIONS" },
];

export const friendsVisibleColumns = [
  "id",
  "username",
  "email",
  "actions",
  "status",
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Inactive", uid: "inactive" },
];

export const tabs = [
  {
    id: "community tournaments",
    label: "Community Tournaments",
  },
  {
    id: "cash matches",
    label: "Cash Matches",
  },
  {
    id: "xp matches",
    label: "XP Matches",
  },
];

export const statusGameMap: Record<string, any["name"]> = {
  mw3: "Call of Duty: Modern Warare 3",
  fornite: "Fornite",
};

export const friendTableColumn = [
  {
    key: "userId",
    label: "USERID",
  },
  {
    key: "role",
    label: "ROLE",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

export const subscriptionCards = [
  {
    id: 1,
    cost: 5,
    content: [
      "Move you from a 7.5% award match fee to a 3.5% award match fee",
      "High priority ticktes",
      "Tier 1 Emblems",
      "Exclusive tournament and match entries",
    ],
  },
];

export const gameIdsInputs = [
  {
    label: "PSN ID",
    key: "psn_id",
  },
  {
    label: "Xbox Live ID",
    key: "xbox_live_id",
  },
  {
    label: "EPIC Display Name",
    key: "epic_display_name",
  },
  {
    label: "Battle.net",
    key: "battle_net",
  },
  {
    label: "Switch Friend Code",
    key: "switch_friend_code",
  },
  {
    label: "Activision ID",
    key: "activision_id",
  },
  {
    label: "2K ID",
    key: "2k_id",
  },
  {
    label: "Steam Friend Code",
    key: "steam_friend_code",
  },
];

export const tournamentTabs = [
  {
    id: "info",
    label: "INFO",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "rules",
    label: "RULES",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "bracket",
    label: "BRACKET",
    content:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: "teams",
    label: "TEAMS",
    content:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

export const trophys = [
  {
    id: "gold",
    label: "GOLD",
    color: "gold",
  },
  {
    id: "silver",
    label: "SILVER",
    color: "silver",
  },
  {
    id: "brown",
    label: "brown",
    color: "#cd7f32",
  },
];
