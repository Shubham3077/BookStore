import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto max-w-[80%] py-16 lg:py-20">
        <div className="rounded-xl border border-footer-foreground/10 bg-footer-foreground/[0.03] px-8 py-12 lg:px-12 lg:py-14 shadow-[0_2px_16px_0_hsl(0_0%_0%/0.08)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            <div>
              <h3 className="font-serif text-xl font-bold mb-4">The Reading Nook</h3>
              <p className="text-sm text-footer-foreground/70 leading-relaxed">
                A curated bookstore for thoughtful readers. Discover stories that inspire, challenge, and delight.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm text-footer-foreground/70">
                {["Shop", "Collections", "Blog", "About Us", "Contact"].map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-footer-foreground transition-colors duration-200">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Categories</h4>
              <ul className="space-y-2.5 text-sm text-footer-foreground/70">
                {["Fiction", "Non-Fiction", "Poetry", "Academic", "Children's"].map((c) => (
                  <li key={c}>
                    <a href="#" className="hover:text-footer-foreground transition-colors duration-200">{c}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Stay Updated</h4>
              <p className="text-sm text-footer-foreground/70 mb-4">
                Get new arrivals and exclusive offers straight to your inbox.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-footer-foreground/10 border-footer-foreground/20 text-footer-foreground placeholder:text-footer-foreground/40 text-sm"
                />
                <Button className="bg-background text-foreground hover:bg-background/90 text-sm font-medium shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-footer-foreground/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-footer-foreground/50">© 2026 The Reading Nook. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="text-footer-foreground/50 hover:text-footer-foreground transition-colors duration-200">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
