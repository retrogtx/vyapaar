'use client'

import { useState, useEffect } from 'react'

export default function GettingStartedGuide() {
  const [checklist, setChecklist] = useState({
    upload: false,
    query: false,
    chat: false,
    stats: false,
    growth: false,
    abTest: false,
    campaigns: false,
    leads: false
  })

  useEffect(() => {
    const savedChecklist = localStorage.getItem('gettingStartedChecklist')
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('gettingStartedChecklist', JSON.stringify(checklist))
  }, [checklist])

  const handleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const allChecked = Object.values(checklist).every(value => value)

  if (allChecked) return null

  return (
    <div className="max-w-2xl mx-auto mb-8 p-4 bg-black rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Getting Started Guide</h2>
      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={checklist.upload}
            onChange={() => handleCheck('upload')}
            className="form-checkbox h-5 w-5 text-blue-600" 
          />
          <span>Upload your CSV file using the upload tool below</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={checklist.query}
            onChange={() => handleCheck('query')}
            className="form-checkbox h-5 w-5 text-blue-600" 
          />
          <span>Try querying your data using natural language</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={checklist.chat}
            onChange={() => handleCheck('chat')}
            className="form-checkbox h-5 w-5 text-blue-600" 
          />
          <span>Chat with AI about your data insights</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={checklist.stats}
            onChange={() => handleCheck('stats')}
            className="form-checkbox h-5 w-5 text-blue-600" 
          />
          <span>Go to the left sidebar and see your customer statistics, it&apos;s beautiful!</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={checklist.growth}
            onChange={() => handleCheck('growth')}
            className="form-checkbox h-5 w-5 text-blue-600" 
          />
          <span>See how AI thinks you can grow.</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={checklist.abTest}
            onChange={() => handleCheck('abTest')}
            className="form-checkbox h-5 w-5 text-blue-600" 
          />
          <span>See your A/B test results through polls on our special site.</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={checklist.campaigns}
            onChange={() => handleCheck('campaigns')}
            className="form-checkbox h-5 w-5 text-blue-600" 
          />
          <span>Create campaigns to craft convincing emails, to the right people.</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={checklist.leads}
            onChange={() => handleCheck('leads')}
            className="form-checkbox h-5 w-5 text-blue-600" 
          />
          <span>Generate Leads with our AI lead generator!</span>
        </label>
      </div>
    </div>
  )
}
