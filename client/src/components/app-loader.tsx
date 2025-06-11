"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ListTodo, CheckCircle, Clock, Users } from "lucide-react"

interface AppLoaderProps {
    variant?: "default" | "minimal" | "detailed" | "skeleton"
    message?: string
    progress?: number
    showProgress?: boolean
    size?: "sm" | "md" | "lg"
    style?: React.CSSProperties
}

export function AppLoader({
    variant = "default",
    message = "Loading...",
    progress,
    showProgress = false,
    size = "md",
    style = {},
}: AppLoaderProps) {
    const [dots, setDots] = useState("")
    const [currentStep, setCurrentStep] = useState(0)

    // Animated dots effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev === "...") return ""
                return prev + "."
            })
        }, 500)

        return () => clearInterval(interval)
    }, [])

    // Simulate loading steps for detailed variant
    useEffect(() => {
        if (variant === "detailed") {
            const interval = setInterval(() => {
                setCurrentStep((prev) => (prev + 1) % 4)
            }, 1500)

            return () => clearInterval(interval)
        }
    }, [variant])

    const getSizeStyles = () => {
        switch (size) {
            case "sm":
                return {
                    container: { padding: "16px" },
                    spinner: { width: "24px", height: "24px" },
                    text: { fontSize: "14px" },
                    logo: { width: "32px", height: "32px" },
                }
            case "lg":
                return {
                    container: { padding: "48px" },
                    spinner: { width: "48px", height: "48px" },
                    text: { fontSize: "18px" },
                    logo: { width: "64px", height: "64px" },
                }
            default:
                return {
                    container: { padding: "32px" },
                    spinner: { width: "32px", height: "32px" },
                    text: { fontSize: "16px" },
                    logo: { width: "48px", height: "48px" },
                }
        }
    }

    const sizeStyles = getSizeStyles()

    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        ...sizeStyles.container,
        ...style,
    }

    const spinnerStyle: React.CSSProperties = {
        ...sizeStyles.spinner,
        border: "3px solid #f3f4f6",
        borderTop: "3px solid #2563eb",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    }

    const pulseStyle: React.CSSProperties = {
        ...sizeStyles.spinner,
        backgroundColor: "#2563eb",
        borderRadius: "50%",
        animation: "pulse 1.5s ease-in-out infinite",
    }

    const logoStyle: React.CSSProperties = {
        ...sizeStyles.logo,
        backgroundColor: "#2563eb",
        color: "white",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
        animation: "bounce 2s infinite",
    }

    const textStyle: React.CSSProperties = {
        ...sizeStyles.text,
        color: "#374151",
        fontWeight: "500",
        marginTop: "16px",
    }

    const progressBarStyle: React.CSSProperties = {
        width: "200px",
        height: "4px",
        backgroundColor: "#f3f4f6",
        borderRadius: "2px",
        marginTop: "16px",
        overflow: "hidden",
    }

    const progressFillStyle: React.CSSProperties = {
        height: "100%",
        backgroundColor: "#2563eb",
        borderRadius: "2px",
        transition: "width 0.3s ease",
        width: `${progress || 0}%`,
    }

    const stepStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        color: "#6b7280",
        marginTop: "8px",
    }

    const skeletonStyle: React.CSSProperties = {
        backgroundColor: "#f3f4f6",
        borderRadius: "4px",
        animation: "shimmer 1.5s infinite",
    }

    const loadingSteps = [
        { icon: <ListTodo size={16} />, text: "Initializing application..." },
        { icon: <Users size={16} />, text: "Loading team data..." },
        { icon: <Clock size={16} />, text: "Fetching tasks..." },
        { icon: <CheckCircle size={16} />, text: "Almost ready..." },
    ]

    if (variant === "minimal") {
        return (
            <div style={containerStyle}>
                <div style={spinnerStyle} />
            </div>
        )
    }

    if (variant === "skeleton") {
        return (
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Header skeleton */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ ...skeletonStyle, width: "40px", height: "40px", borderRadius: "50%" }} />
                    <div style={{ ...skeletonStyle, width: "120px", height: "20px" }} />
                </div>

                {/* Content skeleton */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ ...skeletonStyle, width: "100%", height: "16px" }} />
                    <div style={{ ...skeletonStyle, width: "80%", height: "16px" }} />
                    <div style={{ ...skeletonStyle, width: "60%", height: "16px" }} />
                </div>

                {/* Cards skeleton */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            style={{
                                ...skeletonStyle,
                                width: "100%",
                                height: "80px",
                                borderRadius: "8px",
                            }}
                        />
                    ))}
                </div>
            </div>
        )
    }

    if (variant === "detailed") {
        return (
            <div style={containerStyle}>
                <div style={logoStyle}>
                    <ListTodo size={size === "lg" ? 32 : size === "sm" ? 16 : 24} />
                </div>
                <div style={pulseStyle} />
                <div style={textStyle}>TeamTodo</div>
                <div style={stepStyle}>
                    {loadingSteps[currentStep].icon}
                    <span>{loadingSteps[currentStep].text}</span>
                </div>
                {showProgress && progress !== undefined && (
                    <>
                        <div style={progressBarStyle}>
                            <div style={progressFillStyle} />
                        </div>
                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>{progress}%</div>
                    </>
                )}
            </div>
        )
    }

    // Default variant
    return (
        <div style={containerStyle}>
            <div style={logoStyle}>
                <ListTodo size={size === "lg" ? 32 : size === "sm" ? 16 : 24} />
            </div>
            <div style={spinnerStyle} />
            <div style={textStyle}>
                {message}
                {dots}
            </div>
            {showProgress && progress !== undefined && (
                <>
                    <div style={progressBarStyle}>
                        <div style={progressFillStyle} />
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>{progress}%</div>
                </>
            )}
        </div>
    )
}

// Full page loader component
interface FullPageLoaderProps {
    variant?: "default" | "minimal" | "detailed" | "skeleton"
    message?: string
    progress?: number
    showProgress?: boolean
}

export function FullPageLoader({ variant = "default", message, progress, showProgress }: FullPageLoaderProps) {
    const overlayStyle: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    }

    return (
        <div style={overlayStyle}>
            <AppLoader variant={variant} message={message} progress={progress} showProgress={showProgress} size="lg" />
        </div>
    )
}

// Inline loader for smaller sections
interface InlineLoaderProps {
    message?: string
    size?: "sm" | "md"
    style?: React.CSSProperties
}

export function InlineLoader({ message = "Loading...", size = "sm", style = {} }: InlineLoaderProps) {
    const containerStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px",
        ...style,
    }

    const spinnerSize = size === "sm" ? 16 : 20

    const spinnerStyle: React.CSSProperties = {
        width: `${spinnerSize}px`,
        height: `${spinnerSize}px`,
        border: "2px solid #f3f4f6",
        borderTop: "2px solid #2563eb",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    }

    const textStyle: React.CSSProperties = {
        fontSize: size === "sm" ? "14px" : "16px",
        color: "#6b7280",
    }

    return (
        <div style={containerStyle}>
            <div style={spinnerStyle} />
            <span style={textStyle}>{message}</span>
        </div>
    )
}

// Card loader for loading states within cards
export function CardLoader() {
    const skeletonStyle: React.CSSProperties = {
        backgroundColor: "#f3f4f6",
        borderRadius: "4px",
        animation: "shimmer 1.5s infinite",
    }

    return (
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ ...skeletonStyle, width: "32px", height: "32px", borderRadius: "50%" }} />
                <div style={{ ...skeletonStyle, width: "120px", height: "16px" }} />
            </div>
            <div style={{ ...skeletonStyle, width: "100%", height: "12px" }} />
            <div style={{ ...skeletonStyle, width: "80%", height: "12px" }} />
            <div style={{ ...skeletonStyle, width: "60%", height: "12px" }} />
        </div>
    )
}

// CSS animations as a style tag
export function LoaderStyles() {
    return (
        <style>{`
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(0.95);
        }
      }

      @keyframes bounce {
        0%,
        20%,
        53%,
        80%,
        100% {
          transform: translateY(0);
        }
        40%,
        43% {
          transform: translateY(-8px);
        }
        70% {
          transform: translateY(-4px);
        }
        90% {
          transform: translateY(-2px);
        }
      }

      @keyframes shimmer {
        0% {
          background-position: -200px 0;
        }
        100% {
          background-position: calc(200px + 100%) 0;
        }
      }

      [style*="shimmer"] {
        background: linear-gradient(90deg, #f3f4f6 0px, #e5e7eb 40px, #f3f4f6 80px);
        background-size: 200px;
      }
    `}</style>
    )
}
