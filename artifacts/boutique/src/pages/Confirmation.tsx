import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Check, Heart, Mail, PackageOpen, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Confirmation() {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('lastOrder');
    if (data) {
      setOrderData(JSON.parse(data));
      // Effacer éventuellement pour ne pas réafficher indéfiniment au rafraîchissement
      // sessionStorage.removeItem('lastOrder');
    } else {
      // Fallback si visite directe
      setOrderData({
        name: "",
        email: "",
        address: "",
        city: "",
        shippingName: "Mondial Relay"
      });
    }
  }, []);

  if (!orderData) return null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 bg-muted/20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-background rounded-3xl p-8 md:p-12 border border-border shadow-lg text-center relative overflow-hidden"
      >
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-32 bg-secondary/10 -z-10"></div>
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-secondary/20 rounded-full blur-3xl -z-10"></div>

        <div className="w-20 h-20 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mx-auto mb-8 shadow-md relative z-10">
          <Check className="w-10 h-10" />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">
          Merci {orderData.name} !
        </h1>
        
        <p className="text-lg text-foreground/80 mb-10 max-w-lg mx-auto leading-relaxed">
          Votre commande a bien été prise en compte. Nous préparons votre création avec soin.
        </p>

        <div className="bg-muted/30 rounded-2xl p-6 text-left mb-10 border border-border/50">
          <h2 className="font-serif text-xl text-primary mb-4 flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-secondary" />
            Détails de l'expédition
          </h2>
          <div className="space-y-3 text-sm text-foreground/80">
            <div className="grid grid-cols-3 gap-2 items-center">
              <span className="text-muted-foreground">Méthode</span>
              <span className="col-span-2 font-medium text-primary flex items-center gap-2">
                {orderData.shippingName}
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Offerte</span>
              </span>
            </div>
            {orderData.address && (
              <div className="grid grid-cols-3 gap-2 border-t border-border/30 pt-3">
                <span className="text-muted-foreground">Adresse</span>
                <span className="col-span-2">{orderData.address}, {orderData.city}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground mb-10 bg-accent/20 py-4 px-6 rounded-xl inline-flex mx-auto">
          <Mail className="w-5 h-5 text-accent-foreground" />
          <span>Votre commande a été prise en compte ✓</span>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 h-14 text-lg shadow-md transition-all">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-secondary font-medium italic">
            Fait avec <Heart className="w-4 h-4 fill-secondary" /> en France
          </div>
        </div>
      </motion.div>
    </div>
  );
}
