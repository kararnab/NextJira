import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx'
import Board from './components/Board.jsx'
import { useBoard } from './hooks/useBoard.js'
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use'; // For screen size detection
import 'tailwindcss/tailwind.css';
import {Card} from "./data/CardModel";
import {uid} from "./utils/helpers";
import TaskModal from "./components/TaskModal";

export default function App() {
  const { board, loading, addCard, editCard, deleteCard, addColumn, deleteColumn, moveCard } = useBoard();
  const { width, height } = useWindowSize();
  const [showCongrats, setShowCongrats] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const soundRef = useRef(null);

  const [ modal, setModal ] = useState({ isVisible: false, editableCard: null })

  const openAddModal = () => {
    setModal({ isVisible: true, editableCard: null })
  }

  const openEditModal = (card) => {
    setModal({ isVisible: true, editableCard: card})
  }

  const closeModal = () => {
    setModal({ isVisible: false, editableCard: null })
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result
    if (!destination) return
    if (type === 'COLUMN') {
      // columns draggable by design but ordering not implemented yet
      return
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    moveCard(source.droppableId, destination.droppableId, source.index, destination.index, draggableId)
  }

  useEffect(() => {
    if (!board) return;

    const doneColumn = Object.values(board.columns).find(c => c.name.toLowerCase() === 'done');
    if (!doneColumn) return;

    const totalCards = board.columnOrder.reduce(
        (sum, colId) => sum + board.columns[colId].cardIds.length,
        0
    );
    const doneCards = doneColumn.cardIds.length;

    if (totalCards > 0 && doneCards === totalCards) {
      setShowCongrats(true);
      soundRef.current?.play();

      const confettiTimer = setTimeout(() => {
        setShowCongrats(false);
        setShowPopup(true);
      }, 5000); // confetti for 5 seconds

      const popupTimer = setTimeout(() => {
        setShowPopup(false);
      }, 9000); // popup for 4 seconds

      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(popupTimer);
      };
    }
  }, [board]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold animate-pulse">Loading your board...</div>
        </div>
    );
  }

  return (
      <div className="h-screen flex flex-col relative">
        {showCongrats && <Confetti width={width} height={height} />}
        <audio ref={soundRef} src="./task-complete.mp3" preload="auto" aria-hidden />

        {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-green-500 text-white rounded-lg p-8 text-4xl font-extrabold shadow-lg animate-pulse select-none">
                🎉 All Done! 🎉
              </div>
            </div>
        )}

        <Navbar
            onAddClick={openAddModal}
        />
        <Board
            board={board}
            onDragEnd={onDragEnd}
            onEditCard= {(card) => openEditModal(card)}
            onDeleteCard={deleteCard}
            onAddColumn={addColumn}
            onDeleteColumn={deleteColumn}
        />

        <TaskModal
            isOpen={modal.isVisible}
            card={modal.editableCard}
            onClose={() => closeModal()}
            onSubmit={(task) => {
              if (task?.columnId && task?.title) {
                // Compose assignee object with initials
                const assignee = {
                  name: task.assignee || 'N/A',
                  initials: (task.assignee || 'N/A').charAt(0).toUpperCase(),
                }
                if(modal.editableCard==null) {
                  addCard(
                      new Card({
                        id: 'c-' + uid(),
                        columnId : task.columnId,
                        title : task.title,
                        description : task.description || '',
                        priority : task.priority,
                        status : task.status || 'To Do',
                        assignee
                      })
                  )
                } else {
                  editCard(modal.editableCard)
                }
                closeModal()
              }
            }}
            columns={board?.columnOrder?.map(id => board.columns[id]) || []}
        />
      </div>
  );
}
