"use client"

import type React from "react"

import { useState } from "react"

interface LabelProps {
  children: React.ReactNode
  htmlFor?: string
  style?: React.CSSProperties
}

export function PureLabel({ children, htmlFor, style = {} }: LabelProps) {
  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    display: "block",
    marginBottom: "4px",
    ...style,
  }

  return (
    <label htmlFor={htmlFor} style={labelStyle}>
      {children}
    </label>
  )
}

interface TextareaProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  style?: React.CSSProperties
  id?: string
  rows?: number
}

export function PureTextarea({ placeholder, value, onChange, style = {}, id, rows = 4 }: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false)

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    border: `2px solid ${isFocused ? "#2563eb" : "#d1d5db"}`,
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s ease",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
    ...style,
  }

  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      style={textareaStyle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  )
}
