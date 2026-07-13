import React from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const [location] = useLocation();
  const { items } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Le Produit', path: '/produit/cache-cou-thyroide' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl tracking-wide text-primary">
          Léa Créations
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium transition-colors hover:text-secondary ${
                location === link.path ? 'text-primary border-b-2 border-secondary pb-1' : 'text-foreground/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/panier" className="relative group">
            <Button variant="ghost" size="icon" className="text-primary hover:text-secondary hover:bg-secondary/10">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/panier" className="relative">
            <Button variant="ghost" size="icon" className="text-primary hover:text-secondary hover:bg-secondary/10">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-primary">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-base font-medium p-2 rounded-md ${
                location === link.path ? 'bg-secondary/10 text-primary' : 'text-foreground/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
