import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    AcademicCapIcon,
    Bars3Icon,
    UsersIcon,
    ChartBarIcon,
    FolderIcon,
    DocumentTextIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function Authenticated({ user, header, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '260px' : '80px' }}
                className="bg-white flex-shrink-0 h-screen sticky top-0 z-50 overflow-hidden flex flex-col border-r border-gray-200 transition-all duration-300 shadow-sm"
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 border-b border-gray-200">
                    <Link href="/" className="flex items-center gap-3">
                        <ApplicationLogo className="w-8 h-8 text-blue-600 flex-shrink-0" />
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col whitespace-nowrap"
                                >
                                    <span className="font-bold text-lg text-gray-900 leading-tight mt-1">StrixIT</span>
                                    <span className="text-xs text-blue-600 font-semibold">Academy</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-3 space-y-1 py-6 overflow-y-auto">
                    <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                        <span className="flex items-center gap-3 py-1">
                            <HomeIcon className="w-5 h-5 flex-shrink-0" />
                            {isSidebarOpen && <span>Dashboard</span>}
                        </span>
                    </NavLink>

                    {user.role === 'super_admin' && (
                        <NavLink href={route('super-admin.dashboard')} active={route().current('super-admin.dashboard')}>
                            <span className="flex items-center gap-3 py-1">
                                <Cog6ToothIcon className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && <span>System Config</span>}
                            </span>
                        </NavLink>
                    )}

                    {(user.role === 'admin' || user.role === 'super_admin') && (
                        <>
                            <NavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                                <span className="flex items-center gap-3 py-1">
                                    <ChartBarIcon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span>Analytics</span>}
                                </span>
                            </NavLink>
                            <NavLink href={route('admin.courses.index')} active={route().current('admin.courses.*')}>
                                <span className="flex items-center gap-3 py-1">
                                    <AcademicCapIcon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span>Courses</span>}
                                </span>
                            </NavLink>
                            <NavLink href={route('admin.batches.index')} active={route().current('admin.batches.*')}>
                                <span className="flex items-center gap-3 py-1">
                                    <UsersIcon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span>Batches</span>}
                                </span>
                            </NavLink>
                            <NavLink href={route('admin.assignments.index')} active={route().current('admin.assignments.*')}>
                                <span className="flex items-center gap-3 py-1">
                                    <DocumentTextIcon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span>Assignments</span>}
                                </span>
                            </NavLink>
                            <NavLink href={route('admin.projects.index')} active={route().current('admin.projects.*')}>
                                <span className="flex items-center gap-3 py-1">
                                    <FolderIcon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span>Projects</span>}
                                </span>
                            </NavLink>
                            <NavLink href={route('admin.quizzes.index')} active={route().current('admin.quizzes.*')}>
                                <span className="flex items-center gap-3 py-1">
                                    <DocumentTextIcon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span>Assessments</span>}
                                </span>
                            </NavLink>
                            <NavLink href={route('admin.users.index')} active={route().current('admin.users.*')}>
                                <span className="flex items-center gap-3 py-1">
                                    <UsersIcon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span>Users</span>}
                                </span>
                            </NavLink>
                        </>
                    )}

                    {user.role === 'student' && (
                        <>
                            <NavLink href={route('student.courses.index')} active={route().current('student.courses.*')}>
                                <span className="flex items-center gap-3 py-1">
                                    <AcademicCapIcon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span>My Learning</span>}
                                </span>
                            </NavLink>
                            <NavLink href={route('student.projects.index')} active={route().current('student.projects.*')}>
                                <span className="flex items-center gap-3 py-1">
                                    <FolderIcon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span>Projects</span>}
                                </span>
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* Toggle */}
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-900"
                    >
                        <Bars3Icon className="w-5 h-5" />
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50 relative">
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        {header && (
                            <div className="text-xl font-semibold text-gray-800 tracking-tight">{header}</div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 pl-2 pr-4 py-2 text-sm font-medium text-gray-700 rounded-full hover:bg-gray-100 transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <div className={`w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <p className="text-sm font-semibold text-gray-800 leading-none">{user.name}</p>
                                        <p className="text-xs text-gray-500 font-medium capitalize mt-1">{user.role.replace('_', ' ')}</p>
                                    </div>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>My Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600 font-medium">Log out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
