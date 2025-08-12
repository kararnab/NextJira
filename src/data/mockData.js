export default {
  columns: {
    backlog: { id: 'backlog', name: 'Backlog', cardIds: ['t1','t2'] },
    progress: { id: 'progress', name: 'In Progress', cardIds: ['t3'] },
    review: { id: 'review', name: 'In Review', cardIds: [] },
    done: { id: 'done', name: 'Done', cardIds: [] }
  },
  columnOrder: ['backlog','progress','review','done'],
  cards: {
    t1: {
      id: 't1',
      title: 'Design login screen',
      description: 'Create an accessible, mobile-first login screen. Follow design tokens.',
      priority: 'High',
      status: 'To Do',
      labels: [{ name: 'ui', color:'#E0F2FE', textColor:'#055160' }],
      assignee: { name: 'Arnab Kar', initials: 'AK' },
      dueDate: '2025-09-01'
    },
    t2: {
      id: 't2',
      title: 'Setup Vite + Tailwind',
      description: 'Bootstrap the project with Vite, React and TailwindCSS.',
      priority: 'Medium',
      status: 'To Do',
      labels: [{ name: 'infra', color:'#FFF4E6', textColor:'#663C00' }],
      assignee: { name: 'Nil', initials: 'N' },
      dueDate: ''
    },
    t3: {
      id: 't3',
      title: 'Implement auth API',
      description: 'Add login/logout and JWT session handling (mocked for now).',
      priority: 'Low',
      status: 'In Progress',
      labels: [{ name: 'backend', color:'#F1F8E9', textColor:'#33691E' }],
      assignee: { name: 'S', initials: 'S' },
      dueDate: '2025-08-30'
    }
  }
}
