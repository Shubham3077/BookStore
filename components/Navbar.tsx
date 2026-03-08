import { Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const links = ["Shop", "Collections", "Blog", "About"];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/60 shadow-[0_1px_3px_0_hsl(var(--foreground)/0.04)]">
      <div className="mx-auto max-w-[80%] flex items-center justify-between h-16">
        <a href="/" className="font-serif text-xl font-bold tracking-tight text-foreground">
          The Reading Nook
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-foreground hover:text-secondary">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:text-secondary relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
              3
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
