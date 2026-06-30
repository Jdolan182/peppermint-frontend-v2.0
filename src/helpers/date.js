/**
 * Format an ISO date string for display in tables and lists.
 * e.g. "Jun 29, 2026"
 */
export function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format an ISO date string with time.
 * e.g. "29 Jun 2026, 15:45"
 */
export function formatDateTime(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
