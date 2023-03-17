export enum ErrorEnum {
  ERR1,
  ERR2,
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
];
