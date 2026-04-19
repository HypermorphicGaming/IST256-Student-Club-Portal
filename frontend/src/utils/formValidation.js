export function buildFieldClassName(baseClass, error, hasValue) {
  const statusClass = error ? 'is-invalid' : hasValue ? 'is-valid' : ''
  return `${baseClass} ${statusClass}`.trim()
}
