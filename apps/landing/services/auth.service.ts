import { baseURL, http } from '@hopehome/axios';
import { ISignup, ISignIn, IUser } from '@hopehome/interfaces';

export async function signUp(newPerson: ISignup) {
  const {
    data: { access_token },
  } = await http.post('/auth/register', newPerson);
  document.cookie = `__hht=${access_token};`;
  localStorage.setItem('hh-token', access_token);
  return await getUser();
}

export async function signIn(login: ISignIn) {
  const {
    data: { access_token },
  } = await http.post<{ access_token: string }>('/auth/sign-in', login);
  document.cookie = `__hht=${access_token};`;
  localStorage.setItem('hh-token', access_token);
  return await getUser();
}

export async function verifyCredential(token: string, whatsapp_number: number) {
  const {
    data: { access_token },
  } = await http.post('/auth/google', { token, whatsapp_number });
  document.cookie = `__hht=${access_token};`;
  localStorage.setItem('hh-token', access_token);
  return await getUser();
}

export async function resetPassword(email: string) {
  await http.post('/auth/reset-password', { email });
}

export async function setNewPassword(
  reset_password_id: string,
  new_password: string
) {
  await http.post('/auth/new-password', { reset_password_id, new_password });
}

export async function getUser() {
  const {
    data: { profile_image_ref: image_ref, ...user },
  } = await http.get<IUser>('/auth/user');
  return {
    ...user,
    profile_image_ref: image_ref ? `${baseURL}/${image_ref}` : null,
  };
}

export async function requestNewPassword(email: string) {
  await http.post('/auth/request-password', { email });
}

export async function changePassword(
  current_password: string,
  new_password: string
) {
  await http.put('/auth/change-password', { current_password, new_password });
}

export async function updateProfile(
  newPerson: Partial<ISignup>,
  profile?: File
) {
  const formData = new FormData();
  for (const key in newPerson) {
    if (Object.prototype.hasOwnProperty.call(newPerson, key)) {
      const element = newPerson[key];
      formData.append(key, element);
    }
  }
  if (profile) formData.append('profileImageRef', profile, profile.name);
  const { data } = await http.put('/auth/user/edit', formData);
  return data;
}
