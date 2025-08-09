import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link, usePage } from "@inertiajs/react"

export default function Welcome() {
    const { auth } = usePage().props;
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
                            Hillcrest
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
            <section className="bg-slate-900/90 h-24 "> <h1>explore all properties</h1></section>
            <div className="min-h-screen bg-fixed bg-[url('/storage/real-estatebg.png')] bg-cover bg-no-repeat  bg-right relative p-0 m-0">
            <div className="absolute inset-0 bg-slate-900/50"></div>
            <section className="relative z-10 w-full min-h-screen overflow-y-auto p-25">
                <div className="max-w-6xl mx-auto px-6 lg:px-8  flex flex-col md:grid-cols-2 gap-12 items-center">
                    

                    <div className="m-auto text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            About <span className="text-[#2F8663]">Hillcrest</span>
                        </h2>
                        <p className="text-slate-900 leading-relaxed mb-4">
                            At <strong>Hillcrest</strong>, we connect property owners, agents, and clients on a single platform.
                            Whether you’re looking to sell, rent, or buy, our mission is to simplify the process with
                            a user-friendly interface and professional services.
                        </p>
                        <p className="text-slate-900 leading-relaxed mb-6">
                            From listing your property to finalizing payments, we ensure a secure and transparent experience.
                            Our team works closely with agents to provide you with personalized offers that match your needs.
                        </p>
                        <Button className="bg-[#2F8663] hover:bg-emerald-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl">
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>
            </div>
            <footer className="bg-gray-900 text-gray-300 py-10">
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
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="hover:text-emerald-500 transition">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="hover:text-emerald-500 transition">
                                <i className="fab fa-instagram"></i>
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
