import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react';
import {
    HomeIcon,
    AcademicCapIcon,
    Bars3Icon,
    UsersIcon,
    ChartBarIcon,
    FolderIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
    ClipboardDocumentListIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

export default function Authenticated({ user, header, children }) {
    const [collapsed, setCollapsed] = useState(false);

    const navItemClass = (active) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${active
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;

    const NavItem = ({ href, current, icon: Icon, label }) => (
        <NavLink href={href} active={current}>
            <span className="flex items-center gap-3">
                <Icon className="w-4.5 h-4.5 w-[18px] h-[18px] flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
            </span>
        </NavLink>
    );

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`flex-shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0 z-50 flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'
                    }`}
            >
                {/* Brand */}
                <div className={`h-14 flex items-center border-b border-gray-100 ${collapsed ? 'justify-center px-3' : 'px-4 gap-2.5'}`}>
                    <Link href="/" className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ApplicationLogo className="w-4 h-4 text-white" />
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 leading-none truncate">StrixIT</p>
                                <p className="text-xs text-blue-600 leading-none mt-0.5">Academy</p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                    <NavItem
                        href={route('dashboard')}
                        current={route().current('dashboard')}
                        icon={HomeIcon}
                        label="Dashboard"
                    />

                    {user.role === 'super_admin' && (
                        <NavItem
                            href={route('super-admin.dashboard')}
                            current={route().current('super-admin.dashboard')}
                            icon={Cog6ToothIcon}
                            label="System Config"
                        />
                    )}

                    {(user.role === 'admin' || user.role === 'super_admin') && (
                        <>
                            <div className={`pt-3 pb-1 ${collapsed ? 'hidden' : 'block'}`}>
                                <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Management</p>
                            </div>
                            {collapsed && <div className="my-2 border-t border-gray-100" />}

                            <NavItem
                                href={route('admin.dashboard')}
                                current={route().current('admin.dashboard')}
                                icon={ChartBarIcon}
                                label="Analytics"
                            />
                            <NavItem
                                href={route('admin.courses.index')}
                                current={route().current('admin.courses.*')}
                                icon={AcademicCapIcon}
                                label="Courses"
                            />
                            <NavItem
                                href={route('admin.batches.index')}
                                current={route().current('admin.batches.*')}
                                icon={UsersIcon}
                                label="Batches"
                            />
                            <NavItem
                                href={route('admin.assignments.index')}
                                current={route().current('admin.assignments.*')}
                                icon={DocumentTextIcon}
                                label="Assignments"
                            />
                            <NavItem
                                href={route('admin.quizzes.index')}
                                current={route().current('admin.quizzes.*')}
                                icon={ClipboardDocumentListIcon}
                                label="Assessments"
                            />
                            <NavItem
                                href={route('admin.projects.index')}
                                current={route().current('admin.projects.*')}
                                icon={FolderIcon}
                                label="Projects"
                            />
                            <NavItem
                                href={route('admin.users.index')}
                                current={route().current('admin.users.*')}
                                icon={UsersIcon}
                                label="Users"
                            />
                        </>
                    )}

                    {user.role === 'student' && (
                        <>
                            <div className={`pt-3 pb-1 ${collapsed ? 'hidden' : 'block'}`}>
                                <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Learning</p>
                            </div>
                            {collapsed && <div className="my-2 border-t border-gray-100" />}

                            <NavItem
                                href={route('student.courses.index')}
                                current={route().current('student.courses.*')}
                                icon={AcademicCapIcon}
                                label="My Courses"
                            />
                            <NavItem
                                href={route('student.projects.index')}
                                current={route().current('student.projects.*')}
                                icon={FolderIcon}
                                label="Projects"
                            />
                        </>
                    )}
                </nav>

                {/* Collapse toggle */}
                <div className="border-t border-gray-100 p-2">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? (
                            <ChevronRightIcon className="w-4 h-4" />
                        ) : (
                            <ChevronLeftIcon className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        {header && (
                            <h1 className="text-base font-semibold text-gray-800">{header}</h1>
                        )}
                    </div>

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-800 leading-none">{user.name}</p>
                                    <p className="text-xs text-gray-400 capitalize mt-0.5">{user.role.replace('_', ' ')}</p>
                                </div>
                                <svg className="w-3.5 h-3.5 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>My Profile</Dropdown.Link>
                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-red-600"
                            >
                                Sign out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
