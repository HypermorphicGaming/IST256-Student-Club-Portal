function FormError({ message, className = 'text-danger' }) {
  if (!message) {
    return null
  }

  return <div className={className}>{message}</div>
}

export default FormError
