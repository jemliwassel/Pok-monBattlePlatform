//user.model.ts

type User = Admin | Player | Reporter;

enum UserRole {
  PLAYER = "player",
  ADMIN = "admin",
  REPORTER = "reporter",
}

//Admin model
type Admin = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole.ADMIN;
};

//Player model
type Player = {
  id: number;
  name: string;
  email: string;
  password: string;
  score: number;
  badges: string[];
  role: UserRole.PLAYER;
};

//Reporter model
type Reporter = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole.REPORTER;
};

export { User };
