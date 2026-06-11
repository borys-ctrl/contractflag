'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

const track = (event, params) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, params || {})
    }
  } catch (e) {}
}

const reportError = (error, context) => {
  try {
    fetch('/api/report-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: String(error), context, userAgent: navigator.userAgent }),
    }).catch(() => {})
  } catch (e) {}
}

const SAMPLE_CONTRACT = `SOFTWARE AS A SERVICE AGREEMENT

This Software as a Service Agreement ("Agreement") is entered into as of the date of acceptance between Acme Software Inc. ("Provider") and the subscribing entity ("Customer").

1. SUBSCRIPTION TERM AND RENEWAL
The initial Subscription Term is one (1) year. This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the then-current term. Provider reserves the right to increase subscription fees at each renewal by up to 20% with thirty (30) days notice.

2. FEES AND PAYMENT
Customer shall pay all fees within fifteen (15) days of invoice. Late payments shall accrue interest at the rate of two percent (2%) per month. Provider may suspend Customer's access to the Platform immediately upon non-payment without liability to Customer.

3. LIMITATION OF LIABILITY
IN NO EVENT SHALL PROVIDER'S TOTAL LIABILITY EXCEED THE FEES PAID BY CUSTOMER IN THE ONE (1) MONTH IMMEDIATELY PRECEDING THE CLAIM. PROVIDER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.

4. INDEMNIFICATION
Customer shall indemnify, defend, and hold harmless Provider and its officers, directors, employees, and agents from any claims, damages, or expenses (including reasonable attorney fees) arising out of Customer's use of the Platform.

5. INTELLECTUAL PROPERTY
Provider is hereby granted a perpetual, irrevocable, royalty-free, worldwide license to use, reproduce, modify, and distribute Customer Data and any outputs generated through use of the Platform for improving Provider's services. Customer agrees that any feedback provided to Provider becomes the exclusive property of Provider.

6. CHANGES TO TERMS
Provider reserves the right to modify this Agreement at any time by posting updated terms on Provider's website. Continued use of the Platform after such posting constitutes acceptance of the modified terms.

7. TERMINATION
Provider may terminate this Agreement immediately upon written notice if Customer breaches any provision. Customer may terminate this Agreement with ninety (90) days written notice. Upon termination, Customer Data will be permanently deleted within 7 days with no right of retrieval.

8. NON-SOLICITATION
During the term and for two (2) years thereafter, Customer shall not solicit, recruit, or hire any employee or contractor of Provider who was involved in providing services under this Agreement.

9. DISPUTE RESOLUTION
Any dispute shall be resolved by binding arbitration in San Francisco, California. THE PARTIES WAIVE ALL RIGHTS TO A JURY TRIAL. The prevailing party shall recover its reasonable attorney fees from the non-prevailing party.`

const SAMPLE_RESULT = {
  summary: { overall_risk: "HIGH", risk_score: 92, one_line: "Multiple severe one-sided provisions: auto-renewal with 20% fee hikes, vendor owns your data perpetually, asymmetric termination, and binding arbitration with fee shifting.", flags_found: 8 },
  flags: [
    { rank: 1, category: "IP OWNERSHIP & DATA RIGHTS", severity: "RED", clause_excerpt: "Provider is hereby granted a perpetual, irrevocable, royalty-free, worldwide license to use, reproduce, modify, and distribute Customer Data and any outputs generated through use of the Platform", plain_english: "The vendor gets to keep and use everything you upload — forever — even after you cancel. This includes any data, files, or outputs you create on their platform.", why_it_matters: "Your proprietary business data could be used by the vendor (or sold) with no time limit and no way to revoke it.", counter_move: "Demand this be changed to a limited license that ends when the contract ends, and applies only to anonymized data." },
    { rank: 2, category: "LIABILITY CAPS & INDEMNIFICATION", severity: "RED", clause_excerpt: "IN NO EVENT SHALL PROVIDER'S TOTAL LIABILITY EXCEED THE FEES PAID BY CUSTOMER IN THE ONE (1) MONTH IMMEDIATELY PRECEDING THE CLAIM", plain_english: "If the vendor causes you serious damage, the most they will ever owe you is one month of fees. You also have to defend them if a third party sues over your use of the platform.", why_it_matters: "A data breach costing you $100,000 would entitle you to recover only one month of fees.", counter_move: "Push for a liability cap of at least 12 months of fees, and make indemnification mutual." },
    { rank: 3, category: "AUTO-RENEWAL TRAPS", severity: "RED", clause_excerpt: "This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the then-current term", plain_english: "The contract renews itself for another full year unless you cancel 90 days before it ends. Miss that window and you are locked in for another 12 months.", why_it_matters: "You could be trapped paying for a service you no longer want for up to a year.", counter_move: "Negotiate the cancellation notice down to 30 days and ask for an email reminder before renewal." },
    { rank: 4, category: "TERMINATION ASYMMETRY", severity: "RED", clause_excerpt: "Provider may terminate this Agreement immediately upon written notice if Customer breaches any provision. Customer may terminate this Agreement with ninety (90) days written notice.", plain_english: "The vendor can cut you off instantly. You have to give 90 days notice. And when it ends, your data is deleted in 7 days with no way to get it back.", why_it_matters: "You could lose access and all your data with almost no warning, while being locked into a long exit process yourself.", counter_move: "Make termination rights symmetric and require a 30-day data export window after termination." },
    { rank: 5, category: "PAYMENT TERMS & LATE FEES", severity: "RED", clause_excerpt: "Late payments shall accrue interest at the rate of two percent (2%) per month. Provider may suspend Customer's access to the Platform immediately upon non-payment without liability to Customer.", plain_english: "Pay late and you are charged 2% per month (24% per year). The vendor can also shut off your access immediately with no grace period.", why_it_matters: "A single missed invoice could cut off your business operations and pile on heavy interest.", counter_move: "Ask for a 10-day cure period before suspension and cap late fees at 1% per month." },
    { rank: 6, category: "UNILATERAL CHANGE RIGHTS", severity: "RED", clause_excerpt: "Provider reserves the right to modify this Agreement at any time by posting updated terms on Provider's website. Continued use of the Platform after such posting constitutes acceptance", plain_english: "The vendor can change the contract whenever they want just by updating their website. You automatically agree just by continuing to use the service.", why_it_matters: "Terms you agreed to could change overnight — including price — without you ever being notified directly.", counter_move: "Require 30 days direct written notice for any material change, with the right to terminate if you disagree." },
    { rank: 7, category: "NON-SOLICITATION & NON-COMPETE", severity: "YELLOW", clause_excerpt: "During the term and for two (2) years thereafter, Customer shall not solicit, recruit, or hire any employee or contractor of Provider", plain_english: "For two years after the contract ends, you cannot hire anyone who worked for the vendor on your account.", why_it_matters: "If a great contractor worked on your project, you are barred from hiring them for two years.", counter_move: "Shorten to 12 months and limit it to employees directly involved in your account." },
    { rank: 8, category: "DISPUTE RESOLUTION & GOVERNING LAW", severity: "YELLOW", clause_excerpt: "Any dispute shall be resolved by binding arbitration in San Francisco, California. THE PARTIES WAIVE ALL RIGHTS TO A JURY TRIAL. The prevailing party shall recover its reasonable attorney fees", plain_english: "You cannot sue in court or have a jury. All disputes go to arbitration in San Francisco, and if you lose you pay the vendor's legal fees too.", why_it_matters: "Challenging the vendor means traveling to California and risking paying their lawyers on top of your own.", counter_move: "Ask for arbitration in your home state and remove the one-sided fee-shifting clause." }
  ],
  clean_clauses: [],
  disclaimer: "ContractFlag provides risk intelligence, not legal advice. Have a qualified attorney review any contract before signing."
}

const SEV = {
  RED:    { bg: '#FDF3F2', text: '#B42318', border: '#F5DDDA', dot: '#DC2626', label: 'High Risk' },
  YELLOW: { bg: '#FDF8EC', text: '#92400E', border: '#F2E5C2', dot: '#D97706', label: 'Medium Risk' },
  GREEN:  { bg: '#F1FAF4', text: '#065F46', border: '#D3EEDD', dot: '#10B981', label: 'Low Risk' },
}

const normalize = s => { if (!s) return "YELLOW"; const u = s.toUpperCase(); if (u === "RED" || u === "HIGH") return "RED"; if (u === "GREEN" || u === "LOW") return "GREEN"; return "YELLOW"; }

const RISK = {
  HIGH:   { bg: '#FDF3F2', text: '#B42318' },
  MEDIUM: { bg: '#FDF8EC', text: '#92400E' },
  LOW:    { bg: '#F1FAF4', text: '#065F46' },
}

const ink = '#16140F'
const sub = '#5C5A54'
const faint = '#8A877F'
const gold = '#E5C97E'
const goldDark = '#9A7B2D'
const line = '#ECEAE4'
const cream = '#FBFAF7'
const serif = "'DM Serif Display',Georgia,serif"
const sans = "'DM Sans',system-ui,sans-serif"
const mono = "'DM Mono',monospace"

function Gauge({ score }) {
  const r = 52, cx = 64, cy = 64
  const half = Math.PI * r
  const filled = (score / 100) * half
  const color = score >= 70 ? '#EF4444' : score >= 40 ? '#F59E0B' : '#10B981'
  return (
    <svg width="128" height="80" viewBox="0 0 128 80">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="10" strokeLinecap="round"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${filled} ${half}`} style={{transition:'stroke-dasharray 1s ease'}}/>
      <text x={cx} y={cy-4} textAnchor="middle" fontSize="22" fontWeight="700" fill={color} fontFamily={serif}>{score}</text>
      <text x={cx} y={cy+14} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily={sans} letterSpacing="0.08em">RISK SCORE</text>
    </svg>
  )
}

function FlagCard({ flag, idx }) {
  const [open, setOpen] = useState(false)
  const c = SEV[normalize(flag.severity)] || SEV.YELLOW
  return (
    <div style={{border:`1px solid ${open?c.border:line}`,borderRadius:14,marginBottom:12,background:open?c.bg:cream,transition:'all 0.2s',overflow:'hidden'}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'16px 18px',background:'transparent',border:'none',cursor:'pointer',textAlign:'left',fontFamily:sans}}>
        <span style={{width:26,height:26,borderRadius:'50%',background:c.dot,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{idx+1}</span>
        <span style={{flex:1,fontWeight:600,fontSize:14.5,color:ink}}>{flag.category}</span>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:'0.07em',padding:'4px 10px',borderRadius:99,background:c.bg,color:c.text,border:`1px solid ${c.border}`}}>{c.label}</span>
        <span style={{fontSize:18,color:faint,marginLeft:4}}>{open?'−':'+'}</span>
      </button>
      {open && (
        <div style={{padding:'0 18px 18px',display:'flex',flexDirection:'column',gap:12}}>
          <div style={{background:'#fff',borderRadius:10,padding:'12px 16px',borderLeft:`3px solid ${c.dot}`,border:`1px solid ${line}`}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:faint,marginBottom:5,fontFamily:mono}}>CONTRACT LANGUAGE</div>
            <div style={{fontSize:13,color:sub,lineHeight:1.7,fontStyle:'italic'}}>"{flag.clause_excerpt}"</div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:faint,marginBottom:5,fontFamily:mono}}>WHAT THIS MEANS</div>
            <div style={{fontSize:14,color:ink,lineHeight:1.7}}>{flag.plain_english}</div>
          </div>
          <div style={{background:'#FDF8EC',borderRadius:10,padding:'12px 16px',border:'1px solid #F2E5C2'}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:'#92400E',marginBottom:5,fontFamily:mono}}>WORST CASE</div>
            <div style={{fontSize:13.5,color:'#78350F',lineHeight:1.7}}>{flag.why_it_matters}</div>
          </div>
          <div style={{background:'#F4F8FD',borderRadius:10,padding:'12px 16px',border:'1px solid #DCE8F7'}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:'#1D4ED8',marginBottom:5,fontFamily:mono}}>YOUR COUNTER-MOVE</div>
            <div style={{fontSize:13.5,color:'#1E40AF',lineHeight:1.7}}>{flag.counter_move}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function LockedFlagCard({ flag, idx }) {
  const c = SEV.RED
  return (
    <div style={{border:`1px solid ${c.border}`,borderRadius:14,marginBottom:12,background:c.bg,overflow:'hidden',position:'relative'}}>
      <div style={{filter:'blur(6px)',userSelect:'none',pointerEvents:'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'16px 18px'}}>
          <span style={{width:26,height:26,borderRadius:'50%',background:c.dot,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{idx+1}</span>
          <span style={{flex:1,fontWeight:600,fontSize:14.5,color:ink}}>{flag.category}</span>
          <span style={{fontSize:10,fontWeight:700,padding:'4px 10px',borderRadius:99,background:c.bg,color:c.text,border:`1px solid ${c.border}`}}>{c.label}</span>
        </div>
        <div style={{padding:'0 18px 18px',display:'flex',flexDirection:'column',gap:10}}>
          <div style={{background:'#fff',borderRadius:10,padding:'12px 16px',height:60}}/>
          <div style={{background:'#fff',borderRadius:10,padding:'12px 16px',height:50}}/>
          <div style={{background:'#FDF8EC',borderRadius:10,padding:'12px 16px',height:44}}/>
        </div>
      </div>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{background:'rgba(255,255,255,0.94)',borderRadius:12,padding:'12px 20px',display:'flex',alignItems:'center',gap:9,boxShadow:'0 4px 18px rgba(22,20,15,0.1)',border:`1px solid ${line}`}}>
          <span style={{fontSize:16}}>🔒</span>
          <span style={{fontSize:13,fontWeight:600,color:'#B42318'}}>Unlock to see this HIGH RISK clause</span>
        </div>
      </div>
    </div>
  )
}

function EmailUnlockBox({ result, onUnlock }) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState('')

  const validEmail = (e) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return false
    const [local, domain] = e.split('@')
    const tld = domain.split('.').pop()
    if (!/^[a-zA-Z]{2,}$/.test(tld)) return false
    if (/^\d+$/.test(local) && /^\d+$/.test(domain.split('.')[0])) return false
    if (/^(.)\1+$/.test(local) && /^(.)\1+$/.test(domain.split('.')[0])) return false
    return true
  }

  const send = async () => {
    setErr('')
    if (!validEmail(email)) { setErr('Please enter a valid email address.'); return }
    if (sending) return
    setSending(true)
    try {
      fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, riskScore: result?.summary?.risk_score, overallRisk: result?.summary?.overall_risk }),
      }).catch(() => {})
    } catch (e) {}
    setTimeout(() => onUnlock(), 400)
  }

  return (
    <div style={{background:'#FBF6E9',border:'1px solid #F2E5C2',borderRadius:14,padding:'18px 20px',marginBottom:14}}>
      <div style={{fontSize:14.5,fontWeight:600,color:'#7A5C16',marginBottom:5}}>👀 See your #1 highest-risk clause — free</div>
      <div style={{fontSize:12.5,color:'#7A5C16',opacity:0.85,marginBottom:14,lineHeight:1.6}}>Enter your email and we'll unlock the most dangerous clause in your contract right now — no payment needed. We'll send a confirmation to make sure it's really you.</div>
      <div style={{display:'flex',gap:8}}>
        <input type="email" placeholder="you@company.com" value={email} onChange={e=>{setEmail(e.target.value);setErr('')}}
          style={{flex:1,padding:'11px 14px',border:`1px solid ${err?'#DC2626':'#E2D5AC'}`,borderRadius:8,fontSize:13,outline:'none',background:'#fff',fontFamily:sans}}/>
        <button onClick={send} disabled={sending}
          style={{padding:'11px 20px',background:sending?'#7A5C16':ink,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:sending?'default':'pointer',whiteSpace:'nowrap',fontFamily:sans}}>
          {sending ? 'Unlocking…' : 'Unlock clause #1'}
        </button>
      </div>
      {err && <div style={{fontSize:12,color:'#DC2626',marginTop:6}}>{err}</div>}
    </div>
  )
}

export default function ContractFlag() {
  const [stage, setStage] = useState('upload') // upload | analyzing | preview | paying
  const [contractText, setContractText] = useState('')
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [paying, setPaying] = useState(false)
  const [isSample, setIsSample] = useState(false)
  const [emailUnlocked, setEmailUnlocked] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
    }
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (stage === 'preview' && result) {
      track('paywall_view', { risk_score: result?.summary?.risk_score })
    }
  }, [stage, result])

  const extractPdfText = async (file) => {
    setPdfLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        fullText += content.items.map(item => item.str).join(' ') + '\n'
      }
      setPdfLoading(false)
      return fullText
    } catch (e) {
      setPdfLoading(false)
      throw new Error('Could not read PDF. Try pasting the text instead.')
    }
  }

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setFileName(file.name)
    setErrorMsg('')
    setIsSample(false)
    if (file.name.toLowerCase().endsWith('.pdf')) {
      try { setContractText(await extractPdfText(file)) }
      catch (e) { setErrorMsg(e.message) }
    } else {
      const reader = new FileReader()
      reader.onload = e => setContractText(e.target.result)
      reader.readAsText(file)
    }
  }, [])

  const analyze = async () => {
    if (!contractText.trim()) return
    track(isSample ? 'sample_analyze' : 'analyze_start')
    setStage('analyzing')
    setProgress(0)
    if (isSample) {
      let p = 0
      const t = setInterval(() => { p += 20; setProgress(Math.min(p, 100)); if (p >= 100) { clearInterval(t); setTimeout(() => { setResult(SAMPLE_RESULT); setStage('preview') }, 200) } }, 150)
      return
    }
    const tick = setInterval(() => setProgress(p => p < 85 ? p + Math.random() * 5 : p), 400)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText }),
      })
      const parsed = await res.json()
      clearInterval(tick)
      setProgress(100)
      if (parsed.error) { const msg = typeof parsed.message === 'string' ? parsed.message : typeof parsed.error === 'string' ? parsed.error : 'Analysis failed. Please try again.'; reportError(msg, 'analyze-api-error'); setErrorMsg(msg); setStage('upload'); return }
      setTimeout(() => { setResult(parsed); setStage('preview') }, 300)
    } catch (e) {
      clearInterval(tick)
      reportError(e.message || 'unknown', 'analyze-catch')
      setErrorMsg('Analysis failed. Please try again.')
      setStage('upload')
    }
  }

  const handlePay = async () => {
    if (paying) return
    track('checkout_click', { unlocked_one: emailUnlocked })
    setPaying(true)
    try {
      sessionStorage.setItem('cf_contract', contractText)
      if (result) sessionStorage.setItem('cf_result', JSON.stringify(result))
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText }),
      })
      const data = await res.json()
      if (data.error) { setErrorMsg(data.error); setPaying(false); return }
      window.location.href = data.url
    } catch (e) {
      reportError(e.message || 'unknown', 'checkout')
      setErrorMsg('Could not start checkout. Please try again.')
      setPaying(false)
    }
  }

  const reset = () => {
    setStage('upload'); setContractText(''); setFileName('')
    setResult(null); setErrorMsg(''); setProgress(0); setPaying(false); setEmailUnlocked(false); setIsSample(false)
  }

  const base = { fontFamily: sans, padding: '32px 20px 64px', maxWidth: 680, margin: '0 auto', color: ink }

  const Fonts = () => (
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
  )

  const Header = () => (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:36}}>
      <a href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',color:ink}}>
        <div style={{width:34,height:34,background:gold,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:ink}}>⚑</div>
        <div>
          <div style={{fontFamily:serif,fontSize:20,color:ink,lineHeight:1}}>ContractFlag</div>
          <div style={{fontSize:10,color:goldDark,letterSpacing:'0.1em',fontFamily:mono,marginTop:3}}>CONTRACT RISK INTELLIGENCE</div>
        </div>
      </a>
      <a href="/" style={{fontSize:13,color:sub,textDecoration:'none',fontWeight:500}}>← Home</a>
    </div>
  )

  // ── UPLOAD ──────────────────────────────────────────────────
  if (stage === 'upload') return (
    <div style={base}>
      <Fonts/>
      <Header/>
      <div style={{marginBottom:26}}>
        <div style={{fontFamily:serif,fontSize:30,color:ink,marginBottom:10,lineHeight:1.2}}>Find the hidden traps in your contract</div>
        <div style={{fontSize:15,color:sub,lineHeight:1.7}}>Upload any vendor, SaaS, or supplier contract. Get a free preview of your risks — then unlock the full report for $29.</div>
      </div>
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0])}}
        onClick={()=>fileRef.current.click()}
        style={{border:`2px dashed ${dragging?goldDark:'#D9D6CE'}`,borderRadius:16,padding:'36px 26px',textAlign:'center',cursor:'pointer',marginBottom:18,background:dragging?'#FBF6E9':cream,transition:'all 0.2s'}}
      >
        <div style={{fontSize:34,marginBottom:10}}>{pdfLoading?'⏳':'📄'}</div>
        <div style={{fontWeight:600,fontSize:15,color:ink,marginBottom:4}}>
          {pdfLoading?'Reading PDF…':fileName||'Drop your contract here'}
        </div>
        <div style={{fontSize:13,color:faint}}>
          {pdfLoading?'Extracting text…':fileName?'File loaded — ready to analyze':'PDF or TXT — click to browse or drag and drop'}
        </div>
        <input ref={fileRef} type="file" accept=".txt,.pdf" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>
      </div>
      <div style={{textAlign:'center',color:faint,fontSize:12,margin:'0 0 12px',fontFamily:mono,letterSpacing:'0.05em'}}>— OR PASTE CONTRACT TEXT —</div>
      <textarea rows={7} placeholder="Paste the full contract text here..." value={contractText}
        onChange={e=>{setContractText(e.target.value);setFileName('');setErrorMsg('');setIsSample(false)}}
        style={{width:'100%',boxSizing:'border-box',border:`1px solid ${line}`,borderRadius:12,padding:'14px 16px',fontSize:13.5,color:sub,lineHeight:1.65,resize:'vertical',fontFamily:sans,background:cream,outline:'none'}}/>
      {errorMsg && <div style={{marginTop:8,fontSize:12.5,color:'#DC2626'}}>{errorMsg}</div>}
      <div style={{display:'flex',gap:12,marginTop:16}}>
        <button onClick={()=>{setContractText(SAMPLE_CONTRACT);setFileName('sample_saas_agreement.txt');setErrorMsg('');setIsSample(true)}}
          style={{flex:1,padding:'13px 0',border:`1px solid ${line}`,borderRadius:10,background:'#fff',color:sub,fontSize:13.5,fontWeight:500,cursor:'pointer',fontFamily:sans}}>
          Try sample
        </button>
        <button onClick={analyze} disabled={!contractText.trim()||pdfLoading}
          style={{flex:2,padding:'13px 0',border:'none',borderRadius:10,background:contractText.trim()&&!pdfLoading?ink:line,color:contractText.trim()&&!pdfLoading?'#fff':faint,fontSize:14.5,fontWeight:600,cursor:contractText.trim()&&!pdfLoading?'pointer':'default',transition:'background 0.2s',fontFamily:sans}}>
          Analyze Contract — Free Preview →
        </button>
      </div>
      <div style={{marginTop:20,display:'flex',alignItems:'center',justifyContent:'center',gap:18,flexWrap:'wrap'}}>
        {['🔒 Your contract is never stored','📄 PDF & TXT supported','⚑ Free preview, unlock full report for $29'].map(t=>(
          <span key={t} style={{fontSize:11.5,color:faint}}>{t}</span>
        ))}
      </div>
    </div>
  )

  // ── ANALYZING ───────────────────────────────────────────────
  if (stage === 'analyzing') return (
    <div style={{...base,textAlign:'center'}}>
      <Fonts/>
      <Header/>
      <div style={{padding:'48px 0'}}>
        <div style={{fontSize:44,marginBottom:22}}>⚑</div>
        <div style={{fontFamily:serif,fontSize:26,color:ink,marginBottom:8}}>Reading your contract</div>
        <div style={{fontSize:14,color:faint,marginBottom:36}}>Scanning all 8 risk categories…</div>
        <div style={{background:line,borderRadius:99,height:6,overflow:'hidden',maxWidth:320,margin:'0 auto'}}>
          <div style={{height:'100%',background:ink,borderRadius:99,width:`${progress}%`,transition:'width 0.4s ease'}}/>
        </div>
        <div style={{fontSize:12.5,color:faint,marginTop:12,fontFamily:mono}}>{Math.round(progress)}%</div>
      </div>
    </div>
  )

  // ── PREVIEW (free results + locked red flags) ────────────────
  if (stage === 'preview' && result) {
    const { summary, flags=[], clean_clauses=[], disclaimer } = result
    const rc = RISK[summary?.overall_risk] || RISK.MEDIUM
    const redFlags = flags.filter(f => normalize(f.severity) === "RED")
    const freeFlags = flags.filter(f => normalize(f.severity) !== "RED")
    const reds = flags.filter(f=>normalize(f.severity)==="RED")
    const yellows = flags.filter(f=>normalize(f.severity)==="YELLOW")
    const greens = flags.filter(f=>normalize(f.severity)==="GREEN")

    return (
      <div style={base}>
        <Fonts/>
        <Header/>

        {/* Summary card */}
        <div style={{background:ink,borderRadius:16,padding:'26px 28px',marginBottom:24,color:'#fff'}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:22,flexWrap:'wrap'}}>
            <Gauge score={summary?.risk_score||0}/>
            <div style={{flex:1,minWidth:200}}>
              <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:10}}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',padding:'4px 11px',borderRadius:99,background:rc.bg,color:rc.text}}>{summary?.overall_risk} RISK</span>
                <span style={{fontSize:12.5,color:'rgba(255,255,255,0.55)'}}>{flags.length} issues found</span>
              </div>
              <div style={{fontFamily:serif,fontSize:17,color:'#F9FAFB',lineHeight:1.55,marginBottom:14}}>{summary?.one_line}</div>
              <div style={{display:'flex',gap:14}}>
                {[{count:reds.length,label:'High',color:'#EF4444'},{count:yellows.length,label:'Med',color:'#F59E0B'},{count:greens.length,label:'Low',color:'#10B981'}].map(({count,label,color})=>(
                  <div key={label} style={{display:'flex',alignItems:'center',gap:6}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:color}}/>
                    <span style={{fontSize:12.5,color:'rgba(255,255,255,0.6)'}}>{count} {label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Free flags (yellow + green) */}
        {freeFlags.length > 0 && (
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',color:sub,marginBottom:12,textTransform:'uppercase',fontFamily:mono}}>
              Free preview — {freeFlags.length} medium & low risk issue{freeFlags.length!==1?'s':''}
            </div>
            {freeFlags.map((f,i) => <FlagCard key={i} flag={f} idx={i}/>)}
          </div>
        )}

        {/* Locked red flags */}
        {redFlags.length > 0 && (
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',color:'#B42318',marginBottom:12,textTransform:'uppercase',fontFamily:mono}}>
              🔒 {redFlags.length} high risk clause{redFlags.length!==1?'s':''} — {emailUnlocked ? '1 unlocked' : 'locked'}
            </div>
            {!emailUnlocked && (
              <EmailUnlockBox result={result} onUnlock={() => { track('email_unlock'); setEmailUnlocked(true) }} />
            )}
            {emailUnlocked
              ? <FlagCard flag={redFlags[0]} idx={freeFlags.length} />
              : <LockedFlagCard flag={redFlags[0]} idx={freeFlags.length} />}
            {redFlags.slice(1).map((f,i) => <LockedFlagCard key={i} flag={f} idx={freeFlags.length+1+i}/>)}
          </div>
        )}

        {/* Paywall CTA */}
        <div style={{background:ink,borderRadius:16,padding:'24px 28px',marginTop:10,marginBottom:20}}>
          <div style={{fontFamily:serif,fontSize:19,color:'#fff',marginBottom:8}}>
            {emailUnlocked
              ? `Unlock the remaining ${redFlags.length - 1} high-risk clause${redFlags.length-1!==1?'s':''} — $29`
              : `Unlock all ${redFlags.length} high-risk clause${redFlags.length!==1?'s':''} — $29`}
          </div>
          <div style={{fontSize:13.5,color:'rgba(255,255,255,0.6)',marginBottom:18,lineHeight:1.65}}>
            See exactly what each red flag says, what it means in plain English, the worst-case outcome, and your negotiation counter-move.
          </div>
          <button onClick={handlePay} disabled={paying}
            style={{width:'100%',padding:'15px 0',border:'none',borderRadius:10,background:paying?'#4A463C':gold,color:ink,fontSize:15.5,fontWeight:700,cursor:paying?'default':'pointer',transition:'background 0.2s',fontFamily:sans}}>
            {paying ? 'Redirecting to payment…' : `Unlock Full Report — $29 →`}
          </button>
          <div style={{fontSize:11.5,color:'rgba(255,255,255,0.45)',marginTop:12,textAlign:'center'}}>
            Secure checkout via Stripe · One-time payment · Instant access
          </div>
        </div>

        {/* Clean clauses */}
        {clean_clauses.length > 0 && (
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',color:sub,marginBottom:12,textTransform:'uppercase',fontFamily:mono}}>Clean clauses ({clean_clauses.length})</div>
            {clean_clauses.map((c,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:12,marginBottom:8,background:'#F1FAF4',border:'1px solid #D3EEDD'}}>
                <span>✓</span>
                <span style={{fontSize:13.5,color:'#065F46'}}>{c}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{padding:'14px 16px',borderRadius:10,background:cream,border:`1px solid ${line}`,marginBottom:16}}>
          <div style={{fontSize:12,color:faint,lineHeight:1.65}}>⚖ {disclaimer}</div>
        </div>
        <button onClick={reset} style={{width:'100%',padding:'13px 0',border:`1px solid ${line}`,borderRadius:10,background:'#fff',color:sub,fontSize:13.5,fontWeight:500,cursor:'pointer',fontFamily:sans}}>
          ← Analyze another contract
        </button>
      </div>
    )
  }

  return null
}
