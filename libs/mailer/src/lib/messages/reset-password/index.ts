const resetPasswordTitle = {
  fr: 'Réinitialisation du mot de passe Home hope',
  en: 'Hope home password reset',
};
const resetPasswordSubTitle = (first_name: string) => ({
  fr: `Hello ${first_name}, votre mot de passe a été reinintialisé avec succès.`,
  en: `Hello ${first_name}, your password has been reset successfully. `,
});
const resetPasswordObject = (new_password: string) => ({
  fr: `Votre nouveau mot de passe est: ${new_password}.`,
  en: `Your new password is: ${new_password}.`,
});
const resetPasswordMessage = {
  fr: `Nous ne vous demanderons jamais votre mot de passe et nous vous déconseillons fortement de le partager avec qui que ce soit.`,
  en: `We will never ask you for your password and we strongly advise you not to share it with share it with anyone.`,
};
const resetPasswordCallToAction = {
  fr: 'Connectez-vous',
  en: 'Sign in',
};
export const resetPasswordMessages = {
  resetPasswordTitle,
  resetPasswordSubTitle,
  resetPasswordObject,
  resetPasswordMessage,
  resetPasswordCallToAction,
};

export type ResetPasswordMessages = {
  connexion: string;
  resetPasswordTitle: string;
  resetPasswordSubTitle: string;
  resetPasswordObject: string;
  resetPasswordMessage: string;
  resetPasswordCallToAction: string;
};
