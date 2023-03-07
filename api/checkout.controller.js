import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config() // required to access .env outside of api dir
const stripe = Stripe(process.env.STRIPE_API_KEY);

export default class CheckoutController {

    static async apiCreateCheckoutSession(req, res, next) {
        const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: 'T-shirt',
                  },
                  unit_amount: 2000,
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: 'http://localhost:4242/success',
            cancel_url: 'http://localhost:4242/cancel',
          });
        
          res.redirect(303, session.url);
    }

}