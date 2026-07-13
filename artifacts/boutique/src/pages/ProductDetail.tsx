import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { product } from '../data/products';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import heroImg from '@assets/file_00000000f03871f48778e9563a14b77b_1783972257984.png';
import flatLayC from '@assets/Screenshot_2026-07-13-21-35-56-699_com.openai.chatgpt-edit_1783972258308.jpg';
import flatLayO from '@assets/Screenshot_2026-07-13-21-35-45-069_com.openai.chatgpt-edit_1783972258435.jpg';
import btnCloseUp from '@assets/Screenshot_2026-07-13-21-35-26-250_com.openai.chatgpt-edit_1783972258495.jpg';

const images = [heroImg, flatLayC, flatLayO, btnCloseUp];

export default function ProductDetail() {
  const [match, params] = useRoute('/produit/:id');
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // If ID doesn't match our hardcoded product, show 404-like state
  if (!match || params.id !== product.id) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="font-serif text-3xl text-primary mb-4">Produit introuvable</h1>
        <p className="mb-8">Désolé, ce produit n'existe pas ou n'est plus disponible.</p>
        <Button asChild><Link href="/">Retour à l'accueil</Link></Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: heroImg
    }, quantity);
    
    toast({
      title: "Ajouté au panier",
      description: `${quantity}x ${product.name} ajouté(s).`,
      className: "bg-background border-secondary text-primary",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border/50 relative">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={images[activeImage]} 
              alt={`${product.name} vue ${activeImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === idx ? 'border-secondary' : 'border-transparent hover:border-border'
                }`}
              >
                <img src={img} alt={`Miniature ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-xs font-bold tracking-wide uppercase mb-4">
              Fait-main en France
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="text-3xl font-serif text-primary">
              {product.price.toFixed(2).replace('.', ',')}€
            </div>
          </div>

          <p className="text-foreground/80 leading-relaxed mb-8 text-lg">
            {product.description}
          </p>

          {/* Action Area */}
          <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-sm mb-10">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              {/* Qty Selector */}
              <div className="flex items-center justify-between border border-border rounded-full p-1 bg-background sm:w-1/3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-10 w-10 text-primary hover:text-secondary hover:bg-secondary/10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium text-primary">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-10 w-10 text-primary hover:text-secondary hover:bg-secondary/10"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Add to Cart */}
              <Button 
                onClick={handleAddToCart}
                className="flex-1 rounded-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all text-base"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>
            </div>
            
            <Button 
              asChild
              variant="outline"
              className="w-full rounded-full h-12 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all text-base font-medium"
            >
              <Link href="/panier">
                Acheter maintenant
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mb-10 border-y border-border py-6">
            <div className="flex flex-col items-center text-center gap-2 text-primary">
              <ShieldCheck className="h-6 w-6 text-secondary" />
              <span className="text-xs font-medium">Paiement 100% sécurisé</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 text-primary">
              <Truck className="h-6 w-6 text-secondary" />
              <span className="text-xs font-medium">Expédition sous 48h</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 text-primary">
              <RefreshCw className="h-6 w-6 text-secondary" />
              <span className="text-xs font-medium">Satisfait ou remboursé</span>
            </div>
          </div>

          {/* Accordions */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details" className="border-border">
              <AccordionTrigger className="font-serif text-lg text-primary hover:text-secondary">Caractéristiques</AccordionTrigger>
              <AccordionContent className="text-foreground/80 text-base">
                <ul className="space-y-2 pt-2">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Heart className="h-4 w-4 text-secondary shrink-0 mt-1 fill-secondary/20" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping" className="border-border">
              <AccordionTrigger className="font-serif text-lg text-primary hover:text-secondary">Livraison & Retours</AccordionTrigger>
              <AccordionContent className="text-foreground/80 text-base leading-relaxed">
                <p className="mb-3">{product.shipping}</p>
                <p>Retours acceptés sous 14 jours si le produit n'a pas été porté (pour des raisons d'hygiène évidentes).</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </div>
      </div>
    </div>
  );
}
