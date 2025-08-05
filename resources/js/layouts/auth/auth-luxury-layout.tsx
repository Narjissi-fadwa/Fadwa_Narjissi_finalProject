import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthLuxuryLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <div className="absolute inset-0 ">
                <img
                    src="/storage/real-estate5.png"
                    alt="Real Estate"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>
            {/* Two-column layout */}
            <div className="grid min-h-screen lg:grid-cols-2">
                {/* Left side - Authentication form */}
                <div className="relative flex items-center justify-center p-4 lg:p-12">
                    {/* Form container */}
                    <div className="relative z-10 w-full max-w-md">

                        {/* Form card */}
                        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl w-fit">
                            <div className="mb-6 text-center">
                                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                                <p className="text-white/80 text-sm">{description}</p>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>

                {/* Right side */}
                <div className="relative block">
                    {/* Overlay content */}
                    <div className="absolute inset-0 flex flex-col justify-center ">
                        {/* Logo */}
                        <div className="mb-8 text-center">
                            <Link href={route('home')} className="inline-flex flex-col items-center gap-3 font-medium">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 backdrop-blur-sm">
                                    <AppLogoIcon className="size-8 fill-current text-emerald-600" />
                                </div>
                                <span className="text-2xl font-bold text-white">EstateHub</span>
                            </Link>
                        </div>
                        <div className="text-white text-center p-20">
                            <h2 className="text-3xl font-bold mb-4">Find Your Dream Property</h2>
                            <p className="text-white/90 text-lg ">
                                Discover luxury homes, premium apartments, and exclusive properties
                                in the most desirable locations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
