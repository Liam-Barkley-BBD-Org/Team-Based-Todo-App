"use client"

import type React from "react"

import { useState } from "react"

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  style?: React.CSSProperties
  type?: "button" | "submit" | "reset"
}

export function PureButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  style = {},
  type = "button",
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: isActive ? "#1d4ed8" : isHovered ? "#1d4ed8" : "#2563eb",
          color: "white",
          border: "none",
        }
      case "secondary":
        return {
          backgroundColor: isActive ? "#4b5563" : isHovered ? "#4b5563" : "#6b7280",
          color: "white",
          border: "none",
        }
      case "outline":
        return {
          backgroundColor: isActive ? "#f3f4f6" : isHovered ? "#f9fafb" : "white",
          color: "#374151",
          border: "1px solid #d1d5db",
        }
      case "ghost":
        return {
          backgroundColor: isActive ? "#f3f4f6" : isHovered ? "#f3f4f6" : "transparent",
          color: "#374151",
          border: "none",
        }
      default:
        return {
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          padding: "6px 12px",
          fontSize: "14px",
        }
      case "lg":
        return {
          padding: "12px 24px",
          fontSize: "16px",
        }
      default:
        return {
          padding: "8px 16px",
          fontSize: "14px",
        }
    }
  }

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    borderRadius: "6px",
    transition: "all 0.2s ease",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    textDecoration: "none",
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  }

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
    >
      {children}
    </button>
  )
}
