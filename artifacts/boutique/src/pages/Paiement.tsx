import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ShieldCheck, Lock, CreditCard, Truck } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";

import { useCart } from '../context/CartContext';
import { SHIPPING_METHOD, getPackSavings } from '../data/products';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const checkoutSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  address: z.string().min(5, "L'adresse est requise"),
  postalCode: z.string().min(4, "Code postal invalide"),
  city: z.string().min(2, "La ville est requise"),
  country: z.string().default("France"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Paiement() {
  const [, setLocation] = useLocation();
  const { items, totalAmount, clearCart } = useCart();
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormValues | null>(null);
  const [freeOrderLoading, setFreeOrderLoading] = useState(false);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

  // Read URL params (promo)
  const searchParams = new URLSearchParams(window.location.search);
  const promoCode = searchParams.get('promo') || '';
  const discountPct = Number(searchParams.get('discount') || 0);
  const isFree = discountPct === 100;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      postalCode: "",
      city: "",
      country: "France",
    },
    mode: "onChange"
  });

  // Watch form validity
  useEffect(() => {
    const subscription = form.watch(() => {
      form.trigger().then((isValid) => {
        setIsFormValid(isValid);
        if (isValid) setFormData(form.getValues());
        else setFormData(null);
      });
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && !window.location.pathname.includes('confirmation')) {
      setLocation('/panier');
    }
  }, [items, setLocation]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const packSavings = getPackSavings(totalQuantity);
  const discountAmount = (totalAmount * discountPct) / 100;
  const finalTotal = Math.max(0, totalAmount - discountAmount);

  const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

  const sendNotification = async (overrides?: { paypalOrderId?: string }) => {
    const data = formData || form.getValues();
    await fetch(`${API_BASE_URL}/api/notify-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          address: data.address,
          postalCode: data.postalCode,
          city: data.city,
          country: data.country || 'France',
        },
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        shippingMethod: { name: SHIPPING_METHOD.name, price: SHIPPING_METHOD.price },
        subtotal: totalAmount,
        total: finalTotal,
        promoCode: promoCode || undefined,
        paypalOrderId: overrides?.paypalOrderId,
      }),
    });
  };

  const handleFreeOrder = async () => {
    const valid = await form.trigger();
    if (!valid) return;
    setFreeOrderLoading(true);
    try {
      await sendNotification();
    } catch (e) {
      console.error('Notification email failed:', e);
    }
    const data = form.getValues();
    clearCart();
    sessionStorage.setItem('lastOrder', JSON.stringify({
      name: data.firstName,
      email: data.email,
      address: data.address,
      city: data.city,
      shippingName: SHIPPING_METHOD.name,
    }));
    setLocation('/confirmation');
  };

  const onSubmit = (data: CheckoutFormValues) => {
    setFormData(data);
    setIsFormValid(true);
    document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePayPalApprove = (_data: any, actions: any) => {
    return actions.order.capture().then(async (details: any) => {
      try {
        await sendNotification({ paypalOrderId: details.id });
      } catch (err) {
        console.error('Notification email failed:', err);
      }
      clearCart();
      sessionStorage.setItem('lastOrder', JSON.stringify({
        name: formData?.firstName || details.payer.name.given_name,
        email: formData?.email || details.payer.email_address,
        address: formData?.address,
        city: formData?.city,
        shippingName: SHIPPING_METHOD.name,
      }));
      setLocation('/confirmation');
    });
  };

  if (items.length === 0) return null; // Guard

  return (
    <div className="bg-muted/30 min-h-screen pb-24">
      {/* En-tête de progression de la commande */}
      <div className="bg-background border-b border-border py-6 mb-8">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
              <Check className="w-3 h-3" />
            </div>
            <span className="hidden sm:inline">Panier</span>
          </div>
          <div className="h-[1px] w-8 bg-primary"></div>
          <div className="flex items-center gap-2 text-primary">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
              2
            </div>
            <span>Livraison et paiement</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Colonne gauche : formulaire et paiement */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-background rounded-3xl p-6 md:p-8 border border-border shadow-sm">
              <h2 className="font-serif text-2xl text-primary mb-6 pb-4 border-b border-border flex items-center gap-3">
                <Truck className="w-6 h-6 text-secondary" />
                Vos coordonnées
              </h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl><Input placeholder="Léa" {...field} className="h-12 bg-muted/50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl><Input placeholder="Dupont" {...field} className="h-12 bg-muted/50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="lea@exemple.com" {...field} className="h-12 bg-muted/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse postale</FormLabel>
                      <FormControl><Input placeholder="123 rue des Fleurs" {...field} className="h-12 bg-muted/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="postalCode" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl><Input placeholder="75000" {...field} className="h-12 bg-muted/50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl><Input placeholder="Paris" {...field} className="h-12 bg-muted/50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays</FormLabel>
                      <FormControl><Input {...field} disabled className="h-12 bg-muted text-muted-foreground" /></FormControl>
                    </FormItem>
                  )} />

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-medium text-lg text-primary mb-4">Livraison</h3>
                    <div className="flex items-start gap-3 bg-green-50 border border-green-200 p-4 rounded-xl">
                      <Truck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Livraison offerte</p>
                        <p className="text-sm text-green-700/80 mt-1">{SHIPPING_METHOD.description}</p>
                      </div>
                    </div>
                  </div>

                  {!isFormValid && (
                    <div className="pt-4">
                      <Button type="button" onClick={() => form.trigger()} className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg">
                        Valider pour payer
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </div>

            {/* Payment Section */}
            <div id="payment-section" className={`bg-background rounded-3xl p-6 md:p-8 border border-border shadow-sm transition-opacity duration-500 ${isFormValid ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <h2 className="font-serif text-2xl text-primary mb-2 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-secondary" />
                {isFree ? 'Commande gratuite 🎁' : 'Paiement sécurisé'}
              </h2>
              <p className="text-muted-foreground text-sm mb-6 pb-4 border-b border-border">
                {isFree
                  ? isFormValid ? "Votre code promo couvre 100% du montant. Confirmez pour finaliser." : "Veuillez remplir vos coordonnées ci-dessus."
                  : isFormValid ? "Payez par carte bancaire ci-dessous." : "Veuillez remplir correctement vos coordonnées ci-dessus pour débloquer le paiement."}
              </p>

              {isFree ? (
                /* COMMANDE GRATUITE — contourne PayPal */
                <Button
                  onClick={handleFreeOrder}
                  disabled={!isFormValid || freeOrderLoading}
                  className="w-full h-14 rounded-full bg-green-600 hover:bg-green-700 text-white text-lg font-medium shadow-md"
                >
                  {freeOrderLoading ? 'Traitement…' : '✓ Confirmer ma commande gratuite'}
                </Button>
              ) : (
                /* COMMANDE PAYANTE — carte via PayPal */
                <>
                  {paypalClientId === "test" && (
                    <div className="bg-accent/20 border border-accent p-4 rounded-xl mb-6 text-sm text-foreground/80">
                      <p className="font-medium mb-1">Configuration en cours</p>
                      <p>Le module de paiement est en mode test. Les transactions ne seront pas débitées.</p>
                    </div>
                  )}
                  <div className="min-h-[150px] relative z-0">
                    <PayPalScriptProvider options={{ "clientId": paypalClientId, "currency": "EUR", "intent": "capture" }}>
                      <PayPalButtons
                        fundingSource={FUNDING.CARD}
                        style={{ layout: "vertical", shape: "pill" }}
                        disabled={!isFormValid}
                        forceReRender={[finalTotal]}
                        createOrder={(_data, actions) => actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{
                            description: "Commande Créations du Monde",
                            amount: {
                              currency_code: "EUR",
                              value: finalTotal.toFixed(2),
                              breakdown: {
                                item_total: { currency_code: "EUR", value: totalAmount.toFixed(2) },
                                shipping: { currency_code: "EUR", value: "0.00" },
                              },
                            },
                            payee: { email_address: "creationsdumonde9@gmail.com" },
                          }],
                        })}
                        onApprove={handlePayPalApprove}
                        onError={(err) => console.error("PayPal Error:", err)}
                      />
                    </PayPalScriptProvider>
                  </div>
                </>
              )}

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground pt-6 border-t border-border">
                <div className="flex items-center gap-1"><Lock className="w-3 h-3" /> Transaction cryptée SSL</div>
                <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Paiement sécurisé</div>
              </div>
            </div>

          </div>

          {/* Colonne droite : récapitulatif de la commande */}
          <div className="lg:col-span-5">
            <div className="bg-primary/5 rounded-3xl p-6 lg:p-8 border border-primary/10 sticky top-28">
              <h3 className="font-serif text-xl text-primary mb-6">Résumé de la commande</h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-background border border-border shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <h4 className="font-medium text-primary line-clamp-1">{item.name}</h4>
                      <p className="text-muted-foreground mt-1">Qté: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-primary">
                      {(item.price * item.quantity).toFixed(2).replace('.', ',')}€
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-border/50 text-sm">
                <div className="flex justify-between text-foreground/80">
                  <span>Sous-total</span>
                  <span>{totalAmount.toFixed(2).replace('.', ',')}€</span>
                </div>
                {packSavings > 0 && (
                  <div className="flex justify-between text-secondary font-medium">
                    <span>Offre pack de 3</span>
                    <span>−{packSavings.toFixed(2).replace('.', ',')}€</span>
                  </div>
                )}
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Livraison ({SHIPPING_METHOD.name})</span>
                  <span>Offerte</span>
                </div>
                {discountPct > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Code promo ({discountPct}%)</span>
                    <span>−{discountAmount.toFixed(2).replace('.', ',')}€</span>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-border/50 flex justify-between items-end">
                <span className="font-serif text-lg text-primary">Total à payer</span>
                <span className={`font-serif text-3xl ${isFree ? 'text-green-600' : 'text-primary'}`}>
                  {isFree ? 'GRATUIT' : `${finalTotal.toFixed(2).replace('.', ',')}€`}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
