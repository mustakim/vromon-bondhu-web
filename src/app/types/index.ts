export interface IPlace {
  id: string;
  name: string;
  description: string;
  image?: string[];
  latitude?: number;
  longitude?: number;
  popular?: boolean;
  rating?: number;
}
