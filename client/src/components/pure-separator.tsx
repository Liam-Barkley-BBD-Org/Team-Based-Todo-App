"use client"

import type React from "react"

interface SeparatorProps {
  orientation?: "horizontal" | "vertical"
  style?: React.CSSProperties
}

export function PureSeparator({ orientation = "horizontal", style = {} }: SeparatorProps) {
  const separatorStyle: React.CSSProperties = {
    backgroundColor: "#e5e7eb",
    ...(orientation === "horizontal"
      ? {
          width: "100%",
          height: "1px",
        }
      : {
          width: "1px",
          height: "16px",
        }),
    ...style,
  }

  return <div style={separatorStyle} />
}
