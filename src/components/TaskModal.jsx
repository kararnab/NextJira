import React, { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'

export default function TaskModal({ isOpen, onClose, onSubmit, card, columns = [] }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('Medium')
    const [assignee, setAssignee] = useState('')
    const [selectedColumn, setSelectedColumn] = useState('')

    useEffect(() => {
        if (isOpen) {
            if (card) {
                setTitle(card.title || '')
                setDescription(card.description || '')
                setPriority(card.priority || 'Medium')
                setAssignee(card.assignee || '')
                setSelectedColumn(card.columnId || columns?.[0]?.id || '')
            } else {
                setTitle('')
                setDescription('')
                setPriority('Medium')
                setAssignee('')
                setSelectedColumn(columns?.[0]?.id || '')
            }
        }
    }, [card, isOpen, columns])

    if (!isOpen) return null

    const isEditMode = Boolean(card)

    const handleSubmit = () => {
        if (!title.trim() || !selectedColumn) return
        const taskData = {
            ...card,
            columnId: selectedColumn,
            title: title.trim(),
            description: description.trim(),
            priority,
            assignee: assignee.trim()
        }
        onSubmit(taskData)
        onClose()
    }

    const noColumns = !columns || columns.length === 0

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-lg shadow-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 dark:text-gray-300"
                    aria-label="Close modal"
                >
                    <FiX size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    {isEditMode ? 'Edit Task' : 'Create Task'}
                </h2>

                {/* Column dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="column-select">
                        Column
                    </label>
                    {noColumns ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                            No columns available — create a column first.
                        </div>
                    ) : (
                        <select
                            id="column-select"
                            value={selectedColumn}
                            onChange={(e) => setSelectedColumn(e.target.value)}
                            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                            {columns.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name ?? c.title ?? c.id}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Title */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="title-input">
                        Title
                    </label>
                    <input
                        id="title-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        disabled={noColumns}
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="description-textarea">
                        Description
                    </label>
                    <textarea
                        id="description-textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        disabled={noColumns}
                    />
                </div>

                {/* Priority */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="priority-select">
                        Priority
                    </label>
                    <select
                        id="priority-select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        disabled={noColumns}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                    </select>
                </div>

                {/* Assignee */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="assignee-input">
                        Assignee
                    </label>
                    <input
                        id="assignee-input"
                        type="text"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        placeholder="Enter assignee name..."
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        disabled={noColumns}
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!title.trim() || !selectedColumn || noColumns}
                        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    >
                        {isEditMode ? 'Save' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    )
}
