import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { truncate, formatDate } from '../utils/helpers.js'
import { HiArrowUp, HiArrowDown, HiArrowsRightLeft } from 'react-icons/hi2'
import { FiEdit } from 'react-icons/fi'

export default function CardUI({ card, index, onDelete, onEdit }) {
  const prio = (p) => {
    if (p === 'High') return { color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', icon: <HiArrowUp /> }
    if (p === 'Low') return { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: <HiArrowDown /> }
    return { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', icon: <HiArrowsRightLeft /> }
  }

  return (
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-3 transition-all 
            ${snapshot.isDragging ? 'shadow-lg scale-105' : 'shadow-sm hover:shadow-md'}`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${prio(card.priority).color}`}>
                      {prio(card.priority).icon}
                      <span>{card.priority}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {card.title}
                    </div>
                  </div>
                  {card.description && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {truncate(card.description, 120)}
                      </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{card.status}</div>
                  {card.assignee && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {card.assignee.initials}
                      </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
                <div className="flex gap-2 flex-wrap">
                  {card.labels?.map((l, i) => (
                      <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-[11px]"
                          style={{
                            backgroundColor: l.color,
                            color: l.textColor || (document.documentElement.classList.contains('dark') ? '#fff' : '#000'),
                          }}
                      >
                  {l.name}
                </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {card.dueDate && (
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 2a1 1 0 012 0v1h4V2a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0
                      01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h1V2z" />
                        </svg>
                        <span>{formatDate(card.dueDate)}</span>
                      </div>
                  )}

                  {/* Edit Button */}
                  <button
                      onClick={() => onEdit && onEdit(card)}
                      title="Edit Task"
                      className="text-gray-400 hover:text-blue-500"
                      type="button"
                  >
                    <FiEdit size={16} />
                  </button>

                  {/* Delete Button */}
                  <button
                      onClick={() => onDelete && onDelete(card.id)}
                      title="Delete Task"
                      className="text-gray-400 hover:text-red-500"
                      type="button"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
        )}
      </Draggable>
  )
}
