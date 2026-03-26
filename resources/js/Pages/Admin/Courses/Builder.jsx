import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    PlusIcon,
    BookOpenIcon,
    VideoCameraIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    XMarkIcon,
    TrashIcon,
    ArrowLeftIcon,
    CloudArrowUpIcon,
    CheckCircleIcon,
    LinkIcon,
    CodeBracketIcon,
} from '@heroicons/react/24/outline';

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field = ({ label, error, children, hint }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
        {children}
        {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors';
const textareaClass = inputClass + ' resize-none';

// ─── Content type config ──────────────────────────────────────────────────────
const CONTENT_TYPES = [
    { type: 'video', label: 'Video', icon: VideoCameraIcon, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { type: 'text', label: 'Text', icon: DocumentTextIcon, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { type: 'pdf', label: 'PDF', icon: BookOpenIcon, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { type: 'quiz', label: 'Assessment', icon: AcademicCapIcon, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { type: 'code', label: 'Problem Solve', icon: CodeBracketIcon, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
];

const getTypeConfig = (type) => CONTENT_TYPES.find(t => t.type === type) ?? CONTENT_TYPES[0];

// ─── Content item ─────────────────────────────────────────────────────────────
function ContentItem({ content, cIndex, mIndex, moduleLength, quizzes, onUpdate, onRemove, onMove }) {
    const cfg = getTypeConfig(content.type);
    const Icon = cfg.icon;

    return (
        <div className="flex items-start gap-4 p-5 bg-white rounded-xl border-2 border-gray-100 group hover:border-blue-200 transition-all shadow-sm">
            {/* Index & Type icon */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-0.5">
                <div className={`w-9 h-9 rounded-xl ${cfg.bg} ${cfg.border} border-2 flex items-center justify-center shadow-sm`}>
                    <Icon className={`w-4.5 h-4.5 ${cfg.color}`} />
                </div>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">L{cIndex + 1}</span>
            </div>

            {/* Fields */}
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Title & XP */}
                <div className="md:col-span-12 flex flex-col md:flex-row items-center gap-3">
                    <div className="flex-1 w-full">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Lesson Title</label>
                        <input
                            type="text"
                            value={content.title}
                            onChange={e => onUpdate(mIndex, cIndex, 'title', e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 transition-all"
                            placeholder="Unlock descriptive master title…"
                        />
                    </div>
                    <div className="w-full md:w-28">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">XP Value</label>
                        <div className="relative">
                            <AcademicCapIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-yellow-500" />
                            <input
                                type="number"
                                value={content.xp ?? 100}
                                onChange={e => onUpdate(mIndex, cIndex, 'xp', parseInt(e.target.value))}
                                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black text-gray-900 focus:bg-white focus:border-blue-500 transition-all"
                                placeholder="XP"
                            />
                        </div>
                    </div>
                </div>

                {/* Type-specific input */}
                <div className="md:col-span-12">
                    {content.type === 'video' && (
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 opacity-50 uppercase tracking-tight">YouTube ID:</span>
                            <input
                                type="text"
                                value={content.data?.video_id ?? ''}
                                onChange={e => onUpdate(mIndex, cIndex, 'data', { video_id: e.target.value })}
                                className="w-full pl-20 pr-4 py-2 bg-white/50 rounded-lg border border-gray-100 text-xs text-gray-700 italic placeholder-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                placeholder="e.g. dQw4w9WgXcQ"
                            />
                        </div>
                    )}

                    {content.type === 'text' && (
                        <textarea
                            value={content.data?.body ?? ''}
                            onChange={e => onUpdate(mIndex, cIndex, 'data', { body: e.target.value })}
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-sm text-gray-700 focus:border-blue-500 transition-colors placeholder-gray-300 italic"
                            placeholder="Input deep learning insights here…"
                        />
                    )}

                    {content.type === 'pdf' && (
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={content.data?.url ?? ''}
                                onChange={e => onUpdate(mIndex, cIndex, 'data', { url: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-white/50 rounded-lg border border-gray-100 text-xs text-gray-700 focus:border-blue-500 outline-none"
                                placeholder="Cloud link to PDF resource…"
                            />
                        </div>
                    )}

                    {content.type === 'quiz' && (
                        <div className="flex items-center gap-3">
                            <select
                                value={content.data?.quiz_id ?? ''}
                                onChange={e => onUpdate(mIndex, cIndex, 'data', { quiz_id: e.target.value })}
                                className="flex-1 rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm font-bold text-gray-700 focus:border-blue-500"
                            >
                                <option value="">Select an evaluation module…</option>
                                {quizzes.map(q => (
                                    <option key={q.id} value={q.id}>{q.title}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {content.type === 'code' && (
                        <div className="grid grid-cols-1 gap-4">
                            <div className="relative">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Language</label>
                                <select
                                    value={content.data?.language ?? 'python'}
                                    onChange={e => onUpdate(mIndex, cIndex, 'data', { language: e.target.value })}
                                    className="w-full rounded-xl border border-gray-100 bg-white/50 px-4 py-2 text-xs font-bold text-gray-700 outline-none"
                                >
                                    <option value="python">Python</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="sql">SQL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Instructions (Markdown)</label>
                                <textarea
                                    value={content.data?.instructions ?? ''}
                                    onChange={e => onUpdate(mIndex, cIndex, 'data', { instructions: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-100 bg-white/50 px-4 py-3 text-[11px] text-gray-700 italic outline-none transition-all"
                                    placeholder="Write problem solve instructions…"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Starter Code</label>
                                    <textarea
                                        value={content.data?.initial_code ?? ''}
                                        onChange={e => onUpdate(mIndex, cIndex, 'data', { initial_code: e.target.value })}
                                        rows={4}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-900 text-emerald-400 p-4 text-[11px] font-mono outline-none"
                                        placeholder="# Starter code…"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Solution (Secret)</label>
                                    <textarea
                                        value={content.data?.solution_code ?? ''}
                                        onChange={e => onUpdate(mIndex, cIndex, 'data', { solution_code: e.target.value })}
                                        rows={4}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-900/80 text-blue-400 p-4 text-[11px] font-mono outline-none"
                                        placeholder="# Reference solution…"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 pt-1">
                <button
                    onClick={() => onMove(mIndex, cIndex, -1)}
                    disabled={cIndex === 0}
                    className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-20"
                    title="Promote Lesson"
                >
                    <ChevronUpIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onRemove(mIndex, cIndex)}
                    className="p-1.5 text-gray-400 hover:text-red-500"
                    title="Purge Content"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onMove(mIndex, cIndex, 1)}
                    disabled={cIndex === moduleLength - 1}
                    className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-20"
                    title="Deprioritize Lesson"
                >
                    <ChevronDownIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Module card ──────────────────────────────────────────────────────────────
function ModuleCard({ module, mIndex, totalModules, quizzes, onUpdateTitle, onRemove, onMove, onAddContent, onUpdateContent, onRemoveContent, onMoveContent }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="bg-white border-2 border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Module header */}
            <div className="flex items-center gap-4 px-7 py-5 border-b border-gray-100 bg-gray-50/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-gray-900/10 flex-shrink-0">
                    C{mIndex + 1}
                </div>

                <div className="flex-1 min-w-0">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Chapter Title</label>
                    <input
                        type="text"
                        value={module.title}
                        onChange={e => onUpdateTitle(mIndex, e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-lg font-black text-gray-900 placeholder-gray-300 focus:ring-0 outline-none"
                        placeholder="A captivating goal oriented title…"
                    />
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="bg-blue-600/10 rounded-full px-3 py-1 mr-2 hidden sm:block">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                            {module.contents?.length ?? 0} Masteries
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onMove(mIndex, -1)}
                            disabled={mIndex === 0}
                            className="p-1.5 text-gray-400 hover:text-gray-900 disabled:opacity-20"
                        >
                            <ChevronUpIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onMove(mIndex, 1)}
                            disabled={mIndex === totalModules - 1}
                            className="p-1.5 text-gray-400 hover:text-gray-900 disabled:opacity-20"
                        >
                            <ChevronDownIcon className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        <button
                            onClick={() => setCollapsed(v => !v)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            {collapsed ? <ChevronDownIcon className="w-4 h-4 stroke-[3]" /> : <ChevronUpIcon className="w-4 h-4 stroke-[3]" />}
                        </button>
                        <button
                            onClick={() => onRemove(mIndex)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {!collapsed && (
                <div className="p-7 space-y-8">
                    {/* Chapter Summary (Module Description) */}
                    <div className="relative group/summ">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Chapter Summary</label>
                        <div className="relative">
                            <BookOpenIcon className="absolute left-4 top-4 w-4 h-4 text-gray-300 group-focus-within/summ:text-blue-500 transition-colors" />
                            <textarea
                                value={module.description ?? ''}
                                onChange={e => onUpdateTitle(mIndex, module.title, e.target.value)}
                                className="w-full rounded-[1.5rem] border-2 border-gray-50 bg-gray-50/30 px-11 py-4 text-sm text-gray-600 placeholder-gray-300 focus:border-blue-500 focus:bg-white focus:ring-0 outline-none transition-all resize-none italic"
                                placeholder="Sync the learning objectives here (shown to students)…"
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Content list */}
                    <div className="space-y-5 relative">
                        {/* Connector line */}
                        <div className="absolute left-[20px] top-8 bottom-8 w-1 bg-gradient-to-b from-gray-100 via-gray-50 to-transparent hidden md:block" />

                        {module.contents?.map((content, cIndex) => (
                            <ContentItem
                                key={cIndex}
                                content={content}
                                cIndex={cIndex}
                                mIndex={mIndex}
                                moduleLength={module.contents.length}
                                quizzes={quizzes}
                                onUpdate={onUpdateContent}
                                onRemove={onRemoveContent}
                                onMove={onMoveContent}
                            />
                        ))}
                    </div>

                    {/* Add content tray */}
                    <div className="pt-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4 text-center">Architect Lesson Flow</p>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            {CONTENT_TYPES.map(({ type, label, icon: Icon, color, bg, border }) => (
                                <button
                                    key={type}
                                    onClick={() => onAddContent(mIndex, type)}
                                    className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs font-black rounded-2xl border-2 ${bg} ${border} ${color} hover:scale-105 active:scale-95 transition-all shadow-sm`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Builder Page ────────────────────────────────────────────────────────
export default function Builder({ auth, course, quizzes = [] }) {
    const isEditing = !!course;

    // Course info form
    const {
        data: courseData, setData: setCourseData,
        post: postCourse, put: updateCourse,
        processing: courseProcessing, errors: courseErrors
    } = useForm({
        title: course?.title ?? '',
        description: course?.description ?? '',
        level: course?.level ?? 'Beginner',
        instructor: course?.instructor ?? '',
        instructor_title: course?.instructor_title ?? '',
        cover_image: null,
    });

    // Builder state
    const [modules, setModules] = useState(course?.modules ?? []);
    const { data: builderData, setData: setBuilderData, post: saveBuilder, processing: builderProcessing } = useForm({ modules: [] });

    useEffect(() => {
        setBuilderData('modules', modules);
    }, [modules]);

    // ── Course form submit ─────────────────────────────────────────────────────
    const handleCourseSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateCourse(route('admin.courses.update', course.id));
        } else {
            postCourse(route('admin.courses.store'));
        }
    };

    // ── Curriculum save ────────────────────────────────────────────────────────
    const handleSaveBuilder = () => saveBuilder(route('admin.courses.builder.save', course.id));

    // ── Module operations ──────────────────────────────────────────────────────
    const addModule = () => setModules(prev => [...prev, { id: null, title: 'New Module', description: '', contents: [] }]);

    const removeModule = (i) => {
        if (confirm('Remove this module and all its content?')) {
            setModules(prev => prev.filter((_, idx) => idx !== i));
        }
    };

    const updateModuleTitle = (i, title, description = null) => {
        setModules(prev => prev.map((m, idx) => {
            if (idx !== i) return m;
            return {
                ...m,
                title,
                description: description !== null ? description : m.description
            };
        }));
    };

    const moveModule = (i, dir) => {
        const arr = [...modules];
        const j = i + dir;
        if (j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setModules(arr);
    };

    // ── Content operations ─────────────────────────────────────────────────────
    const addContent = (mIdx, type) => {
        const defaults = {
            video: { video_id: '' },
            text: { body: '' },
            pdf: { url: '' },
            quiz: { quiz_id: '' },
            code: { instructions: '', language: 'python', initial_code: '', solution_code: '' }
        };
        setModules(prev => prev.map((m, i) => i !== mIdx ? m : {
            ...m,
            contents: [...m.contents, { id: null, title: `New ${type}`, type, xp: 100, data: defaults[type] }]
        }));
    };

    const removeContent = (mIdx, cIdx) => {
        setModules(prev => prev.map((m, i) => i !== mIdx ? m : {
            ...m,
            contents: m.contents.filter((_, j) => j !== cIdx)
        }));
    };

    const updateContent = (mIdx, cIdx, field, value) => {
        setModules(prev => prev.map((m, i) => i !== mIdx ? m : {
            ...m,
            contents: m.contents.map((c, j) => j !== cIdx ? c : (
                field === 'title' ? { ...c, title: value } :
                    field === 'xp' ? { ...c, xp: value } :
                        { ...c, data: { ...c.data, ...value } }
            ))
        }));
    };

    const moveContent = (mIdx, cIdx, dir) => {
        setModules(prev => prev.map((m, i) => {
            if (i !== mIdx) return m;
            const arr = [...m.contents];
            const j = cIdx + dir;
            if (j < 0 || j >= arr.length) return m;
            [arr[cIdx], arr[j]] = [arr[j], arr[cIdx]];
            return { ...m, contents: arr };
        }));
    };

    const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

    return (
        <AuthenticatedLayout user={auth.user} header={isEditing ? 'Edit Course' : 'New Course'}>
            <Head title={isEditing ? `Edit: ${course.title}` : 'Create Course'} />

            <div className="max-w-5xl mx-auto space-y-6">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2">
                    <Link
                        href={route('admin.courses.index')}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Courses
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm text-gray-600 font-medium">
                        {isEditing ? course.title : 'New Course'}
                    </span>
                </div>

                {/* ── Section 1: Course Info ───────────────────────────────── */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900">Course Details</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Basic information about this course</p>
                    </div>

                    <form onSubmit={handleCourseSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Left column */}
                            <div className="space-y-4">
                                <Field label="Course Title" error={courseErrors.title}>
                                    <input
                                        type="text"
                                        value={courseData.title}
                                        onChange={e => setCourseData('title', e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Introduction to Python"
                                    />
                                </Field>

                                <Field label="Description">
                                    <textarea
                                        value={courseData.description}
                                        onChange={e => setCourseData('description', e.target.value)}
                                        rows={4}
                                        className={textareaClass}
                                        placeholder="What will students learn from this course?"
                                    />
                                </Field>

                                <Field label="Level">
                                    <select
                                        value={courseData.level}
                                        onChange={e => setCourseData('level', e.target.value)}
                                        className={inputClass}
                                    >
                                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Instructor Name">
                                        <input
                                            type="text"
                                            value={courseData.instructor}
                                            onChange={e => setCourseData('instructor', e.target.value)}
                                            className={inputClass}
                                            placeholder="e.g. Dr. Angela Yu"
                                        />
                                    </Field>
                                    <Field label="Instructor Title">
                                        <input
                                            type="text"
                                            value={courseData.instructor_title}
                                            onChange={e => setCourseData('instructor_title', e.target.value)}
                                            className={inputClass}
                                            placeholder="e.g. Data Scientist"
                                        />
                                    </Field>
                                </div>
                            </div>

                            {/* Right column — Cover image */}
                            <div>
                                <Field label="Cover Image" hint="JPG or PNG, max 2MB">
                                    <div className="relative h-48 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center overflow-hidden hover:border-blue-400 transition-colors cursor-pointer group">
                                        {/* Show existing cover */}
                                        {course?.cover_image && !courseData.cover_image && (
                                            <img
                                                src={course.cover_image}
                                                alt="Current cover"
                                                className="absolute inset-0 w-full h-full object-cover opacity-40"
                                            />
                                        )}

                                        {/* Selected file preview */}
                                        {courseData.cover_image ? (
                                            <div className="absolute inset-0 bg-blue-50 flex flex-col items-center justify-center">
                                                <CheckCircleIcon className="w-8 h-8 text-blue-500 mb-2" />
                                                <span className="text-xs font-medium text-blue-700 px-4 text-center truncate max-w-full">
                                                    {courseData.cover_image.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <>
                                                <CloudArrowUpIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                                                <span className="text-xs text-gray-500 font-medium">Click to upload or drag & drop</span>
                                                {course?.cover_image && (
                                                    <span className="text-[10px] text-gray-400 mt-1">Current image shown behind</span>
                                                )}
                                            </>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setCourseData('cover_image', e.target.files[0] ?? null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </Field>
                            </div>
                        </div>

                        {/* Save course info */}
                        <div className="flex justify-end pt-2 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={courseProcessing}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {courseProcessing
                                    ? 'Saving…'
                                    : isEditing
                                        ? 'Update Course Info'
                                        : 'Create Course & Start Building'
                                }
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Section 2: Curriculum Builder (only when editing) ─────── */}
                {isEditing && (
                    <div className="bg-white rounded-xl border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">Curriculum</h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Organize modules and add videos, texts, PDFs and assessments
                                </p>
                            </div>
                            <button
                                onClick={addModule}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <PlusIcon className="w-3.5 h-3.5" />
                                Add Module
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {modules.length > 0 ? (
                                <>
                                    {modules.map((module, mIdx) => (
                                        <ModuleCard
                                            key={mIdx}
                                            module={module}
                                            mIndex={mIdx}
                                            totalModules={modules.length}
                                            quizzes={quizzes}
                                            onUpdateTitle={updateModuleTitle}
                                            onRemove={removeModule}
                                            onMove={moveModule}
                                            onAddContent={addContent}
                                            onUpdateContent={updateContent}
                                            onRemoveContent={removeContent}
                                            onMoveContent={moveContent}
                                        />
                                    ))}

                                    {/* Save curriculum */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-400">
                                            {modules.length} module{modules.length !== 1 ? 's' : ''}, {modules.reduce((s, m) => s + (m.contents?.length ?? 0), 0)} content items
                                        </p>
                                        <button
                                            onClick={handleSaveBuilder}
                                            disabled={builderProcessing}
                                            className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {builderProcessing ? 'Saving…' : 'Save Curriculum'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* Empty curriculum */
                                <div className="py-12 text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                        <BookOpenIcon className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-600">No modules yet</p>
                                    <p className="text-xs text-gray-400 mt-1 mb-4">Add your first module to start building the curriculum</p>
                                    <button
                                        onClick={addModule}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <PlusIcon className="w-3.5 h-3.5" />
                                        Add First Module
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tip when creating new course */}
                {!isEditing && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-[10px] font-bold">i</span>
                        </div>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            After creating the course, you&apos;ll be taken back to the course list. Click <strong>Edit</strong> on the course to open the curriculum builder and add modules, videos, texts, PDFs, and assessments.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
