"use client"

import type React from "react"

import { useState } from "react"

interface InputProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  style?: React.CSSProperties
  type?: string
  id?: string
}

export function PureInput({ placeholder, value, onChange, onKeyPress, style = {}, type = "text", id }: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    border: `2px solid ${isFocused ? "#2563eb" : "#d1d5db"}`,
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
    ...style,
  }

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      style={inputStyle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  )
}
