import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs = [
    {
        title: 'ClientDashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ purchases: initialPurchases }) {
    const { purchases: propPurchases } = usePage().props;
    const purchases = propPurchases ?? initialPurchases ?? [];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
                    <h2 className="text-lg font-semibold mb-4">Bought Properties</h2>
                    {purchases.length === 0 ? (
                        <div className="text-sm text-neutral-600">No purchases yet.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Sold at</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchases.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.title}</TableCell>
                                        <TableCell>{p.address}</TableCell>
                                        <TableCell>${p.price?.toLocaleString?.() ?? p.price}</TableCell>
                                        <TableCell>{p.sold_at}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
