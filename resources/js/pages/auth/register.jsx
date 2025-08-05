import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'client',
        interest_type: '',
        city: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Join EstateHub and discover your perfect property">
            <Head title="Register" />
            <form className="space-y-4 w-[600PX]" onSubmit={submit}>

                <div className="space-y-3">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-medium text-white">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Enter your full name"
                            className="h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent"
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div className='flex space-x-3 w-full'>

                        <div className="grid gap-2 w-full">
                            <Label htmlFor="email" className="text-sm font-medium text-white">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="your.email@example.com"
                                className="h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2 w-full">
                            <Label htmlFor="phone" className="text-sm font-medium text-white">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                required
                                tabIndex={3}
                                autoComplete="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                disabled={processing}
                                placeholder="+1 (555) 123-4567"
                                className="h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent"
                            />
                            <InputError message={errors.phone} />
                        </div>
                    </div>
                </div>

                <div className="flex space-x-3 w-full">
                    <div className="grid gap-2 w-full">
                        <Label htmlFor="password" className="text-sm font-medium text-white">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Create a strong password"
                            className="h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2 w-full">
                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-white">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm your password"
                            className="h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>


                <div className="space-y-3">
                    <div className="grid gap-3">
                        <Label className="text-sm font-medium text-white">I am a</Label>
                        <ToggleGroup
                            type="single"
                            value={data.role}
                            onValueChange={(value) => value && setData('role', value)}
                            className="grid grid-cols-2 gap-2 "
                        >
                            <ToggleGroupItem
                                value="client"
                                className="h-12 rounded  bg-white/10 border-white/20 text-white placeholder-white/60 border data-[state=on]:border-[#2F8663] data-[state=on]:bg-[#2F8663] data-[state=on]:text-white"
                                tabIndex={6}
                            >
                                Client
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="owner"
                                className="h-12 rounded  bg-white/10 border-white/20 text-white placeholder-white/60 border data-[state=on]:border-[#2F8663] data-[state=on]:bg-[#2F8663] data-[state=on]:text-white"
                                tabIndex={7}
                            >
                                Property Owner
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <InputError message={errors.role} />
                    </div>
                </div>
                <div className='flex space-x-3 w-full'>
                    {data.role === 'client' && (
                        <div className="space-y-3 w-full">
                            <div className="grid gap-2">
                                <Label htmlFor="interest_type" className="text-sm font-medium text-white">Interest Type</Label>
                                <Select value={data.interest_type} onValueChange={(value) => setData('interest_type', value)} required>
                                    <SelectTrigger className="h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent" tabIndex={8}>
                                        <SelectValue placeholder="What are you looking for?" />
                                    </SelectTrigger>
                                    <SelectContent className='rounded-xl bg-white/95 border border-white/20'>
                                        <SelectItem className='text-[#2F8663]' value="buy">Buy Property</SelectItem>
                                        <SelectItem className='text-[#2F8663]' value="rent">Rent Property</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.interest_type} />
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 w-full">
                        <div className="grid gap-2">
                            <Label htmlFor="city" className="text-sm font-medium text-white">City</Label>
                            <Input
                                id="city"
                                type="text"
                                required
                                tabIndex={data.role === 'client' ? 9 : 8}
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                disabled={processing}
                                placeholder="Enter your city"
                                className="h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent"
                            />
                            <InputError message={errors.city} />
                        </div>
                    </div>
                </div>


                <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    tabIndex={data.role === 'client' ? 10 : 9}
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Create Account
                </Button>


                <div className="text-center text-sm text-white">
                    Already have an account?{' '}
                    <TextLink
                        href={route('login')}
                        className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                        tabIndex={data.role === 'client' ? 11 : 10}
                    >
                        Sign in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
