const subject = {
  fr: 'Service Clientèle',
  en: 'Customer Care',
};

const messageDisclaimer = (name: string) => ({
  fr: `This message was writing to you by ${name}. This message was only send to Hope-Home's platform administrators. Please signal de developer team if you aren't one.`,
  en: `Ce message vous a été écrit par ${name}. Ce message a été envoyé aux administrateurs de la plateforme Hope-Home. Veillez signaler à l'équipe de developpement si vous en etes pas un.`,
});
const reponseTo = {
  fr: 'Repondez à',
  en: 'Reply to',
};
export const contactUsMessages = {
  subject,
  reponseTo,
  messageDisclaimer,
};

export type ContactUsMessages = {
  logo: string;
  email: string;
  subject: string;
  message: string;
  responseTo: string;
  messageDisclaimer: string;
};
