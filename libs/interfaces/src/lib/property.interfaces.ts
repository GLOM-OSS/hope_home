import { IUser } from './auth.interfaces';

export type ListingReason = 'Rent' | 'Sale';
export type PropertyType = 'Home' | 'Land';
export type HouseType = 'Appartment' | 'Hostel' | 'Default';

export interface IHouseDetails {
  type: HouseType;
  number_of_baths: number;
  number_of_rooms: number;
}
export interface CreateNewProperty {
  area: number;
  price: number;
  address: string;
  description: string;
  property_type: PropertyType;
  listing_reason: ListingReason;
  house_details?: IHouseDetails;
}

export interface IHHProperty extends CreateNewProperty {
  property_id: string;
  image_ref: string;
  latitude: number | null;
  longitude: number | null;
  is_liked: boolean;
  number_of_likes: number;

  publisher_details: IUser;
}

export interface IComment {
  publisher: IUser;
  comment: string;
}

export interface IPropertyDetails extends Omit<IHHProperty, 'image_ref'> {
  comments: IComment[];
  image_refs: { image_id: string; image_ref: string }[];
}

export interface PropertyQuery {
  property_type?: PropertyType;
  listing_reason?: ListingReason;
  house_type?: HouseType;
  published_by?: string;
}
