import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ShieldCheck, Tag, X, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { shippingMethods } from '../data/products';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  famille: { discount: 100, label: "Code famille — 100% offert 🎁" },
};

export default function Panier() {
  const { items, updateQty, removeItem, totalAmount } = useCart();
  const [selectedShipping, setSelectedShipping] = React.useState<string>(shippingMethods[0].id);
  const [promoInput, setPromoInput] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState<{ code: string; discount: number; label: string } | null>(null);
  const [promoError, setPromoError] = React.useState('');
  const [, setLocation] = useLocation();

  const shippingCost = shippingMethods.find(m => m.id === selectedShipping)?.price || 0;
  const subtotalWithShipping = totalAmount + (items.length > 0 ? shippingCost : 0);
  const discountAmount = appliedPromo ? (subtotalWithShipping * appliedPromo.discount) / 100 : 0;
  const finalTotal = Math.max(0, subtotalWithShipping - discountAmount);
  const isFree = appliedPromo?.discount === 100;

  const applyPromo = () => {
    const code = promoInput.trim().toLowerCase();
    const promo = PROMO_CODES[code];
    if (promo) {
      setAppliedPromo({ code, ...promo });
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Code promo invalide');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const handleCheckout = () => {
    const params = new URLSearchParams({ shipping: selectedShipping });
    if (appliedPromo) {
      params.set('promo', appliedPromo.code);
      params.set('discount', String(appliedPromo.discount));
    }
    setLocation(`/paiement?${params.toString()}`);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-primary mb-4">Votre panier est vide</h1>
        <p className="text-foreground/70 mb-8 max-w-md">
          Prenez le temps de découvrir notre création artisanale. Chaque cache-cou est réalisé avec soin pour vous apporter douceur et réconfort.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12 text-lg">
          <Link href="/">Découvrir la boutique</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <h1 className="font-serif text-3xl md:text-4xl text-primary mb-10">Mon Panier</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1 space-y-6">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm font-medium text-muted-foreground">
            <div className="col-span-6">Produit</div>
            <div className="col-span-3 text-center">Quantité</div>
            <div className="col-span-2 text-right">Prix</div>
            <div className="col-span-1"></div>
          </div>

          {items.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key={item.id}
              className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center py-6 border-b border-border/50"
            >
              <div className="col-span-6 flex items-center gap-4 w-full">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <Link href={`/produit/${item.id}`} className="font-serif text-lg text-primary hover:text-secondary transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <span className="text-muted-foreground text-sm mt-1 md:hidden">
                    {item.price.toFixed(2).replace('.', ',')}€
                  </span>
                </div>
              </div>

              <div className="col-span-3 flex items-center justify-between md:justify-center w-full md:w-auto">
                <span className="md:hidden text-sm text-muted-foreground">Quantité:</span>
                <div className="flex items-center justify-between border border-border rounded-full p-1 bg-background w-32">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 text-primary hover:text-secondary"
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center font-medium text-primary text-sm">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 text-primary hover:text-secondary"
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="col-span-2 text-right hidden md:block w-full">
                <span className="font-medium text-lg text-primary">
                  {(item.price * item.quantity).toFixed(2).replace('.', ',')}€
                </span>
              </div>

              <div className="col-span-1 flex justify-end w-full md:w-auto mt-2 md:mt-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-10 w-10 md:h-8 md:w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}

          <div className="pt-4">
            <Button asChild variant="link" className="text-secondary hover:text-primary px-0">
              <Link href="/">← Continuer mes achats</Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-sm sticky top-28 space-y-6">
            <h2 className="font-serif text-2xl text-primary">Récapitulatif</h2>

            {/* Sous-total */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-foreground/80">
                <span>Sous-total ({items.reduce((acc, i) => acc + i.quantity, 0)} articles)</span>
                <span>{totalAmount.toFixed(2).replace('.', ',')}€</span>
              </div>
            </div>

            {/* Livraison */}
            <div className="border-t border-border pt-5">
              <h3 className="font-medium text-primary mb-3">Mode de livraison</h3>
              <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="space-y-3">
                {shippingMethods.map((method) => (
                  <div key={method.id} className="flex items-start space-x-3 border border-border p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="font-medium text-primary flex justify-between cursor-pointer">
                        <span>{method.name}</span>
                        <span>{method.price.toFixed(2).replace('.', ',')}€</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Code promo */}
            <div className="border-t border-border pt-5">
              <h3 className="font-medium text-primary mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-secondary" />
                Code promo
              </h3>

              {appliedPromo ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                    <Check className="w-4 h-4" />
                    {appliedPromo.label}
                  </div>
                  <button onClick={removePromo} className="text-green-500 hover:text-green-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Entrez votre code"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                    className="h-10 bg-muted/50 flex-1"
                  />
                  <Button
                    onClick={applyPromo}
                    variant="outline"
                    className="h-10 px-4 border-secondary text-secondary hover:bg-secondary hover:text-white shrink-0"
                  >
                    Appliquer
                  </Button>
                </div>
              )}
              {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
            </div>

            {/* Total */}
            <div className="border-t border-border pt-5">
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-foreground/80">
                  <span>Livraison ({shippingMethods.find(m => m.id === selectedShipping)?.name})</span>
                  <span>{shippingCost.toFixed(2).replace('.', ',')}€</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Réduction ({appliedPromo.discount}%)</span>
                    <span>−{discountAmount.toFixed(2).replace('.', ',')}€</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-end">
                <span className="font-serif text-xl text-primary">Total</span>
                <div className="text-right">
                  {appliedPromo && (
                    <span className="text-sm text-muted-foreground line-through block">
                      {subtotalWithShipping.toFixed(2).replace('.', ',')}€
                    </span>
                  )}
                  <span className={`font-serif text-3xl block ${isFree ? 'text-green-600' : 'text-primary'}`}>
                    {isFree ? 'GRATUIT' : `${finalTotal.toFixed(2).replace('.', ',')}€`}
                  </span>
                  <span className="text-xs text-muted-foreground">TVA incluse</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg shadow-md transition-all group"
            >
              {isFree ? 'Confirmer la commande' : 'Passer au paiement'}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
              Paiement 100% sécurisé à l'étape suivante
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
