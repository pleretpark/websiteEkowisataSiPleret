'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

type AnimationVariant = 
  | 'fade-up' 
  | 'fade-down' 
  | 'fade-left' 
  | 'fade-right' 
  | 'zoom-in' 
  | 'blur-in'
  | 'slide-up'

interface ScrollRevealProps {
  children: ReactNode
  variant?: AnimationVariant
  delay?: number  // in ms
  duration?: number  // in ms
  className?: string
  once?: boolean  // only animate once
  threshold?: number  // 0-1, how much of element should be visible
}

const variantClasses: Record<AnimationVariant, { hidden: string; visible: string }> = {
  'fade-up': {
    hidden: 'opacity-0 translate-y-8',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-down': {
    hidden: 'opacity-0 -translate-y-8',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-left': {
    hidden: 'opacity-0 -translate-x-10',
    visible: 'opacity-100 translate-x-0',
  },
  'fade-right': {
    hidden: 'opacity-0 translate-x-10',
    visible: 'opacity-100 translate-x-0',
  },
  'zoom-in': {
    hidden: 'opacity-0 scale-90',
    visible: 'opacity-100 scale-100',
  },
  'blur-in': {
    hidden: 'opacity-0 blur-sm scale-95',
    visible: 'opacity-100 blur-0 scale-100',
  },
  'slide-up': {
    hidden: 'opacity-0 translate-y-12',
    visible: 'opacity-100 translate-y-0',
  },
}

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  once = true,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold])

  const { hidden, visible } = variantClasses[variant]

  return (
    <div
      ref={ref}
      className={`transition-all ${isVisible ? visible : hidden} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  )
}
