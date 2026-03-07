import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    ClockIcon,
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    PaperClipIcon,
    TrashIcon,
    PaperAirplaneIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

const STATUS_COLUMNS = [
    { id: 'todo', name: 'To Do', border: 'border-gray-200 text-gray-700 bg-gray-50' },
    { id: 'in_progress', name: 'In Progress', border: 'border-blue-200 text-blue-700 bg-blue-50' },
    { id: 'review', name: 'Review', border: 'border-purple-200 text-purple-700 bg-purple-50' },
    { id: 'done', name: 'Complete', border: 'border-green-200 text-green-700 bg-green-50' },
];

export default function Show({ auth, project }) {
    const { patch } = useForm();
    const [selectedTask, setSelectedTask] = useState(null);
    const fileInputRef = useRef(null);

    const { data: commentData, setData: setCommentData, post: postComment, processing: commentProcessing, reset: resetComment } = useForm({
        comment: ''
    });

    const { post: postFile, processing: fileProcessing, reset: resetFile } = useForm({
        file: null
    });

    const updateStatus = (task, newStatus) => {
        if (task.status === newStatus) return;
        patch(route('tasks.updateStatus', task.id), {
            status: newStatus
        });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        postComment(route('tasks.comments.store', selectedTask.id), {
            onSuccess: () => resetComment(),
            preserveScroll: true
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        postFile(route('tasks.attachments.store', selectedTask.id), {
            forceFormData: true,
            onSuccess: () => resetFile(),
            preserveScroll: true
        });
    };

    const deleteComment = (id) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            useForm().delete(route('tasks.comments.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const deleteAttachment = (id) => {
        if (confirm('Are you sure you want to remove this attachment?')) {
            useForm().delete(route('tasks.attachments.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const currentTask = selectedTask ? project.tasks.find(t => t.id === selectedTask.id) : null;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Project Board</h2>}
        >
            <Head title={project.name} />

            <div className="py-6 h-[calc(100vh-160px)] flex flex-col">
                <div className="max-w-[1600px] w-full mx-auto sm:px-6 lg:px-8 h-full flex flex-col">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 pl-2">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Manage tasks and collaborate with your team</p>
                        </div>
                        <div className="flex -space-x-3">
                            {project.users.map(user => (
                                <div key={user.id} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-gray-900 text-xs font-bold shadow-sm ${user.id === auth.user.id ? 'bg-blue-600 z-10' : 'bg-gray-400'}`} title={user.name}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Kanban Board */}
                    <div className="flex-1 overflow-x-auto pb-6">
                        <div className="flex gap-6 min-w-max h-full items-start">
                            {STATUS_COLUMNS.map((col) => (
                                <div key={col.id} className="w-[320px] flex flex-col bg-gray-50/50 rounded-xl border border-gray-200 h-full max-h-full">
                                    <div className={`px-4 py-3 border-b ${col.border} rounded-t-xl`}>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold uppercase tracking-wider">{col.name}</h3>
                                            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                                {project.tasks.filter(t => t.status === col.id).length}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                        {project.tasks.filter(t => t.status === col.id).map((task) => (
                                            <div
                                                key={task.id}
                                                onClick={() => setSelectedTask(task)}
                                                className={`bg-white border p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow ${task.assigned_to === auth.user.id ? 'border-blue-300' : 'border-gray-200'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                                            task.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                                                                'bg-blue-50 text-blue-600'
                                                        }`}>
                                                        {task.priority}
                                                    </span>
                                                    <div className="flex gap-3 text-gray-500">
                                                        {task.comments?.length > 0 && (
                                                            <div className="flex items-center gap-1 text-xs font-semibold">
                                                                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                                                {task.comments.length}
                                                            </div>
                                                        )}
                                                        {task.attachments?.length > 0 && (
                                                            <div className="flex items-center gap-1 text-xs font-semibold">
                                                                <PaperClipIcon className="w-4 h-4" />
                                                                {task.attachments.length}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <h4 className="text-gray-900 font-semibold text-sm mb-1 leading-snug">{task.title}</h4>
                                                {task.description && (
                                                    <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                                                )}

                                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                        <ClockIcon className="w-4 h-4 text-gray-500" />
                                                        {task.due_at ? new Date(task.due_at).toLocaleDateString() : 'No due date'}
                                                    </div>

                                                    <div className="flex gap-1.5">
                                                        {STATUS_COLUMNS.map(btn => (
                                                            btn.id !== col.id && (
                                                                <button
                                                                    title={`Move to ${btn.name}`}
                                                                    key={btn.id}
                                                                    onClick={(e) => { e.stopPropagation(); updateStatus(task, btn.id); }}
                                                                    className={`p-1 rounded bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors ${btn.id === 'done' ? 'hover:text-green-600' : 'hover:text-blue-600'
                                                                        }`}
                                                                >
                                                                    {btn.id === 'done' ? <CheckIcon className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current opacity-40"></div>}
                                                                </button>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 "
                        onClick={() => setSelectedTask(null)}
                    />

                    <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-md">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-start bg-gray-50/50">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${currentTask?.priority === 'high' ? 'bg-red-100 text-red-700' :
                                            currentTask?.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {currentTask?.priority} Priority
                                    </span>
                                    <span className="text-sm font-medium text-gray-500">Task #{currentTask?.id}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{currentTask?.title}</h2>
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                            {/* Details & Attachments */}
                            <div className="lg:col-span-2 p-8 space-y-8 bg-white">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Description</h3>
                                    <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[100px]">
                                        {currentTask?.description ? (
                                            <p className="whitespace-pre-wrap">{currentTask.description}</p>
                                        ) : (
                                            <p className="italic">No description provided for this task.</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-semibold text-gray-900">Attachments</h3>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={fileProcessing}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                                        >
                                            <PaperClipIcon className="w-4 h-4" />
                                            {fileProcessing ? 'Uploading...' : 'Add File'}
                                        </button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {currentTask?.attachments?.map((file) => (
                                            <div key={file.id} className="p-3 rounded-lg border border-gray-200 flex items-center justify-between group bg-white shadow-sm hover:border-blue-300 transition-colors">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="p-2 bg-gray-100 rounded text-gray-500 flex-shrink-0">
                                                        <PaperClipIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-medium text-gray-900 truncate" title={file.file_name}>{file.file_name}</p>
                                                        <p className="text-xs text-gray-500">{(file.file_size / 1024 / 1024).toFixed(2)} MB • {file.user?.name?.split(' ')[0]}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 flex-shrink-0 ml-2">
                                                    <a href={file.file_path} download className="p-1.5 text-gray-500 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors">
                                                        <ArrowDownTrayIcon className="w-4 h-4" />
                                                    </a>
                                                    {(file.user_id === auth.user.id || auth.user.role !== 'student') && (
                                                        <button onClick={() => deleteAttachment(file.id)} className="p-1.5 text-gray-500 hover:text-red-600 rounded hover:bg-red-50 transition-colors">
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {currentTask?.attachments?.length === 0 && (
                                            <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                                <p className="text-sm font-medium text-gray-500">No attachments found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="p-6 flex flex-col bg-gray-50/50">
                                <h3 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-500" />
                                    Discussion
                                </h3>

                                <div className="flex-1 overflow-y-auto space-y-5 mb-6 pr-2">
                                    {currentTask?.comments?.map((comment) => {
                                        const isCurrentUser = comment.user_id === auth.user.id;
                                        return (
                                            <div key={comment.id} className="space-y-1">
                                                <div className={`flex justify-between items-center px-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                                    <span className="text-xs font-semibold text-gray-700">
                                                        {isCurrentUser ? 'You' : comment.user.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <span className="text-[10px] font-medium">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        {(isCurrentUser || auth.user.role !== 'student') && (
                                                            <button onClick={() => deleteComment(comment.id)} className="hover:text-red-500 transition-colors" title="Delete comment">
                                                                <TrashIcon className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`p-3 rounded-xl text-sm ${isCurrentUser ? 'bg-blue-600 text-gray-900 rounded-tr-sm ml-4' : 'bg-white border text-gray-700 rounded-tl-sm mr-4'
                                                    }`}>
                                                    {comment.comment}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {currentTask?.comments?.length === 0 && (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-gray-500 italic">No comments yet. Start the discussion!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Post Comment */}
                                <form onSubmit={handleCommentSubmit} className="relative mt-auto">
                                    <textarea
                                        value={commentData.comment}
                                        onChange={e => setCommentData('comment', e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none min-h-[80px] pr-12 resize-none shadow-sm"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={commentProcessing || !commentData.comment.trim()}
                                        className="absolute bottom-3 right-3 p-1.5 bg-blue-600 text-gray-900 rounded-md shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:hover:bg-blue-600"
                                    >
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
