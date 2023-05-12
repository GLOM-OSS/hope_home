export enum ErrorEnum {
  ERR1 = 'ERR1',
  ERR2 = 'ERR2',
  ERR3 = 'ERR3',
  ERR4 = 'ERR4',
  ERR5 = 'ERR5',
  ERR6 = 'ERR6',
}

export type Error = {
  code: ErrorEnum;
  message: {
    fr: string;
    en: string;
  };
};
export const appErros: Error[] = [
  {
    code: ErrorEnum.ERR1,
    message: {
      fr: "L'entrée n'est pas une adresse e-mail valide",
      en: 'Input is not a valid email',
    },
  },
  {
    code: ErrorEnum.ERR2,
    message: {
      fr: 'Au moins une image est requise pour créer une propriété.',
      en: 'At least one image is required to create a property.',
    },
  },
  {
    code: ErrorEnum.ERR3,
    message: {
      en: 'The current password is incorrect.',
      fr: 'Le mot de passe courant est incorrect.',
    },
  },
  {
    code: ErrorEnum.ERR4,
    message: {
      fr: 'Un compte existe déjà avec cette adresse email.',
      en: 'An account already exist with this email address.',
    },
  },
  {
    code: ErrorEnum.ERR5,
    message: {
      fr: 'Email ou mot de passe incorrect.',
      en: 'Incorrect email or password.',
    },
  },
  {
    code: ErrorEnum.ERR6,
    message: {
      fr: "Cette email n'est pas encore lié a un compte. Veillez vous s'inscrire.",
      en: 'This email is not yet link to an account. Please sign up.',
    },
  },
];
