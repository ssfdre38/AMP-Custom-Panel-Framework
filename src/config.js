export function getApiBase() {
  const raw = import.meta.env.VITE_AMP_API_BASE || ''
  let base = raw && raw.trim().length ? raw.trim() : `${location.origin}`
  base = base.replace(/\/$/, '')
  if (!base.toLowerCase().endsWith('/api')) base = base + '/API'
  return base
}
