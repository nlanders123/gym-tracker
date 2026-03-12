import { useEffect, useRef, useState } from 'react'
import { X, Camera } from 'lucide-react'

export default function BarcodeScanner({ isOpen, onClose, onScan }) {
  const [error, setError] = useState(null)
  const scannerRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    let scanner = null

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        scanner = new Html5Qrcode('barcode-reader')
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 280, height: 160 },
            aspectRatio: 1.5,
            formatsToSupport: [
              0,  // QR_CODE
              4,  // EAN_13
              3,  // EAN_8
              11, // UPC_A
              12, // UPC_E
              2,  // CODE_128
              1,  // CODE_39
            ],
          },
          (decodedText) => {
            // Barcode scanned — stop scanner and pass result up
            scanner.stop().catch(() => {})
            scannerRef.current = null
            onScan(decodedText)
          },
          () => {} // ignore scan failures (normal during scanning)
        )
      } catch (err) {
        console.error('Scanner error:', err)
        setError(
          typeof err === 'string'
            ? err
            : err?.message || 'Camera access denied. Check permissions.'
        )
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2 text-white">
          <Camera size={18} />
          <span className="font-bold">Scan barcode</span>
        </div>
        <button
          onClick={() => {
            if (scannerRef.current) {
              scannerRef.current.stop().catch(() => {})
              scannerRef.current = null
            }
            onClose()
          }}
          className="p-2 bg-zinc-800 rounded-full text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scanner viewport */}
      <div className="flex-1 flex items-center justify-center" ref={containerRef}>
        <div id="barcode-reader" className="w-full max-w-md" />
      </div>

      {error && (
        <div className="p-4">
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl p-4 text-sm text-center">
            {error}
          </div>
        </div>
      )}

      <div className="p-4 text-center text-zinc-500 text-sm">
        Point camera at a food barcode
      </div>
    </div>
  )
}
