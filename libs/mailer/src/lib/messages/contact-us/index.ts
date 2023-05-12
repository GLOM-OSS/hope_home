const subject = {
  fr: 'Service Clientèle',
  en: 'Customer Care',
};

const messageDisclaimer = (username: string) => ({
  fr: `This message was writing to you by ${username}. This message was only send to Hope-Home's platform administrators. Please signal de developer team if you aren't one.`,
  en: `Ce message vous a été écrit par ${username}. Ce message a été envoyé aux administrateurs de la plateforme Hope-Home. Veillez signaler à l'équipe de developpement si vous en etes pas un.`,
});
export const contactUsMessages = {
  subject,
  messageDisclaimer,
};

export type ContactUsMessages = {
  logo: string;
  subject: string;
  message: string;
  messageDisclaimer: string;
};
