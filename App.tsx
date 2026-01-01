import React, { useState, useMemo, useEffect } from 'react';
import { 
  Gamepad2, 
  ShoppingCart, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  Star, 
  ChevronRight, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  Loader2,
  Send,
  User,
  MessageSquare,
  History,
  Settings,
  CheckCircle2,
  Package,
  CreditCard,
  Wallet,
  PartyPopper,
  Library,
  Ticket,
  Tag,
  Sun,
  Moon,
  Heart,
  Download,
  Info,
  SlidersHorizontal,
  RotateCcw,
  Eye,
  Smartphone,
  Laptop,
  Monitor,
  Dribbble,
  Flame,
  Percent,
  BrainCircuit,
  Zap,
  RefreshCw
} from 'lucide-react';
import { GAMES, CATEGORIES, PLATFORMS } from './data';
import { Game, CartItem, ViewState, Review, Purchase } from './types';
import { getGameRecommendations } from './services/geminiService';

// --- Global Discount Applied to all Games ---
const SALE_DISCOUNT_PERCENT = 15;
const SALE_MULTIPLIER = 1 - (SALE_DISCOUNT_PERCENT / 100);

const STORE_GAMES: Game[] = GAMES.map(game => ({
  ...game,
  originalPrice: game.price,
  price: Number((game.price * (game.price > 0 ? SALE_MULTIPLIER : 1)).toFixed(2))
}));

// --- Constants ---
const COUPONS: Record<string, number> = {
  'NEXUS10': 0.10,
  'GAMER20': 0.20,
  'LEGEND50': 0.50,
  'WELCOME': 0.15
};

const YEARS = [2024, 2023, 2022, 2021, 2020];

// --- Helpers ---
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'PC': return <Laptop className="w-3.5 h-3.5" />;
    case 'Mobile': return <Smartphone className="w-3.5 h-3.5" />;
    case 'PS5': return <Gamepad2 className="w-3.5 h-3.5" />;
    case 'Xbox': return <Monitor className="w-3.5 h-3.5" />;
    default: return <Dribbble className="w-3.5 h-3.5" />;
  }
};

// --- Components ---

const Navbar: React.FC<{ 
  cartCount: number; 
  wishlistCount: number;
  onViewChange: (v: ViewState) => void; 
  currentView: ViewState;
  username: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}> = ({ cartCount, wishlistCount, onViewChange, currentView, username, theme, onToggleTheme }) => (
  <nav className="sticky top-0 z-50 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-white/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 transition-colors">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer group" 
        onClick={() => onViewChange('store')}
      >
        <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-600/20">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
          NEXUS
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => onViewChange('store')}
          className={`text-sm font-medium transition-colors ${currentView === 'store' || currentView === 'details' ? 'text-indigo-500 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
        >
          Store
        </button>
        <button 
          onClick={() => onViewChange('ai-scout')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentView === 'ai-scout' ? 'text-indigo-500 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
        >
          <Sparkles className="w-4 h-4" />
          AI Scout
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onToggleTheme}
          className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-all"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button 
          onClick={() => onViewChange('wishlist')}
          className={`relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ${currentView === 'wishlist' ? 'text-rose-500' : ''}`}
        >
          <Heart className={`w-6 h-6 ${currentView === 'wishlist' ? 'fill-rose-500' : ''}`} />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-zinc-950">
              {wishlistCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => onViewChange('profile')}
          className={`flex items-center gap-2 p-2 text-zinc-400 hover:text-indigo-600 dark:hover:text-white transition-colors ${currentView === 'profile' ? 'text-indigo-500' : ''}`}
        >
          <div className="hidden sm:block text-[10px] font-bold uppercase tracking-widest">{username}</div>
          <User className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => onViewChange('cart')}
          className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-zinc-950">
              {cartCount}
            </span>
          )}
        </button>
        <button className="md:hidden p-2 text-zinc-500 dark:text-zinc-400">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </div>
  </nav>
);

const GameCard: React.FC<{ 
  game: Game; 
  onAddToCart: (g: Game) => void; 
  onClick: (g: Game) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  onQuickView: (g: Game) => void;
}> = ({ game, onAddToCart, onClick, onToggleWishlist, isWishlisted, onQuickView }) => (
  <div 
    onClick={() => onClick(game)}
    className="group bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-sm hover:shadow-xl"
  >
    <div className="relative aspect-video overflow-hidden">
      <img 
        src={game.image} 
        alt={game.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
        <span className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100">
          {game.category}
        </span>
        <span className="bg-indigo-600/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-indigo-500/30 text-white flex items-center gap-1">
          <PlatformIcon platform={game.platform} />
          {game.platform}
        </span>
        {game.originalPrice && game.originalPrice > game.price && (
          <span className="bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1 animate-pulse shadow-lg shadow-rose-500/30">
            <Percent className="w-3 h-3" />
            {SALE_DISCOUNT_PERCENT}% OFF
          </span>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(game);
          }}
          className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-indigo-600 hover:text-white"
        >
          <Eye className="w-4 h-4" />
          Quick View
        </button>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(game.id);
        }}
        aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        className={`absolute top-3 right-3 p-2 rounded-full border transition-all duration-300 shadow-lg z-10 
          ${isWishlisted 
            ? 'bg-rose-500 text-white border-rose-500 opacity-100 scale-110' 
            : 'bg-white/90 dark:bg-zinc-950/90 text-rose-500 border-zinc-200 dark:border-zinc-800 opacity-0 group-hover:opacity-100 hover:scale-110'
          } active:scale-95`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
    </div>
    
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {game.title}
          </h3>
          <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{game.releaseYear}</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-500 text-sm">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-medium">{game.rating}</span>
        </div>
      </div>
      
      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
        {game.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          {game.originalPrice && game.originalPrice > game.price && (
             <span className="text-xs text-zinc-400 line-through decoration-rose-500/50">${game.originalPrice.toFixed(2)}</span>
          )}
          <span className="text-xl font-bold text-zinc-900 dark:text-white">${game.price.toFixed(2)}</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(game);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

const QuickViewModal: React.FC<{ 
  game: Game | null; 
  onClose: () => void; 
  onAddToCart: (g: Game) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}> = ({ game, onClose, onAddToCart, isWishlisted, onToggleWishlist }) => {
  if (!game) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-zinc-200 dark:border-zinc-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-1/2 aspect-square md:aspect-auto">
            <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="p-8 md:w-1/2 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                {game.category}
              </span>
              <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1">
                <PlatformIcon platform={game.platform} />
                {game.platform}
              </span>
              <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold ml-auto">
                <Star className="w-3 h-3 fill-current" />
                <span>{game.rating}</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-orbitron font-bold text-zinc-900 dark:text-white mb-2 leading-tight">
              {game.title}
            </h2>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-4">Released {game.releaseYear}</p>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed flex-grow">
              {game.description}
            </p>
            
            <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  {game.originalPrice && game.originalPrice > game.price && (
                    <span className="text-sm text-zinc-400 line-through decoration-rose-500/50">${game.originalPrice.toFixed(2)}</span>
                  )}
                  <span className="text-3xl font-bold text-zinc-900 dark:text-white">${game.price.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => onToggleWishlist(game.id)}
                  className={`p-2 rounded-full border transition-all ${isWishlisted ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500'}`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
              
              <button 
                onClick={() => {
                  onAddToCart(game);
                  onClose();
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewSection: React.FC<{ 
  gameId: string; 
  reviews: Review[]; 
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void; 
  username: string;
}> = ({ gameId, reviews, onAddReview, username }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;
    onAddReview({ gameId, author: username, rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-orbitron font-bold mb-8 flex items-center gap-3 text-zinc-900 dark:text-white">
        <MessageSquare className="w-6 h-6 text-indigo-500" />
        Player Reviews
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 h-fit shadow-sm">
          <h4 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">Write a Review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform active:scale-90"
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating) 
                          ? 'fill-yellow-500 text-yellow-500' 
                          : 'text-zinc-200 dark:text-zinc-700'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">Your Feedback</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with the community..."
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 rounded-xl p-4 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 outline-none transition-all h-32 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={rating === 0 || !comment.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Post Review
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
              <p className="text-zinc-500">No reviews yet. Be the first to play and review!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-600/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{review.author}</h5>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-200 dark:text-zinc-800'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            )).reverse()
          )}
        </div>
      </div>
    </div>
  );
};

const GameDetails: React.FC<{ 
  game: Game; 
  onAddToCart: (g: Game) => void;
  onBack: () => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  username: string;
}> = ({ game, onAddToCart, onBack, onToggleWishlist, isWishlisted, reviews, onAddReview, username }) => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors group">
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Back to Catalog
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
      <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
        <img src={game.image} alt={game.title} className="w-full aspect-video object-cover" />
        {game.originalPrice && game.originalPrice > game.price && (
          <div className="absolute top-6 right-6 bg-rose-500 text-white font-orbitron font-bold py-2 px-6 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
            <Percent className="w-5 h-5" />
            SALE {SALE_DISCOUNT_PERCENT}% OFF
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-600/30">
            {game.category}
          </span>
          <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5">
            <PlatformIcon platform={game.platform} />
            {game.platform}
          </span>
          <div className="flex items-center gap-1 text-yellow-500 font-bold ml-auto">
            <Star className="w-4 h-4 fill-current" />
            <span>{game.rating}</span>
          </div>
        </div>
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-zinc-900 dark:text-white mb-2 leading-tight">
            {game.title}
          </h1>
          <span className="text-sm text-zinc-500 font-bold tracking-[0.2em] uppercase">Released {game.releaseYear}</span>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 leading-relaxed">
          {game.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {game.tags.map(tag => (
            <span key={tag} className="text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-500 px-3 py-1 rounded-lg">
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-col">
            {game.originalPrice && game.originalPrice > game.price && (
               <span className="text-sm text-zinc-400 line-through decoration-rose-500/50 mb-[-4px] ml-1">${game.originalPrice.toFixed(2)}</span>
            )}
            <span className="text-4xl font-bold text-zinc-900 dark:text-white">${game.price.toFixed(2)}</span>
          </div>
          <div className="flex gap-4 w-full">
            <button 
              onClick={() => onAddToCart(game)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add to Cart
            </button>
            <button 
              onClick={() => onToggleWishlist(game.id)}
              className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold ${
                isWishlisted 
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-500' 
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-rose-500 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>

    <ReviewSection gameId={game.id} reviews={reviews} onAddReview={onAddReview} username={username} />
  </div>
);

const WishlistView: React.FC<{
  wishlist: string[];
  onBack: () => void;
  onViewGame: (g: Game) => void;
  onAddToCart: (g: Game) => void;
  onToggleWishlist: (id: string) => void;
  onQuickView: (g: Game) => void;
}> = ({ wishlist, onBack, onViewGame, onAddToCart, onToggleWishlist, onQuickView }) => {
  const wishlistGames = STORE_GAMES.filter(g => wishlist.includes(g.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Store
      </button>

      <div className="flex items-center gap-3 mb-12">
        <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
        <h1 className="text-4xl font-orbitron font-bold text-zinc-900 dark:text-white">Your Wishlist</h1>
      </div>

      {wishlistGames.length === 0 ? (
        <div className="text-center py-32 bg-white dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full inline-block mb-4 border border-zinc-200 dark:border-zinc-800">
            <Heart className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Your wishlist is empty</h3>
          <p className="text-zinc-500 mb-8">Save games you love to see them here later!</p>
          <button 
            onClick={onBack}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            Explore Games
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {wishlistGames.map(game => (
            <GameCard 
              key={game.id} 
              game={game} 
              onAddToCart={onAddToCart} 
              onClick={onViewGame}
              /* Fixed: Changed 'toggleWishlist' to 'onToggleWishlist' */
              onToggleWishlist={onToggleWishlist}
              isWishlisted={true}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CartView: React.FC<{ 
  cart: CartItem[]; 
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onCheckout: (method: string, discount: number) => void;
}> = ({ cart, onUpdateQty, onRemove, onBack, onCheckout }) => {
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal - discountAmount;

  // Global savings tracker for the UI
  const globalSavings = cart.reduce((acc, item) => {
    if (item.originalPrice) {
      return acc + (item.originalPrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);

  const handleApplyCoupon = () => {
    const code = coupon.toUpperCase().trim();
    if (COUPONS[code]) {
      setAppliedDiscount(COUPONS[code]);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setAppliedDiscount(0);
    }
  };

  const paymentOptions = [
    { id: 'Credit Card', icon: CreditCard, label: 'Credit Card' },
    { id: 'Debit Card', icon: CreditCard, label: 'Debit Card' },
    { id: 'PayPal', icon: Wallet, label: 'PayPal' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Store
      </button>

      <h1 className="text-3xl font-orbitron font-bold mb-8 text-zinc-900 dark:text-white">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 shadow-sm">
          <ShoppingCart className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 text-lg mb-6">Your cart is empty.</p>
          <button 
            onClick={onBack}
            className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-full text-white font-bold transition-colors shadow-lg shadow-indigo-600/20"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex gap-4 shadow-sm">
                <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{item.title}</h3>
                    <button onClick={() => onRemove(item.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1">
                      <button 
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="p-1 hover:text-indigo-600 text-zinc-500"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold text-zinc-900 dark:text-zinc-100">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="p-1 hover:text-indigo-600 text-zinc-500"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-col items-end">
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-rose-500 line-through decoration-rose-500/30">
                          ${(item.originalPrice * item.quantity).toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-zinc-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 mt-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === opt.id 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400' 
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <opt.icon className="w-5 h-5" />
                    <span className="font-bold text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Coupon Code</h3>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Enter code (e.g. GAMER20)" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 rounded-xl pl-12 pr-4 py-3 text-zinc-900 dark:text-white outline-none"
                  />
                </div>
                <button 
                  onClick={handleApplyCoupon}
                  className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-red-500 text-sm mt-2 ml-1">{couponError}</p>}
              {appliedDiscount > 0 && (
                <p className="text-green-600 dark:text-green-500 text-sm mt-2 ml-1 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Coupon applied: {appliedDiscount * 100}% off!
                </p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 h-fit sticky top-24 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {globalSavings > 0 && (
                <div className="flex justify-between text-rose-500 font-bold text-sm">
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> Site-wide Discount</span>
                  <span>-${globalSavings.toFixed(2)}</span>
                </div>
              )}
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-500 font-bold">
                  <span>Coupon Discount ({appliedDiscount * 100}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Sales Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex justify-between text-xl font-bold text-zinc-900 dark:text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => onCheckout(paymentMethod, discountAmount)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              Pay with {paymentMethod}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutSuccessView: React.FC<{
  purchase: Purchase | null;
  onGoToProfile: () => void;
  onContinueShopping: () => void;
}> = ({ purchase, onGoToProfile, onContinueShopping }) => {
  if (!purchase) return null;

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <div className="inline-block p-6 bg-green-100 dark:bg-green-600/20 rounded-full mb-8 animate-bounce">
        <PartyPopper className="w-16 h-16 text-green-600 dark:text-green-500" />
      </div>
      <h1 className="text-4xl font-orbitron font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-500">
        Order Confirmed!
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-12">
        Thank you for your purchase. Your digital license is now being issued to your Nexus account.
      </p>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-left mb-12 shadow-2xl">
        <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
          <div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">Order Number</div>
            <div className="font-orbitron font-bold text-zinc-900 dark:text-white">#{purchase.id}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">Date</div>
            <div className="text-zinc-900 dark:text-white font-medium">{purchase.date}</div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {purchase.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{item.title}</span>
                <span className="text-xs text-zinc-400">x{item.quantity}</span>
              </div>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-6 border-t border-zinc-100 dark:border-zinc-800">
           {purchase.discount && purchase.discount > 0 && (
            <div className="flex justify-between items-center text-green-600 dark:text-green-500 text-sm">
              <span className="flex items-center gap-2 font-bold">
                <Tag className="w-4 h-4" />
                Savings Applied
              </span>
              <span>-${purchase.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Paid via {purchase.paymentMethod}</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">${purchase.total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={onGoToProfile}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Library className="w-5 h-5" />
          Go to Library
        </button>
        <button 
          onClick={onContinueShopping}
          className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:text-short rounded-xl font-bold transition-all shadow-sm"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

const ProfileView: React.FC<{
  username: string;
  onUsernameChange: (val: string) => void;
  purchases: Purchase[];
  onBack: () => void;
}> = ({ username, onUsernameChange, purchases, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  const saveUsername = () => {
    onUsernameChange(tempUsername);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
       <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Store
      </button>

      <div className="flex flex-col md:flex-row items-center gap-8 mb-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
        <div className="relative">
          <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-white dark:border-zinc-950 shadow-2xl">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-zinc-900 shadow-sm" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input 
                type="text" 
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-2 text-xl font-bold text-zinc-900 dark:text-white outline-none w-full max-w-xs"
                autoFocus
              />
              <button 
                onClick={saveUsername}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold transition-all"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
              <h1 className="text-3xl font-orbitron font-bold text-zinc-900 dark:text-white">{username}</h1>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 text-zinc-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          )}
          <p className="text-zinc-500">Member since Feb 2024 • Pro Tier</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl text-center shadow-inner">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{purchases.length}</div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Games</div>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl text-center shadow-inner">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{purchases.length * 42}</div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Achievements</div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-orbitron font-bold text-zinc-900 dark:text-white">Purchase History</h2>
        </div>

        {purchases.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl py-20 text-center shadow-sm">
            <Package className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500">Your digital library is empty. Let's find some adventures!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {purchases.map(purchase => (
              <div key={purchase.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:border-indigo-500/20 transition-all">
                {/* Header Information */}
                <div className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-600/20 p-2 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">Order ID: {purchase.id}</div>
                      <div className="text-xs text-zinc-900 dark:text-zinc-100 font-medium">{purchase.date} • {purchase.paymentMethod}</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline transition-all">
                    <Download className="w-3.5 h-3.5" />
                    Download Invoice
                  </button>
                </div>

                {/* Items Detailed List */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {purchase.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.title}</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-600">x{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] text-zinc-400 hidden sm:inline">Unit: ${item.price.toFixed(2)}</span>
                           <span className="font-medium text-zinc-700 dark:text-zinc-300">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col items-end">
                    <div className="w-full max-w-[200px] space-y-2">
                       {purchase.discount && purchase.discount > 0 && (
                        <>
                          <div className="flex justify-between text-xs text-zinc-500">
                            <span>Subtotal</span>
                            <span>${(purchase.total + purchase.discount).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-green-600 dark:text-green-500 font-bold">
                            <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount</span>
                            <span>-${purchase.discount.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t border-zinc-200 dark:border-zinc-700">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tighter">Total</span>
                        <span className="text-xl font-bold text-zinc-900 dark:text-white">${purchase.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950/50 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 italic">
                    <Info className="w-3 h-3" />
                    Digital keys available in your library
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-1.5 rounded-lg transition-all shadow-sm">
                    VIEW ASSETS
                  </button>
                </div>
              </div>
            )).reverse()}
          </div>
        )}
      </div>
    </div>
  );
};

// --- AIScout Component ---

const AIScout: React.FC<{ 
  onAddToCart: (g: Game) => void;
  onViewGame: (g: Game) => void;
  availableGames: Game[];
}> = ({ onAddToCart, onViewGame, availableGames }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; recommendations: { gameTitle: string; reason: string }[] } | null>(null);

  const QUICK_PROMPTS = [
    "Hardcore fighting games for PS5",
    "Relaxing space simulator",
    "Football or Cricket under $30",
    "Cozy RPG with magic",
    "Realistic sports for Xbox"
  ];

  const handleSubmit = async (e?: React.FormEvent, directQuery?: string) => {
    e?.preventDefault();
    const activeQuery = directQuery || query;
    if (!activeQuery.trim() || loading) return;

    setLoading(true);
    setResult(null);
    const res = await getGameRecommendations(activeQuery, availableGames);
    setResult(res);
    setLoading(false);
  };

  const findGameByTitle = (title: string) => {
    return availableGames.find(g => g.title.toLowerCase() === title.toLowerCase());
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="relative inline-block p-4 bg-indigo-100 dark:bg-indigo-600/10 rounded-full mb-6 ring-4 ring-indigo-500/10 animate-pulse">
          <BrainCircuit className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          <div className="absolute -top-1 -right-1 bg-cyan-500 p-1.5 rounded-full shadow-lg shadow-cyan-500/50">
            <Zap className="w-3 h-3 text-white fill-current" />
          </div>
        </div>
        <h1 className="text-5xl font-orbitron font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 drop-shadow-sm">
          Neural Scout v2.0
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
          The Nexus neural network is scanning thousands of possibilities. Describe your ideal game, and I'll find the perfect match.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16">
        <form onSubmit={handleSubmit} className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-3xl -z-10" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your gaming desire (e.g., 'Realistic Cricket on Mobile under $20')"
            className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 focus:border-indigo-500 rounded-2xl py-6 px-8 pr-24 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-all shadow-xl"
          />
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 p-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 group active:scale-95"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Send className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p);
                handleSubmit(undefined, p);
              }}
              className="text-xs font-bold px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-white transition-all active:scale-95"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="w-24 h-24 mb-8 relative">
             <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
             <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin" />
             <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-indigo-500 animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-indigo-500 font-orbitron font-bold text-sm tracking-[0.3em] uppercase animate-pulse">Scanning Nexus Archives</p>
            <p className="text-zinc-400 text-xs italic">Syncing with Gemini-3 neural nodes...</p>
          </div>
          
          {/* Scanning Beam Visual */}
          <div className="mt-8 w-64 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
             <div className="absolute h-full w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer" />
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-orbitron font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Analysis Complete</h2>
            </div>
            <button 
              onClick={() => {
                setResult(null);
                setQuery('');
              }}
              className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Scan
            </button>
          </div>

          <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <BrainCircuit className="w-64 h-64 text-indigo-500" />
            </div>

            <p className="text-zinc-900 dark:text-zinc-100 text-xl font-medium italic mb-10 leading-relaxed border-l-4 border-indigo-500 pl-6">
              "{result.message}"
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {result.recommendations.map((rec, idx) => {
                const game = findGameByTitle(rec.gameTitle);
                return (
                  <div key={idx} className="group flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-2xl hover:-translate-y-1">
                    {game && (
                      <div className="relative aspect-video">
                        <img src={game.image} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-2 left-2 flex gap-1.5">
                           <span className="bg-indigo-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter">AI Pick</span>
                           {game.originalPrice && game.originalPrice > game.price && (
                             <span className="bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter flex items-center gap-0.5">
                               <Percent className="w-2 h-2" /> SALE
                             </span>
                           )}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-orbitron font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-4">{rec.gameTitle}</h3>
                      
                      <div className="mb-6 space-y-2">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <BrainCircuit className="w-3 h-3" /> Neural Logic
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                          "{rec.reason}"
                        </p>
                      </div>

                      {game ? (
                        <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                          <div className="flex flex-col">
                            {game.originalPrice && game.originalPrice > game.price && (
                              <span className="text-[10px] text-zinc-400 line-through">${game.originalPrice.toFixed(2)}</span>
                            )}
                            <span className="font-bold text-zinc-900 dark:text-white">${game.price.toFixed(2)}</span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => onViewGame(game)}
                              className="p-2 text-zinc-400 hover:text-indigo-600 transition-colors"
                              title="View Details"
                            >
                              <Info className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => onAddToCart(game)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-all shadow-md active:scale-95"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 italic">
                          Reference game (not currently in stock)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('nexus_theme') as 'dark' | 'light') || 'dark';
  });
  const [view, setView] = useState<ViewState>('store');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [quickViewGame, setQuickViewGame] = useState<Game | null>(null);
  const [lastPurchase, setLastPurchase] = useState<Purchase | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [platform, setPlatform] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [releaseYear, setReleaseYear] = useState<number | 'All'>('All');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('nexus_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [username, setUsername] = useState(() => localStorage.getItem('nexus_username') || 'NexusGamer');
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('nexus_reviews');
    return saved ? JSON.parse(saved) : [];
  });
  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('nexus_purchases');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light-theme');
      document.body.style.backgroundColor = '#09090b';
      document.body.style.color = '#fafafa';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-theme');
      document.body.style.backgroundColor = '#fafafa';
      document.body.style.color = '#09090b';
    }
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nexus_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('nexus_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('nexus_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('nexus_username', username);
  }, [username]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const filteredGames = useMemo(() => {
    return STORE_GAMES.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase()) || 
                           game.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === 'All' || game.category === category;
      const matchesPlatform = platform === 'All' || game.platform === platform;
      const matchesPrice = game.price >= priceRange[0] && game.price <= priceRange[1];
      const matchesYear = releaseYear === 'All' || game.releaseYear === releaseYear;
      return matchesSearch && matchesCategory && matchesPlatform && matchesPrice && matchesYear;
    });
  }, [search, category, platform, priceRange, releaseYear]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setPlatform('All');
    setPriceRange([0, 100]);
    setReleaseYear('All');
  };

  const addToCart = (game: Game) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === game.id);
      if (existing) {
        return prev.map(item => item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...game, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = (paymentMethod: string, discount: number) => {
    if (cart.length === 0) return;
    
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal - discount;

    const newPurchase: Purchase = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: cart.map(item => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      total,
      discount,
      paymentMethod
    };

    setPurchases(prev => [...prev, newPurchase]);
    setLastPurchase(newPurchase);
    setCart([]);
    setView('checkout-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewGame = (game: Game) => {
    setSelectedGame(game);
    setView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setReviews(prev => [...prev, newReview]);
  };

  const featuredGame = STORE_GAMES.find(g => g.isFeatured) || STORE_GAMES[0];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Global Sale Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 py-1.5 px-4 text-center text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center justify-center gap-3">
        <Percent className="w-3 h-3 md:w-4 md:h-4 animate-spin-slow" />
        Flash Sale: 15% Off All Digital Downloads!
        <Flame className="w-3 h-3 md:w-4 md:h-4 animate-bounce" />
      </div>

      <Navbar 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
        wishlistCount={wishlist.length}
        onViewChange={setView} 
        currentView={view}
        username={username}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <QuickViewModal 
        game={quickViewGame} 
        onClose={() => setQuickViewGame(null)} 
        onAddToCart={addToCart}
        isWishlisted={quickViewGame ? wishlist.includes(quickViewGame.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950 transition-colors">
        {view === 'store' && (
          <>
            {/* Hero Section */}
            <div className="relative h-[65vh] w-full overflow-hidden">
              <img 
                src={featuredGame.image} 
                alt="Featured Game" 
                className="w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-20 max-w-7xl mx-auto">
                <span className="text-rose-400 font-bold tracking-[0.2em] mb-2 uppercase drop-shadow-lg flex items-center gap-2">
                  <Flame className="w-4 h-4" /> Best Seller • On Sale
                </span>
                <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 text-white max-w-2xl leading-tight drop-shadow-2xl">
                  {featuredGame.title}
                </h1>
                <p className="text-zinc-200 text-lg md:text-xl max-w-xl mb-8 leading-relaxed drop-shadow-md">
                  {featuredGame.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => addToCart(featuredGame)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold flex flex-col items-center transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Get It Now
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className="text-xs line-through opacity-60 decoration-rose-400">${featuredGame.originalPrice?.toFixed(2)}</span>
                       <span className="text-sm font-orbitron">${featuredGame.price.toFixed(2)}</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleViewGame(featuredGame)}
                    className="bg-zinc-800/60 hover:bg-zinc-700/80 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold transition-all border border-zinc-700/50"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Monitor className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-xl font-orbitron font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Select Platform</h2>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar scrollbar-hide">
                  {PLATFORMS.map(plat => (
                    <button
                      key={plat}
                      onClick={() => setPlatform(plat)}
                      className={`whitespace-nowrap px-8 py-3 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${
                        platform === plat 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-indigo-400 dark:hover:border-zinc-700 hover:text-indigo-600 dark:hover:text-white shadow-sm'
                      }`}
                    >
                      {plat !== 'All' && <PlatformIcon platform={plat} />}
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scrollbar-hide">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold border transition-all ${
                        category === cat 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-indigo-400 dark:hover:border-zinc-700 hover:text-indigo-600 dark:hover:text-white shadow-sm'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <div className="relative group min-w-[300px] flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search games..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 rounded-xl pl-12 pr-6 py-3 text-zinc-900 dark:text-zinc-100 outline-none w-full transition-all shadow-sm focus:shadow-md"
                    />
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-bold transition-all ${showFilters ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'}`}
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-12 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-widest">Price Range</label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <span className="text-[10px] text-zinc-400 block mb-1">MIN</span>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                              <input 
                                type="number" 
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 pl-7 pr-3 text-sm outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] text-zinc-400 block mb-1">MAX</span>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                              <input 
                                type="number" 
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 pl-7 pr-3 text-sm outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    </div>

                    {/* Release Year */}
                    <div>
                      <label className="block text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-widest">Release Year</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setReleaseYear('All')}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${releaseYear === 'All' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300'}`}
                        >
                          All
                        </button>
                        {YEARS.map(year => (
                          <button 
                            key={year}
                            onClick={() => setReleaseYear(year)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${releaseYear === year ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300'}`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col justify-end gap-3">
                      <button 
                        onClick={resetFilters}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-sm font-bold transition-all text-zinc-600 dark:text-zinc-300"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset All Filters
                      </button>
                      <button 
                         onClick={() => setShowFilters(false)}
                         className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/20"
                      >
                        Apply {filteredGames.length} Results
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {filteredGames.map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game} 
                      onAddToCart={addToCart} 
                      onClick={handleViewGame}
                      onToggleWishlist={toggleWishlist}
                      isWishlisted={wishlist.includes(game.id)}
                      onQuickView={setQuickViewGame}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-white dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full inline-block mb-4 border border-zinc-200 dark:border-zinc-800">
                    <Search className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">No games found</h3>
                  <p className="text-zinc-500 mb-6">Your current filter configuration returned 0 results.</p>
                  <button 
                    onClick={resetFilters}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {view === 'wishlist' && (
          <WishlistView 
            wishlist={wishlist}
            onBack={() => setView('store')}
            onAddToCart={addToCart}
            onViewGame={handleViewGame}
            onToggleWishlist={toggleWishlist}
            onQuickView={setQuickViewGame}
          />
        )}

        {view === 'cart' && (
          <CartView 
            cart={cart} 
            onUpdateQty={updateQty} 
            onRemove={removeFromCart}
            onBack={() => setView('store')}
            onCheckout={handleCheckout}
          />
        )}

        {view === 'checkout-success' && (
          <CheckoutSuccessView 
            purchase={lastPurchase}
            onGoToProfile={() => setView('profile')}
            onContinueShopping={() => setView('store')}
          />
        )}

        {view === 'ai-scout' && (
          <AIScout 
            onAddToCart={addToCart} 
            onViewGame={handleViewGame}
            availableGames={STORE_GAMES} 
          />
        )}

        {view === 'details' && selectedGame && (
          <GameDetails 
            game={selectedGame} 
            onAddToCart={addToCart}
            onBack={() => setView('store')}
            onToggleWishlist={toggleWishlist}
            isWishlisted={wishlist.includes(selectedGame.id)}
            reviews={reviews.filter(r => r.gameId === selectedGame.id)}
            onAddReview={handleAddReview}
            username={username}
          />
        )}

        {view === 'profile' && (
          <ProfileView 
            username={username}
            onUsernameChange={setUsername}
            purchases={purchases}
            onBack={() => setView('store')}
          />
        )}
      </main>

      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 py-12 px-4 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/20">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-orbitron font-bold text-zinc-900 dark:text-white tracking-wider">
                NEXUS
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-500 max-sm leading-relaxed mb-6">
              The premier digital destination for elite gaming experiences. Discover, play, and connect with millions across the globe.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Discord', 'Instagram', 'YouTube'].map(social => (
                <a key={social} href="#" className="text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
                  {social}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-orbitron font-bold mb-6 uppercase tracking-wider text-sm text-zinc-900 dark:text-white">Navigation</h4>
            <ul className="space-y-4 text-zinc-500 dark:text-zinc-400 text-sm">
              <li><button onClick={() => setView('store')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Store</button></li>
              <li><button onClick={() => setView('ai-scout')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">AI Scout</button></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">News</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-orbitron font-bold mb-6 uppercase tracking-wider text-sm text-zinc-900 dark:text-white">Legal</h4>
            <ul className="space-y-4 text-zinc-500 dark:text-zinc-400 text-sm">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Cookie Settings</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-zinc-100 dark:border-zinc-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © 2024 Nexus Gaming Store. All rights reserved.
          </p>
          <div className="flex gap-6 opacity-30 dark:opacity-30 grayscale hover:grayscale-0 transition-all cursor-pointer">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
          </div>
        </div>
      </footer>
    </div>
  );
}
