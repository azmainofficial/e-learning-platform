import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    ChevronLeftIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    CheckCircleIcon,
    LockClosedIcon,
    PlayCircleIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    BookOpenIcon,
    ClockIcon,
    VideoCameraIcon,
    CodeBracketIcon,
    PlayIcon,
} from '@heroicons/react/24/outline';
import { Editor } from '@monaco-editor/react';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import axios from 'axios';

// ─── YouTube Player (preserved from original) ─────────────────────────────────
const YouTubePlayer = ({ contentId }) => {
    const [videoId, setVideoId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(route('student.video.shield', contentId))
            .then(res => setVideoId(atob(res.data.token)))
            .catch(err => console.error('Shield Error:', err))
            .finally(() => setLoading(false));
    }, [contentId]);

    if (loading) return (
        <div className="w-full aspect-video bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-gray-400">Loading video...</span>
            </div>
        </div>
    );

    return (
        <div onContextMenu={e => e.preventDefault()} className="relative w-full aspect-video bg-black shadow-lg">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&showinfo=0&disablekb=1&origin=${window.location.origin}`}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};

// ─── Content type icon ────────────────────────────────────────────────────────
const ContentIcon = ({ type, className = 'w-4 h-4' }) => {
    if (type === 'video') return <PlayCircleIcon className={className} />;
    if (type === 'quiz') return <AcademicCapIcon className={className} />;
    if (type === 'pdf') return <DocumentTextIcon className={className} />;
    if (type === 'code') return <CodeBracketIcon className={className} />;
    return <BookOpenIcon className={className} />;
};

// ─── Coding Exercise Component ──────────────────────────────────────────────
const CodingExercise = ({ content, onComplete }) => {
    const [code, setCode] = useState(content.data?.initial_code ?? '');
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [tab, setTab] = useState('console'); // console, solution

    const runCode = () => {
        setIsRunning(true);
        setOutput([{ type: 'info', text: 'Initializing environment...' }]);

        // Simulation of execution flow
        setTimeout(() => {
            if (content.data?.language === 'javascript') {
                try {
                    let logs = [];
                    const customLog = (...args) => logs.push(args.join(' '));
                    const fn = new Function('console', code);
                    fn({ log: customLog, info: customLog, error: customLog });
                    setOutput(logs.map(l => ({ type: 'log', text: l })));
                } catch (e) {
                    setOutput([{ type: 'error', text: e.message }]);
                }
            } else {
                // Mock for Python/SQL if not using a real backend
                setOutput([
                    { type: 'log', text: 'Environment: ' + content.data.language },
                    { type: 'log', text: '> Running script.py...' },
                    { type: 'log', text: 'Calculated results: 4.0, 4' },
                    { type: 'info', text: 'Process finished with exit code 0' }
                ]);
            }
            setIsRunning(false);
        }, 1000);
    };

    const submitAnswer = () => {
        // Simple string match or basic logic for demo
        const isCorrect = code.trim().includes(content.data?.solution_code?.trim()?.split('\n')[0] ?? 'print');
        if (isCorrect) {
            setOutput(prev => [...prev, { type: 'success', text: 'Correct! Mastered.' }]);
            onComplete(content.id);
        } else {
            setOutput(prev => [...prev, { type: 'error', text: 'Submission failed. Logic does not match requirements.' }]);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full h-[650px] bg-[#05192d] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            {/* Left: Instructions */}
            <div className="w-full lg:w-[400px] flex flex-col bg-[#111827] border-r border-gray-800">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CodeBracketIcon className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exercise</span>
                    </div>
                    <div className="bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded text-[10px] font-black text-yellow-400 italic">
                        {content.xp ?? 100} XP
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800">
                    <h2 className="text-xl font-black text-white mb-4 leading-tight">{content.title}</h2>
                    <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                        {content.data?.instructions}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-800">
                        <div className="flex items-center gap-2 mb-4">
                            <DocumentTextIcon className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instructions</span>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-xs font-medium text-gray-400 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                Hit the Run Code button to observe behavior.
                            </li>
                            <li className="flex gap-3 text-xs font-medium text-gray-400 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                Submit when you are confident in your solution.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="p-4 bg-black/20">
                    <button className="w-full py-2.5 border border-gray-700 rounded-lg text-[10px] font-black text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider">
                        Take Hint (-30 XP)
                    </button>
                </div>
            </div>

            {/* Right: Code & Output */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Editor Header */}
                <div className="h-12 bg-[#05192d] border-b border-gray-800 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <div className="text-[10px] font-black text-emerald-400 px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded uppercase tracking-widest">
                            script.{content.data?.language === 'python' ? 'py' : 'js'}
                        </div>
                    </div>
                    <button className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Remote Shell Active
                    </button>
                </div>

                {/* Main Editor */}
                <div className="flex-1 min-h-0 relative">
                    <Editor
                        height="100%"
                        language={content.data?.language ?? 'python'}
                        theme="vs-dark"
                        value={code}
                        onChange={setCode}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 20 }
                        }}
                    />

                    {/* Action Bar */}
                    <div className="absolute bottom-6 right-6 flex items-center gap-3">
                        <button
                            onClick={runCode}
                            disabled={isRunning}
                            className="px-6 py-2.5 bg-gray-800 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border border-gray-700 hover:bg-gray-700 transition-all flex items-center gap-2"
                        >
                            <PlayIcon className="w-3.5 h-3.5" />
                            Run Code
                        </button>
                        <button
                            onClick={submitAnswer}
                            className="px-8 py-2.5 bg-emerald-500 text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-emerald-400 shadow-[0_4px_0_rgb(5,150,85)] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2"
                        >
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            Submit Answer
                        </button>
                    </div>
                </div>

                {/* Console Output (IPython Shell lookalike) */}
                <div className="h-[200px] bg-[#020d18] border-t border-gray-800 flex flex-col">
                    <div className="flex items-center gap-6 px-6 h-10 border-b border-gray-800/50">
                        <button className="text-[10px] font-black text-white border-b-2 border-emerald-400 h-full px-2 uppercase tracking-widest">
                            {content.data?.language === 'python' ? 'IPython' : 'Node'} Shell
                        </button>
                        <button className="text-[10px] font-black text-gray-500 hover:text-gray-300 uppercase tracking-widest">Slides</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800">
                        <div className="text-gray-500 mb-2">Connected to strix-executor-v4.2...</div>
                        {output.length === 0 && <div className="text-gray-600 italic">No output generated yet.</div>}
                        {output.map((line, i) => (
                            <div key={i} className={`flex gap-3 ${line.type === 'error' ? 'text-red-400' :
                                line.type === 'info' ? 'text-blue-400' :
                                    line.type === 'success' ? 'text-emerald-400 font-bold' :
                                        'text-gray-300 text-opacity-80'
                                }`}>
                                <span className="text-gray-700 select-none">[{i + 1}]</span>
                                <div>{line.text}</div>
                            </div>
                        ))}
                        {isRunning && <div className="flex gap-2 text-emerald-500 animate-pulse italic">
                            <span className="text-gray-700 select-none">[*]</span>
                            Executing command...
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Chapter / Module row ─────────────────────────────────────────────────────
function ChapterRow({ module, index, contents, isCompleted, isLocked, onSelectContent, activeContent, onComplete, processing }) {
    const [expanded, setExpanded] = useState(index === 0);

    const completedCount = contents.filter(c => isCompleted(c.id)).length;
    const totalCount = contents.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const isModuleLocked = contents.length > 0 && isLocked(contents[0].id, 0, index);

    // First incomplete unlocked content
    const nextContent = contents.find(c => !isCompleted(c.id) && !isLocked(c.id, contents.indexOf(c), index));

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Chapter header */}
            <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-sm font-bold text-gray-500 flex-shrink-0">{index + 1}</span>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-bold text-gray-900">{module.title}</h3>
                                {isModuleLocked ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-semibold">
                                        <LockClosedIcon className="w-3 h-3" /> Locked
                                    </span>
                                ) : (
                                    <span className="inline-flex px-2 py-0.5 rounded bg-green-50 text-green-600 text-[10px] font-semibold">
                                        Available
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full transition-all"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 font-medium w-7 text-right">{pct}%</span>
                        </div>
                    </div>
                </div>

                {/* Chapter description */}
                {module.description && (
                    <p className="text-xs text-gray-500 mt-2 ml-7 leading-relaxed">{module.description}</p>
                )}

                {/* Toggle + CTA */}
                <div className="flex items-center justify-between mt-3 ml-7">
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        {expanded ? (
                            <><ChevronUpIcon className="w-3.5 h-3.5" /> Hide Chapter Details</>
                        ) : (
                            <><ChevronDownIcon className="w-3.5 h-3.5" /> View Chapter Details</>
                        )}
                    </button>

                    {!isModuleLocked && nextContent && (
                        <button
                            onClick={() => onSelectContent(nextContent)}
                            className="px-4 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors"
                        >
                            {completedCount === 0 ? 'Start Chapter' : 'Continue Chapter'}
                        </button>
                    )}

                    {pct === 100 && (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                            <CheckCircleSolid className="w-4 h-4" /> Completed
                        </span>
                    )}
                </div>
            </div>

            {/* Lesson list */}
            {expanded && (
                <div className="border-t border-gray-100">
                    {contents.map((content, cIdx) => {
                        const locked = isLocked(content.id, cIdx, index);
                        const done = isCompleted(content.id);
                        const active = activeContent?.id === content.id;

                        return (
                            <button
                                key={content.id}
                                disabled={locked}
                                onClick={() => !locked && onSelectContent(content)}
                                className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors border-b border-gray-50 last:border-0 ${active ? 'bg-blue-50' :
                                    locked ? 'opacity-50 cursor-not-allowed bg-gray-50' :
                                        'hover:bg-gray-50'
                                    }`}
                            >
                                {/* Icon */}
                                <div className={`flex-shrink-0 ${done ? 'text-green-500' : active ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {locked ? (
                                        <LockClosedIcon className="w-4 h-4" />
                                    ) : done ? (
                                        <CheckCircleSolid className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <ContentIcon type={content.type} />
                                    )}
                                </div>

                                {/* Label */}
                                <span className={`flex-1 text-sm ${active ? 'font-semibold text-blue-700' : 'text-gray-700'} truncate`}>
                                    {content.title}
                                </span>

                                {/* XP */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {done && (
                                        <CheckCircleSolid className="w-3.5 h-3.5 text-green-500" />
                                    )}
                                    <span className="text-xs font-semibold text-gray-400">
                                        {content.xp ?? 100} XP
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Content Viewer Fullscreen Interface ──────────────────────────────────────
function ContentPanel({ content, allContents, courseTitle, isCompleted, onComplete, onNext, onPrev, processing, onClose }) {
    if (!content) return null;

    const done = isCompleted(content.id);
    const currentIndex = allContents.findIndex(c => c.id === content.id);
    const progressPct = ((currentIndex + 1) / allContents.length) * 100;

    return (
        <div className="fixed inset-0 z-[100] bg-[#f8f9fb] flex flex-col font-sans select-none">
            {/* ── Top Navigation Bar ── */}
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                        <button
                            onClick={onPrev}
                            disabled={currentIndex === 0}
                            className="p-1.5 rounded hover:bg-gray-50 text-gray-400 disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded transition-colors"
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="w-3 H-[1.5px] bg-gray-600 rounded-full" />
                                <span className="w-3 H-[1.5px] bg-gray-600 rounded-full" />
                                <span className="w-3 H-[1.5px] bg-gray-600 rounded-full" />
                            </div>
                            Course Outline
                        </button>
                        <button
                            onClick={onNext}
                            disabled={currentIndex === allContents.length - 1 || (!done && content.type !== 'quiz')}
                            className="p-1.5 rounded hover:bg-gray-50 text-gray-400 disabled:opacity-30 rotate-180 transition-colors"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-400">
                        <span className="hover:text-blue-600 cursor-pointer">Learn</span>
                        <ChevronLeftIcon className="w-3 h-3 rotate-180" />
                        <span className="hover:text-blue-600 cursor-pointer">Courses</span>
                        <ChevronLeftIcon className="w-3 h-3 rotate-180" />
                        <span className="text-gray-900 font-bold">{courseTitle}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily XP</span>
                        <div className="flex items-center gap-1 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded text-[10px] font-black italic">
                            100
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Content Area ── */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
                <div className="flex-1 overflow-y-auto w-full max-w-[1200px] mx-auto p-4 md:p-8 flex items-center justify-center">

                    {/* VIDEO VIEW */}
                    {content.type === 'video' && (
                        <div className="w-full max-w-4xl space-y-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                                    {currentIndex === 0 ? `Welcome to ${courseTitle}!` : content.title}
                                </h1>
                                <div className="bg-yellow-400 text-gray-900 px-2.5 py-1 rounded text-xs font-black italic shadow-sm">
                                    {content.xp ?? 50} XP
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100">
                                <YouTubePlayer contentId={content.id} />

                                <div className="mt-6 flex items-center justify-between">
                                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                                        Show Transcript
                                    </button>

                                    <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17,1H7A3,3,0,0,0,4,4V20a3,3,0,0,0,3,3H17a3,3,0,0,0,3,-3V4A3,3,0,0,0,17,1Zm1,19a1,1,0,0,1,-1,1H7a1,1,0,0,1,-1,-1V4A1,1,0,0,1,7,3H17a1,1,0,0,1,1,1Z" /></svg>
                                        This course is also available on mobile. <span className="text-blue-600 font-bold cursor-pointer underline-offset-2 hover:underline">Continue learning.</span>
                                    </div>

                                    {!done ? (
                                        <button
                                            onClick={() => onComplete(content.id)}
                                            disabled={processing}
                                            className="px-8 py-2.5 bg-[#05f18c] text-gray-900 text-xs font-black rounded-lg hover:bg-[#04d97d] shadow-[0_4px_0_rgb(0,180,100)] active:shadow-none active:translate-y-[2px] transition-all"
                                        >
                                            Got It!
                                        </button>
                                    ) : (
                                        <button
                                            onClick={onNext}
                                            className="px-8 py-2.5 bg-[#05f18c] text-gray-900 text-xs font-black rounded-lg hover:bg-[#04d97d] shadow-[0_4px_0_rgb(0,180,100)] active:shadow-none active:translate-y-[2px] transition-all uppercase tracking-wider"
                                        >
                                            Continue
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TEXT / ASSIGNMENT VIEW */}
                    {(content.type === 'text' || content.type === 'pdf') && (
                        <div className="w-full flex flex-col md:flex-row gap-6 items-stretch h-full max-h-[800px]">
                            {/* Left Pane: Instructions */}
                            <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-sm">
                                <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                                    <div className="w-3.5 h-3.5 rounded border border-gray-400 flex items-center justify-center">
                                        <CheckCircleSolid className="w-2.5 h-2.5 text-gray-300" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{content.type === 'pdf' ? 'PDF Content' : 'Text Content'}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    <h1 className="text-xl font-black text-gray-900 leading-tight">{content.title}</h1>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                </div>
                                                <span className="text-xs font-black text-gray-900 uppercase tracking-wide">Instructions</span>
                                            </div>
                                            <div className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded text-[10px] font-black italic">
                                                {content.xp ?? 100} XP
                                            </div>
                                        </div>

                                        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-medium">
                                            {content.type === 'pdf' ? (
                                                <div className="bg-gray-50 rounded-lg p-4 text-center border border-dashed border-gray-300">
                                                    <p className="text-xs text-gray-500 mb-3">A PDF resource is attached below</p>
                                                    <a
                                                        href={route('student.pdf.shield', content.id)}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors"
                                                    >
                                                        <DocumentTextIcon className="w-4 h-4" />
                                                        Open PDF in New Tab
                                                    </a>
                                                </div>
                                            ) : (
                                                content.data?.body || 'No description provided.'
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center gap-4">
                                        <button className="px-3 py-1.5 border border-gray-200 rounded text-[10px] font-black text-gray-600 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                                            Take Hint (-30 XP)
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
                                    {!done ? (
                                        <button
                                            onClick={() => onComplete(content.id)}
                                            disabled={processing}
                                            className="px-6 py-2 bg-[#05f18c] text-gray-900 text-xs font-black rounded-lg hover:bg-[#04d97d] shadow-[0_4px_0_rgb(0,180,100)] active:shadow-none active:translate-y-[2px] transition-all"
                                        >
                                            {processing ? '...' : 'Complete Content'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={onNext}
                                            className="px-6 py-2 bg-[#05f18c] text-gray-900 text-xs font-black rounded-lg hover:bg-[#04d97d] shadow-[0_4px_0_rgb(0,180,100)] active:shadow-none active:translate-y-[2px] transition-all"
                                        >
                                            Continue
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* Right Pane: Visual/Preview */}
                            <div className="hidden md:block flex-[1.2] bg-[#111827] rounded-xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col">
                                <div className="h-10 bg-[#1f2937] border-b border-gray-800 flex items-center px-4">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resource Preview</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center p-8 bg-[#0b0f1a] relative">
                                    {content.type === 'pdf' ? (
                                        <iframe
                                            src={route('student.pdf.shield', content.id) + '#toolbar=0&navpanes=0'}
                                            className="w-full h-full border-0 rounded-lg filter brightness-90 grayscale-[0.2]"
                                        />
                                    ) : (
                                        <div className="w-full max-w-md aspect-video bg-[#1f2937]/30 border border-gray-800/50 rounded-2xl flex items-center justify-center p-8">
                                            <div className="text-center space-y-4">
                                                <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center mx-auto border border-blue-500/20">
                                                    <BookOpenIcon className="w-10 h-10 text-blue-500/50" />
                                                </div>
                                                <p className="text-xs font-medium text-gray-500">Read through the material on the left to complete this lesson.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CODE EXERCISE VIEW */}
                    {content.type === 'code' && (
                        <div className="w-full">
                            <CodingExercise content={content} onComplete={onComplete} />
                        </div>
                    )}

                    {/* QUIZ VIEW */}
                    {content.type === 'quiz' && (
                        <div className="w-full max-w-2xl">
                            <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100 relative">
                                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-2.5 py-1 rounded text-xs font-black italic shadow-sm">
                                    {content.xp ?? 50} XP
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h1 className="text-xl font-black text-gray-900 leading-tight pr-12">{content.title}</h1>
                                        <p className="text-sm text-gray-500 leading-relaxed font-medium">Ready for the assessment? This module test will verify your knowledge of the topics covered.</p>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                                <CheckCircleSolid className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Assessment Detail</span>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <p className="text-sm font-bold text-gray-900 mb-1">Module Assessment</p>
                                            <p className="text-xs text-gray-500 leading-relaxed">Complete this quiz to demonstration your competency. You can retake this if needed.</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center justify-between">
                                        <button className="px-3 py-1.5 border border-gray-200 rounded text-[10px] font-black text-gray-600 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                                            Take Hint (-15 XP)
                                        </button>

                                        <Link
                                            href={route('student.quizzes.show', [content.data?.quiz_id, content.id])}
                                            className="px-8 py-3 bg-[#05f18c] text-gray-900 text-xs font-black rounded-lg hover:bg-[#04d97d] shadow-[0_4px_0_rgb(0,180,100)] active:shadow-none active:translate-y-[2px] transition-all uppercase tracking-wider"
                                        >
                                            Submit Answer
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* ── Progress Indicators at Bottom ── */}
                <div className="h-10 bg-white border-t border-gray-100 flex items-center justify-center flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                        {allContents.map((c, i) => (
                            <div
                                key={c.id}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-blue-500' :
                                    isCompleted(c.id) ? 'w-1.5 bg-green-500' : 'w-1.5 bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Show({ auth, course, userProgress = [], nextToUnlock }) {
    const [activeContent, setActiveContent] = useState(null);
    const { post, processing } = useForm();

    const handleComplete = (contentId) => {
        post(route('student.content.complete', contentId), {
            preserveScroll: true,
            onSuccess: () => setActiveContent(null),
        });
    };

    const isCompleted = (id) => userProgress.includes(id);

    const isLocked = (contentId, cIndex, mIndex) => {
        if (isCompleted(contentId)) return false;
        const flat = course.modules.flatMap(m => m.contents);
        const idx = flat.findIndex(c => c.id === contentId);
        if (idx <= 0) return false;
        return !isCompleted(flat[idx - 1].id);
    };

    const allContents = course.modules.flatMap(m => m.contents);
    const totalDone = allContents.filter(c => isCompleted(c.id)).length;
    const totalPct = allContents.length > 0 ? Math.round((totalDone / allContents.length) * 100) : 0;

    // Handle navigation
    const handleNext = () => {
        const currentIdx = allContents.findIndex(c => c.id === activeContent?.id);
        if (currentIdx < allContents.length - 1) {
            setActiveContent(allContents[currentIdx + 1]);
        }
    };
    const handlePrev = () => {
        const currentIdx = allContents.findIndex(c => c.id === activeContent?.id);
        if (currentIdx > 0) {
            setActiveContent(allContents[currentIdx - 1]);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={course.title}>
            <Head title={course.title} />

            <div className="max-w-6xl mx-auto space-y-5 pb-12">

                {/* ── Dark hero banner ─────────────────────────────────────── */}
                <div className="bg-[#111827] rounded-2xl px-8 py-10 shadow-xl border border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex-1">
                            {/* Breadcrumb */}
                            <Link
                                href={route('student.courses.index')}
                                className="inline-flex items-center gap-1.5 text-[10px] font-black text-gray-400 hover:text-white transition-colors mb-4 uppercase tracking-[0.2em]"
                            >
                                <ChevronLeftIcon className="w-3 h-3" />
                                Back to All Courses
                            </Link>

                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded text-[10px] font-black italic shadow-sm">
                                    {course.level ?? 'Beginner'}
                                </span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Interactive Course</span>
                            </div>
                            <h1 className="text-3xl font-black text-white mb-3 leading-tight pr-10">{course.title}</h1>

                            {/* Meta stats */}
                            <div className="flex items-center gap-5 flex-wrap">
                                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    {course.modules?.length ?? 0} chapters
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                                    <VideoCameraIcon className="w-3.5 h-3.5" />
                                    {allContents.filter(c => c.type === 'video').length} videos
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                                    <BookOpenIcon className="w-3.5 h-3.5" />
                                    {allContents.length} lessons
                                </div>
                            </div>
                        </div>

                        {/* CTA / Progress column */}
                        <div className="w-full md:w-auto space-y-4">
                            {(() => {
                                const next = allContents.find(c => !isCompleted(c.id) && !isLocked(c.id, allContents.indexOf(c), 0));
                                return next ? (
                                    <button
                                        onClick={() => setActiveContent(next)}
                                        className="w-full md:w-48 px-6 py-3 bg-[#05f18c] text-gray-900 text-sm font-black rounded-xl hover:bg-[#04d97d] shadow-[0_4px_0_rgb(0,180,100)] active:shadow-none active:translate-y-[2px] transition-all uppercase tracking-wider"
                                    >
                                        {totalDone > 0 ? 'Continue Chapter' : 'Start Course'}
                                    </button>
                                ) : (
                                    <div className="w-full md:w-48 px-6 py-3 bg-gray-700 text-gray-400 text-xs font-black rounded-xl text-center uppercase tracking-widest">
                                        Course Completed
                                    </div>
                                );
                            })()}

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${totalPct}%` }} />
                                </div>
                                <span className="text-xs font-black text-gray-400">{totalPct}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Two-column layout ─────────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left: Chapter list */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {/* Description */}
                        {course.description && (
                            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
                                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <BookOpenIcon className="w-4 h-4" />
                                    Course Summary
                                </h2>
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{course.description}</p>
                            </div>
                        )}

                        {/* Chapter rows */}
                        <div className="space-y-4">
                            {course.modules.map((module, mIdx) => (
                                <ChapterRow
                                    key={module.id}
                                    module={module}
                                    index={mIdx}
                                    contents={module.contents ?? []}
                                    isCompleted={isCompleted}
                                    isLocked={isLocked}
                                    activeContent={activeContent}
                                    onSelectContent={setActiveContent}
                                    onComplete={handleComplete}
                                    processing={processing}
                                />
                            ))}
                        </div>

                        {course.modules.length === 0 && (
                            <div className="bg-white border border-gray-200 rounded-2xl py-24 text-center">
                                <BookOpenIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No content available yet</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Sidebar */}
                    <div className="w-full lg:w-72 space-y-6 flex-shrink-0">

                        {/* Progress summary card */}
                        <div className="bg-white border-2 border-blue-500/10 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-500/5 rounded-full" />
                            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">You&apos;ve Progressed</h3>
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-4xl font-black text-gray-900 leading-none">{totalPct}</span>
                                <span className="text-lg font-black text-gray-400">%</span>
                            </div>
                            <p className="text-[11px] font-bold text-gray-400">{totalDone} of {allContents.length} items collected</p>
                        </div>

                        {/* Prerequisites */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                                <LockClosedIcon className="w-3.5 h-3.5" />
                                Requirements
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-green-600 font-black">
                                <CheckCircleSolid className="w-4 h-4" />
                                No Prerequisites
                            </div>
                        </div>

                        {/* Instructor */}
                        {course.instructor && (
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm group">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Instructor
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                                        <span className="text-sm font-black text-white">
                                            {course.instructor.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black text-gray-900 truncate">{course.instructor}</p>
                                        {course.instructor_title && (
                                            <p className="text-[10px] font-bold text-gray-400 uppercase truncate tracking-wider">{course.instructor_title}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content viewer fullscreen panel */}
            {activeContent && (
                <ContentPanel
                    content={activeContent}
                    allContents={allContents}
                    courseTitle={course.title}
                    isCompleted={isCompleted}
                    onComplete={handleComplete}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    processing={processing}
                    onClose={() => setActiveContent(null)}
                />
            )}
        </AuthenticatedLayout>
    );
}
