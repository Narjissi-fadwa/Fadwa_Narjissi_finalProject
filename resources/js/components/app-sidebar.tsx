import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, Building, UserCheck, Home, Calendar, MessageCircle, Settings, Globe } from 'lucide-react';
import AppLogo from './app-logo';





export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user?.role?.name;

    // Filter navigation items based on user role
    const getNavigationItems = () => {
        if (userRole === 'owner') {
            return [
                {
                    title: 'My Listings',
                    url: '/owner/dashboard',
                    icon: Home,
                },
                {
                    title: 'Calendar',
                    url: '/owner/calendar',
                    icon: Calendar,
                },
                {
                    title: 'Chat',
                    url: '/owner/chat',
                    icon: MessageCircle,
                },
            ];
        }

        if (userRole === 'admin') {
            return [
                {
                    title: 'Manage Users',
                    url: '/admin/dashboard',
                    icon: Users,
                },
                {
                    title: 'Manage Listings',
                    url: '/admin/dashboard',
                    icon: Building,
                },
                {
                    title: 'Manage Agents',
                    url: '/admin/dashboard',
                    icon: UserCheck,
                },
                {
                    title: 'Manage Site Content',
                    url: '/admin/dashboard',
                    icon: Globe,
                },
                {
                    title: 'Global Site Settings',
                    url: '/admin/dashboard',
                    icon: Settings,
                },
            ];
        }

        // Default fallback
        return [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: LayoutGrid,
            },
        ];
    };

    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-slate-900 ">
            <SidebarHeader className="border-b border-white/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="text-white hover:bg-white/10">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-transparent">
                <NavMain items={getNavigationItems()} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 bg-transparent">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
