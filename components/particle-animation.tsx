"use client"

import { useEffect, useRef } from "react"

export function ParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    // Function to set canvas size properly
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      // Ensure minimum dimensions to prevent errors
      if (canvas.width < 1) canvas.width = 1
      if (canvas.height < 1) canvas.height = 1

      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    setCanvasSize()

    // Responsive configuration based on screen size
    const getResponsiveConfig = () => {
      const width = canvas.width
      const height = canvas.height
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024

      return {
        particleCount: isMobile ? 2000 : isTablet ? 3500 : 5000,
        textArray: ["Stay curious.", "Break limits.", "Build meaning."],
        mouseRadius: isMobile ? 0.15 : 0.1,
        particleSize: isMobile ? 1.5 : 2,
        forceMultiplier: 0.001,
        returnSpeed: 0.005,
        velocityDamping: 0.95,
        colorMultiplier: 40000,
        saturationMultiplier: 1000,
        textChangeInterval: 10000,
        rotationForceMultiplier: 0.5,
        fontSize: Math.min(width * 0.15, height * 0.25, 180), // Increased font size for better fit
        fontSpacing: isMobile ? 2 : 3, // Tighter spacing for better text coverage
      }
    }

    let config = getResponsiveConfig()
    let currentTextIndex = 0
    let nextTextTimeout: NodeJS.Timeout
    let textCoordinates: { x: number; y: number }[] = []

    const mouse = {
      x: -500,
      y: -500,
      radius: config.mouseRadius,
    }

    const particles: Array<{
      x: number
      y: number
      baseX: number
      baseY: number
      vx: number
      vy: number
    }> = []

    // Initialize particles array
    const initializeParticles = () => {
      particles.length = 0
      for (let i = 0; i < config.particleCount; i++) {
        particles.push({ x: 0, y: 0, baseX: 0, baseY: 0, vx: 0, vy: 0 })
      }
    }

    initializeParticles()

    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute float a_hue;
      attribute float a_saturation;
      varying float v_hue;
      varying float v_saturation;
      void main() {
          gl_PointSize = ${config.particleSize.toFixed(1)};
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_hue = a_hue;
          v_saturation = a_saturation;
      }
    `

    const fragmentShaderSource = `
      precision mediump float;
      varying float v_hue;
      varying float v_saturation;
      void main() {
          float c = v_hue * 6.0;
          float x = 1.0 - abs(mod(c, 2.0) - 1.0);
          vec3 color;
          if (c < 1.0) color = vec3(1.0, x, 0.0);
          else if (c < 2.0) color = vec3(x, 1.0, 0.0);
          else if (c < 3.0) color = vec3(0.0, 1.0, x);
          else if (c < 4.0) color = vec3(0.0, x, 1.0);
          else if (c < 5.0) color = vec3(x, 0.0, 1.0);
          else color = vec3(1.0, 0.0, x);
          vec3 finalColor = mix(vec3(1.0), color, v_saturation);
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const program = gl.createProgram()
      if (!program) return null
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
      }
      return program
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
    const hueAttributeLocation = gl.getAttribLocation(program, "a_hue")
    const saturationAttributeLocation = gl.getAttribLocation(program, "a_saturation")

    const positionBuffer = gl.createBuffer()
    const hueBuffer = gl.createBuffer()
    const saturationBuffer = gl.createBuffer()

    let positions = new Float32Array(config.particleCount * 2)
    let hues = new Float32Array(config.particleCount)
    let saturations = new Float32Array(config.particleCount)

    function getTextCoordinates(text: string) {
      // Safety check for canvas dimensions
      if (canvas.width <= 0 || canvas.height <= 0) {
        console.warn("Canvas dimensions are invalid:", canvas.width, canvas.height)
        return []
      }

      const ctx = document.createElement("canvas").getContext("2d")
      if (!ctx) return []

      // Set proper canvas dimensions
      ctx.canvas.width = canvas.width
      ctx.canvas.height = canvas.height

      // Safety check for context canvas dimensions
      if (ctx.canvas.width <= 0 || ctx.canvas.height <= 0) {
        console.warn("Context canvas dimensions are invalid")
        return []
      }

      // Calculate responsive font size with proper aspect ratio
      const fontSize = config.fontSize
      ctx.font = `900 ${fontSize}px Arial, sans-serif`
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Clear the canvas first
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      // Draw text in the center
      ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2)

      let imageData
      try {
        imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
      } catch (error) {
        console.error("Error getting image data:", error)
        return []
      }

      const data = imageData.data
      const coordinates = []

      // Sample pixels with proper spacing for performance
      const spacing = config.fontSpacing

      for (let y = 0; y < ctx.canvas.height; y += spacing) {
        for (let x = 0; x < ctx.canvas.width; x += spacing) {
          const index = (y * ctx.canvas.width + x) * 4
          if (data[index + 3] > 128) {
            // Alpha channel check
            coordinates.push({
              x: (x / ctx.canvas.width) * 2 - 1,
              y: (y / ctx.canvas.height) * -2 + 1,
            })
          }
        }
      }

      return coordinates
    }

    function createParticles() {
      textCoordinates = getTextCoordinates(config.textArray[currentTextIndex])

      // Ensure we have coordinates before proceeding
      if (textCoordinates.length === 0) {
        console.warn("No text coordinates generated")
        return
      }

      for (let i = 0; i < config.particleCount; i++) {
        const randomIndex = Math.floor(Math.random() * textCoordinates.length)
        const { x, y } = textCoordinates[randomIndex] || { x: 0, y: 0 }
        particles[i].x = particles[i].baseX = x
        particles[i].y = particles[i].baseY = y
      }
    }

    function updateParticles() {
      for (let i = 0; i < config.particleCount; i++) {
        const particle = particles[i]
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const maxDistance = mouse.radius
        const force = (maxDistance - distance) / maxDistance
        const directionX = forceDirectionX * force * config.forceMultiplier
        const directionY = forceDirectionY * force * config.forceMultiplier

        const angle = Math.atan2(dy, dx)

        const rotationForceX = Math.sin(
          -Math.cos(angle * -1) *
            Math.sin(config.rotationForceMultiplier * Math.cos(force)) *
            Math.sin(distance * distance) *
            Math.sin(angle * distance),
        )

        const rotationForceY = Math.sin(
          Math.cos(angle * 1) *
            Math.sin(config.rotationForceMultiplier * Math.sin(force)) *
            Math.sin(distance * distance) *
            Math.cos(angle * distance),
        )

        if (distance < mouse.radius) {
          particle.vx -= directionX + rotationForceX
          particle.vy -= directionY + rotationForceY
        } else {
          particle.vx += (particle.baseX - particle.x) * config.returnSpeed
          particle.vy += (particle.baseY - particle.y) * config.returnSpeed
        }

        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= config.velocityDamping
        particle.vy *= config.velocityDamping

        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
        const hue = (speed * config.colorMultiplier) % 360

        hues[i] = hue / 360
        saturations[i] = Math.min(speed * config.saturationMultiplier, 1)
        positions[i * 2] = particle.x
        positions[i * 2 + 1] = particle.y
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, hueBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, hues, gl.DYNAMIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, saturationBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, saturations, gl.DYNAMIC_DRAW)
    }

    function draw() {
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(positionAttributeLocation)

      gl.bindBuffer(gl.ARRAY_BUFFER, hueBuffer)
      gl.vertexAttribPointer(hueAttributeLocation, 1, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(hueAttributeLocation)

      gl.bindBuffer(gl.ARRAY_BUFFER, saturationBuffer)
      gl.vertexAttribPointer(saturationAttributeLocation, 1, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(saturationAttributeLocation)

      gl.drawArrays(gl.POINTS, 0, config.particleCount)
    }

    function animate() {
      updateParticles()
      draw()
      requestAnimationFrame(animate)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = ((event.clientY - rect.top) / rect.height) * -2 + 1
    }

    const handleMouseLeave = () => {
      mouse.x = -500
      mouse.y = -500
    }

    const handleResize = () => {
      setCanvasSize()

      // Update config for new screen size
      config = getResponsiveConfig()
      mouse.radius = config.mouseRadius

      // Reinitialize particles array if count changed
      if (particles.length !== config.particleCount) {
        initializeParticles()
        positions = new Float32Array(config.particleCount * 2)
        hues = new Float32Array(config.particleCount)
        saturations = new Float32Array(config.particleCount)
      }

      // Recreate particles with new dimensions
      createParticles()
    }

    function changeText() {
      currentTextIndex = (currentTextIndex + 1) % config.textArray.length
      const newCoordinates = getTextCoordinates(config.textArray[currentTextIndex])

      if (newCoordinates.length === 0) {
        // Retry after a short delay if no coordinates
        nextTextTimeout = setTimeout(changeText, 1000)
        return
      }

      for (let i = 0; i < config.particleCount; i++) {
        const randomIndex = Math.floor(Math.random() * newCoordinates.length)
        const { x, y } = newCoordinates[randomIndex] || { x: 0, y: 0 }
        particles[i].baseX = x
        particles[i].baseY = y
      }
      nextTextTimeout = setTimeout(changeText, config.textChangeInterval)
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("resize", handleResize)

    // Enable blending for transparency
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    gl.clearColor(0, 0, 0, 0) // Transparent background
    gl.useProgram(program)

    // Initial setup with delay to ensure canvas is ready
    setTimeout(() => {
      createParticles()
      animate()
      nextTextTimeout = setTimeout(changeText, config.textChangeInterval)
    }, 100)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", handleResize)
      clearTimeout(nextTextTimeout)
    }

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0) // Transparent background
    gl.useProgram(program)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" style={{ zIndex: 2 }} />
}
