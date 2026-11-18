// ============================================================
// FrameSafe — Global Types
// ============================================================

export type UserRole = 'PHOTOGRAPHER' | 'CLIENT';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  token: string;
  user: User;
}

export interface PhotographerProfile {
  id: string;
  userId: string;
  brandName: string;
  bio?: string;
  instagram?: string;
  whatsapp?: string;
  qrisUrl?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface ClientProfile {
  id: string;
  userId: string;
  name: string;
  phone?: string;
  user?: User;
}

// -------------------- ALBUM --------------------
export type AlbumStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED';

export interface Album {
  id: string;
  title: string;
  clientName?: string;
  photographerId: string;
  status: AlbumStatus;
  description?: string;
  createdAt: string;
  photographer?: PhotographerProfile;
  photos?: Photo[];
  purchases?: Purchase[];
  _count?: {
    photos: number;
    purchases: number;
  };
}

// -------------------- PHOTO --------------------
export type PhotoProcessingStatus = 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';

export interface Photo {
  id: string;
  albumId: string;
  previewUrl: string;
  highResUrl?: string;
  isPaid: boolean;
  createdAt: string;
  originalUrl?: string;
  processingStatus: PhotoProcessingStatus;
  album?: Album;
}

// -------------------- PURCHASE --------------------
export type PurchaseType = 'ALBUM' | 'PHOTO';
export type PurchaseStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface Purchase {
  id: string;
  buyerId: string;
  albumId?: string;
  photoId?: string;
  type: PurchaseType;
  status: PurchaseStatus;
  createdAt: string;
  expiredAt: string;
  payment?: Payment;
  album?: Album;
  photo?: Photo;
  buyer?: User;
}

// -------------------- PAYMENT --------------------
export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'PROOF_UPLOADED'
  | 'REJECTED'
  | 'EXPIRED';

export interface Payment {
  id: string;
  status: PaymentStatus;
  proofUrl?: string;
  purchaseId: string;
  createdAt: string;
  updatedAt: string;
  purchase?: Purchase;
}

// -------------------- API RESPONSE --------------------
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// -------------------- DASHBOARD --------------------
export interface PhotographerDashboardStats {
  totalAlbums: number;
  pendingPayments: number;
  completedPayments: number;
  pendingPurchases: number;
  revenue: number;
  recentAlbums: Album[];
  recentPurchases: Purchase[];
  recentPayments: Payment[];
}
