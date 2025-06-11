"use client"

import type React from "react"

import { useState } from "react"

interface CardProps {
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
}

export function PureCard({ children, onClick, style = {} }: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const cardStyle: React.CSSProperties = {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: isHovered && onClick ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    cursor: onClick ? "pointer" : "default",
    transition: "box-shadow 0.2s ease",
    ...style,
  }

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}

export function CardContent({ children, style = {}, className = "" }: { children: React.ReactNode; style?: React.CSSProperties, className: string }) {
  const contentStyle: React.CSSProperties = {
    padding: "16px",
    ...style,
  }

  return <div className={className} style={contentStyle}>{children}</div>
}
