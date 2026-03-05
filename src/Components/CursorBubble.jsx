import { useEffect, useMemo, useRef, useState } from 'react'

function CursorBubble() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const frameRef = useRef(0)
  const [isVisible, setIsVisible] = useState(false)
  const [ripples, setRipples] = useState([])

  const shouldRender = useMemo(() => {
    if (typeof window === 'undefined') {
      return false
    }

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    return hasFinePointer
  }, [])

  useEffect(() => {
    if (!shouldRender) {
      return undefined
    }

    let currentX = window.innerWidth / 2
    let currentY = window.innerHeight / 2
    let targetX = currentX
    let targetY = currentY

    const moveDot = (x, y) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
    }

    const moveRing = (x, y) => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.16
      currentY += (targetY - currentY) * 0.16
      moveRing(currentX, currentY)
      frameRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (event) => {
      if (!isVisible) {
        setIsVisible(true)
      }

      targetX = event.clientX
      targetY = event.clientY
      moveDot(targetX, targetY)
    }

    const handleMouseLeave = () => setIsVisible(false)

    const handleClick = (event) => {
      const ripple = {
        id: Date.now() + Math.random(),
        x: event.clientX,
        y: event.clientY,
      }

      setRipples((prev) => [...prev, ripple])
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== ripple.id))
      }, 600)
    }

    frameRef.current = requestAnimationFrame(animate)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('click', handleClick)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('click', handleClick)
    }
  }, [isVisible, shouldRender])

  if (!shouldRender) {
    return null
  }

  return (
    <>
      <div ref={ringRef} className={`cursor-ring ${isVisible ? 'cursor-visible' : ''}`} />
      <div ref={dotRef} className={`cursor-dot ${isVisible ? 'cursor-visible' : ''}`} />

      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="cursor-ripple"
          style={{ transform: `translate3d(${ripple.x}px, ${ripple.y}px, 0)` }}
        />
      ))}
    </>
  )
}

export default CursorBubble
