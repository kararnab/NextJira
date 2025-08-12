import { useEffect, useState, useCallback, useRef } from 'react'
import { fetchBoard, saveBoardBatch } from '../services/api.js'
import { uid } from '../utils/helpers.js'
import {Card} from "../data/CardModel";

export function useBoard(){
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)

  // Keep a ref of the last confirmed stable board state for rollback
  const stableBoardRef = useRef(null)
  // Queue of pending changes to send in batch
  const pendingChangesRef = useRef([])

  // Timer for batching
  const batchTimerRef = useRef(null)

  useEffect(() => {
    let mounted = true
    fetchBoard().then(b => {
      if (mounted) {
        setBoard(b)
        stableBoardRef.current = b
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [])

  // Apply a local change optimistically and queue it for server sync
  const applyChange = useCallback((changeFn, changePayload) => {
    setBoard(prevBoard => {
      const newBoard = changeFn(prevBoard)
      // Queue changePayload for server sync
      pendingChangesRef.current.push(changePayload)

      // Start/reset batch timer
      if (batchTimerRef.current) clearTimeout(batchTimerRef.current)
      batchTimerRef.current = setTimeout(() => {
        flushPendingChanges()
      }, 3000)

      return newBoard
    })
  }, [])

  // Send batched changes to API
  const flushPendingChanges = useCallback(() => {
    const changesToSend = [...pendingChangesRef.current]
    if (changesToSend.length === 0) return

    pendingChangesRef.current = []
    saveBoardBatch(changesToSend)
      .then(() => {
        // On success update stableBoardRef to current board
        stableBoardRef.current = board
      })
      .catch(() => {
        // On failure rollback local board to last stable state
        setBoard(stableBoardRef.current)
        alert('Failed to sync changes. Reverting.')
      })
  }, [board])

  // API methods

  const addColumn = useCallback((title) => {
    const id = 'col-' + uid()
    applyChange(prevBoard => {
      const newCol = { id, name: title, cardIds: [] }
      return {
        ...prevBoard,
        columns: { ...prevBoard.columns, [id]: newCol },
        columnOrder: [...prevBoard.columnOrder, id]
      }
    }, { type: 'addColumn', id, title })
  }, [applyChange])

  const deleteColumn = useCallback((colId) => {
    applyChange(prevBoard => {
      const cols = { ...prevBoard.columns }
      const cardIds = cols[colId]?.cardIds || []
      const cards = { ...prevBoard.cards }
      cardIds.forEach(cid => delete cards[cid])
      delete cols[colId]
      const order = prevBoard.columnOrder.filter(c => c !== colId)
      return { ...prevBoard, columns: cols, columnOrder: order, cards }
    }, { type: 'deleteColumn', colId })
  }, [applyChange])

/*  const addCard = useCallback((colId, title, description, priority, status, assignee) => {
    const id = 'c-' + uid()
    applyChange(prevBoard => {
      const newCard = { id, title, description, priority: priority || 'Medium', status: status || 'To Do', labels: [], assignee, dueDate: '' }
      const cards = { ...prevBoard.cards, [id]: newCard }
      const col = { ...prevBoard.columns[colId], cardIds: [...(prevBoard.columns[colId]?.cardIds || []), id] }
      return { ...prevBoard, cards, columns: { ...prevBoard.columns, [colId]: col } }
    }, { type: 'addCard', colId, id, title })
  }, [applyChange])*/


  const addCard = useCallback((card) => {
    if (!(card instanceof Card)) {
      console.error('addCard expects a Card instance', card)
      return
    }
    const colId = card.columnId

    applyChange(prevBoard => {
      const col = prevBoard.columns[colId]
      if (!col) {
        console.warn(`Column ${colId} not found. Card not added.`)
        return prevBoard
      }

      const cards = { ...prevBoard.cards, [card.id]: card }
      const updatedCol = { ...col, cardIds: [...(col.cardIds || []), card.id] }

      return { ...prevBoard, cards, columns: { ...prevBoard.columns, [colId]: updatedCol } }
    }, { type: 'addCard', id: card.id, colId, title: card.title })
  }, [applyChange])

  const editCard = useCallback((card) => {
    // Ensure card is a Card instance
    console.log(card)
    const updatedCard = card instanceof Card ? card : new Card({ ...card })
    const colId = updatedCard.columnId

    applyChange(prevBoard => {
      const cards = { ...prevBoard.cards, [updatedCard.id]: updatedCard }

      const col = prevBoard.columns[colId]
          ? {
            ...prevBoard.columns[colId],
            cardIds: prevBoard.columns[colId].cardIds.includes(updatedCard.id)
                ? [...prevBoard.columns[colId].cardIds]
                : [...prevBoard.columns[colId].cardIds, updatedCard.id]
          }
          : undefined

      return {
        ...prevBoard,
        cards,
        columns: col ? { ...prevBoard.columns, [colId]: col } : { ...prevBoard.columns }
      }
    }, { type: 'editCard', id: updatedCard.id, colId, title: updatedCard.title })
  }, [applyChange])

  const deleteCard = useCallback((cardId) => {
    applyChange(prevBoard => {
      const cards = { ...prevBoard.cards }
      delete cards[cardId]
      const cols = { ...prevBoard.columns }
      Object.values(cols).forEach(c => {
        c.cardIds = c.cardIds.filter(id => id !== cardId)
      })
      return { ...prevBoard, cards, columns: cols }
    }, { type: 'deleteCard', cardId })
  }, [applyChange])

  const moveCard = useCallback((sourceColId, destColId, sourceIndex, destIndex, cardId) => {
    applyChange(prevBoard => {
      const cols = { ...prevBoard.columns }
      const sourceIds = Array.from(cols[sourceColId].cardIds)
      sourceIds.splice(sourceIndex, 1)
      const destIds = Array.from(cols[destColId].cardIds)
      destIds.splice(destIndex, 0, cardId)
      cols[sourceColId] = { ...cols[sourceColId], cardIds: sourceIds }
      cols[destColId] = { ...cols[destColId], cardIds: destIds }
      return { ...prevBoard, columns: cols }
    }, { type: 'moveCard', sourceColId, destColId, sourceIndex, destIndex, cardId })
  }, [applyChange])

  return { board, loading, addColumn, deleteColumn, addCard, editCard, deleteCard, moveCard }
}

