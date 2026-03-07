import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { motion } from 'framer-motion';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-blue-600 selection:text-brand-navy">
            <Head title="Welcome to YSTRIX IT" />

            {/* Background Animations */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[130px]"
                />
            </div>

            <main className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <ApplicationLogo className="w-64 h-auto mx-auto mb-12 drop-shadow-sm" />

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-6">
                        Empowering the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-pink to-brand-orange">Next Generation.</span>
                    </h1>

                    <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                        The ultimate student internship portal for YSTRIX IT.
                        Track your progress, manage resources, and build your future.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-10 py-5 bg-blue-600 text-brand-navy font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-brand-cyan/20"
                            >
                                Enter Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-10 py-5 bg-blue-600 text-brand-navy font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-brand-cyan/20 w-full sm:w-auto text-center"
                                >
                                    Login to Portal
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="px-10 py-5 bg-white/5 border border-gray-200 text-gray-900 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto text-center "
                                >
                                    Register Account
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Accent dots */}
                <div className="mt-24 flex justify-center gap-3 opacity-20">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                </div>
            </main>

            <footer className="absolute bottom-8 left-0 w-full text-center z-10">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
                    &copy; {new Date().getFullYear()} YSTRIX IT SOLUTIONS. ALL RIGHTS RESERVED.
                </p>
            </footer>
        </div>
    );
}
