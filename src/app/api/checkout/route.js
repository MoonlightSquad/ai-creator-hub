import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { assetId, title } = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Premium Featured Listing: ${title}`,
                            description: '30 days visibility at the top of AI Creator Hub',
                        },
                        unit_amount: 4900,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: { assetId },
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/submit?canceled=true`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error('Stripe Checkout Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}