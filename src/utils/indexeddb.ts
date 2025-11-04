export async function addPendingSummit(record: any) {
  const key = 'trail_pending_summits'
  const raw = localStorage.getItem(key)
  const arr = raw ? JSON.parse(raw) : []
  arr.push(record)
  localStorage.setItem(key, JSON.stringify(arr))
}

export function getPendingSummits() {
  const raw = localStorage.getItem('trail_pending_summits')
  return raw ? JSON.parse(raw) : []
}

export function clearPendingSummits() {
  localStorage.removeItem('trail_pending_summits')
}
