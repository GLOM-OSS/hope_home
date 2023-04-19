import { createContext } from 'react';
import { IUserState } from './user.interface';

export const initialState: IUserState = {
  activeUser: {
    email: '',
    fullname: '',
    person_id: '',
    preferred_lang: 'fr',
    profile_image_ref: '',
    role: 'CLIENT',
    whatsapp_number: '',
    phone_number: '',
    created_at: Date.now(),
  },
  userDispatch: () => null,
};
const UserContext = createContext(initialState);

export default UserContext;
