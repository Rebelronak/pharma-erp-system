"use client"

import { useEffect, useState } from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000

let count = 0
let toastsState: ToastData[] = []
let listeners: Array<(toasts: ToastData[]) => void> = []

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

function addToast(data: Omit<ToastData, "id">) {
  const id = genId()
  const toast = { ...data, id }
  toastsState = [toast, ...toastsState].slice(0, TOAST_LIMIT)
  listeners.forEach((listener) => listener(toastsState))

  setTimeout(() => {
    removeToast(id)
  }, TOAST_REMOVE_DELAY)

  return id
}

function removeToast(toastId: string) {
  toastsState = toastsState.filter((t) => t.id !== toastId)
  listeners.forEach((listener) => listener(toastsState))
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      const index = listeners.indexOf(setToasts)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    toasts,
    toast: addToast,
    dismiss: removeToast,
  }
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant }) => (
        <Toast key={id} variant={variant}>
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription>{description}</ToastDescription>}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
