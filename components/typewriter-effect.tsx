"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface TypewriterEffectProps {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
  typeSpeed?: number
  deleteSpeed?: number
  delaySpeed?: number
}

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
  typeSpeed = 80,
  deleteSpeed = 50,
  delaySpeed = 1500,
}: TypewriterEffectProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        // Handle the case when we're waiting after typing a word
        if (isWaiting) {
          setIsWaiting(false)
          setIsDeleting(true)
          return
        }

        // Handle the case when we're deleting a word
        if (isDeleting) {
          setCurrentText((prev) => prev.substring(0, prev.length - 1))
          if (currentText === "") {
            setIsDeleting(false)
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
          }
          return
        }

        // Handle the case when we're typing a word
        const currentWord = words[currentWordIndex].text
        setCurrentText((prev) => {
          const nextText = currentWord.substring(0, prev.length + 1)
          if (nextText === currentWord) {
            setIsWaiting(true)
          }
          return nextText
        })
      },
      isWaiting ? delaySpeed : isDeleting ? deleteSpeed : typeSpeed,
    )

    return () => clearTimeout(timeout)
  }, [currentText, currentWordIndex, isDeleting, isWaiting, words, typeSpeed, deleteSpeed, delaySpeed])

  return (
    <div className={cn("inline-block", className)}>
      <span>{currentText}</span>
      <span className={cn("animate-blink", cursorClassName)}>|</span>
    </div>
  )
}
