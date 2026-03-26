import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Sign in</h2>
                <p className="text-sm text-gray-500 mt-1">Enter your credentials to access the portal</p>
            </div>

            {status && (
                <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 px-4 py-3 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email address" className="text-sm font-medium text-gray-700" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1.5 text-xs text-red-500" />
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <InputLabel htmlFor="password" value="Password" className="text-sm font-medium text-gray-700" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1.5 text-xs text-red-500" />
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="remember"
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                        Keep me signed in
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-2 flex justify-center items-center py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    ) : null}
                    {processing ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
        </GuestLayout>
    );
}
