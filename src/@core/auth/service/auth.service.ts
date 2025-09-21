import * as AuthInterface from './auth.interface';
import { api, internal } from '@/service/index.service';

export const AuthService = {
  postLogin: async (form: AuthInterface.PostLoginProps) => {
    try {
      const { data } = await api.post<AuthInterface.PostLogin>(
        '/auth/login',
        form,
      );

      await internal.post<AuthInterface.PostLogin>('/api/auth/create-session', {
        ...data,
        email: form.email,
      });

      return data;
    } catch (err) {
      throw err;
    }
  },
  postSignUp: async (form: AuthInterface.PostSignUpProps) => {
    try {
      const { data } = await api.post<AuthInterface.PostLogin>(
        '/auth/signup',
        form,
      );

      await AuthService.postLogin({
        email: form.email,
        password: form.password,
      });

      return data;
    } catch (err) {
      throw err;
    }
  },
};
