<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create a payment intent for property listing
     */
    public function createPropertyPaymentIntent($amount, $currency = 'usd', $metadata = [])
    {
        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount * 100, 
                'currency' => $currency,
                'metadata' => $metadata,
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return $paymentIntent;
        } catch (ApiErrorException $e) {
            throw new \Exception('Failed to create payment intent: ' . $e->getMessage());
        }
    }

    /**
     * Retrieve a payment intent
     */
    public function retrievePaymentIntent($paymentIntentId)
    {
        try {
            return PaymentIntent::retrieve($paymentIntentId);
        } catch (ApiErrorException $e) {
            throw new \Exception('Failed to retrieve payment intent: ' . $e->getMessage());
        }
    }

    /**
     * Calculate property listing fee
     */
    public function calculatePropertyFee($price, $listingType)
    {
        $feePercentage = $listingType === 'sale' ? 0.10 : 0.30; // 10% for sale, 30% for rent
        return round($price * $feePercentage, 2);
    }
}
