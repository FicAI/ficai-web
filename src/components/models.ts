export interface User {
  email: string | null;
  confirmed: boolean;
}

export interface TagSignal {
  name: string;
  my_signal: boolean | null;
  for: number;
  against: number;
}

export interface ApiSignal {
  tag: string;
  signal: boolean | null;
  signalsFor: number;
  signalsAgainst: number;
}
