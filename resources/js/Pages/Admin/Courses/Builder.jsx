import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Bars3Icon,
    CheckCircleIcon,
    ArrowLeftIcon,
    CloudArrowUpIcon
} from '@heroicons/react/24/outline';

export default function Builder({ auth, course, quizzes = [] }) {
    const isEditing = !!course;

    // Course Basic Info Form
    const { data: courseData, setData: setCourseData, post: postCourse, put: updateCourse, processing: courseProcessing, errors: courseErrors } = useForm({
        title: course?.title || '',
        description: course?.description || '',
        cover_image: null,
    });

    // Modules State (Local)
    const [modules, setModules] = useState(course?.modules || []);
    const { data: builderData, setData: setBuilderData, post: saveBuilder, processing: builderProcessing } = useForm({
        modules: []
    });

    useEffect(() => {
        setBuilderData('modules', modules);
    }, [modules]);

    const handleCourseSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateCourse(route('admin.courses.update', course.id));
        } else {
            postCourse(route('admin.courses.store'));
        }
    };

    const handleSaveBuilder = () => {
        saveBuilder(route('admin.courses.builder.save', course.id));
    };

    const addModule = () => {
        setModules([...modules, {
            id: null,
            title: 'New Module',
            contents: []
        }]);
    };

    const removeModule = (index) => {
        if (confirm('Are you sure you want to remove this module and all its content?')) {
            const newModules = [...modules];
            newModules.splice(index, 1);
            setModules(newModules);
        }
    };

    const updateModuleTitle = (index, title) => {
        const newModules = [...modules];
        newModules[index].title = title;
        setModules(newModules);
    };

    const moveModule = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === modules.length - 1)) return;
        const newModules = [...modules];
        const temp = newModules[index];
        newModules[index] = newModules[index + direction];
        newModules[index + direction] = temp;
        setModules(newModules);
    };

    const moveContent = (moduleIndex, contentIndex, direction) => {
        const newModules = [...modules];
        const contents = newModules[moduleIndex].contents;
        if ((direction === -1 && contentIndex === 0) || (direction === 1 && contentIndex === contents.length - 1)) return;
        const temp = contents[contentIndex];
        contents[contentIndex] = contents[contentIndex + direction];
        contents[contentIndex + direction] = temp;
        setModules(newModules);
    };

    const addContent = (moduleIndex, type) => {
        const newModules = [...modules];
        newModules[moduleIndex].contents.push({
            id: null,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            type: type,
            data: type === 'video' ? { video_id: '' } : type === 'text' ? { body: '' } : type === 'pdf' ? { url: '' } : { quiz_id: '' }
        });
        setModules(newModules);
    };

    const removeContent = (moduleIndex, contentIndex) => {
        const newModules = [...modules];
        newModules[moduleIndex].contents.splice(contentIndex, 1);
        setModules(newModules);
    };

    const updateContent = (moduleIndex, contentIndex, field, value) => {
        const newModules = [...modules];
        if (field === 'title') {
            newModules[moduleIndex].contents[contentIndex].title = value;
        } else {
            // value is a specific data object
            newModules[moduleIndex].contents[contentIndex].data = {
                ...newModules[moduleIndex].contents[contentIndex].data,
                ...value
            };
        }
        setModules(newModules);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">Course Builder</h2>}
        >
            <Head title={isEditing ? `Editing ${course.title}` : 'Create Course'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    <div className="flex items-center gap-4 mb-4">
                        <Link href={route('admin.courses.index')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-900 transition-all">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">{isEditing ? 'Curriculum Builder' : 'New Course'}</h1>
                            <p className="text-gray-500">Organize your modules and interactive content.</p>
                        </div>
                    </div>

                    {/* Step 1: Course Detail */}
                    <div className="bg-white  border border-gray-200 rounded-3xl p-8">
                        <form onSubmit={handleCourseSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Course Title</label>
                                        <input
                                            type="text"
                                            value={courseData.title}
                                            onChange={e => setCourseData('title', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-brand-cyan transition-all"
                                            placeholder="Enter course name..."
                                        />
                                        {courseErrors.title && <p className="text-red-500 text-xs mt-1">{courseErrors.title}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                        <textarea
                                            value={courseData.description}
                                            onChange={e => setCourseData('description', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-brand-cyan transition-all min-h-[120px]"
                                            placeholder="What will students learn?"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Cover Image</label>
                                    <div className="relative h-48 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center hover:border-blue-300 transition-all group overflow-hidden">
                                        {course?.cover_image && !courseData.cover_image && (
                                            <img src={course.cover_image} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                                        )}
                                        <CloudArrowUpIcon className="w-12 h-12 text-gray-600 group-hover:text-blue-600 mb-2 transition-colors" />
                                        <span className="text-sm font-bold text-gray-500">Drag & drop or click to upload</span>
                                        <input
                                            type="file"
                                            onChange={e => setCourseData('cover_image', e.target.files[0])}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        {courseData.cover_image && (
                                            <div className="absolute inset-0 bg-blue-600 flex items-center justify-center p-4">
                                                <CheckCircleIcon className="w-12 h-12 text-brand-navy" />
                                                <span className="ml-2 font-black text-brand-navy uppercase tracking-widest text-xs">{courseData.cover_image.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={courseProcessing}
                                    className="px-8 py-3 bg-purple-600 hover:bg-purple-600/80 text-gray-900 font-black rounded-xl transition-all shadow-lg shadow-brand-pink/20"
                                >
                                    {courseProcessing ? 'Saving...' : (isEditing ? 'Update Course Info' : 'Create Course & Start Building')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Step 2: Modules & Curriculum */}
                    <AnimatePresence>
                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-black text-gray-900">Curriculum Plan</h2>
                                    <button
                                        onClick={addModule}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 font-bold rounded-xl border border-brand-cyan/20 transition-all"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        Add Module
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {modules.map((module, mIndex) => (
                                        <div key={mIndex} className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
                                            <div className="px-6 py-4 bg-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <span className="text-xs font-black text-blue-600 bg-blue-600/10 px-2 py-1 rounded">M{mIndex + 1}</span>
                                                    <input
                                                        type="text"
                                                        value={module.title}
                                                        onChange={e => updateModuleTitle(mIndex, e.target.value)}
                                                        className="bg-transparent border-none text-gray-900 font-black text-lg p-0 focus:ring-0 w-full"
                                                    />
                                                </div>
                                                <div className="flex gap-1.5 items-center">
                                                    <div className="flex flex-col">
                                                        <button onClick={() => moveModule(mIndex, -1)} disabled={mIndex === 0} className="p-0.5 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-400">
                                                            <ChevronUpIcon className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => moveModule(mIndex, 1)} disabled={mIndex === modules.length - 1} className="p-0.5 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-400">
                                                            <ChevronDownIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <button onClick={() => removeModule(mIndex)} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors ml-2">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-6 space-y-4">
                                                {module.contents.map((content, cIndex) => (
                                                    <div key={cIndex} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 group hover:border-purple-300 transition-all">
                                                        <div className="mt-1">
                                                            {content.type === 'video' && <VideoCameraIcon className="w-6 h-6 text-blue-600" />}
                                                            {content.type === 'text' && <DocumentTextIcon className="w-6 h-6 text-brand-orange" />}
                                                            {content.type === 'pdf' && <BookOpenIcon className="w-6 h-6 text-purple-600" />}
                                                            {content.type === 'quiz' && <AcademicCapIcon className="w-6 h-6 text-brand-yellow" />}
                                                        </div>
                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={content.title}
                                                                    onChange={e => updateContent(mIndex, cIndex, 'title', e.target.value)}
                                                                    className="w-full bg-transparent border-none p-0 text-gray-900 font-bold placeholder-gray-600 focus:ring-0"
                                                                    placeholder="Activity Title"
                                                                />
                                                            </div>
                                                            <div>
                                                                {content.type === 'video' && (
                                                                    <input
                                                                        type="text"
                                                                        value={content.data.video_id}
                                                                        onChange={e => updateContent(mIndex, cIndex, 'video_id', { video_id: e.target.value })}
                                                                        className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500 focus:border-brand-cyan"
                                                                        placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)"
                                                                    />
                                                                )}
                                                                {content.type === 'text' && (
                                                                    <button className="text-[10px] font-black uppercase text-brand-orange hover:underline">Edit Rich Text Content</button>
                                                                )}
                                                                {content.type === 'pdf' && (
                                                                    <input
                                                                        type="text"
                                                                        value={content.data.url}
                                                                        onChange={e => updateContent(mIndex, cIndex, 'url', { url: e.target.value })}
                                                                        className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500 focus:border-brand-cyan"
                                                                        placeholder="PDF URL"
                                                                    />
                                                                )}
                                                                {content.type === 'quiz' && (
                                                                    <div className="flex items-center gap-2">
                                                                        <select
                                                                            value={content.data.quiz_id}
                                                                            onChange={e => updateContent(mIndex, cIndex, 'quiz_id', { quiz_id: e.target.value })}
                                                                            className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500 focus:border-brand-cyan outline-none"
                                                                        >
                                                                            <option value="">Select Assessment</option>
                                                                            {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
                                                                        </select>
                                                                        <Link href={route('admin.quizzes.index')} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Architect</Link>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                                            <button onClick={() => moveContent(mIndex, cIndex, -1)} disabled={cIndex === 0} className="text-gray-400 hover:text-blue-600 disabled:opacity-30">
                                                                <ChevronUpIcon className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => removeContent(mIndex, cIndex)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => moveContent(mIndex, cIndex, 1)} disabled={cIndex === module.contents.length - 1} className="text-gray-400 hover:text-blue-600 disabled:opacity-30">
                                                                <ChevronDownIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="flex gap-2 pt-4">
                                                    <button onClick={() => addContent(mIndex, 'video')} className="flex-1 py-2 bg-blue-600/5 hover:bg-blue-600/10 border border-brand-cyan/20 rounded-xl text-blue-600 text-xs font-black uppercase flex items-center justify-center gap-2 tracking-widest transition-all">
                                                        <VideoCameraIcon className="w-4 h-4" /> Video
                                                    </button>
                                                    <button onClick={() => addContent(mIndex, 'text')} className="flex-1 py-2 bg-brand-orange/5 hover:bg-brand-orange/10 border border-brand-orange/20 rounded-xl text-brand-orange text-xs font-black uppercase flex items-center justify-center gap-2 tracking-widest transition-all">
                                                        <DocumentTextIcon className="w-4 h-4" /> Text
                                                    </button>
                                                    <button onClick={() => addContent(mIndex, 'pdf')} className="flex-1 py-2 bg-purple-600/5 hover:bg-purple-600/10 border border-brand-pink/20 rounded-xl text-purple-600 text-xs font-black uppercase flex items-center justify-center gap-2 tracking-widest transition-all">
                                                        <BookOpenIcon className="w-4 h-4" /> PDF
                                                    </button>
                                                    <button onClick={() => addContent(mIndex, 'quiz')} className="flex-1 py-2 bg-brand-yellow/5 hover:bg-brand-yellow/10 border border-brand-yellow/20 rounded-xl text-brand-yellow text-xs font-black uppercase flex items-center justify-center gap-2 tracking-widest transition-all">
                                                        <AcademicCapIcon className="w-4 h-4" /> Quiz
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-center pt-8">
                                    <button
                                        onClick={handleSaveBuilder}
                                        disabled={builderProcessing}
                                        className="px-12 py-4 bg-blue-600 hover:bg-blue-600/80 text-brand-navy font-black text-lg rounded-2xl transition-all shadow-xl shadow-brand-cyan/20 hover:scale-105 active:scale-95"
                                    >
                                        {builderProcessing ? 'Syncing...' : 'Save Curriculum Structure'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
