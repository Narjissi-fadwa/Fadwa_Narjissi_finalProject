import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Users, Home, CheckCircle, XCircle, Clock, UserCheck, MapPin } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminDashboard({ auth, stats, properties, agents }) {
    const breadcrumbs = [
        { label: 'Admin', href: '/admin/dashboard' },
        { label: 'Dashboard', href: '/admin/dashboard' },
    ];

    const handleStatusChange = (property, status) => {
        router.post(`/admin/properties/${property.id}/status`, {
            status: status,
        });
    };

    const handleAssignAgent = (property, agentId) => {
        router.post(`/admin/properties/${property.id}/agent`, {
            agent_id: agentId,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-fixed bg-[url('/storage/real-estatebg.png')] bg-contain bg-no-repeat  bg-right relative p-0 m-0">

                <div className="absolute inset-0 bg-slate-900/30"></div>
                
                
                <div className="relative z-10 w-full min-h-screen overflow-y-auto p-4">
                    
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Welcome back, {auth?.user?.name || 'User'}</h1>
                        <p className="text-slate-900/80 text-lg">Manage properties, users, and system settings</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        
                        <div className="backdrop-blur-md bg-black/5 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-900">Total Properties</h3>
                                <Home className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{stats.total_properties}</div>
                            <div className="text-slate-900/70 text-sm">All property listings</div>
                        </div>
                        <div className="backdrop-blur-md bg-black/10 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-900">Pending Approval</h3>
                                <Clock className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{stats.pending_properties}</div>
                            <div className="text-slate-900/70 text-sm">Awaiting review</div>
                        </div>

                        <div className="backdrop-blur-md bg-black/10 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-900">Approved</h3>
                                <CheckCircle className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{stats.approved_properties}</div>
                            <div className="text-slate-900/70 text-sm">Active listings</div>
                        </div>
                        <div className="backdrop-blur-md bg-black/10 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-900">Total Users</h3>
                                <Users className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{stats.total_users}</div>
                            <div className="text-slate-900/70 text-sm">Registered users</div>
                        </div>
                        <div className="backdrop-blur-md bg-black/10 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-900">Agents</h3>
                                <UserCheck className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{stats.total_agents}</div>
                            <div className="text-slate-900/70 text-sm">Active agents</div>
                        </div>
                        <div className="backdrop-blur-md bg-black/10 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-900">Property Owners</h3>
                                <Users className="w-8 h-8 text-orange-400" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{stats.total_owners}</div>
                            <div className="text-slate-900/70 text-sm">Property owners</div>
                        </div>
                    </div>
                    <div className="backdrop-blur-md bg-black/10 border border-black/10 rounded-3xl shadow-2xl">
                        <div className="px-6 py-4 border-b border-black/10">
                            <h2 className="text-xl font-semibold text-slate-900">Property Management</h2>
                        </div>
                        <Table className="text-slate-900">
                            <TableHeader>
                                <TableRow className="border-black/10 hover:bg-white/5">
                                    <TableHead className="text-slate-900/70 font-medium text-xs uppercase tracking-wider">Property</TableHead>
                                    <TableHead className="text-slate-900/70 font-medium text-xs uppercase tracking-wider">Owner</TableHead>
                                    <TableHead className="text-slate-900/70 font-medium text-xs uppercase tracking-wider">Type</TableHead>
                                    <TableHead className="text-slate-900/70 font-medium text-xs uppercase tracking-wider">Price</TableHead>
                                    <TableHead className="text-slate-900/70 font-medium text-xs uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="text-slate-900/70 font-medium text-xs uppercase tracking-wider">Agent</TableHead>
                                    <TableHead className="text-slate-900/70 font-medium text-xs uppercase tracking-wider">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {properties.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-slate-900/70">
                                            <Home className="w-12 h-12 mx-auto mb-4 text-slate-900/30" />
                                            <p>No properties found</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    properties.map((property) => (
                                        <TableRow key={property.id} className="border-black/10 hover:bg-white/5 transition-colors duration-200">
                                            <TableCell>
                                                <div className="text-sm font-medium text-slate-900">{property.title}</div>
                                                <div className="text-sm text-slate-900/70">{property.address}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-slate-900">{property.owner?.name}</div>
                                                <div className="text-sm text-slate-900/70">{property.owner?.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-slate-900 capitalize">{property.type}</div>
                                                <div className="text-sm text-slate-900/70 capitalize">{property.listing_type}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-medium text-slate-900">
                                                    ${property.price?.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${property.approval_status === 'approved'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                                        : property.approval_status === 'rejected'
                                                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                                                    }`}>
                                                    {property.approval_status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-slate-900">
                                                    {property.assigned_agent?.name || 'Unassigned'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col space-y-2">

                                                    <select
                                                        value={property.approval_status}
                                                        onChange={(e) => handleStatusChange(property, e.target.value)}
                                                        className="text-xs bg-black/10 border border-black/10 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                    >
                                                        <option value="pending" className="text-gray-800">Pending</option>
                                                        <option value="approved" className="text-gray-800">Approved</option>
                                                        <option value="rejected" className="text-gray-800">Rejected</option>
                                                    </select>
                                                    <select
                                                        value={property.assigned_agent_id || ''}
                                                        onChange={(e) => handleAssignAgent(property, e.target.value)}
                                                        className="text-xs bg-black/10 border border-black/10 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                    >
                                                        <option value="" className="text-gray-800">Assign Agent</option>
                                                        {agents.map((agent) => (
                                                            <option key={agent.id} value={agent.id} className="text-gray-800">
                                                                {agent.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
