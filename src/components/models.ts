export interface User {
  id: number | null;
  email: string | null;
  confirmed: boolean;
}

export interface Preferences {
  darkMode: boolean | null;
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
