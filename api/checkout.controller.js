import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config() // required to access .env outside of api dir
const stripe = Stripe(process.env.STRIPE_API_KEY);

export default class CheckoutController {

  static async apiCreateCheckoutSession(req, res, next) {
    const cart = Object.values(req.body);
    const taxRate = await stripe.taxRates.create({
      display_name: "Sales Tax",
      inclusive: false,
      percentage: 7.75,
      country: 'US',
      state: 'IL',
      jurisdiction: 'US - IL',
      description: 'IL Sales Tax',
    })

    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: {allowed_countries: ['US']},
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {amount: CheckoutController.calcShipping(cart), currency: 'usd'},
            display_name: 'Shipping Cost',
          },
        },
      ],
      line_items: cart.map((item) => {
        return (
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: [item.img],
                description: `Material: ${item.attributes.material}\n Size: ${item.attributes.size}\n Finish: ${item.attributes.finish}`
              },
              unit_amount: item.attributes.price,
            },
            quantity: item.quantity,
            tax_rates: [taxRate.id],
          }
        )
      }),
      mode: 'payment',
      success_url: 'http://localhost:4242/success',
      cancel_url: 'http://localhost:4242/cancel',
    });
      
    console.log(Object.values(req.body))
    res.json({url: session.url});
  }

  static calcShipping = (arr) => {
    let total = 0;

    arr.map((item) => {
      total += item.quantity * item.attributes.price;
    })

    if (total >= 10000) {
      return 0
    } else {
      return 999
    }
  }

}