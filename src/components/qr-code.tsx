"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"

interface QRCodeProps {
  url: string
  size?: number
}

export function QRCodeGenerator({ url, size = 400 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("[v0] QR Code generation error:", error)
        },
      )
    }
  }, [url, size])

  return <canvas ref={canvasRef} className="w-full h-auto" />
}
