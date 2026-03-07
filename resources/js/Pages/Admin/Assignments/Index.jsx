import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    BookmarkIcon,
    PlusIcon,
    TrashIcon,
    UserGroupIcon,
    UserIcon,
    CalendarIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, assignments, courses, batches, students }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        course_id: '',
        type: 'batch', // batch or individual
        batch_id: '',
        user_id: '',
        due_at: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.assignments.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">Course Assignments</h2>}
        >
            <Head title="Assignments" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 italic">Assignments</h1>
                            <p className="text-gray-500 mt-1">Deploy courses to specific batches or individual students.</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-600/80 text-gray-900 font-black rounded-xl transition-all shadow-lg shadow-brand-pink/20"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Assign New Course
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-gray-200">
                                <tr>
                                    <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Course</th>
                                    <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Assigned To</th>
                                    <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Due Date</th>
                                    <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {assignments.map((assignment) => (
                                    <tr key={assignment.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-600/10 rounded-xl">
                                                    <BookmarkIcon className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <span className="text-gray-900 font-bold text-lg">{assignment.course.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {assignment.batch ? (
                                                <div className="flex items-center gap-2 text-brand-orange">
                                                    <UserGroupIcon className="w-5 h-5" />
                                                    <span className="font-bold uppercase text-[10px] tracking-widest">Batch: {assignment.batch.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-purple-600">
                                                    <UserIcon className="w-5 h-5" />
                                                    <span className="font-bold uppercase text-[10px] tracking-widest">User: {assignment.user?.name}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <CalendarIcon className="w-5 h-5" />
                                                <span className="text-sm font-bold">{assignment.due_at ? new Date(assignment.due_at).toLocaleDateString() : 'No Limit'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {assignments.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <p className="text-gray-600 font-bold uppercase tracking-[0.3em]">No active assignments</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Assignment Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/90 "
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, x: 20 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            exit={{ scale: 0.9, opacity: 0, x: 20 }}
                            className="relative bg-white border border-gray-200 rounded-xl w-full max-w-2xl p-12 shadow-md"
                        >
                            <h2 className="text-4xl font-black text-gray-900 italic mb-2">Assign Course</h2>
                            <p className="text-gray-500 mb-10">Map your curriculum to student groups.</p>

                            <form onSubmit={submit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="col-span-full">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Select Course</label>
                                        <select
                                            value={data.course_id}
                                            onChange={e => setData('course_id', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-pink transition-all outline-none appearance-none"
                                        >
                                            <option value="">Choose a course...</option>
                                            {courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Assignment Target</label>
                                        <div className="flex bg-gray-50 p-2 rounded-2xl">
                                            <button
                                                type="button"
                                                onClick={() => setData('type', 'batch')}
                                                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${data.type === 'batch' ? 'bg-purple-600 text-gray-900 shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                Batch
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('type', 'individual')}
                                                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${data.type === 'individual' ? 'bg-purple-600 text-gray-900 shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                Individual
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Target Entity</label>
                                        {data.type === 'batch' ? (
                                            <select
                                                value={data.batch_id}
                                                onChange={e => setData('batch_id', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-pink transition-all outline-none"
                                            >
                                                <option value="">Select Batch...</option>
                                                {batches.map(batch => <option key={batch.id} value={batch.id}>{batch.name}</option>)}
                                            </select>
                                        ) : (
                                            <select
                                                value={data.user_id}
                                                onChange={e => setData('user_id', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-pink transition-all outline-none"
                                            >
                                                <option value="">Select Student...</option>
                                                {students.map(student => <option key={student.id} value={student.id}>{student.name}</option>)}
                                            </select>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Due Date (Optional)</label>
                                        <input
                                            type="date"
                                            value={data.due_at}
                                            onChange={e => setData('due_at', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:border-brand-pink transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-5 bg-purple-600 hover:bg-purple-600/80 text-gray-900 font-black text-lg rounded-[2rem] transition-all shadow-sm transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    Confirm Assignment
                                    <ArrowRightIcon className="w-6 h-6" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
