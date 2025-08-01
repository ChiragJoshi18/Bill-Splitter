import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useNotifications } from '@/hooks/use-notifications';
import { 
    LayoutGrid, 
    Users, 
    Receipt, 
    CreditCard, 
    BarChart3, 
    Mail,
    Bell,
    PieChart
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Groups',
        href: '/groups',
        icon: Users,
    },
    {
        title: 'Invites',
        href: '/invites',
        icon: Mail,
    },
    {
        title: 'Expenses',
        href: '/expenses',
        icon: Receipt,
    },
    {
        title: 'Settlements',
        href: '/settlements',
        icon: CreditCard,
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
];





export function AppSidebar() {
    const page = usePage();
    const { unreadCount } = useNotifications();
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Main Navigation */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel className="text-base font-semibold">Platform</SidebarGroupLabel>
                    <SidebarMenu>
                        {mainNavItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={page.url.startsWith(item.href)} 
                                    tooltip={{ children: item.title }}
                                    className="text-base font-medium"
                                >
                                    <Link href={item.href} prefetch className="text-base">
                                        {item.icon && <item.icon className="w-5 h-5" />}
                                        <span className="text-base font-medium">{item.title}</span>
                                        {item.title === 'Notifications' && unreadCount > 0 && (
                                            <Badge className="ml-auto bg-red-500 text-white text-sm px-2 py-1 min-w-[1.5rem]">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </Badge>
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>




            </SidebarContent>

            <SidebarFooter className='mb-5'>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
