import { baseURL, http } from '@hopehome/axios';
import {
  ICreateNewProperty,
  IHHProperty,
  IImage,
  IPropertyDetails,
  IPropertyQuery,
  IUpdateProperty,
} from '@hopehome/interfaces';

export async function getProperties(query?: IPropertyQuery) {
  const { data } = await http.get<IHHProperty[]>('/properties/all', {
    params: query,
  });
  return data.map(
    ({
      publisher_details: { profile_image_ref, ...publisher },
      image_ref,
      ...property
    }) => ({
      ...property,
      image_ref: image_ref ? `${baseURL}/${image_ref}` : null,
      publisher_details: {
        ...publisher,
        profile_image_ref: profile_image_ref
          ? `${baseURL}/${profile_image_ref}`
          : null,
      },
    })
  );
}

export async function getPropertyDetails(property_id: string) {
  const {
    data: {
      image_refs,
      publisher_details: { profile_image_ref: image_ref, ...publisher },
      ...property
    },
  } = await http.get<IPropertyDetails>(`/properties/${property_id}/details`);
  return {
    ...property,
    publisher_details: {
      ...publisher,
      profile_image_ref: image_ref ? `${baseURL}/${image_ref}` : null,
    },
    image_refs: image_refs.map(({ image_id, image_ref }) => ({
      image_id,
      image_ref: image_ref ? `${baseURL}/${image_ref}` : null,
    })),
  };
}

export async function getPropertyImages(property_id: string) {
  const { data } = await http.get<IImage[]>(
    `/properties/${property_id}/images`
  );
  return data.map(({ image_id, image_ref }) => ({
    image_id,
    image_ref: image_ref ? `${baseURL}/${image_ref}` : null,
  }));
}

export async function createNewProperty(
  newProperty: ICreateNewProperty,
  files: File[]
) {
  const formData = new FormData();
  for (const key in newProperty) {
    if (Object.prototype.hasOwnProperty.call(newProperty, key)) {
      const element = newProperty[key];
      if (element) formData.append(key, element);
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
  { removedImageIds, ...newProperty }: Partial<IUpdateProperty>,
  files?: File[]
) {
  const formData = new FormData();
  for (const key in newProperty) {
    if (Object.prototype.hasOwnProperty.call(newProperty, key)) {
      const element = newProperty[key];
      formData.append(key, element);
    }
  }
  if (files)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append('imageRefs', file);
    }
  await Promise.all(removedImageIds.map((imageId) => deleteImage(imageId)));
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

export async function likeDislike(property_id: string) {
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

export async function searchProperties(keywords: string) {
  const { data } = await http.get<IHHProperty[]>(`/properties`, {
    params: { keywords },
  });
  return data.map(({ image_ref, ...property }) => ({
    ...property,
    image_ref: image_ref ? `${baseURL}/${image_ref}` : null,
  }));
}
