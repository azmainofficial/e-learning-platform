import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user} header="Dashboard">
            <Head title="Dashboard" />
            <div className="max-w-4xl mx-auto py-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <p className="text-gray-600 text-sm">You&apos;re signed in. Welcome back, <span className="font-semibold text-gray-900">{auth.user.name}</span>.</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
