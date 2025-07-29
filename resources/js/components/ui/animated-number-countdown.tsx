"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedNumberCountdownProps {
  value: number
  className?: string
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

const AnimatedNumberCountdown: React.FC<AnimatedNumberCountdownProps> = ({
  value,
  className,
  duration = 2000,
  decimals = 2,
  prefix = "",
  suffix = "",
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const startValue = 0
    const endValue = value

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (endValue - startValue) * easeOutQuart

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
      }
    }

    animate()
  }, [value, duration])

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  return (
    <span className={cn("font-mono text-2xl font-bold", className)}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  )
}

export default AnimatedNumberCountdown 