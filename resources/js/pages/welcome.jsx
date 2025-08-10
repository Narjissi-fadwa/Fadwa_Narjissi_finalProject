import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { Link, usePage } from "@inertiajs/react"
import { Facebook, X, Instagram } from 'lucide-react';

export default function Welcome() {
    const { auth , properties } = usePage().props;
    const [activeTab, setActiveTab] = useState('buy')
    const [propertyType, setPropertyType] = useState('')
    const [location, setLocation] = useState('')
    const [priceRange, setPriceRange] = useState([0, 1000000])

    return (
        <div className="relative h-screen w-full ">
            <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-4 backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors duration-300">
                            <img src="/storage/logo-Hillcrest.png" alt="log" className="h-15 w-85" />
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            // Show user menu when logged in
                            <>
                                <Link
                                    href="/dashboard"
                                    className="px-6 py-2 text-white/90 hover:text-white font-medium transition-all duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm inline-block"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="px-6 py-2 text-white/90 hover:text-white font-medium border border-white/30 hover:border-white/50 rounded-lg transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            // Show login/register when not logged in
                            <>
                                <Link
                                    href="/login"
                                    className="px-6 py-2 text-white/90 hover:text-white font-medium transition-all duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm inline-block"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    className="px-6 py-2 text-white font-medium border border-white/30 hover:border-white/50 rounded-lg transition-all duration-300 hover:bg-white/10 backdrop-blur-sm inline-block"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}

                        <Button className="px-6 py-2 bg-[#2F8663] hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            Free Consultation
                        </Button>
                    </div>
                </div>
            </nav>

            <section id="hero-section" className="relative h-screen w-full overflow-hidden py-8">
                <div className="absolute inset-0">
                    <img
                        src="/storage/real-estate3.png"
                        alt="Real Estate"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 flex h-full items-center justify-center pt-24 px-4 py-8">
                    <div className="w-full max-w-[70%] flex flex-col gap-26 pt-8 py-8">
                        <div className="text-center ">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Find your dream property
                            </h1>
                            <p className="text-white/80 text-lg">
                                Discover the perfect place to call home
                            </p>
                        </div>
                        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl  mt-24">



                            <div className="flex  mb-6">
                                <div className="bg-white/10 rounded-full p-1 flex">
                                    <button
                                        onClick={() => setActiveTab('buy')}
                                        className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'buy'
                                            ? 'bg-[#2F8663] text-white shadow-lg'
                                            : 'text-white/70 hover:text-white'
                                            }`}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('rent')}
                                        className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'rent'
                                            ? 'bg-[#2F8663] text-white shadow-lg'
                                            : 'text-white/70 hover:text-white'
                                            }`}
                                    >
                                        Rent
                                    </button>
                                </div>
                            </div>


                            <div className="space-y-4 flex flex-col ">
                                <div className="flex flex-row space-x-4 justify-between">

                                    <div className="w-full">
                                        <select
                                            value={propertyType}
                                            onChange={(e) => setPropertyType(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent"
                                        >
                                            <option value="" className="text-gray-800">Select property type</option>
                                            <option value="apartment" className="text-gray-800">Apartment</option>
                                            <option value="villa" className="text-gray-800">Villa</option>
                                            <option value="house" className="text-gray-800">House</option>
                                            <option value="land" className="text-gray-800">Land</option>
                                        </select>
                                    </div>


                                    <div className="w-full">
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Search by city or area..."
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent"
                                        />
                                    </div>
                                </div>


                                <div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1">
                                            <input
                                                type="number"
                                                placeholder={activeTab === 'buy' ? 'Min Price' : 'Min Rent'}
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent"
                                            />
                                        </div>
                                        <span className="text-white/60">-</span>
                                        <div className="flex-1">
                                            <input
                                                type="number"
                                                placeholder={activeTab === 'buy' ? 'Max Price' : 'Max Rent'}
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <Button className="w-50 align-self-center mx-auto bg-[#2F8663] hover:bg-[#2F8663] text-white p-6 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl">
                                    Search Properties
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <div className="min-h-screen  bg-fixed bg-[url('/storage/real-estatebg.png')] bg-cover bg-no-repeat bg-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-900/70"></div>
                <section className="relative z-10 py-20">
                    <div className="max-w-6xl mx-auto px-6 lg:px-8">


                        <div className="text-center backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
                            <h2 className="text-4xl font-bold text-white mb-6">
                                About <span className="text-[#2F8663]">Hillcrest</span>
                            </h2>
                            <p className="text-white/90 text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
                                At <strong className="text-[#2F8663]">Hillcrest</strong>, we connect property owners, agents, and clients on a single platform.
                                Whether you’re looking to sell, rent, or buy, our mission is to simplify the process with
                                a user-friendly interface and professional services.
                            </p>
                            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
                                From listing your property to finalizing payments, we ensure a secure and transparent experience.
                                Our team works closely with agents to provide you with personalized offers that match your needs.
                            </p>
                            <Button className="bg-[#2F8663] hover:bg-emerald-600 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="relative z-10 py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="text-center mb-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">Featured Properties</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto">
                                Discover our handpicked selection of premium properties
                            </p>
                        </div>

                        {properties?.data?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                                {properties.data.map((p) => (
                                    <Card key={p.id} className="overflow-hidden   transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-md bg-slate-900 border border-white/20 shadow-2xl">
                                        <div className="relative ">
                                            {p.image ? (
                                                <img src={p.image} alt={p.title} className="h-64 w-full object-cover" />
                                            ) : (
                                                <div className="flex h-64 w-full items-center justify-center bg-gray-100 text-gray-500">
                                                    <div className="text-center">
                                                        <div className="text-4xl mb-2">🏠</div>
                                                        <p>No image available</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-[#2F8663] text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                                                    {p.type}
                                                </span>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="mb-4">
                                                <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                                                <p className="text-white/80 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    {p.address}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-2xl font-bold text-[#2F8663]">
                                                    {Number(p.price).toLocaleString()} $
                                                </div>
                                                <div className="text-white/80 text-sm">
                                                    {p.bedrooms ? `${p.bedrooms} bed` : '—'} • {p.area} m²
                                                </div>
                                            </div>

                                            <Button asChild className="w-full bg-[#2F8663] hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                                                <Link href={route('properties.show', p.id)}>
                                                    View Details
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
                                <h3 className="text-2xl font-semibold text-white mb-2">No Properties Available</h3>
                                <p className="text-white/80">Check back later for new listings!</p>
                            </div>
                        )}

                        <div className="text-center mt-12">
                            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl inline-block">
                                <Button asChild className="bg-[#2F8663] hover:bg-emerald-700 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <Link href={route('properties.index')}>
                                        Explore All Properties
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <footer className="bg-slate-900 text-gray-300 py-10">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Hillcrest</h3>
                        <p className="text-sm">
                            Making real estate simple, secure, and efficient for owners, agents, and clients.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:text-emerald-500 transition">Home</a></li>
                            <li><a href="/properties" className="hover:text-emerald-500 transition">Properties</a></li>
                            <li><a href="/about" className="hover:text-emerald-500 transition">About Us</a></li>
                            <li><a href="/contact" className="hover:text-emerald-500 transition">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
                        <p className="text-sm">123 Real Estate Ave,<br /> Casablanca, Morocco</p>
                        <p className="text-sm mt-2">Email: support@Hillcrest.com</p>
                        <p className="text-sm">Phone: +212 600 000 000</p>
                    </div>


                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-emerald-500 transition">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="#" className="hover:text-emerald-500 transition">
                                <X className="w-6 h-6" />
                            </a>
                            <a href="#" className="hover:text-emerald-500 transition">
                                <Instagram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm">
                    © 2025 Hillcrest. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
