import { HelperOptions } from 'handlebars';
import { resetPasswordMessages } from './reset-password';
export { resetPasswordMessages, ResetPasswordMessages } from './reset-password';


export type FormatMessageOptions = {
  messageId: keyof typeof messages;
  lang: 'en' | 'fr';
  options: HelperOptions;
};
export const formatMessage = ({
  options,
  messageId,
  lang,
}: FormatMessageOptions) => {
  return options.fn(messages[messageId][lang]);
};

const messages = { ...resetPasswordMessages };