'use client'

export default function ExportButton() {
  const handleExport = () => {
    const rows = Array.from(document.querySelectorAll('table tr')).map(row => 
      Array.from(row.querySelectorAll('th,td')).map(cell => cell.textContent?.replace(/,/g, '')).join(',')
    ).join('\n')
    
    const blob = new Blob([rows], {type: 'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'participants_report.csv'
    a.click()
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
    >
      <span>📥</span> Export CSV
    </button>
  )
}
