import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowLeft } from 'lucide-react';

export default function PropertiesIndex({ properties }) {
  return (
    <div className="min-h-screen bg-fixed bg-[url('/storage/real-estatebg.png')] bg-cover bg-no-repeat  bg-right relative">
      <div className="absolute inset-0 bg-slate-900/50"></div>
      <div className="mx-auto max-w-7xl px-4 pt-34  ">
        <h1 className="mb-6 text-3xl font-bold text-slate-900 text-center">Available properties</h1>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full bg-transparent m-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4 bg-transparent">
            {properties.data.map((p) => (
              <CarouselItem key={p.id} className="pl-2 md:pl-4 bg-transparent md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden transition-shadow hover:shadow-md backdrop-blur-md bg-black/10 border border-black/20 rounded-3xl shadow-2xl p-6">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="h-48 w-full object-cover" />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-neutral-100 text-neutral-500">No image</div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">{p.title}</h2>
                      <span className="text-sm">{p.type}</span>
                    </div>
                    <div className="mt-1 text-sm text-neutral-600">{p.address}</div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span>{Number(p.price).toLocaleString()} $</span>
                      <span>
                        {p.bedrooms ? `${p.bedrooms} bd` : '—'} • {p.area} m²
                      </span>
                    </div>
                    <div className="mt-4">
                      <Button asChild className="w-full bg-[#2F8663] hover:bg-emerald-600 text-white">
                        <Link href={route('properties.show', p.id)}>
                          See More Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-white border-none" />
          <CarouselNext className="bg-white border-none"/>
        </Carousel>
        
      </div>

    </div>
   
  );
}


