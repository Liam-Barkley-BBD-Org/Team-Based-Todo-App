"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  options: { value: string; label: string }[]
  style?: React.CSSProperties
}

export function PureSelect({ value, onValueChange, placeholder, options, style = {} }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const containerStyle: React.CSSProperties = {
    position: "relative",
    ...style,
  }

  const buttonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "8px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: isHovered ? "#f9fafb" : "white",
    cursor: "pointer",
    outline: "none",
    transition: "background-color 0.2s ease",
    boxSizing: "border-box",
  }

  const textStyle: React.CSSProperties = {
    color: selectedOption ? "#111827" : "#6b7280",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: "4px",
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    maxHeight: "240px",
    overflowY: "auto",
    zIndex: 20,
  }

  return (
    <div style={containerStyle} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        type="button"
      >
        <span style={textStyle}>{selectedOption?.label || placeholder}</span>
        <ChevronDown size={16} color="#9ca3af" />
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              onSelect={(value) => {
                onValueChange(value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </SelectItem>
          ))}
        </div>
      )}
    </div>
  )
}

function SelectItem({
  value,
  children,
  onSelect,
}: {
  value: string
  children: React.ReactNode
  onSelect: (value: string) => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  const itemStyle: React.CSSProperties = {
    padding: "8px 12px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: isHovered ? "#f3f4f6" : "transparent",
    transition: "background-color 0.2s ease",
  }

  return (
    <div
      style={itemStyle}
      onClick={() => onSelect(value)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}
