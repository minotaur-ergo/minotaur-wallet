interface RegisteredXPub {
  xpub: string;
  registered: boolean;
}

interface RegisteredTeam {
  name: string;
  id: string;
  m: number;
  xpubs: Array<RegisteredXPub>;
  address: string;
}

export type { RegisteredTeam, RegisteredXPub };
