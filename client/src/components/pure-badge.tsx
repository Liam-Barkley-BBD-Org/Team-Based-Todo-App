"use client"

import type React from "react"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "success" | "destructive"
  style?: React.CSSProperties
}

export function PureBadge({ children, variant = "default", style = {} }: BadgeProps) {
  const variants = {
    default: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
    },
    secondary: {
      backgroundColor: "#f3f4f6",
      color: "#1f2937",
    },
    success: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    destructive: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
    },
  }

  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    fontSize: "12px",
    fontWeight: "500",
    borderRadius: "9999px",
    ...variants[variant],
    ...style,
  }

  return <span style={badgeStyle}>{children}</span>
}
