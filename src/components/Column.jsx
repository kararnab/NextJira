import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import CardUI from './CardUI.jsx'

export default function Column({ columnId, column, cardsMap, index, onEditCard, onDeleteCard }) {

  return (
    <Draggable draggableId={columnId} index={index}>
      {(prov) => (
        <div ref={prov.innerRef} {...prov.draggableProps} className="w-80 flex-shrink-0">
          {/* Column container: light/dark aware */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header (drag handle) */}
            <div className="px-4 py-3 flex items-center justify-between" {...prov.dragHandleProps}>
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{column.name}</h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">
                  {column.cardIds.length}
                </span>
              </div>
            </div>

            {/* Droppable area: adds dark variant for dragging-over */}
            <Droppable droppableId={columnId} type="CARD">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-3 min-h-[140px] max-h-[60vh] overflow-y-auto space-y-3 transition-colors
                    ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20 rounded' : 'bg-transparent'}`}
                >
                  {column.cardIds.map((cid, i) => (
                    <CardUI
                      key={cid}
                      card={cardsMap[cid]}
                      index={i}
                      onEdit={(card) => onEditCard(card)}
                      onDelete={(id) => onDeleteCard(columnId, id)}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

          </div>
        </div>
      )}
    </Draggable>
  )
}
