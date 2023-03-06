export interface ISignIn {
  email: string;
  password: string;
}

export type ILang = 'en' | 'fr';
export type IGender = 'Male' | 'Female';

export enum IRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}
export type IUserRole = {
  user_id: string;
  role: IRole;
};

export interface IUser {
  person_id: string;
  fullname: string;
  phone_number?: string;
  gender?: IGender;
  email: string;
  preferred_lang: ILang;
  created_at: Date;
  roles: IUserRole[];
}
