import { IUser } from './auth.interfaces';

export type HouseType = 'Appartment' | 'Hostel' | 'Default';
export interface IHouseDetails {
  number_of_baths: number;
  number_of_rooms: number;
  type: HouseType;
}

export interface IHHProperty {
  property_id: string;
  image_ref: string;
  price: number;
  area: number;
  listing_reason: 'Rent' | 'Sale';
  longitude: number;
  latitude: number;
  description: string;
  property_type: 'Home' | 'Land';
  address: string;
  house_details?: IHouseDetails;
  publisher_details: IUser;
}

export interface IComment {
  publisher: IUser;
  comment: string;
}

export interface IPropertyDetails extends Omit<IHHProperty, 'image_ref'> {
  comments: IComment[];
  image_refs: string[];
}
