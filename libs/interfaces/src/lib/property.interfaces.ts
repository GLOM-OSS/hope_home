import { IUser } from './auth.interfaces';

export  type HouseTypeEnum = "Appartment" | "Hostel" | "Villa" | "Room" | "Studio" | "Duplex" | "Default";
export type PropertyTypeEnum = 'Home' | 'Land';
export type ListingReasonEnum = 'Rent' | 'Sale';
export interface IHouseDetails {
  house_type: HouseTypeEnum;
  number_of_baths: number;
  number_of_rooms: number;
}
export interface ICreateNewProperty {
  area: number;
  price: number;
  address: string;
  description: string;
  house_type: HouseTypeEnum;
  number_of_baths: number;
  number_of_rooms: number;
  latitude: number | null;
  longitude: number | null;
  owner_whatsapp: string | null;
  property_type: PropertyTypeEnum;
  listing_reason: ListingReasonEnum;
}

export interface IUpdateProperty extends Partial<ICreateNewProperty> {
  removedImageIds?: string[];
}

export interface IHHProperty
  extends Omit<
    ICreateNewProperty,
    'house_type' | 'number_of_baths' | 'number_of_rooms'
  > {
  property_id: string;
  image_ref: string;
  latitude: number | null;
  longitude: number | null;
  is_liked: boolean | null;
  is_flagged: boolean;
  is_listed: boolean;
  number_of_likes: number;
  created_at: number;
  house_details?: IHouseDetails;

  publisher_details: IUser;
}

export interface IComment {
  publisher: IUser;
  comment: string;
}

export interface IImage {
  image_id: string;
  image_ref: File | string;
}

export interface IPropertyDetails extends Omit<IHHProperty, 'image_ref'> {
  comments: IComment[];
  image_refs: IImage[];
}

export interface IPropertyQuery {
  property_type?: PropertyTypeEnum;
  listing_reason?: ListingReasonEnum;
  house_type?: HouseTypeEnum;
  is_owner?: boolean;
}
