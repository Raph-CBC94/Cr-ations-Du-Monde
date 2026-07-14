export const UNIT_PRICE = 19.99;
export const PACK_QTY = 3;
export const PACK_PRICE = 49.99;

export function getTotalPrice(quantity: number): number {
  const packs = Math.floor(quantity / PACK_QTY);
  const remainder = quantity % PACK_QTY;
  return packs * PACK_PRICE + remainder * UNIT_PRICE;
}

export function getPackSavings(quantity: number): number {
  return quantity * UNIT_PRICE - getTotalPrice(quantity);
}

export const SHIPPING_METHOD = { id: "mondial_relay", name: "Mondial Relay", price: 0, description: "Livraison offerte en point relais sous 3-5 jours ouvrés" };

export const product = {
  id: "cache-cou-thyroide",
  name: "Cache-Cou Fleuri — Cicatrice Thyroïde",
  price: UNIT_PRICE,
  shortDescription: "Un cache-cou artisanal pour dissimuler élégamment les cicatrices de thyroïde.",
  description: "Ce cache-cou artisanal est spécialement conçu pour couvrir discrètement et avec élégance les cicatrices après une opération de la thyroïde. Fabriqué en tissu liberty fleuri mauve et rose poudré, il s'adapte parfaitement à l'anatomie du cou. Son bouton cœur est une touche délicate qui rappelle que la force est féminine.",
  details: [
    "Tissu liberty 100% coton fleuri",
    "Doublure en satin doux pour un confort maximal",
    "Bouton cœur fait-main",
    "Taille unique — s'adapte parfaitement",
    "Lavable à 30°",
    "Fabriqué avec amour en France"
  ],
  shipping: "Livraison offerte en point relais Mondial Relay. Informations à renseigner lors du paiement."
};
