import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Heart, Package, Shield, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { PACK_PRICE, PACK_QTY } from '../data/products';

import heroImg from '@assets/file_00000000f03871f48778e9563a14b77b_1783972257984.png';
import flatLayC from '@assets/Screenshot_2026-07-13-21-35-56-699_com.openai.chatgpt-edit_1783972258308.jpg';
import flatLayO from '@assets/Screenshot_2026-07-13-21-35-45-069_com.openai.chatgpt-edit_1783972258435.jpg';

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Femme portant un cache-cou fleuri" 
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 px-4 md:px-8 flex flex-col md:w-1/2 md:mr-auto py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-medium tracking-wide">
              Artisanat Français
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-primary">
              Reprenez confiance,<br/> <span className="italic text-secondary">avec grâce.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-lg leading-relaxed">
              Le cache-cou artisanal pour dissimuler avec douceur les cicatrices de thyroïde — discret, délicat et féminin.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
                <Link href="/produit/cache-cou-thyroide">
                  Découvrir la création
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EMPATHY SECTION */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-8">
          <Heart className="w-12 h-12 mx-auto text-secondary opacity-80" strokeWidth={1.5} />
          <h2 className="font-serif text-3xl md:text-4xl text-primary">Une transition tout en douceur</h2>
          <p className="text-lg leading-relaxed text-foreground/80">
            Après une opération de la thyroïde, le corps guérit, mais le regard que l'on porte sur soi a parfois besoin de temps. 
            Nous avons imaginé ce cache-cou non pas pour cacher, mais pour envelopper. Pour vous offrir une parenthèse de 
            douceur florale, le temps que vous soyez prête à dévoiler votre histoire. Un accessoire pensé par des femmes, pour des femmes.
          </p>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2 flex gap-4">
            <div className="w-2/3 rounded-2xl overflow-hidden shadow-lg border border-border/50">
              <img src={flatLayC} alt="Cache-cou forme C" className="w-full h-full object-cover" />
            </div>
            <div className="w-1/3 flex flex-col gap-4">
              <div className="flex-1 rounded-2xl overflow-hidden shadow-md border border-border/50">
                <img src={flatLayO} alt="Cache-cou forme O" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden shadow-md border border-border/50 bg-secondary/10 flex items-center justify-center p-4 text-center">
                <p className="font-serif text-primary italic text-sm">"Tissu liberty doux & respirant"</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="mb-4 flex items-center gap-2">
              <span className="bg-accent/30 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Édition Limitée</span>
            </div>
            <h2 className="font-serif text-4xl text-primary mb-6">Notre pièce signature</h2>
            <p className="text-xs text-muted-foreground italic mb-6">
              Visuels générés par intelligence artificielle — ils représentent fidèlement la forme, les couleurs et le rendu de notre création artisanale.
            </p>
            <ProductCard />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-16">Simple & Rassurant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4 text-secondary">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl">1. Choisissez</h3>
              <p className="text-primary-foreground/70 text-sm">Une taille unique qui s'adapte parfaitement à votre morphologie.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4 text-secondary">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl">2. Commandez en sécurité</h3>
              <p className="text-primary-foreground/70 text-sm">Paiement sécurisé via PayPal, avec protection des achats.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
