import { http } from '@hopehome/axios';
import {
  CreateNewProperty,
  IHHProperty,
  IImage,
  IPropertyDetails,
  PropertyQuery,
  UpdateProperty,
} from '@hopehome/interfaces';

export async function getProperties(query?: PropertyQuery) {
  const { data } = await http.get<IHHProperty[]>('/properties/all', {
    params: query,
  });
  return data;
}

export async function getPropertyDetails(property_id: string) {
  const { data } = await http.get<IPropertyDetails>(
    `/properties/${property_id}/details`
  );
  return data;
}

export async function getPropertyImages(property_id: string) {
  const { data } = await http.get<IImage[]>(
    `/properties/${property_id}/images`
  );
  return data;
}

export async function createNewProperty(
  { house_details, ...newProperty }: CreateNewProperty,
  files?: FileList
) {
  const dataObject = house_details
    ? { ...house_details, ...newProperty }
    : newProperty;
  const formData = new FormData();
  for (const key in dataObject) {
    if (Object.prototype.hasOwnProperty.call(dataObject, key)) {
      const element = dataObject[key];
      formData.append(key, element);
    }
  }
  if (files)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append('imageRefs', file);
    }
  const { data } = await http.post<IHHProperty>('/properties/new', formData);
  return data;
}

export async function updateProperty(
  property_id: string,
  { house_details, ...newProperty }: Partial<UpdateProperty>,
  files?: File[]
) {
  const dataObject = house_details
    ? { ...house_details, ...newProperty }
    : newProperty;
  const formData = new FormData();
  for (const key in dataObject) {
    if (Object.prototype.hasOwnProperty.call(dataObject, key)) {
      const element = dataObject[key];
      formData.append(key, element);
    }
  }
  if (files)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append('imageRefs', file);
    }
  const { data } = await http.put<IHHProperty>(
    `/properties/${property_id}/edit`,
    formData
  );
  return data;
}

export async function delistProperty(property_id: string) {
  await http.put(`/properties/${property_id}/delist`);
}

export async function deleteProperty(property_id: string) {
  await http.put(`/properties/${property_id}/delete`);
}

export async function likeOrUnlike(property_id: string) {
  await http.put(`/properties/${property_id}/like`);
}

export async function commentOnProperty(property_id: string) {
  const { data } = await http.post(`/properties/${property_id}/comment`);
  return data;
}

export async function deleteComment(comment_id: string) {
  await http.put(`/properties/comments/${comment_id}/delete`);
}

export async function flagProperty(property_id: string) {
  await http.put(`/properties/${property_id}/flag`);
}

export async function deleteImage(property_image_id: string) {
  await http.put(`/properties/images/${property_image_id}/delete`);
}
