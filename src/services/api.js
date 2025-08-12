import mock from '../data/mockData.js'
let board = JSON.parse(JSON.stringify(mock))

export const fetchBoard = async () => {
  await new Promise(r => setTimeout(r,120))
  return JSON.parse(JSON.stringify(board))
}

export const saveBoard = async (newBoard) => {
  await new Promise(r => setTimeout(r,80))
  board = JSON.parse(JSON.stringify(newBoard))
  return { success: true }
}

export async function saveBoardBatch(changes) {
  console.log('Batch saving changes', changes)
  // Simulate API delay & random failure for testing
  await new Promise(r => setTimeout(r, 500))
  if (Math.random() < 0.1) throw new Error('Simulated API failure')
  return true
}
