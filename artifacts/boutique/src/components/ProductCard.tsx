import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '../context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { product, PACK_QTY, PACK_PRICE } from '../data/products';
import { Check } from 'lucide-react';
import heroImg from '@assets/file_00000000f03871f48778e9563a14b77b_1783972257984.png';

export const ProductCard = () => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: heroImg
    });
    
    toast({
      title: "Ajouté au panier",
      description: "Le cache-cou a été ajouté à votre panier avec succès.",
      className: "bg-background border-secondary text-primary",
    });
  };

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card">
      <Link href={`/produit/${product.id}`} className="block relative aspect-square overflow-hidden group">
        <img 
          src={heroImg} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur text-primary text-xs px-3 py-1 rounded-full font-medium border border-border">
          Fait-main
        </div>
      </Link>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/produit/${product.id}`}>
            <h3 className="font-serif text-xl text-primary hover:text-secondary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="text-right ml-4">
            <span className="font-semibold text-lg text-primary whitespace-nowrap block">
              {product.price.toFixed(2).replace('.', ',')}€
            </span>
            <span className="text-xs text-secondary font-medium">
              Pack de {PACK_QTY} : {PACK_PRICE.toFixed(2).replace('.', ',')}€
            </span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.shortDescription}
        </p>
        <ul className="space-y-1 mb-6">
          {product.details.slice(0, 3).map((detail, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
              <Check className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button 
          onClick={handleAddToCart}
          variant="outline"
          className="flex-1 border-secondary/50 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all"
        >
          Ajouter au panier
        </Button>
        <Button 
          asChild
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
        >
          <Link href={`/produit/${product.id}`}>
            Découvrir
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
