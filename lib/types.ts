// User Address Type
export type UserAddress = {
  id: string
  userId: string
  fullName: string
  phoneNumber: string
  pincode: string
  city: string
  state: string
  fullAddress: string
  isDefault?: boolean
  createdAt: string
  updatedAt: string
}

// Order Type
export type Order = {
  id: string
  userId: string
  bookId: string
  addressId: string
  status: "pending" | "processing" | "completed" | "failed"
  amount: number
  razorpayOrderId?: string
  razorpayPaymentId?: string
  createdAt: string
  updatedAt: string
}

// Razorpay Order Response
export type RazorpayOrderResponse = {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  attempts: number
  notes: Record<string, any>
  created_at: number
}


type BookDetails = {
  dimensions: string;
  pages: number;
  publisher: string;
};

type RecommendedBook = {
  id: string;
  title: string;
  cover: string;
  price: number;
};

export type Book = {
  id: string;
  author: string;
  authorDescription: string;
  badge: string;
  bookDescription: string;
  bookDetails: BookDetails;
  cover: string;
  order: number;
  price: number;
  title: string;
  categoryId?: number;
  whoShouldReadThis?: string[];
  whatYouWillLearn?: string[];
  recommendedBooks?: RecommendedBook[];
};

export type Category = {
  id: number;
  title: string;
  icon: string;
  description: string;
};

// Invoice Type
export type Invoice = {
  id: string;
  orderId: string;
  userId: string;
  razorpayInvoiceId?: string;
  invoicePdfUrl?: string;
  status: "pending" | "issued" | "sent" | "failed";
  userEmail: string;
  adminEmail: string;
  totalAmount: number;
  gstAmount: number;
  gstNumber: string;
  itemsCount: number;
  sentToUser: boolean;
  sentToAdmin: boolean;
  createdAt: string;
  sentAt?: string;
  failureReason?: string;
};
