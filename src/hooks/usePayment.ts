import { useEffect, useState } from "react"

export function usePaymentStatus(chargeId: string | null) {
  const [status, setStatus] = useState("pending")

  useEffect(() => {
    if (!chargeId) return

    const interval = setInterval(async () => {
      const res = await fetch(`/api/payment/status/${chargeId}`)
      const data = await res.json()
      setStatus(data.status)

      if (data.status !== "pending") {
        clearInterval(interval)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [chargeId])

  return status
}