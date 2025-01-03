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

export const moneyMatchColumns = [
  {
    key: "game",
    label: "GAME",
  },
  {
    key: "platforms",
    label: "PLATFORMS",
  },
  {
    key: "matchEntry",
    label: "ENTRY",
  },
  {
    key: "teamSize",
    label: "TEAM SIZE",
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

export const nonCashMatchColumns = [
  {
    key: "game",
    label: "GAME",
  },
  {
    key: "platforms",
    label: "PLATFORMS",
  },
  {
    key: "teamSize",
    label: "TEAM SIZE",
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

export const ticketColumns = [
  { key: "id", label: "ID", sortable: true },
  { key: "status", label: "STATUS", sortable: true },
  { key: "actions", label: "ACTIONS" },
];

export const ticketVisibleColumns = ["id", "actions", "status"];

export const ticketOptions = [
  {
    label: "Match Dispute",
    value: "match dispute",
    description: "Create a match dispute from a recent match",
  },
  {
    label: "General",
    value: "genearl",
    description:
      "Create a general ticket regarding the application or a system being down",
  },
];

export const addCashSelectOptions = [
  {
    label: "5",
    value: "5",
    description: "add $5 to your account",
  },
  {
    label: "10",
    value: "10",
    description: "add $10 to your account",
  },
  {
    label: "15",
    value: "15",
    description: "add $15 to your account",
  },
  {
    label: "25",
    value: "25",
    description: "add $25 to your account",
  },
  {
    label: "50",
    value: "50",
    description: "add $50 to your account",
  },
  {
    label: "75",
    value: "75",
    description: "add $75 to your account",
  },
  {
    label: "100",
    value: "100",
    description: "add $100 to your account",
  },
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Inactive", uid: "inactive" },
];

export const matchOptions = [
  { name: "Tournament", uid: "tournament" },
  { name: "Money Match", uid: "money-match" },
  { name: "Regular Match", uid: "regular-match" },
];

export const teamSizeOptions = [
  { name: "Solo", uid: "solo" },
  { name: "Duos", uid: "duos" },
  { name: "Trios", uid: "trios" },
  { name: "Quads", uid: "quads" },
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

export const statusGameMap: Record<string, string> = {
  mw3: "Call of Duty: Modern Warfare 3",
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

export interface TeamCategoryTypes {
  id: {
    category: string[];
  };
}

export const teamCategory = [
  {
    mw3: { category: ["solo", "duo", "trios", "quads"] },
    fornite: { category: ["solo", "duo", "trios", "quads"] },
    "Black Ops 6": { category: ["solo", "duo", "trios", "quads"] },
  },
];

export const gameTitles = [
  {
    mw3: {
      solo: [
        "CDL Search and Destory",
        "CDL Hardpoint",
        "CDL Variant",
        "Rio Only SND",
      ],
      duo: [
        "CDL Search and Destory (duo)",
        "CDL Hardpoint (duo)",
        "CDL Variant (duo)",
        "Rio Only SND (duo)",
        "CDL Control (duo)",
      ],
      trios: [
        "CDL Search and Destory (trios)",
        "CDL Hardpoint (trios)",
        "CDL Variant (trios)",
        "Rio Only SND (trios)",
        "CDL Control (trios)",
      ],
      quads: [
        "CDL Search and Destory (quads)",
        "CDL Hardpoint (quads)",
        "CDL Variant (quads)",
        "Rio Only SND (quads)",
        "CDL Control (quads)",
      ],
    },
    fornite: {
      solo: [
        "Kill Race",
        "Kill Race - Zero Build",
        "Survival DeathMatch",
        "Build Fight",
        "Zone Wars",
      ],
      duo: [
        "Kill Race",
        "Kill Race - Zero Build",
        "Survival DeathMatch",
        "Build Fight",
        "Zone Wars",
      ],
      trios: [
        "Kill Race",
        "Kill Race - Zero Build",
        "Survival DeathMatch",
        "Build Fight",
        "Zone Wars",
      ],
      quads: [
        "Kill Race",
        "Kill Race - Zero Build",
        "Survival DeathMatch",
        "Build Fight",
        "Zone Wars",
      ],
    },
  },
];

export const Rules = [
  {
    mw3: {
      pc_player: ["Allowed", "Not Allowed"],
      snaking: ["Allowed", "Not Allowed"],
      snipers: ["Allowed", "Not Allowed"],
      allowed_input: ["Controller", "MKB", "Controller + MKB"],
    },

    fornite: {
      pc_player: ["Allowed", "Not Allowed"],
      smg: ["Allowed", "Not Allowed"],
    },

    warzone: {
      pc_player: ["Allowed", "Not Allowed"],
      snipers: ["Allowed", "Not Allowed"],
      helicopters: ["Allowed", "Not Allowed"],
    },
  },
];

export const teamSizeRender = [
  {
    mw3: {
      solo: 1,
      duo: 2,
      trios: 3,
      quads: 4,
    },
    fornite: {
      solo: 1,
      duo: 2,
      trios: 3,
      quads: 4,
    },
  },
];

export const leaderBoardColumns = [
  {
    key: "userName",
    label: "NAME",
  },
  {
    key: "wins",
    label: "WINS",
  },
  {
    key: "losses",
    label: "LOSSES",
  },
  {
    key: "matchType",
    label: "Match Type",
  },
  { key: "actions", label: "Actions" },
];
