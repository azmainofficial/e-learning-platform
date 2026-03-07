import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    VideoCameraIcon,
    DocumentTextIcon,
    BookOpenIcon,
    AcademicCapIcon,
    LockClosedIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    ChevronLeftIcon,
    PlayCircleIcon
} from '@heroicons/react/24/solid';

import axios from 'axios';

const YouTubePlayer = ({ contentId }) => {
    const [videoId, setVideoId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(route('student.video.shield', contentId))
            .then(res => {
                // Decode base64 server-side protection
                const decodedId = atob(res.data.token);
                setVideoId(decodedId);
            })
            .catch(err => console.error("Shield Error:", err))
            .finally(() => setLoading(false));
    }, [contentId]);

    const preventContext = (e) => e.preventDefault();

    return (
        <div
            onContextMenu={preventContext}
            className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-md group"
        >
            {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 ">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Decrypting Stream...</span>
                    </div>
                </div>
            ) : (
                <>
                    <iframe
                        id="yt-player"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&showinfo=0&disablekb=1&origin=${window.location.origin}`}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                    {/* Protection Shield Overlay (Transparent but captures right clicks) */}
                    <div className="absolute inset-0 pointer-events-none select-none z-10" />

                    {/* Branding Watermark Overlay */}
                    <div className="absolute top-6 right-8 pointer-events-none z-20 opacity-20 group-hover:opacity-40 transition-opacity">
                        <h4 className="text-gray-900 font-black italic tracking-tighter text-xl">Strix<span className="text-blue-600">IT</span></h4>
                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest text-right">Protected Stream</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default function Show({ auth, course, userProgress, nextToUnlock }) {
    const [activeContent, setActiveContent] = useState(null);
    const { post, processing } = useForm();

    const handleComplete = (contentId) => {
        post(route('student.content.complete', contentId), {
            preserveScroll: true,
            onSuccess: () => {
                // Find next content to show automatically?
            }
        });
    };

    const isCompleted = (contentId) => userProgress.includes(contentId);
    const isLocked = (contentId, cIndex, mIndex, module) => {
        // If it's already completed, it's not locked.
        if (isCompleted(contentId)) return false;

        // Find the index of this content in the total flat list
        const flatContents = course.modules.flatMap(m => m.contents);
        const thisIndex = flatContents.findIndex(c => c.id === contentId);

        if (thisIndex === 0) return false; // First item is always unlocked

        // Locked if previous item is not completed
        const prevContent = flatContents[thisIndex - 1];
        return !isCompleted(prevContent.id);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">{course.title}</h2>}
        >
            <Head title={course.title} />

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] overflow-hidden bg-white">

                {/* Sidebar - Course Structure */}
                <div className="w-full lg:w-96 bg-white  border-r border-gray-200 overflow-y-auto scrollbar-hide py-8 px-6">
                    <div className="mb-8">
                        <Link href={route('student.courses.index')} className="text-[10px] font-black uppercase text-blue-600 tracking-widest hover:underline flex items-center gap-1">
                            <ChevronLeftIcon className="w-3 h-3" /> Back to Courses
                        </Link>
                        <h2 className="text-2xl font-black text-gray-900 mt-4">{course.title}</h2>
                    </div>

                    <div className="space-y-8">
                        {course.modules.map((module, mIndex) => (
                            <div key={module.id} className="space-y-4">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">
                                    Module {mIndex + 1}: {module.title}
                                </h3>
                                <div className="space-y-2">
                                    {module.contents.map((content, cIndex) => {
                                        const locked = isLocked(content.id, cIndex, mIndex, module);
                                        const completed = isCompleted(content.id);
                                        const active = activeContent?.id === content.id;

                                        return (
                                            <button
                                                key={content.id}
                                                disabled={locked}
                                                onClick={() => setActiveContent(content)}
                                                className={`w-full group text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${active ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm'
                                                    : locked ? 'opacity-50 cursor-not-allowed border-transparent bg-gray-50 grayscale'
                                                        : 'bg-white border-gray-200 hover:border-blue-300 text-gray-900 shadow-sm hover:shadow'
                                                    }`}
                                            >
                                                <div className="relative">
                                                    {completed ? <CheckCircleIcon className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-green-500'}`} />
                                                        : locked ? <LockClosedIcon className="w-6 h-6 text-gray-400" />
                                                            : <div className={`w-6 h-6 rounded-full border-2 border-dashed ${active ? 'border-blue-600' : 'border-gray-300'}`} />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold truncate">{content.title}</h4>
                                                    <div className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-blue-600' : 'text-gray-500'}`}>
                                                        {content.type} • {locked ? 'Locked' : completed ? 'Completed' : 'Ready'}
                                                    </div>
                                                </div>
                                                {active && <PlayCircleIcon className="w-6 h-6 opacity-30" />}
                                                {!locked && !active && <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-purple-600" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Viewer */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-8 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {activeContent ? (
                            <motion.div
                                key={activeContent.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-5xl space-y-8"
                            >
                                <div className="mb-4">
                                    <span className="text-xs font-black uppercase text-blue-600 tracking-[0.3em]">{activeContent.type}</span>
                                    <h1 className="text-4xl font-black text-gray-900 mt-1">{activeContent.title}</h1>
                                </div>

                                <div className="bg-white  border border-gray-200 rounded-xl p-1 shadow-md">
                                    {activeContent.type === 'video' && (
                                        <YouTubePlayer contentId={activeContent.id} />
                                    )}
                                    {activeContent.type === 'text' && (
                                        <div className="p-12 text-gray-300 text-lg leading-relaxed space-y-4 prose prose-invert max-w-none">
                                            {activeContent.data.body || 'No text content provided.'}
                                        </div>
                                    )}
                                    {activeContent.type === 'pdf' && (
                                        <div
                                            onContextMenu={(e) => e.preventDefault()}
                                            className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center relative shadow-inner"
                                        >
                                            <div className="absolute inset-x-0 top-0 h-12 bg-gray-50  z-10 flex items-center px-8 border-b border-gray-200">
                                                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Protected Document Viewer</span>
                                            </div>
                                            <iframe
                                                src={route('student.pdf.shield', activeContent.id) + '#toolbar=0&navpanes=0&scrollbar=0'}
                                                className="w-full h-full border-0"
                                            />
                                            {/* Anti-Selection / Anti-Interaction Ghost Layer (Optional but can disrupt UX if too aggressive) */}
                                            {/* Let's just use the toolbar=0 approach as basic shield */}
                                        </div>
                                    )}
                                    {activeContent.type === 'quiz' && (
                                        <div className="p-20 text-center">
                                            <AcademicCapIcon className="w-20 h-20 text-brand-yellow mx-auto mb-6 opacity-80" />
                                            <h2 className="text-3xl font-black text-gray-900 mb-4">Module Challenge</h2>
                                            <p className="text-gray-500 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                                                To demonstrate your understanding and unlock the next module, you must complete the required assessment.
                                            </p>
                                            <Link
                                                href={route('student.quizzes.show', [activeContent.data.quiz_id, activeContent.id])}
                                                className="inline-block px-12 py-5 bg-yellow-400 hover:bg-yellow-400/80 hover:scale-105 active:scale-95 text-gray-900 font-black text-lg rounded-3xl transition-all shadow-sm"
                                            >
                                                Enter Assessment Room
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                                        Status: {isCompleted(activeContent.id) ? 'Mastered' : 'Pending Verification'}
                                    </div>
                                    {!isCompleted(activeContent.id) && activeContent.type !== 'quiz' && (
                                        <button
                                            onClick={() => handleComplete(activeContent.id)}
                                            disabled={processing}
                                            className="px-10 py-4 bg-purple-600 hover:bg-purple-600/80 text-gray-900 font-black rounded-2xl transition-all flex items-center gap-3 shadow-xl shadow-sm"
                                        >
                                            {processing ? 'Processing...' : 'Complete Phase'}
                                            <CheckCircleIcon className="w-6 h-6" />
                                        </button>
                                    )}
                                    {isCompleted(activeContent.id) && (
                                        <div className="px-10 py-4 flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs">
                                            <CheckCircleIcon className="w-6 h-6" /> Completed
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center max-w-md">
                                <BookOpenIcon className="w-24 h-24 text-gray-800 mx-auto mb-8" />
                                <h2 className="text-3xl font-black text-gray-900 mb-2 italic">Ready to learn?</h2>
                                <p className="text-gray-500">Pick a module from the sidebar to start your interactive journey. Remember to follow the sequence!</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
