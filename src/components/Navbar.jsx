import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'
import { FiSun, FiMoon, FiPlus } from 'react-icons/fi'
import TaskModal from './TaskModal.jsx'
import {Card} from "../data/CardModel";
import {uid} from "../utils/helpers";

export default function Navbar({ onAddClick }) {
    const { theme, toggle } = useTheme()

    return (
        <>
            <div className="flex items-center justify-between px-4 py-3
        bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">Jira Vibrant</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Frontend-only</div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onAddClick}
                        className="flex items-center gap-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                        <FiPlus /> Add Task
                    </button>
                    <button
                        onClick={toggle}
                        className="flex items-center gap-2 px-3 py-1 border rounded text-sm text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition"
                    >
                        {theme === 'dark' ? <FiSun /> : <FiMoon />}
                        <span className="text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </button>
                </div>
            </div>
        </>
    )
}
