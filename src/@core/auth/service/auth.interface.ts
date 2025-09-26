export interface PostLoginProps {
  email: string;
  password: string;
}

export interface PostLogin {
  accessToken: string;
  role: 'USER' | 'ADMIN';
  name: string;
}

export interface PostSignUpProps {
  name: string;
  email: string;
  tax_identifier: string;
  password: string;
}
