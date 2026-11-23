'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowUpRight, Github, Menu, X } from 'lucide-react'

const links = [
  ['About', '#about'], ['Skills', '#skills'], ['Projects', '#projects'], ['Contact', '#contact'],
]
const groups = [
  { name: 'Frontend', number: '01', items: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Redux Toolkit', 'Tailwind CSS'] },
  { name: 'Backend', number: '02', items: ['Node.js', 'Express.js', 'REST APIs'] },
  { name: 'Database', number: '03', items: ['MongoDB', 'Mongoose'] },
  { name: 'Tools & more', number: '04', items: ['Git', 'GitHub', 'Vite', 'Framer Motion'] },
]
const capabilities = [
  ['01', 'Frontend development', 'Modern, responsive interfaces shaped around the people who use them.'],
  ['02', 'Backend development', 'REST APIs, server-side logic, and clear application architecture.'],
  ['03', 'Database engineering', 'Thoughtful data models and reliable MongoDB integrations.'],
  ['04', 'Authentication & security', 'Authentication flows, email verification, and password management.'],
  ['05', 'Full-stack applications', 'Complete products that connect polished interfaces to dependable systems.'],
]

function DownloadLink({ secondary = false }: { secondary?: boolean }) {
  return <span className={`${secondary ? 'button button-outline' : 'button button-lime'} button-disabled`} aria-disabled="true" title="The CV PDF has not been provided yet">CV PDF pending <ArrowUpRight size={16} /></span>
}

function ProjectVisual({ kind }: { kind: 'shop' | 'screen' }) {
  return (
    <div className={`project-visual ${kind}`} aria-label="Project overview illustration, not a product screenshot" role="img">
      <div className="visual-top"><span className="visual-mark">{kind === 'shop' ? 'P.' : 'N.'}</span><span>PROJECT / {kind === 'shop' ? '01' : '02'}</span><span className="visual-dots">● ● ●</span></div>
      {kind === 'shop' ? <div className="shop-art"><div className="shop-copy"><span>PROSHOP / COMMERCE</span><strong>Thoughtful<br />shopping.</strong><small>CATALOGUE&nbsp;&nbsp; / &nbsp;&nbsp;ACCOUNT&nbsp;&nbsp; / &nbsp;&nbsp;CART</small></div><div className="shop-orbit"><div className="orbit-line"/><div className="orbit-core">P</div><span>01 / 04</span></div></div> : <div className="screen-art"><div className="screen-copy"><span>DISCOVER SOMETHING NEW</span><strong>Stories<br />for every<br />screen.</strong><small>FILM&nbsp;&nbsp; SERIES&nbsp;&nbsp; DISCOVER</small></div><div className="screen-stack"><div className="screen-tile tile-one">01</div><div className="screen-tile tile-two">02</div><div className="screen-tile tile-three">03</div><span className="screen-caption">A FULL-STACK CONCEPT</span></div></div>}
      <div className="visual-footer"><span>CASE STUDY</span><span>↗</span></div>
    </div>
  )
}

function ProjectCard({ number, name, description, stack, features, kind, repo }: { number: string; name: string; description: string; stack: string[]; features: string[]; kind: 'shop' | 'screen'; repo?: string }) {
  return <article className="project-card"><ProjectVisual kind={kind} /><div className="project-info"><div className="project-heading"><span className="eyebrow lime-text">PROJECT {number}</span><h3>{name}</h3><p>{description}</p></div><div className="project-details"><div><span className="detail-label">BUILT WITH</span><div className="tag-list">{stack.map(item => <span className="tag" key={item}>{item}</span>)}</div></div><div><span className="detail-label">FEATURES</span><ul className="feature-list">{features.map(item => <li key={item}>{item}</li>)}</ul></div></div><div className="project-links">{repo ? <a href={repo} target="_blank" rel="noreferrer" className="text-link"><Github size={16} /> View repository <ArrowUpRight size={15} /></a> : <span className="link-pending">Repository link to be provided</span>}<span className="link-pending">No live demo supplied</span></div></div></article>
}

export function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => { const height = document.documentElement.scrollHeight - window.innerHeight; setProgress(height > 0 ? window.scrollY / height * 100 : 0) }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return <>
    <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />
    <header className="site-header"><a href="#home" className="brand" aria-label="Mohamed Elgmaal, home"><span>ME</span><i>.</i></a><nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav><div className="header-actions"><DownloadLink /><button className="menu-toggle" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>{menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{links.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={17}/></a>)}<DownloadLink /></nav>}</header>

    <main>
      <section className="hero section-wrap" id="home"><div className="hero-grid" aria-hidden="true"/><div className="hero-left"><div className="eyebrow intro-label"><span className="lime-dot"/> HELLO, I&apos;M MOHAMED ELGMAAL</div><h1>BUILDING<br/>DIGITAL<br/><span>EXPERIENCES</span><br/>THAT MATTER<span className="lime-text">.</span></h1><div className="hero-bottom"><p className="hero-role">Full Stack Developer <span>—</span> Frontend &amp; Backend</p><p className="hero-description">I build modern, scalable, and interactive web applications by combining thoughtful frontend experiences with powerful backend engineering.</p><div className="hero-actions"><a href="#projects" className="button button-lime">Explore my work <ArrowDownRight size={17}/></a><DownloadLink secondary /></div></div></div><div className="hero-aside"><div className="code-card"><div className="code-top"><span>ABOUT.ME</span><span>JS&nbsp; ↗</span></div><div className="code-body"><span className="code-muted">01</span> <span className="code-pink">const</span> <span className="code-blue">developer</span> = {'{'}<br/><span className="code-muted">02</span> &nbsp;name: <span className="code-green">&apos;Mohamed&apos;</span>,<br/><span className="code-muted">03</span> &nbsp;focus: <span className="code-green">&apos;full stack&apos;</span>,<br/><span className="code-muted">04</span> &nbsp;builds: <span className="code-green">&apos;for people&apos;</span><br/><span className="code-muted">05</span> {'}'}</div><div className="code-foot"><span><span className="tiny-dot"/> AVAILABLE FOR PROJECTS</span><span>CAIRO, EG</span></div></div><div className="hero-index"><span>01 / 06</span><span>SCROLL TO EXPLORE <ArrowDown size={14}/></span></div></div><span className="hero-coordinate">30°02&apos;N&nbsp; / &nbsp;31°14&apos;E</span></section>

      <section className="about section-wrap section-pad" id="about"><div className="section-kicker"><span>01 — A LITTLE ABOUT ME</span><span>THE PERSON BEHIND THE PIXELS</span></div><div className="about-layout"><h2>MORE THAN<br/>JUST <span className="lime-text">CODE.</span></h2><div className="about-copy"><p className="about-lede">I&apos;m a Full Stack Developer who enjoys turning complex ideas into complete, considered web experiences.</p><p>From the first interface detail to the systems behind it, I work across frontend development, backend engineering, database integration, authentication, and APIs. My focus is building applications that feel intuitive to use and remain clear and maintainable under the hood.</p><p>Good engineering is more than making things work. It&apos;s about making the whole experience work better.</p><a className="inline-link" href="#skills">WHAT I BRING <ArrowDownRight size={15}/></a></div></div><div className="about-stamp"><span>DESIGN MINDED</span><span className="stamp-cross">✳</span><span>ENGINEER BUILT</span></div></section>

      <section className="skills section-wrap section-pad" id="skills"><div className="section-kicker"><span>02 — THE TOOLKIT</span><span>TOOLS ARE ONLY THE BEGINNING</span></div><div className="skills-heading"><h2>GOOD WORK.<br/><span className="muted-heading">RIGHT TOOLS.</span></h2><p>A practical toolkit for building complete digital products, from the first component to the final API request.</p></div><div className="skill-grid">{groups.map(group => <article className="skill-group" key={group.name}><div className="skill-group-top"><span>{group.number} / 04</span><span className="group-arrow">↗</span></div><h3>{group.name}</h3><div className="skill-items">{group.items.map((item, i) => <span className="skill-chip" key={item}><span className="skill-index">{String(i + 1).padStart(2, '0')}</span>{item}</span>)}</div></article>)}</div><p className="no-ratings">A growing toolkit, shared without arbitrary scores.</p></section>

      <section className="projects section-wrap section-pad" id="projects"><div className="section-kicker"><span>03 — SELECTED WORK</span><span>BUILDING COMPLETE EXPERIENCES</span></div><div className="projects-title"><h2>MADE TO<br/><span className="lime-text">WORK.</span></h2><p>Two full-stack builds. Each one connects the details of a thoughtful frontend with the systems that make it useful.</p></div><div className="projects-list"><ProjectCard number="01" kind="shop" name="ProShop" description="A full-stack commerce experience with a complete shopping journey, from product discovery through order management." stack={['React', 'Node.js', 'Express', 'MongoDB', 'PayPal']} features={['JWT authentication & password reset', 'Product catalogue & administration', 'Cart, orders & PayPal payments', 'Admin dashboard & multilingual UI']} repo="https://github.com/mohamedelgmaal/websaite/tree/main/store-project"/><ProjectCard number="02" kind="screen" name="Netflix Clone" description="A separate movie and TV discovery platform, pairing TMDB-powered browsing with a custom full-stack account experience." stack={['React', 'Redux Toolkit', 'Node.js', 'Express', 'MongoDB', 'TMDB']} features={['Dynamic movie & series discovery', 'TMDB-backed titles and details', 'Email verification & account flows', 'Password reset & bcrypt hashing']} /></div><p className="project-disclaimer">Project details reflect the supplied information. Netflix Clone repository and demo links have not been provided.</p></section>

      <section className="capabilities section-wrap section-pad"><div className="section-kicker"><span>04 — WHAT I BUILD</span><span>THE ENGINEERING BEHIND THE EXPERIENCE</span></div><div className="capabilities-layout"><h2>THOUGHTFUL<br/><span className="muted-heading">BY DESIGN.</span></h2><div className="capability-list">{capabilities.map(([n, title, body]) => <article className="capability" key={n}><span className="cap-number">{n}</span><div><h3>{title}</h3><p>{body}</p></div><ArrowUpRight size={18}/></article>)}</div></div></section>

      <section className="contact section-wrap section-pad" id="contact"><div className="section-kicker"><span>05 — YOUR MOVE</span><span>GOOD THINGS START WITH A CONVERSATION</span></div><div className="contact-main"><span className="eyebrow"><span className="lime-dot"/> HAVE SOMETHING IN MIND?</span><h2>LET&apos;S BUILD<br/>SOMETHING <span className="lime-text">GREAT.</span></h2><p>Have a project in mind or want to connect? Let&apos;s create something meaningful.</p><div className="contact-links"><span className="button button-lime button-disabled" aria-disabled="true" title="An email address has not been provided">Email address to be provided <ArrowUpRight size={17}/></span><a className="social-link" href="https://github.com/mohamedelgmaal" target="_blank" rel="noreferrer"><Github size={17}/> GitHub <ArrowUpRight size={14}/></a><span className="link-pending">LinkedIn profile to be provided</span></div></div><span className="contact-mark" aria-hidden="true">ME<span>.</span></span></section>
    </main>

    <footer className="site-footer section-wrap"><a href="#home" className="brand footer-brand"><span>ME</span><i>.</i></a><div className="footer-caption"><span>MOHAMED ELGMAAL</span><span>FULL STACK DEVELOPER</span></div><nav aria-label="Footer navigation">{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav><span className="copyright">© {new Date().getFullYear()} MOHAMED ELGMAAL</span></footer>
  </>
}
