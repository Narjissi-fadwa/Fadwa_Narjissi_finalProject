import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link } from "@inertiajs/react"

export default function Welcome() {
    const [activeTab, setActiveTab] = useState('buy')
    const [propertyType, setPropertyType] = useState('')
    const [location, setLocation] = useState('')
    const [priceRange, setPriceRange] = useState([0, 1000000])

    return (
        <div className="relative h-screen w-full overflow-hidden">
            <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-4 backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors duration-300">
                            EstateHub
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/login"
                            className="px-6 py-2 text-white/90 hover:text-white font-medium transition-all duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm"
                        >
                            Login
                        </Link>

                        <Link
                            href="/register"
                            className="px-6 py-2 text-white font-medium border border-white/30 hover:border-white/50 rounded-lg transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                        >
                            Sign Up
                        </Link>

                        <Button className="px-6 py-2 bg-[#2F8663] hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            Free Consultation
                        </Button>
                    </div>
                </div>
            </nav>

            <section id="hero-section" className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/storage/real-estate3.png"
                        alt="Real Estate"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 flex h-full items-center justify-center pt-24 px-4">
                    <div className="w-full max-w-[70%] flex flex-col gap-26 pt-8 ">
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

        </div>
    );
}



