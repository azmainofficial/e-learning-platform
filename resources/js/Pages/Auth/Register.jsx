import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Join the Portal</h2>
                    <p className="text-gray-500 text-sm mt-1">Start your career journey with Mytrix IT today.</p>
                </motion.div>

                <form onSubmit={submit} className="space-y-4">
                    <motion.div variants={itemVariants}>
                        <InputLabel htmlFor="name" value="Full Name" className="text-gray-300 font-bold" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full bg-white/5 border-gray-200 text-gray-900 focus:border-brand-pink focus:ring-purple-200"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <InputLabel htmlFor="email" value="Email Address" className="text-gray-300 font-bold" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full bg-white/5 border-gray-200 text-gray-900 focus:border-brand-pink focus:ring-purple-200"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <InputLabel htmlFor="role" value="Desired Role" className="text-gray-300 font-bold" />
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            className="mt-1 block w-full bg-white border-gray-200 text-gray-900 rounded-lg focus:border-brand-pink focus:ring-purple-200 transition-all font-medium py-2.5"
                            onChange={(e) => setData('role', e.target.value)}
                            required
                        >
                            <option value="student">Student Intern</option>
                            <option value="admin">Program Manager</option>
                            {/* Super Admin restricted from direct registration */}
                        </select>
                        <InputError message={errors.role} className="mt-2" />
                        <p className="text-[10px] text-gray-500 mt-1 uppercase font-black tracking-widest italic">Note: All accounts require manual admin approval.</p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                        <motion.div variants={itemVariants}>
                            <InputLabel htmlFor="password" value="Password" className="text-gray-300 font-bold" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full bg-white/5 border-gray-200 text-gray-900 focus:border-brand-pink focus:ring-purple-200"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <InputLabel htmlFor="password_confirmation" value="Confirm" className="text-gray-300 font-bold" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full bg-white/5 border-gray-200 text-gray-900 focus:border-brand-pink focus:ring-purple-200"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                        </motion.div>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                    <InputError message={errors.password_confirmation} className="mt-2" />

                    <motion.div variants={itemVariants} className="pt-4">
                        <PrimaryButton
                            className="w-full justify-center py-4 bg-purple-600 hover:bg-brand-orange text-gray-900 font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-brand-pink/20 transition-all transform hover:scale-[1.02] active:scale-95"
                            disabled={processing}
                        >
                            Create Account
                        </PrimaryButton>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center mt-6">
                        <p className="text-gray-500 text-xs">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-blue-600 hover:text-brand-blue font-black uppercase tracking-widest transition-colors">
                                Log in
                            </Link>
                        </p>
                    </motion.div>
                </form>
            </motion.div>
        </GuestLayout>
    );
}
