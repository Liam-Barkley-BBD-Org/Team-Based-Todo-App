"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
  maxWidth?: string
}

export function PureModal({ isOpen, onClose, children, title, description, maxWidth = "500px" }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
      setTimeout(() => setIsVisible(false), 200)
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isVisible) return null

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    opacity: isOpen ? 1 : 0,
    transition: "opacity 0.2s ease",
  }

  const modalStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    maxWidth,
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
    transform: isOpen ? "scale(1)" : "scale(0.95)",
    transition: "transform 0.2s ease",
  }

  const headerStyle: React.CSSProperties = {
    padding: "24px 24px 0 24px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  }

  const titleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
    marginBottom: description ? "8px" : 0,
  }

  const descriptionStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  }

  const closeButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    padding: "4px",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#6b7280",
    transition: "background-color 0.2s ease",
  }

  const contentStyle: React.CSSProperties = {
    padding: "24px",
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {(title || description) && (
          <div style={headerStyle}>
            <div>
              {title && <h2 style={titleStyle}>{title}</h2>}
              {description && <p style={descriptionStyle}>{description}</p>}
            </div>
            <button style={closeButtonStyle} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        )}
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  )
}

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
}

export function PureAlertModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: AlertModalProps) {
  const footerStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
  }

  return (
    <PureModal isOpen={isOpen} onClose={onClose} title={title} description={description} maxWidth="400px">
      <div style={footerStyle}>
        <button
          onClick={onClose}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "500",
            color: "white",
            backgroundColor: "#dc2626",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
        >
          {confirmText}
        </button>
      </div>
    </PureModal>
  )
}
