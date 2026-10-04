import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import '@fontsource-variable/bricolage-grotesque/wdth.css'
import '@fontsource-variable/martian-mono'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import 'lenis/dist/lenis.css'
import './styles.css'
import App from './App'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

createRoot(document.getElementById('root')!).render(<App />)
