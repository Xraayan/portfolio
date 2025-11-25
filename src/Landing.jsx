import React, { useState, useEffect } from 'react'

function Landing() {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [startTyping, setStartTyping] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [allowScroll, setAllowScroll] = useState(false)
  const [currentSection, setCurrentSection] = useState('home')
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showTagline, setShowTagline] = useState(false)
  const [showSocials, setShowSocials] = useState(false)
  const [cursorInterval, setCursorInterval] = useState(null)
  const [phase, setPhase] = useState('initial')
  const [charIndex, setCharIndex] = useState(0)
  const [blinkCount, setBlinkCount] = useState(0)
  
  const fullText = "Adithyan Vinod"
  
  const socialLinks = {
    github: "https://github.com/Xraayan",
    linkedin: "https://www.linkedin.com/in/asteroiddestroyer3000",
    instagram: "https://instagram.com/your_instagram",
    email: "mailto:adithyanvinod616@gmail.com"
  }
  
  const scrollToSection = (section) => {
    if (!allowScroll) return
    setCurrentSection(section)
    if (section === 'about') {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    } else if (section === 'projects') {
      window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  useEffect(() => {
    // Blink cursor 3 times before starting to type
    let blinkCount = 0
    const blinkTimer = setInterval(() => {
      setShowCursor(prev => !prev)
      blinkCount++
      if (blinkCount >= 6) { // 3 complete blinks (on/off cycles)
        clearInterval(blinkTimer)
        setShowCursor(true)
        setStartTyping(true)
      }
    }, 250)
    
    return () => clearInterval(blinkTimer)
  }, [])
  
  useEffect(() => {
    if (!startTyping) return
    
    const timer = setInterval(() => {
      switch (phase) {
        case 'initial':
          setPhase('typing1')
          setCharIndex(0)
          break
          
        case 'typing1':
          if (charIndex <= 8) {
            setDisplayText(fullText.slice(0, charIndex))
            setCharIndex(prev => prev + 1)
          } else {
            setPhase('pausing')
            setBlinkCount(0)
          }
          break
          
        case 'pausing':
          setShowCursor(prev => !prev)
          setBlinkCount(prev => prev + 1)
          if (blinkCount >= 4) {
            setShowCursor(true)
            setPhase('typing2')
          }
          break
          
        case 'typing2':
          if (charIndex <= fullText.length) {
            setDisplayText(fullText.slice(0, charIndex))
            setCharIndex(prev => prev + 1)
          } else {
            setPhase('completed')
            const permanentBlink = setInterval(() => {
              setShowCursor(prev => !prev)
            }, 250)
            setCursorInterval(permanentBlink)
            
            setTimeout(() => setShowSubtitle(true), 800)
            setTimeout(() => setShowTagline(true), 1200)
            setTimeout(() => setShowSocials(true), 1600)
            setTimeout(() => {
              setShowButtons(true)
              setAllowScroll(true)
              document.body.style.overflow = 'auto'
            }, 2000)
          }
          break
      }
    }, phase === 'pausing' ? 250 : 100)
    
    return () => clearInterval(timer)
  }, [startTyping, phase, charIndex, blinkCount])
  
  useEffect(() => {
    // Starfield animation
    const canvas = document.getElementById('starfield')
    const context = canvas.getContext('2d')
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const STAR_COLOR = '#fff'
    const STAR_SIZE = 3
    const STAR_MIN_SCALE = 0.2
    const OVERFLOW_THRESHOLD = 50
    const STAR_COUNT = isMobile ? Math.min(50, (window.innerWidth + window.innerHeight) / 20) : (window.innerWidth + window.innerHeight) / 8
    
    let scale = 1, width, height
    let stars = []
    let pointerX, pointerY
    let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 }
    let touchInput = false
    
    const generate = () => {
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: 0, y: 0,
          z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
        })
      }
    }
    
    const placeStar = (star) => {
      star.x = Math.random() * width
      star.y = Math.random() * height
    }
    
    const recycleStar = (star) => {
      let direction = 'z'
      let vx = Math.abs(velocity.x), vy = Math.abs(velocity.y)
      
      if (vx > 1 || vy > 1) {
        let axis = vx > vy ? (Math.random() < vx / (vx + vy) ? 'h' : 'v') : (Math.random() < vy / (vx + vy) ? 'v' : 'h')
        direction = axis === 'h' ? (velocity.x > 0 ? 'l' : 'r') : (velocity.y > 0 ? 't' : 'b')
      }
      
      star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
      
      if (direction === 'z') {
        star.z = 0.1
        star.x = Math.random() * width
        star.y = Math.random() * height
      } else if (direction === 'l') {
        star.x = -OVERFLOW_THRESHOLD
        star.y = height * Math.random()
      } else if (direction === 'r') {
        star.x = width + OVERFLOW_THRESHOLD
        star.y = height * Math.random()
      } else if (direction === 't') {
        star.x = width * Math.random()
        star.y = -OVERFLOW_THRESHOLD
      } else if (direction === 'b') {
        star.x = width * Math.random()
        star.y = height + OVERFLOW_THRESHOLD
      }
    }
    
    const resize = () => {
      const oldWidth = width || window.innerWidth * scale
      const oldHeight = height || window.innerHeight * scale
      scale = isMobile ? 1 : (window.devicePixelRatio || 1)
      width = window.innerWidth * scale
      height = window.innerHeight * scale
      canvas.width = width
      canvas.height = height
      
      // Adjust existing star positions proportionally
      if (oldWidth && oldHeight) {
        const scaleX = width / oldWidth
        const scaleY = height / oldHeight
        stars.forEach(star => {
          star.x *= scaleX
          star.y *= scaleY
        })
      }
    }
    
    const update = () => {
      velocity.tx *= 0.96
      velocity.ty *= 0.96
      velocity.x += (velocity.tx - velocity.x) * 0.8
      velocity.y += (velocity.ty - velocity.y) * 0.8
      
      stars.forEach((star) => {
        star.x += velocity.x * star.z
        star.y += velocity.y * star.z
        star.x += (star.x - width/2) * velocity.z * star.z
        star.y += (star.y - height/2) * velocity.z * star.z
        star.z += velocity.z
        
        if (star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD) {
          recycleStar(star)
        }
      })
    }
    
    const render = () => {
      stars.forEach((star) => {
        context.beginPath()
        context.lineCap = 'round'
        context.lineWidth = STAR_SIZE * star.z * scale
        context.globalAlpha = 0.5 + 0.5 * Math.random()
        context.strokeStyle = STAR_COLOR
        context.moveTo(star.x, star.y)
        
        let tailX = velocity.x * 2, tailY = velocity.y * 2
        if (Math.abs(tailX) < 0.1) tailX = 0.5
        if (Math.abs(tailY) < 0.1) tailY = 0.5
        
        context.lineTo(star.x + tailX, star.y + tailY)
        context.stroke()
      })
    }
    
    let lastFrame = 0
    const step = (timestamp) => {
      if (isMobile && timestamp - lastFrame < 33) {
        requestAnimationFrame(step)
        return
      }
      lastFrame = timestamp
      
      context.clearRect(0, 0, width, height)
      update()
      render()
      requestAnimationFrame(step)
    }
    
    const movePointer = (x, y) => {
      if (typeof pointerX === 'number' && typeof pointerY === 'number') {
        let ox = x - pointerX, oy = y - pointerY
        velocity.tx = velocity.tx + (ox / 200 * scale) * (touchInput ? 1 : -1)
        velocity.ty = velocity.ty + (oy / 200 * scale) * (touchInput ? 1 : -1)
      }
      pointerX = x
      pointerY = y
    }
    
    const onMouseMove = (event) => {
      touchInput = false
      movePointer(event.clientX, event.clientY)
    }
    
    const onMouseLeave = () => {
      pointerX = null
      pointerY = null
    }
    
    generate()
    resize()
    step()
    
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    
    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])
  
  useEffect(() => {
    // Force clean state on page load - ONLY ONCE
    window.scrollTo(0, 0)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])
  
  // Separate effect for cursor cleanup
  useEffect(() => {
    return () => {
      if (cursorInterval) {
        clearInterval(cursorInterval)
      }
    }
  }, [cursorInterval])
  
  return (
    <>
      <canvas id="starfield" className="fixed inset-0" style={{zIndex: 1}}></canvas>
      <div className="min-h-screen w-full bg-portfolio-bg text-white relative overflow-hidden font-mono">
        <div className="fixed inset-0 z-10 opacity-20" style={{pointerEvents: 'none', backgroundImage: "linear-gradient(#ffffff20 1px, transparent 1px), linear-gradient(90deg, #ffffff20 1px, transparent 1px)", backgroundSize: "120px 120px", backgroundPosition: "center"}}></div>
        <div className="w-full flex justify-between px-12 pt-10 text-sm opacity-80 relative z-10" style={{pointerEvents: 'none'}}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-400/40 rounded-sm"></div>
          </div>
        </div>
        <div className="w-full h-[80vh] flex items-center justify-center relative z-10" style={{pointerEvents: 'none'}}>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-7xl font-bold mb-6 text-portfolio-blue tracking-wide">
              {displayText}
              <span className={`text-4xl ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{fontWeight: '100'}}>_</span>
            </h1>
            <p className={`text-2xl mb-2 transition-all duration-700 ${showSubtitle ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Developer Portfolio
            </p>
            <p className={`text-sm mb-8 transition-all duration-700 ${showTagline ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Converting caffeine into code
            </p>
            <div className={`flex gap-8 text-3xl justify-center items-center transition-all duration-700 ${showSocials ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{pointerEvents: 'auto'}}>
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
                <i className="fab fa-github"></i>
              </a>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={socialLinks.email} className="hover:scale-110 transition-transform duration-200">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-4 flex-wrap justify-center" style={{pointerEvents: 'auto'}}>
          <button onClick={() => scrollToSection('about')} className={`px-4 py-2 md:px-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-700 whitespace-nowrap ${showButtons ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`} style={{fontSize: '14px', transitionDelay: '0ms'}}>About</button>
          <button onClick={() => scrollToSection('projects')} className={`px-4 py-2 md:px-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-700 whitespace-nowrap ${showButtons ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`} style={{fontSize: '14px', transitionDelay: '200ms'}}>Projects</button>
          <button className={`px-4 py-2 md:px-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-700 whitespace-nowrap ${showButtons ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`} style={{fontSize: '14px', transitionDelay: '400ms'}}>Skills</button>
          <button className={`px-4 py-2 md:px-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-700 whitespace-nowrap ${showButtons ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`} style={{fontSize: '14px', transitionDelay: '600ms'}}>Experience</button>
          <button className={`px-4 py-2 md:px-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-700 whitespace-nowrap ${showButtons ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`} style={{fontSize: '14px', transitionDelay: '800ms'}}>Contact Me</button>
        </div>
      </div>
      
      <div className="min-h-screen w-full bg-portfolio-bg text-white relative flex items-center justify-center font-mono">
        <div className="text-center max-w-4xl px-8 relative z-0">
          <h2 className="text-5xl font-bold mb-8 text-portfolio-blue tracking-wide">About Me</h2>
          <p className="text-lg opacity-60">I'm an engineering student who just tries to do minimal work to get greater output, and fighting my natural laziness with sudden bursts of ridiculous productivity. When I get into the zone, I can sit for hours solving problems, improving designs, or chasing an idea that didn't even exist in my head ten minutes earlier. I enjoy learning new tech, experimenting with projects, and making things that feel clean, simple, and actually useful. I work with web development using HTML, CSS, and JavaScript, and I'm comfortable with Java, Python, C, and Dart for the more serious logic. I also enjoy polishing frontends, designing smooth interfaces, debugging until the problem finally gives up, learning new tools whenever something catches my interest, and turning chaotic ideas into real, working projects.</p>
        </div>
      </div>
      
      <div className="min-h-screen w-full bg-portfolio-bg text-white relative flex items-center justify-center py-20 font-mono">
        <div className="max-w-6xl px-8 relative z-10">
          <h2 className="text-5xl font-bold mb-12 text-portfolio-blue tracking-wide text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-64">
              <h3 className="text-xl font-bold mb-3 text-portfolio-blue">Track AI(beta)</h3>
              <p className="text-sm opacity-60 mb-4 flex-grow">AI system for real-time intruder and animal detection, tracking, and precise positioning using YOLOv8, SORT, and MediaPipe landmarks.</p>
              <div className="flex justify-end">
                <a href="https://github.com/Xraayan/trackai" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-portfolio-blue/20 text-portfolio-blue rounded-full text-sm hover:bg-portfolio-blue/30 transition-colors">Try Now</a>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-64">
              <h3 className="text-xl font-bold mb-3 text-portfolio-blue">Privacy Grade</h3>
              <p className="text-sm opacity-60 mb-4 flex-grow">A browser extension that monitors network requests, storage APIs, fingerprinting scripts, and third-party trackers to compute a weighted privacy score and generate detailed analysis reports.</p>
              <div className="flex justify-end">
                <a href="https://github.com/Xraayan/privacygrade" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-portfolio-blue/20 text-portfolio-blue rounded-full text-sm hover:bg-portfolio-blue/30 transition-colors">Try Now</a>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-64">
              <h3 className="text-xl font-bold mb-3 text-portfolio-blue">Fumble</h3>
              <p className="text-sm opacity-60 mb-4 flex-grow">An app that specializes in delivering sharp, playful(harmful) AI roasts that crush excuses, spark confidence, and push you out of your comfort zone without wrecking your soul.</p>
              <div className="flex justify-end">
                <a href="https://github.com/Xraayan/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-portfolio-blue/20 text-portfolio-blue rounded-full text-sm hover:bg-portfolio-blue/30 transition-colors">Try Now</a>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-64">
              <h3 className="text-xl font-bold mb-3 text-portfolio-blue">Upcomming</h3>
              <p className="text-sm opacity-60 mb-4 flex-grow">Upcomming</p>
              <div className="flex justify-end">
                <a href="#" className="px-4 py-2 bg-portfolio-blue/20 text-portfolio-blue rounded-full text-sm hover:bg-portfolio-blue/30 transition-colors">Try Now</a>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-64">
              <h3 className="text-xl font-bold mb-3 text-portfolio-blue">Upcomming</h3>
              <p className="text-sm opacity-60 mb-4 flex-grow">Upcomming</p>
              <div className="flex justify-end">
                <a href="#" className="px-4 py-2 bg-portfolio-blue/20 text-portfolio-blue rounded-full text-sm hover:bg-portfolio-blue/30 transition-colors">Try Now</a>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-64">
              <h3 className="text-xl font-bold mb-3 text-portfolio-blue">Upcomming</h3>
              <p className="text-sm opacity-60 mb-4 flex-grow">Upcomming</p>
              <div className="flex justify-end">
                <a href="#" className="px-4 py-2 bg-portfolio-blue/20 text-portfolio-blue rounded-full text-sm hover:bg-portfolio-blue/30 transition-colors">Try Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing