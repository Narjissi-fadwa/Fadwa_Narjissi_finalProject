<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Create payment intent for property listing
     */
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'property_id' => 'required|exists:properties,id',
        ]);

        $property = Property::findOrFail($request->property_id);

        if ($property->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // Check if property is approved
        if ($property->approval_status !== 'approved') {
            return response()->json([
                'error' => 'Property must be approved before payment can be made.'
            ], 403);
        }

        // Check if payment is already completed
        if ($property->payment_status === 'paid') {
            return response()->json([
                'error' => 'Payment for this property has already been completed.'
            ], 400);
        }
        $fee = $this->stripeService->calculatePropertyFee($property->price, $property->listing_type);

        try {
            $paymentIntent = $this->stripeService->createPropertyPaymentIntent(
                $fee,
                'usd',
                [
                    'property_id' => $property->id,
                    'user_id' => Auth::id(),
                    'listing_type' => $property->listing_type,
                ]
            );

            // Update property with payment intent ID
            $property->update([
                'stripe_payment_intent_id' => $paymentIntent->id,
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'amount' => $fee,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle successful payment
     */
    public function handlePaymentSuccess(Request $request)
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        try {
            $paymentIntent = $this->stripeService->retrievePaymentIntent($request->payment_intent_id);

            if ($paymentIntent->status === 'succeeded') {
                $property = Property::where('stripe_payment_intent_id', $paymentIntent->id)->first();

                if ($property && $property->user_id === Auth::id()) {
                    $property->update([
                        'payment_status' => 'paid',
                        'status' => 'active',
                    ]);

                    return redirect()->route('owner.dashboard')
                        ->with('success', 'Payment successful! Your property is now active.');
                }
            }

            return redirect()->route('owner.dashboard')
                ->with('error', 'Payment verification failed.');
        } catch (\Exception) {
            return redirect()->route('owner.dashboard')
                ->with('error', 'Payment processing error.');
        }
    }

    /**
     * Show payment page
     */
    public function showPaymentPage(Property $property)
    {
        // Ensure the property belongs to the authenticated user
        if ($property->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // Check if property is approved
        if ($property->approval_status !== 'approved') {
            return redirect()->route('owner.dashboard')
                ->withErrors(['error' => 'Property must be approved before payment can be made.']);
        }

        // Check if payment is already completed
        if ($property->payment_status === 'paid') {
            return redirect()->route('owner.dashboard')
                ->with('info', 'Payment for this property has already been completed.');
        }

        $fee = $this->stripeService->calculatePropertyFee($property->price, $property->listing_type);

        return Inertia::render('payment/property-payment', [
            'property' => $property,
            'fee' => $fee,
            'stripePublishableKey' => config('services.stripe.key'),
        ]);
    }
}
