"use client"

import { createContext, useState, useContext, useCallback } from "react"
import { v4 as uuidv4 } from "uuid" // To generate unique IDs for notifications

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((message, type = "info", duration = 3000) => {
    const id = uuidv4()
    const newNotification = { id, message, type }
    setNotifications((prevNotifications) => [...prevNotifications, newNotification])

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  return useContext(NotificationContext)
}

// Component to display notifications
const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-[1000] space-y-3">
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} onDismiss={() => removeNotification(notification.id)} />
      ))}
    </div>
  )
}

// Individual notification component
const Notification = ({ id, message, type, onDismiss }) => {
  let bgColorClass = "bg-blue-500"
  let borderColorClass = "border-blue-700"
  let textColorClass = "text-white"

  switch (type) {
    case "success":
      bgColorClass = "bg-green-500"
      borderColorClass = "border-green-700"
      break
    case "error":
      bgColorClass = "bg-red-500"
      borderColorClass = "border-red-700"
      break
    case "warning":
      bgColorClass = "bg-yellow-500"
      borderColorClass = "border-yellow-700"
      textColorClass = "text-gray-800" // For better contrast on yellow
      break
    case "info":
    default:
      bgColorClass = "bg-blue-500"
      borderColorClass = "border-blue-700"
      break
  }

  return (
    <div
      className={`${bgColorClass} ${textColorClass} border-l-4 ${borderColorClass} p-4 rounded-md shadow-lg flex items-center justify-between min-w-[250px] max-w-sm`}
      role="alert"
    >
      <p className="flex-grow">{message}</p>
      <button onClick={onDismiss} className="ml-4 text-lg font-bold opacity-75 hover:opacity-100">
        &times;
      </button>
    </div>
  )
}
