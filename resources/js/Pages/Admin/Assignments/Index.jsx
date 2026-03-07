import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    PlusIcon,
    TrashIcon,
    UserGroupIcon,
    UserIcon,
    CalendarIcon,
    XMarkIcon,
    BookOpenIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 italic px-1">{label}</label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500 font-medium italic">{error}</p>}
    </div>
);

const selectClass =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all';

function AssignModal({ open, onClose, courses, batches, students }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        course_id: '',
        type: 'batch',
        batch_id: '',
        user_id: '',
        due_at: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.assignments.store'), {
            onSuccess: () => { onClose(); reset(); },
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900 font-sans italic">Assign Course</h2>
                    <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <Field label="Target Course" error={errors.course_id}>
                        <select
                            value={data.course_id}
                            onChange={e => setData('course_id', e.target.value)}
                            className={selectClass}
                        >
                            <option value="">Select a course…</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Assignment Scope">
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setData('type', 'batch')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${data.type === 'batch'
                                    ? 'bg-white text-indigo-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Batch
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('type', 'individual')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${data.type === 'individual'
                                    ? 'bg-white text-indigo-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Individual
                            </button>
                        </div>
                    </Field>

                    {data.type === 'batch' ? (
                        <Field label="Select Target Batch" error={errors.batch_id}>
                            <select
                                value={data.batch_id}
                                onChange={e => setData('batch_id', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Select a batch…</option>
                                {batches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </Field>
                    ) : (
                        <Field label="Select Recipient" error={errors.user_id}>
                            <select
                                value={data.user_id}
                                onChange={e => setData('user_id', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Select a student…</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </Field>
                    )}

                    <Field label="Due Date (optional)" error={errors.due_at}>
                        <input
                            type="date"
                            value={data.due_at}
                            onChange={e => setData('due_at', e.target.value)}
                            className={selectClass}
                        />
                    </Field>

                    <div className="pt-4 space-y-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-indigo-600 text-sm font-bold text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50"
                        >
                            {processing ? 'Processing…' : 'Finalize Assignment'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Index({ auth, assignments, courses, batches, students }) {
    const [modalOpen, setModalOpen] = useState(false);
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this course assignment?')) {
            destroy(route('admin.assignments.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-lg text-gray-800">Mission Assignments</h2>}
        >
            <Head title="Assignments" />

            <div className="py-10 bg-gray-50 min-h-[calc(100vh-64px)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Course Assignments</h1>
                            <p className="text-sm text-gray-500 mt-1">Map educational content to cohorts or specific individuals.</p>
                        </div>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-sm font-bold text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Initialize Assignment
                        </button>
                    </div>

                    {/* Table View */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {assignments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Target Course</th>
                                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Recipient Scope</th>
                                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</th>
                                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {assignments.map((assignment) => (
                                            <tr key={assignment.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                                                            <BookOpenIcon className="w-5 h-5 font-bold" />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {assignment.course.title}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    {assignment.batch ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-100 shadow-sm">
                                                            <UserGroupIcon className="w-3.5 h-3.5" />
                                                            Cohort: {assignment.batch.name}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-100 shadow-sm">
                                                            <UserIcon className="w-3.5 h-3.5" />
                                                            Individual: {assignment.user?.name}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold italic tracking-wide">
                                                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                                                        {assignment.due_at
                                                            ? new Date(assignment.due_at).toLocaleDateString('en-US', {
                                                                year: 'numeric', month: 'short', day: 'numeric'
                                                            })
                                                            : <span className="text-gray-300 font-medium tracking-widest text-[10px]">UNBOUND</span>
                                                        }
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(assignment.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        title="Remove assignment"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                                    <BookOpenIcon className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 font-sans italic">Null Assignments</h3>
                                <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">Click "Initialize Assignment" to map resources to users.</p>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all font-sans italic"
                                >
                                    <PlusIcon className="w-3.5 h-3.5" />
                                    Assign Course
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AssignModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                courses={courses}
                batches={batches}
                students={students}
            />
        </AuthenticatedLayout>
    );
}
