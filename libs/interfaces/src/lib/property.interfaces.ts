import { IUser } from './auth.interfaces';

export type ListingReason = 'Rent' | 'Sale';
export type PropertyType = 'Home' | 'Land';
export type HouseType = 'Appartment' | 'Hostel' | 'Default';

export interface IHouseDetails {
  house_type: HouseType;
  number_of_baths: number;
  number_of_rooms: number;
}
export interface ICreateNewProperty {
  area: number;
  price: number;
  address: string;
  description: string;
  house_type: HouseType;
  number_of_baths: number;
  number_of_rooms: number;
  latitude: number | null;
  longitude: number | null;
  property_type: PropertyType;
  listing_reason: ListingReason;
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
  property_type?: PropertyType;
  listing_reason?: ListingReason;
  house_type?: HouseType;
  is_user_property?: boolean;
}

export interface ISearchProperty {
  property_type: PropertyType;
  address?: string;
  description: string;
  priceInterval?: {
    lower_bound?: number;
    upper_bound?: number;
  };
}
