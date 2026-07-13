import React from 'react';
import { Heart, ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'wouter';

export const Footer = () => {
  return (
    <footer className="bg-muted py-12 mt-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start gap-4">
            <h3 className="font-serif text-2xl text-primary">Léa Créations</h3>
            <p className="text-sm text-foreground/70 flex items-center gap-2">
              Fait avec <Heart className="h-4 w-4 text-secondary fill-secondary" /> pour vous redonner confiance.
            </p>
          </div>

          <div className="flex flex-col gap-2 items-center md:items-start">
            <h4 className="font-serif text-lg text-primary mb-2">Liens Rapides</h4>
            <Link href="/" className="text-sm text-foreground/70 hover:text-secondary transition-colors">Accueil</Link>
            <Link href="/produit/cache-cou-thyroide" className="text-sm text-foreground/70 hover:text-secondary transition-colors">Le Produit</Link>
            <Link href="/panier" className="text-sm text-foreground/70 hover:text-secondary transition-colors">Panier</Link>
          </div>

          <div className="flex flex-col gap-4 items-center md:items-start">
            <h4 className="font-serif text-lg text-primary">Contact & Confiance</h4>
            <a href="mailto:contact@leacreations.fr" className="text-sm text-foreground/70 hover:text-secondary transition-colors flex items-center gap-2">
              <Mail className="h-4 w-4" /> contact@leacreations.fr
            </a>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1 text-xs text-foreground/60">
                <ShieldCheck className="h-4 w-4 text-primary" /> Paiement Sécurisé
              </div>
            </div>
            <div className="text-xs text-foreground/50 mt-4">
              © {new Date().getFullYear()} Léa Créations. Artisanat Français.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
