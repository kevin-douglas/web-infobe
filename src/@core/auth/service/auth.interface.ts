export interface PostLoginProps {
  email: string;
  password: string;
}

export interface PostLogin {
  accessToken: string;
  role: "USER" | "ADMIN";
}
