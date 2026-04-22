'use client'

import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { markAttendance } from './actions'

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState<{success: boolean, message: string} | null>(null)
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (scanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: {width: 250, height: 250} },
        /* verbose= */ false
      )

      scanner.render(async (decodedText) => {
        // Pausing scanner to prevent duplicate calls
        scanner?.pause(true);
        setLoading(true)
        const result = await markAttendance(decodedText)
        setScanResult({ success: result.success as boolean, message: result.message || result.error as string })
        setLoading(false)
        
        // Wait 3 seconds then resume
        setTimeout(() => {
           setScanResult(null)
           scanner?.resume()
        }, 3500)
      }, (errorMessage) => {
         // ignore small parse errors silently
      })
    }
    
    return () => {
       scanner?.clear().catch(e => console.error(e))
    }
  }, [scanning])

  return (
    <div className="p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8 text-center">
         <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Access Scanner</h1>
          <p className="text-zinc-500 mt-1">Scan student tickets to securely mark attendance in real-time.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden p-8">
           {!scanning ? (
              <div className="py-20 flex flex-col items-center">
                 <span className="text-6xl mb-6 opacity-80">📸</span>
                 <p className="font-semibold text-zinc-900 mb-2">Camera is deactivated</p>
                 <p className="text-sm text-zinc-500 mb-8 max-w-sm">Click the button below to grant camera access and start validating student registrations.</p>
                 <button onClick={() => setScanning(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]">
                    Start Scanner
                 </button>
              </div>
           ) : (
              <div className="flex flex-col items-center relative">
                 {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
                       <div className="bg-white p-4 rounded-full shadow-lg flex items-center gap-3">
                         <svg className="h-6 w-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         <span className="font-semibold text-zinc-700">Verifying Ticket...</span>
                       </div>
                    </div>
                 )}
                 <div id="reader" className="w-full max-w-sm mx-auto overflow-hidden rounded-3xl border-4 border-zinc-100 shadow-inner bg-zinc-900 relative"></div>
                 
                 <div className="mt-8 h-20 w-full max-w-md mx-auto">
                    {scanResult && (
                       <div className={`px-6 py-4 rounded-xl shadow-lg border font-semibold tracking-wide flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 ${scanResult.success ? 'bg-green-50 text-green-800 border-green-200/50' : 'bg-red-50 text-red-800 border-red-200/50'}`}>
                          <span className="text-2xl pt-0.5">{scanResult.success ? '✅' : '🚨'}</span>
                          <span className="text-left leading-snug">{scanResult.message}</span>
                       </div>
                    )}
                    {!scanResult && !loading && (
                      <p className="text-sm text-zinc-400 font-medium tracking-widest uppercase mt-4">Position QR code inside the frame</p>
                    )}
                 </div>

                 <button onClick={() => setScanning(false)} className="mt-8 text-sm font-bold tracking-widest uppercase text-zinc-400 hover:text-zinc-800 transition-colors">
                    Close Camera
                 </button>
              </div>
           )}
        </div>
      </div>
    </div>
  )
}
