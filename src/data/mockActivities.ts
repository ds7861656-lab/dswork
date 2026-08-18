import { type GalleryItem, type Activity } from '../types/activity';

export const mockGalleryItems: GalleryItem[] = [
  { id: '1', imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: '2', imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: '3', imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: '4', imageUrl: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" }
];

export const mockActivities: Activity[] = [
  {
    id: '101',
    title: 'Mauritius Watch Whale',
    rating: '5.00',
    reviews: 180,
    price: '800rmb',
    unit: 'person',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '102',
    title: 'Mauritius Watch Whale',
    rating: '5.00',
    reviews: 180,
    price: '4000rmb',
    unit: 'boat',
    unitCount: 10,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '103',
    title: 'Mauritius Whale Film',
    rating: '5.00',
    reviews: 180,
    price: '15500rmb',
    unit: 'person',
    image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];
