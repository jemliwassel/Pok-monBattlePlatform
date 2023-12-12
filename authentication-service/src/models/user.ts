type User = Player | Admin | Reporter;

export { User };

type Player = {
  id: number;
  name: string;
  role: "Player";
  score: number;
  badges: string[];
  email: string;
  password: string;
  visibility: boolean;
};

type Admin = {
  id: number;
  name: string;
  role: "Admin";
  email: string;
  password: string;
  visibility: boolean;
};

type Reporter = {
  id: number;
  name: string;
  role: "Reporter";
  email: string;
  password: string;
  visibility: boolean;
};
