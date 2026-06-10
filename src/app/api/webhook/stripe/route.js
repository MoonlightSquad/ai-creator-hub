import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const assetId = session.metadata.assetId;

        console.log(`🔔 Payment successful for asset: ${assetId}`);

        const { error } = await supabaseAdmin
            .from('assets')
            .update({
                is_approved: true,
                is_featured: true,
                stripe_session_id: session.id
            })
            .eq('id', assetId);

        if (error) {
            console.error('❌ Error updating asset in Supabase:', error);
            return NextResponse.json({ error: 'DB Update Error' }, { status: 500 });
        }

        console.log(`✅ Asset ${assetId} has been successfully promoted to Featured!`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
}