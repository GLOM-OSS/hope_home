export enum ErrorEnum {
  ERR1,
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
];
