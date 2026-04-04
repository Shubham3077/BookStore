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

export type Book = {
  id: number,
  author: string;
  authorDescription: string;
  badge: string;
  bookDescription: string;
  bookDetails: BookDetails; // The (map) from your data
  cover: string;
  order: number;
  price: number;
  title: string;
};
