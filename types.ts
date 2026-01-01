
export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  category: string;
  platform: 'PC' | 'Mobile' | 'PS5' | 'Xbox' | 'Multi';
  image: string;
  tags: string[];
  isFeatured?: boolean;
  releaseYear: number;
}

export interface Review {
  id: string;
  gameId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Purchase {
  id: string;
  date: string;
  items: {
    title: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  discount?: number;
  paymentMethod: string;
}

export interface CartItem extends Game {
  quantity: number;
}

export type ViewState = 'store' | 'cart' | 'ai-scout' | 'details' | 'profile' | 'checkout-success' | 'wishlist';
