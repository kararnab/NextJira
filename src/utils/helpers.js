export const truncate = (s, n = 90) => (s && s.length > n ? s.slice(0, n) + '...' : s || '')
export const uid = () => Math.random().toString(36).slice(2,9)
export const formatDate = (iso) => {
  if(!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString()
  } catch { return iso }
}
