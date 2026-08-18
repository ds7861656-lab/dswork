export interface GalleryItem {
  id: string;
  imageUrl: string;
}

export interface Activity {
  id: string;
  galleryId: string;
  title: string;
  rating: string;
  reviews: number;
  price: string;
  unit: string;
  details?: string;
  isSpecial?: boolean;
  image: string;
}
