import { IUser } from './auth.interfaces';

export interface IHouseDetails {
  number_of_baths: number;
  number_of_rooms: number;
  type: 'Appartment' | 'Hostel' | 'Default';
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
