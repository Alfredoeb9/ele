export interface MatchFinderTableProps {
  matchId: string;
  // game: string;
  platform: string[];
  // team_size: string;
  matchEntry?: number;
  tournament_type?: string;
  rules: any;
  startTime: string | number | Date;
  gameTitle: string;
  support?: string;
  starting?: string;
  info?: MatchFinderInfoProps[];
}

export interface MatchListProps {
  data: MatchFinderTableProps[];
}

export interface MatchFinderInfoProps {
  pc_players: string;
  snipers: string;
  snaking: string;
  allowed_input: string;
}
