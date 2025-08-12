import React, { useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Column from './Column.jsx'

export default function Board({
  board,
  onDragEnd,
  onEditCard,
  onDeleteCard,
  onAddColumn,
  onDeleteColumn,
  onColumnsChange
}) {
  // Send column data to parent when board changes
  useEffect(() => {
    if (board && onColumnsChange) {
      const columnsList = board.columnOrder.map((colId) => ({
        id: colId,
        title: board.columns[colId].title
      }))
      onColumnsChange(columnsList)
    }
  }, [board, onColumnsChange])

  if (!board) {
    return (
        <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-300">
          Loading...
        </div>
    )
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-4 overflow-x-auto pb-4 min-h-screen scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
            >
              {board.columnOrder.map((colId, idx) => (
                <Column
                  key={colId}
                  columnId={colId}
                  column={board.columns[colId]}
                  cardsMap={board.cards}
                  index={idx}
                  onEditCard={onEditCard}
                  onDeleteCard={onDeleteCard}
                />
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
