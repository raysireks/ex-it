export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Blurb {
  id: string;
  text: string;
  votes: number;
  userId: string;
  username: string;
  createdAt: Date;
}

export interface SupportCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

export interface ResourceModule {
  id: string;
  title: string;
  description: string;
  content: string;
}
