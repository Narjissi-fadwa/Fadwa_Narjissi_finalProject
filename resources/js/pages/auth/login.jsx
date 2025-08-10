import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Welcome back" description="Sign in to your Hillcrest account">
            <Head title="Log in" />

            {status && <div className="mb-6 text-center text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl">{status}</div>}

            <form className="space-y-6 w-[600px]" onSubmit={submit}>
                <div className="space-y-4">
                    <div className="grid gap-2 bg-transparent">
                        <Label htmlFor="email" className="text-sm font-medium text-white">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="your.email@example.com"
                            className="h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent"
                             
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-medium text-white">Password</Label>
                            {canResetPassword && (
                                <TextLink
                                    href={route('password.request')}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Enter your password"
                            className="h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2F8663] focus:border-transparent "
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                        <Label htmlFor="remember" className="text-sm text-white">Remember me</Label>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    tabIndex={4}
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Sign In
                </Button>

                <div className="text-center text-sm text-white">
                    Don't have an account?{' '}
                    <TextLink
                        href={route('register')}
                        className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                        tabIndex={6}
                    >
                        Create account
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
