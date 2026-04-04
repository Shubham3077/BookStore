"use client"
import { useState, useEffect } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/firebase-auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CartCheckoutModal from "@/components/CartCheckoutModal";

interface CartItem {
  id: string;
  bookId: string;
  title: string;
  price: number;
  cover: string;
  quantity: number;
}

const CartItemCard = ({ 
  item, 
  onIncrement, 
  onDecrement, 
  onRemove,
  isLoading 
}: { 
  item: CartItem;
  onIncrement: (id: string) => Promise<void>;
  onDecrement: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  isLoading: boolean;
}) => (
  <div className="flex gap-3 md:gap-6 p-3 md:p-5 bg-card rounded-xl border border-border/60 shadow-[0_2px_12px_hsl(var(--foreground)/0.04)] hover:shadow-[0_4px_20px_hsl(var(--foreground)/0.07)] transition-shadow duration-200">
    {/* Book Image */}
    <div className="w-16 h-24 md:w-24 md:h-32 rounded-lg bg-secondary/50 overflow-hidden shrink-0">
      <Image
        src={item.cover}
        alt={item.title}
        width={96}
        height={128}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Details */}
    <div className="flex-1 flex flex-col justify-between min-w-0">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-serif text-sm md:text-lg font-semibold text-foreground leading-snug line-clamp-2">
          {item.title}
        </h3>
        <button 
          onClick={() => onRemove(item.id)}
          disabled={isLoading}
          className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 mt-3">
        {/* Quantity Controls */}
        <div className="flex items-center gap-0.5">
          <button 
            onClick={() => onDecrement(item.id)}
            disabled={isLoading}
            className="w-7 h-7 md:w-8 md:h-8 rounded-lg border border-border bg-background flex items-center justify-center text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-3 h-3 md:w-3.5 md:h-3.5" />
          </button>
          <span className="w-7 text-center text-xs md:text-sm font-medium text-foreground">
            {item.quantity}
          </span>
          <button 
            onClick={() => onIncrement(item.id)}
            disabled={isLoading}
            className="w-7 h-7 md:w-8 md:h-8 rounded-lg border border-border bg-background flex items-center justify-center text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" />
          </button>
        </div>

        {/* Price */}
        <p className="font-serif text-base md:text-lg font-bold text-foreground ml-auto">
          ₹{(item?.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  </div>
);

const OrderSummary = ({
  subtotal,
  tax,
  total,
}: {
  subtotal: number;
  tax: number;
  total: number;
}) => (
  <div className="rounded-xl border border-border/60 bg-card p-6 shadow-md">
    <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Order Summary</h3>
    <div className="space-y-3 mb-4 border-b border-border/60 pb-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="text-foreground font-medium">₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tax (18%)</span>
        <span className="text-foreground font-medium">₹{tax.toFixed(2)}</span>
      </div>
    </div>
    <div className="flex justify-between text-lg font-bold text-foreground">
      <span>Total</span>
      <span>₹{total.toFixed(2)}</span>
    </div>
  </div>
);

export default function CartPage() {
  const { items, subtotal, tax, total, isLoading, incrementQuantity, decrementQuantity, removeFromCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  console.log(items, "cart items")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="py-6 md:py-8 border-b border-border/60">
        <div className="mx-auto max-w-[90%] sm:max-w-[85%] lg:max-w-[80%]">
          <div className="flex items-center gap-2 md:gap-3 mb-0 md:mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 shrink-0">
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground">Shopping Cart</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 md:py-12">
        <div className="mx-auto max-w-[90%] sm:max-w-[85%] lg:max-w-[80%]">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-lg md:text-2xl font-serif font-semibold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6">Start adding books to your cart!</p>
              <Link href="/">
                <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 md:space-y-4">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onIncrement={incrementQuantity}
                    onDecrement={decrementQuantity}
                    onRemove={removeFromCart}
                    isLoading={isLoading}
                  />
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 md:top-24 space-y-3 md:space-y-4 flex flex-col gap-0.25">
                  <OrderSummary subtotal={subtotal} tax={tax} total={total} />
                  <Button 
                    onClick={() => setCheckoutOpen(true)}
                    className="w-full h-10 md:h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover font-semibold shadow-md hover:shadow-lg transition-all text-sm md:text-base"
                  >
                    Proceed to Checkout
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="w-full h-10 md:h-12 rounded-full border-border font-medium text-sm md:text-base">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CartCheckoutModal 
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}
