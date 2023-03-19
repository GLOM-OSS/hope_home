export interface ISignup {
  email: string;
  password: string;
  fullname: string;
  whatsapp_number: string;
  phone_number: string;
  gender?: Gender;
}

export interface ISignIn {
  email: string;
  password: string;
}

export type Lang = 'en' | 'fr';

export type Gender = 'Male' | 'Female';

export type Role = 'ADMIN' | 'CLIENT';

export interface IUser {
  person_id: string;
  fullname: string;
  phone_number?: string;
  whatsapp_number: string;
  gender?: Gender;
  email: string;
  preferred_lang: Lang;
  created_at: number;
  role: Role;
  profile_image_ref: string;
}
