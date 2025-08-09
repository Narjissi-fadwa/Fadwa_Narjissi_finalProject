import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, DollarSign, Home, ArrowLeft } from 'lucide-react';

const PaymentForm = ({ property, fee, stripePublishableKey, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            body: JSON.stringify({
                property_id: property.id,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.client_secret) {
                setClientSecret(data.client_secret);
            } else {
                onError(data.error || 'Failed to initialize payment');
            }
        })
        .catch(error => {
            onError('Network error: ' + error.message);
        });
    }, [property.id, onError]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setProcessing(true);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        });

        if (error) {
            onError(error.message);
            setProcessing(false);
        } else if (paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Listing Fee ({property.listing_type === 'sale' ? '10%' : '30%'})</span>
                    <span className="text-lg font-bold text-gray-900">${fee.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500">
                    This fee activates your property listing and makes it visible to potential {property.listing_type === 'sale' ? 'buyers' : 'renters'}.
                </p>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Card Information
                </label>
                <div className="p-3 border border-gray-300 rounded-md">
                    <CardElement options={cardElementOptions} />
                </div>
            </div>

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full flex items-center justify-center px-6 py-3 bg-[#2F8663] hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
                {processing ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pay ${fee.toFixed(2)}
                    </>
                )}
            </button>
        </form>
    );
};

const breadcrumbs = [
    {
        title: 'Owner Dashboard',
        href: '/owner/dashboard',
    },
    {
        title: 'Payment',
        href: '#',
    },
];

export default function PropertyPayment({ property, fee, stripePublishableKey }) {
    const [error, setError] = useState('');
    const stripePromise = loadStripe(stripePublishableKey);

    const handleSuccess = (paymentIntentId) => {
        router.post('/payment/success', {
            payment_intent_id: paymentIntentId,
        });
    };

    const handleError = (errorMessage) => {
        setError(errorMessage);
    };

    const handleBackToDashboard = () => {
        router.visit('/owner/dashboard');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Complete Payment" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="absolute  inset-0 bg-[url('/storage/real-estatebg.png')] bg-cover bg-center opacity-80"></div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
                    <div className="mb-6">
                        <button
                            onClick={handleBackToDashboard}
                            className="inline-flex items-center text-[#2F8663] hover:text-emerald-800 font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        <div className="backdrop-blur-md bg-black/5 border border-black/10  rounded-xl shadow-sm  p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Home className="w-5 h-5 mr-2" />
                                Property Summary
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-900">{property.title}</h3>
                                    <p className="text-sm text-gray-600">{property.address}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Type:</span>
                                        <span className="ml-2 font-medium capitalize">{property.type}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Area:</span>
                                        <span className="ml-2 font-medium">{property.area} m²</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Listing:</span>
                                        <span className="ml-2 font-medium capitalize">{property.listing_type}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Price:</span>
                                        <span className="ml-2 font-medium">${property.price.toLocaleString()}</span>
                                    </div>
                                </div>

                                {property.images && property.images.length > 0 && (
                                    <div>
                                        <span className="text-sm text-gray-500 block mb-2">Property Images:</span>
                                        <div className="grid grid-cols-2 gap-2">
                                            {property.images.slice(0, 4).map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Property ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded-md"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="backdrop-blur-md bg-black/5 border border-black/10  rounded-xl shadow-sm  p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <DollarSign className="w-5 h-5 mr-2" />
                                Complete Payment
                            </h2>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-800 text-sm">{error}</p>
                                </div>
                            )}

                            <Elements stripe={stripePromise}>
                                <PaymentForm
                                    property={property}
                                    fee={fee}
                                    stripePublishableKey={stripePublishableKey}
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                />
                            </Elements>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
