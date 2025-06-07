"use client"

import type React from "react"

import { useState } from "react"

interface AvatarProps {
  src?: string
  alt?: string
  fallback: string
  size?: number
  style?: React.CSSProperties
}

export function PureAvatar({ src, alt, fallback, size = 32, style = {} }: AvatarProps) {
  const [imageError, setImageError] = useState(false)

  const avatarStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e7eb",
    color: "#374151",
    fontSize: `${size * 0.4}px`,
    fontWeight: "500",
    overflow: "hidden",
    ...style,
  }

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }

  if (src && !imageError) {
    return (
      <div style={avatarStyle}>
        <img src={src || "/placeholder.svg"} alt={alt} style={imageStyle} onError={() => setImageError(true)} />
      </div>
    )
  }

  return <div style={avatarStyle}>{fallback}</div>
}
