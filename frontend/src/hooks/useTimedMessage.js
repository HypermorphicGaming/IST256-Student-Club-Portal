import { useCallback, useEffect, useRef, useState } from 'react'

function useTimedMessage(initialValue, delay = 3000) {
  const [message, setMessage] = useState(initialValue)
  const timerRef = useRef(null)

  const clearMessage = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    setMessage(initialValue)
  }, [initialValue])

  const showMessage = useCallback(
    (nextValue, nextDelay = delay) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      setMessage(nextValue)
      timerRef.current = setTimeout(() => {
        setMessage(initialValue)
        timerRef.current = null
      }, nextDelay)
    },
    [delay, initialValue]
  )

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    },
    []
  )

  return [message, showMessage, clearMessage]
}

export default useTimedMessage
