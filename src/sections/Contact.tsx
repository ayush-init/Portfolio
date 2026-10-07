import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { resume } from '../data/resume'
import { state } from '../lib/state'
import { magnetic, release } from '../ui/Cursor'

interface HistoryEntry {
  command: string
  response?: string
  isOk?: boolean
}

export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const termBodyRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (termBodyRef.current) {
      termBodyRef.current.scrollTop = termBodyRef.current.scrollHeight
    }
  }, [history])

  const handleCopy = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    navigator.clipboard.writeText(resume.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const raw = input.trim()
      const cmd = raw.toLowerCase()
      if (!raw) {
        setHistory((prev) => [...prev, { command: '' }])
      } else if (cmd === 'clear') {
        setHistory([])
      } else if (cmd === 'email' || cmd === 'mail' || cmd === 'contact') {
        navigator.clipboard.writeText(resume.email)
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
        setHistory((prev) => [
          ...prev,
          { command: raw, response: '✓ Email copied to clipboard! Ready when you are.', isOk: true },
        ])
      } else if (cmd === 'help') {
        setHistory((prev) => [
          ...prev,
          { command: raw, response: 'commands: email, clear, whoami, stack, or type anything for fun!' },
        ])
      } else if (cmd === 'whoami') {
        setHistory((prev) => [
          ...prev,
          { command: raw, response: 'a curious builder with great taste :)' },
        ])
      } else if (cmd === 'stack') {
        setHistory((prev) => [
          ...prev,
          { command: raw, response: 'React, TypeScript, Three.js, GSAP, Node.js, Python, PyTorch' },
        ])
      } else {
        setHistory((prev) => [
          ...prev,
          { command: raw, response: `> logged: "${raw}". Type "email" to copy contact or ping on LinkedIn!` },
        ])
      }
      setInput('')
    }
  }

  useGSAP(
    () => {
      ScrollTrigger.create({
        // Looked up directly: selector strings here are scoped to this section.
        trigger: document.getElementById('experience'),
        start: 'top bottom',
        endTrigger: root.current,
        end: 'top bottom',
        onUpdate: (s) => (state.tail = s.progress),
      })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom bottom',
        onUpdate: (s) => (state.contact = s.progress),
      })
      const split = new SplitText('.contact h2', { type: 'words' })
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 45%' } })
        .from(split.words, { yPercent: 80, opacity: 0, rotateX: -50, stagger: 0.06, duration: 1, ease: 'expo.out' })
        .from('.term__line', { opacity: 0, x: -14, stagger: 0.35, duration: 0.4 }, 0.3)
        .from('.contact__links > *', { y: 30, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out' }, 0.5)
    },
    { scope: root },
  )

  return (
    <section className="contact" id="contact" ref={root}>
      <div className="contact__col">
        <span className="tag">05 / the core</span>
        <h2>
          Got something to build? <em>Let's ship it.</em>
        </h2>

        <div
          className="term"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="term__bar">
            <i />
            <i />
            <i />
            <button
              type="button"
              className={`term__copy-btn ${copied ? 'is-copied' : ''}`}
              onClick={handleCopy}
              title="Copy email address"
            >
              <span>{copied ? '✓' : '✉'}</span>
              <span>{copied ? 'copied!' : 'copy email'}</span>
            </button>
            <span className="term__bar-title">zsh</span>
          </div>

          <div
            className="term__body"
            ref={termBodyRef}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
          >
            <p className="term__line">
              <b>$</b> curl -X POST /api/hire -d '{`{"to":"${resume.firstName.toLowerCase()}"}`}'
            </p>
            <p className="term__line term__ok">201 Created</p>

            {history.map((h, i) => (
              <div key={i} className="term__history">
                <p className="term__line">
                  <b>$</b> {h.command}
                </p>
                {h.response && (
                  <p className={`term__line ${h.isOk ? 'term__ok' : 'term__reply'}`}>{h.response}</p>
                )}
              </div>
            ))}

            <div className="term__prompt">
              <b>$</b>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="term__input"
                placeholder='type anything here or try "email"...'
                autoComplete="off"
                spellCheck="false"
                aria-label="Interactive terminal input"
              />
            </div>
          </div>
        </div>

        <div className="contact__links">
          {resume.links.map((l) => (
            <a
              className="btn"
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              onPointerMove={magnetic}
              onPointerLeave={release}
            >
              {l.icon && (
                <img
                  src={l.icon}
                  alt=""
                  className="btn__icon"
                />
              )}
              <span>{l.label}</span>
              <small>{l.handle}</small>
              <span className="btn__arrow" aria-hidden>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
