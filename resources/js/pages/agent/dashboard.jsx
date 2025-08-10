import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Home, CheckCircle, Clock, UserCheck, Target, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs = [
    {
        title: 'AgentDashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ assignedProperties = [], allListings = [] }) {
    const { auth } = usePage().props;

    // Calculate stats from the existing data
    const totalAssignedProperties = assignedProperties.length;
    const totalDeals = assignedProperties.reduce((sum, p) => sum + p.deals.length, 0);
    const completedDeals = assignedProperties.reduce((sum, p) =>
        sum + p.deals.filter(d => d.outcome === 'sold').length, 0);
    const pendingDeals = assignedProperties.reduce((sum, p) =>
        sum + p.deals.filter(d => d.outcome === 'pending').length, 0);
    const activeListings = allListings.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-fixed bg-[url('/storage/real-estatebg.png')] bg-contain bg-no-repeat bg-right relative p-0 m-0">
                <div className="absolute inset-0 bg-slate-900/30"></div>

                <div className="relative z-10 w-full min-h-screen overflow-y-auto p-4">

                    <div className="mb-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Welcome back, {auth?.user?.name || 'Agent'}</h1>
                        <p className="text-slate-900/80 text-lg">Manage your assigned properties and track client interactions</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                        <div className="backdrop-blur-md bg-black/5 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-900">Assigned Properties</h3>
                                <Home className="w-8 h-8 text-[#2F8663]" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{totalAssignedProperties}</div>
                            <div className="text-slate-900/70 text-sm">Properties under your management</div>
                        </div>

                        

                        <div className="backdrop-blur-md bg-black/10 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-900">Completed Sales</h3>
                                <CheckCircle className="w-8 h-8 text-[#2F8663]" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{completedDeals}</div>
                            <div className="text-slate-900/70 text-sm">Successfully closed deals</div>
                        </div>

                        

                        <div className="backdrop-blur-md bg-black/10 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-900">Available Listings</h3>
                                <TrendingUp className="w-8 h-8 text-[#2F8663]" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{activeListings}</div>
                            <div className="text-slate-900/70 text-sm">Active market opportunities</div>
                        </div>

                        
                    </div>

                    <div className="backdrop-blur-md bg-black/10 border border-black/10 rounded-3xl shadow-2xl">
                        <div className="px-6 py-4 border-b border-black/10">
                            <h2 className="text-xl font-semibold text-slate-900">Assigned Properties</h2>
                        </div>
                        {assignedProperties.length === 0 ? (
                            <div className="text-center py-8 text-slate-900/70">
                                <Home className="w-12 h-12 mx-auto mb-4 text-slate-900/30" />
                                <p>No properties assigned.</p>
                            </div>
                        ) : (
                            <Table className="text-slate-900 text-bold">
                                <TableHeader>
                                    <TableRow className="border-black/10 hover:bg-white/5">
                                        <TableHead className="text-slate-900/70 font-medium text-l uppercase tracking-wider">Property</TableHead>
                                        <TableHead className="text-slate-900/70 font-medium text-l uppercase tracking-wider">Owner</TableHead>
                                        <TableHead className="text-slate-900/70 font-medium text-l uppercase tracking-wider">Client</TableHead>
                                        <TableHead className="text-slate-900/70 font-medium text-l uppercase tracking-wider">Steps</TableHead>
                                        <TableHead className="text-slate-900/70 font-medium text-l uppercase tracking-wider">Outcome</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignedProperties.flatMap((p) => (
                                        p.deals.map((d) => (
                                            <TableRow key={`${p.id}-${d.id}`} className="border-black/10 hover:bg-white/5 transition-colors duration-200">
                                                <TableCell>
                                                    <div className="text-l font-medium text-slate-900">{p.title}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-l text-slate-900">{p.owner?.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-l text-slate-900">{d.client?.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-l space-y-1">
                                                        <div className="text-slate-900">1. Contact {d.step_contacted_at ? '✓' : '—'}</div>
                                                        <div className="text-slate-900">2. Schedule {d.step_scheduled_at ? '✓' : '—'}</div>
                                                        <div className="text-slate-900">3. Meet {d.step_met_at ? '✓' : '—'}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex px-2 py-1 text-l font-semibold rounded-full capitalize ${
                                                        d.outcome === 'sold'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                                            : d.outcome === 'rejected'
                                                                ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                                                    }`}>
                                                        {d.outcome}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        <div className="px-6 py-4 border-t border-black/10">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Available Listings</h3>
                            <div className="text-xs text-slate-900/70">Showing {allListings.length} active properties</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
