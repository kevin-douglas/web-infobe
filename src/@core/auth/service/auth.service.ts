import * as AuthInterface from "./auth.interface";
import { api } from "@/service/index.service";

export const AuthService = {
  postLogin: async (data: AuthInterface.PostLoginProps) =>
    api.post<AuthInterface.PostLogin>("auth/login", data),
};
