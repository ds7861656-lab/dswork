export interface GalleryItem {
  id: string;
  imageUrl: string;
}

export interface Activity {
  id: string;
  title: string;
  rating: string;
  reviews: number;
  price: string;
  unit: string;
  unitCount?: number;
  details?: string;
  isSpecial?: boolean;
  image: string;
}
