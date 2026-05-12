import { useRef } from 'react'
import styles from './Button.module.css'

export default function Button({
  children, variant = 'primary', size = 'md',
  onClick, disabled, loading, type = 'button', style, className
}) {
  const btnRef = useRef()

  function handleClick(e) {
    // Ripple
    const btn = btnRef.current
    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.style.cssText = `
      position:absolute; width:6px; height:6px;
      background:rgba(255,255,255,0.45); border-radius:50%;
      transform:translate(-50%,-50%) scale(0);
      left:${e.clientX - rect.left}px; top:${e.clientY - rect.top}px;
      animation:rippleAnim 0.6s ease-out forwards;
      pointer-events:none; z-index:10;
    `
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 650)
    onClick && onClick(e)
  }

  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    className || ''
  ].join(' ')

  return (
    <button
      ref={btnRef}
      type={type}
      className={cls}
      onClick={handleClick}
      disabled={disabled || loading}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      {loading
        ? <span className={styles.spinner} />
        : children}
    </button>
  )
}
