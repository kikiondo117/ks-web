import Stripe from "stripe";

// Inicializa Stripe con la clave secreta
export const stripe = new Stripe(process.env.SECRET_STRIPE_KEY!, {
  apiVersion: "2024-06-20",
});
