"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ListTodo, Plus, ChevronDown, ChevronRight, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
// import Link from "next/link"

interface SidebarProps {
  children: React.ReactNode
}

interface SidebarItemProps {
  href?: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
  onClick?: () => void
}

interface SidebarGroupProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function SidebarItem({ href, icon, label, isActive, onClick }: SidebarItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: isActive ? "#2563eb" : isHovered ? "#f3f4f6" : "transparent",
    color: isActive ? "white" : isHovered ? "#111827" : "#6b7280",
  }

  const content = (
    <div
      style={itemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  )

  if (href) {
    return <Link to={href}>{content}</Link>
  }

  return content
}

function SidebarGroup({ title, children, defaultOpen = true }: SidebarGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isHovered, setIsHovered] = useState(false)

  const groupStyle: React.CSSProperties = {
    marginBottom: "16px",
  }

  const buttonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "8px 12px",
    fontSize: "14px",
    fontWeight: "500",
    color: isHovered ? "#111827" : "#6b7280",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "color 0.2s ease",
  }

  const childrenStyle: React.CSSProperties = {
    paddingLeft: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  }

  return (
    <div style={groupStyle}>
      <button
        style={buttonStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div style={childrenStyle}>{children}</div>}
    </div>
  )
}

export function PureSidebar({ children }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [windowWidth, setWindowWidth] = useState(1024) // Default to desktop

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true)
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isDesktop = windowWidth >= 1024

  const containerStyle: React.CSSProperties = {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f9fafb",
  }

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 40,
    display: isMobileOpen ? "block" : "none",
  }

  const sidebarStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: "256px",
    backgroundColor: "white",
    borderRight: "1px solid #e5e7eb",
    transform: isMobileOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
  }

  const sidebarDesktopStyle: React.CSSProperties = {
    ...sidebarStyle,
    position: "static",
    transform: "none",
    zIndex: "auto",
  }

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
  }

  const logoStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const logoIconStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: "8px",
  }

  const logoTextStyle: React.CSSProperties = {
    fontWeight: "600",
    color: "#111827",
  }

  const navStyle: React.CSSProperties = {
    flex: 1,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  const footerStyle: React.CSSProperties = {
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
  }

  const footerButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background-color 0.2s ease",
  }

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  }

  const mobileHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "white",
  }

  const mobileButtonStyle: React.CSSProperties = {
    padding: "4px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: "auto",
    backgroundColor: "white",
  }

  // Don't render sidebar content until client-side
  if (!isClient) {
    return (
      <div style={containerStyle}>
        <div style={mainContentStyle}>
          <div style={contentStyle}>{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {/* Mobile overlay */}
      <div style={overlayStyle} onClick={() => setIsMobileOpen(false)} />

      {/* Sidebar */}
      <div style={isDesktop ? sidebarDesktopStyle : sidebarStyle}>
        <div style={headerStyle}>
          <div style={logoStyle}>
            <div style={logoIconStyle}>
              <ListTodo size={16} />
            </div>
            <span style={logoTextStyle}>TeamTodo</span>
          </div>
          {!isDesktop && (
            <button style={mobileButtonStyle} onClick={() => setIsMobileOpen(false)}>
              <X size={16} />
            </button>
          )}
        </div>

        <div style={navStyle}>
          <SidebarItem href="/dashboard" icon={<ListTodo size={16} />} label="My Tasks" isActive={true} />

          <SidebarGroup title="Teams">
            <SidebarItem href="/team/alpha" icon={<span style={{ fontSize: "12px" }}>-</span>} label="Team Alpha" />
            <SidebarItem href="/team/beta" icon={<span style={{ fontSize: "12px" }}>-</span>} label="Team Beta" />
          </SidebarGroup>
        </div>

        <div style={footerStyle}>
          <Link to="/create-team" style={footerButtonStyle}>
            <Plus size={16} />
            Join / Create Team
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div style={mainContentStyle}>
        {/* Mobile header */}
        {!isDesktop && (
          <div style={mobileHeaderStyle}>
            <button style={mobileButtonStyle} onClick={() => setIsMobileOpen(true)}>
              <Menu size={16} />
            </button>
          </div>
        )}

        {/* Page content */}
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  )
}

export { SidebarItem, SidebarGroup }
