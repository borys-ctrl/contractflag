'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

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

const SEV = {
  RED:    { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', dot: '#EF4444', label: 'High Risk' },
  YELLOW: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', dot: '#F59E0B', label: 'Medium Risk' },
  GREEN:  { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0', dot: '#10B981', label: 'Low Risk' },
}

const normalize = s => { if (!s) return "YELLOW"; const u = s.toUpperCase(); if (u === "RED" || u === "HIGH") return "RED"; if (u === "GREEN" || u === "LOW") return "GREEN"; return "YELLOW"; }

const RISK = {
  HIGH:   { bg: '#FEE2E2', text: '#991B1B' },
  MEDIUM: { bg: '#FEF3C7', text: '#92400E' },
  LOW:    { bg: '#D1FAE5', text: '#065F46' },
}

function Gauge({ score }) {
  const r = 52, cx = 64, cy = 64
  const half = Math.PI * r
  const filled = (score / 100) * half
  const color = score >= 70 ? '#EF4444' : score >= 40 ? '#F59E0B' : '#10B981'
  return (
    <svg width="128" height="80" viewBox="0 0 128 80">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#E5E7EB" strokeWidth="10" strokeLinecap="round"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${filled} ${half}`} style={{transition:'stroke-dasharray 1s ease'}}/>
      <text x={cx} y={cy-4} textAnchor="middle" fontSize="22" fontWeight="700" fill={color} fontFamily="Georgia,serif">{score}</text>
      <text x={cx} y={cy+14} textAnchor="middle" fontSize="10" fill="#6B7280" fontFamily="sans-serif" letterSpacing="0.08em">RISK SCORE</text>
    </svg>
  )
}

function FlagCard({ flag, idx }) {
  const [open, setOpen] = useState(false)
  const c = SEV[normalize(flag.severity)] || SEV.YELLOW
  return (
    <div style={{border:`1px solid ${open?c.border:'#E5E7EB'}`,borderRadius:12,marginBottom:10,background:open?c.bg:'#FAFAFA',transition:'all 0.2s',overflow:'hidden'}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'14px 16px',background:'transparent',border:'none',cursor:'pointer',textAlign:'left'}}>
        <span style={{width:24,height:24,borderRadius:'50%',background:c.dot,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{idx+1}</span>
        <span style={{flex:1,fontWeight:600,fontSize:14,color:'#111827'}}>{flag.category}</span>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:'0.07em',padding:'3px 9px',borderRadius:99,background:c.bg,color:c.text,border:`1px solid ${c.border}`}}>{c.label}</span>
        <span style={{fontSize:18,color:'#9CA3AF',marginLeft:4}}>{open?'−':'+'}</span>
      </button>
      {open && (
        <div style={{padding:'0 16px 16px',display:'flex',flexDirection:'column',gap:12}}>
          <div style={{background:'#F3F4F6',borderRadius:8,padding:'10px 14px',borderLeft:`3px solid ${c.dot}`}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:'#9CA3AF',marginBottom:4}}>CONTRACT LANGUAGE</div>
            <div style={{fontSize:12,color:'#374151',lineHeight:1.65,fontStyle:'italic'}}>"{flag.clause_excerpt}"</div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:'#9CA3AF',marginBottom:4}}>WHAT THIS MEANS</div>
            <div style={{fontSize:13,color:'#1F2937',lineHeight:1.65}}>{flag.plain_english}</div>
          </div>
          <div style={{background:'#FEF3C7',borderRadius:8,padding:'10px 14px'}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:'#92400E',marginBottom:4}}>WORST CASE</div>
            <div style={{fontSize:13,color:'#78350F',lineHeight:1.65}}>{flag.why_it_matters}</div>
          </div>
          <div style={{background:'#EFF6FF',borderRadius:8,padding:'10px 14px'}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:'#1D4ED8',marginBottom:4}}>YOUR COUNTER-MOVE</div>
            <div style={{fontSize:13,color:'#1E40AF',lineHeight:1.65}}>{flag.counter_move}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function LockedFlagCard({ flag, idx }) {
  const c = SEV.RED
  return (
    <div style={{border:`1px solid ${c.border}`,borderRadius:12,marginBottom:10,background:c.bg,overflow:'hidden',position:'relative'}}>
      {/* Blurred content */}
      <div style={{filter:'blur(6px)',userSelect:'none',pointerEvents:'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px'}}>
          <span style={{width:24,height:24,borderRadius:'50%',background:c.dot,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{idx+1}</span>
          <span style={{flex:1,fontWeight:600,fontSize:14,color:'#111827'}}>{flag.category}</span>
          <span style={{fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:99,background:c.bg,color:c.text,border:`1px solid ${c.border}`}}>{c.label}</span>
        </div>
        <div style={{padding:'0 16px 16px',display:'flex',flexDirection:'column',gap:10}}>
          <div style={{background:'#F3F4F6',borderRadius:8,padding:'10px 14px',height:60}}/>
          <div style={{background:'#fff',borderRadius:8,padding:'10px 14px',height:50}}/>
          <div style={{background:'#FEF3C7',borderRadius:8,padding:'10px 14px',height:44}}/>
        </div>
      </div>
      {/* Lock overlay */}
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{background:'rgba(255,255,255,0.92)',borderRadius:10,padding:'10px 18px',display:'flex',alignItems:'center',gap:8,boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
          <span style={{fontSize:16}}>🔒</span>
          <span style={{fontSize:13,fontWeight:600,color:'#991B1B'}}>Unlock to see this HIGH RISK clause</span>
        </div>
      </div>
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
    setStage('analyzing')
    setProgress(0)
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
      if (parsed.error) { const msg = typeof parsed.message === 'string' ? parsed.message : typeof parsed.error === 'string' ? parsed.error : 'Analysis failed. Please try again.'; setErrorMsg(msg); setStage('upload'); return }
      setTimeout(() => { setResult(parsed); setStage('preview') }, 300)
    } catch (e) {
      clearInterval(tick)
      setErrorMsg('Analysis failed. Please try again.')
      setStage('upload')
    }
  }

  const handlePay = async () => {
    if (paying) return
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
      setErrorMsg('Could not start checkout. Please try again.')
      setPaying(false)
    }
  }

  const reset = () => {
    setStage('upload'); setContractText(''); setFileName('')
    setResult(null); setErrorMsg(''); setProgress(0); setPaying(false)
  }

  const base = { fontFamily: 'system-ui,sans-serif', padding: '24px 20px', maxWidth: 640, margin: '0 auto' }

  const Header = () => (
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:28}}>
      <div style={{width:36,height:36,background:'#111827',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>⚑</div>
      <div>
        <div style={{fontFamily:'Georgia,serif',fontSize:20,color:'#111827',lineHeight:1}}>ContractFlag</div>
        <div style={{fontSize:11,color:'#9CA3AF',letterSpacing:'0.06em'}}>CONTRACT RISK INTELLIGENCE</div>
      </div>
    </div>
  )

  // ── UPLOAD ──────────────────────────────────────────────────
  if (stage === 'upload') return (
    <div style={base}>
      <Header/>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#111827',marginBottom:6}}>Find the hidden traps in your contract</div>
        <div style={{fontSize:13,color:'#6B7280',lineHeight:1.6}}>Upload any vendor, SaaS, or supplier contract. Get a free preview of your risks — then unlock the full report for $29.</div>
      </div>
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0])}}
        onClick={()=>fileRef.current.click()}
        style={{border:`2px dashed ${dragging?'#6366F1':'#D1D5DB'}`,borderRadius:14,padding:'28px 24px',textAlign:'center',cursor:'pointer',marginBottom:16,background:dragging?'#EEF2FF':'#F9FAFB',transition:'all 0.2s'}}
      >
        <div style={{fontSize:32,marginBottom:8}}>{pdfLoading?'⏳':'📄'}</div>
        <div style={{fontWeight:600,fontSize:14,color:'#111827',marginBottom:3}}>
          {pdfLoading?'Reading PDF…':fileName||'Drop your contract here'}
        </div>
        <div style={{fontSize:12,color:'#9CA3AF'}}>
          {pdfLoading?'Extracting text…':fileName?'File loaded — ready to analyze':'PDF or TXT — click to browse or drag and drop'}
        </div>
        <input ref={fileRef} type="file" accept=".txt,.pdf" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>
      </div>
      <div style={{textAlign:'center',color:'#9CA3AF',fontSize:12,margin:'0 0 10px'}}>— or paste contract text —</div>
      <textarea rows={7} placeholder="Paste the full contract text here..." value={contractText}
        onChange={e=>{setContractText(e.target.value);setFileName('');setErrorMsg('')}}
        style={{width:'100%',boxSizing:'border-box',border:'1px solid #E5E7EB',borderRadius:10,padding:'12px 14px',fontSize:13,color:'#374151',lineHeight:1.6,resize:'vertical',fontFamily:'inherit',background:'#FAFAFA',outline:'none'}}/>
      {errorMsg && <div style={{marginTop:8,fontSize:12,color:'#EF4444'}}>{errorMsg}</div>}
      <div style={{display:'flex',gap:10,marginTop:14}}>
        <button onClick={()=>{setContractText(SAMPLE_CONTRACT);setFileName('sample_saas_agreement.txt');setErrorMsg('')}}
          style={{flex:1,padding:'11px 0',border:'1px solid #E5E7EB',borderRadius:8,background:'#fff',color:'#6B7280',fontSize:13,fontWeight:500,cursor:'pointer'}}>
          Try sample
        </button>
        <button onClick={analyze} disabled={!contractText.trim()||pdfLoading}
          style={{flex:2,padding:'11px 0',border:'none',borderRadius:8,background:contractText.trim()&&!pdfLoading?'#111827':'#E5E7EB',color:contractText.trim()&&!pdfLoading?'#fff':'#9CA3AF',fontSize:14,fontWeight:600,cursor:contractText.trim()&&!pdfLoading?'pointer':'default',transition:'background 0.2s'}}>
          Analyze Contract — Free Preview →
        </button>
      </div>
      <div style={{marginTop:16,display:'flex',alignItems:'center',justifyContent:'center',gap:16,flexWrap:'wrap'}}>
        {['🔒 Your contract is never stored','📄 PDF & TXT supported','⚑ Free preview, unlock full report for $29'].map(t=>(
          <span key={t} style={{fontSize:11,color:'#9CA3AF'}}>{t}</span>
        ))}
      </div>
    </div>
  )

  // ── ANALYZING ───────────────────────────────────────────────
  if (stage === 'analyzing') return (
    <div style={{...base,textAlign:'center'}}>
      <Header/>
      <div style={{padding:'40px 0'}}>
        <div style={{fontSize:42,marginBottom:20}}>⚑</div>
        <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#111827',marginBottom:6}}>Reading your contract</div>
        <div style={{fontSize:13,color:'#9CA3AF',marginBottom:32}}>Scanning all 8 risk categories…</div>
        <div style={{background:'#F3F4F6',borderRadius:99,height:6,overflow:'hidden',maxWidth:320,margin:'0 auto'}}>
          <div style={{height:'100%',background:'#111827',borderRadius:99,width:`${progress}%`,transition:'width 0.4s ease'}}/>
        </div>
        <div style={{fontSize:12,color:'#9CA3AF',marginTop:10}}>{Math.round(progress)}%</div>
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
        <Header/>

        {/* Summary card */}
        <div style={{background:'#111827',borderRadius:14,padding:'22px 24px',marginBottom:20,color:'#fff'}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:20,flexWrap:'wrap'}}>
            <Gauge score={summary?.risk_score||0}/>
            <div style={{flex:1,minWidth:200}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',padding:'3px 10px',borderRadius:99,background:rc.bg,color:rc.text}}>{summary?.overall_risk} RISK</span>
                <span style={{fontSize:12,color:'#6B7280'}}>{flags.length} issues found</span>
              </div>
              <div style={{fontFamily:'Georgia,serif',fontSize:16,color:'#F9FAFB',lineHeight:1.5,marginBottom:12}}>{summary?.one_line}</div>
              <div style={{display:'flex',gap:12}}>
                {[{count:reds.length,label:'High',color:'#EF4444'},{count:yellows.length,label:'Med',color:'#F59E0B'},{count:greens.length,label:'Low',color:'#10B981'}].map(({count,label,color})=>(
                  <div key={label} style={{display:'flex',alignItems:'center',gap:5}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:color}}/>
                    <span style={{fontSize:12,color:'#9CA3AF'}}>{count} {label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Free flags (yellow + green) */}
        {freeFlags.length > 0 && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',color:'#6B7280',marginBottom:10,textTransform:'uppercase'}}>
              Free preview — {freeFlags.length} medium & low risk issue{freeFlags.length!==1?'s':''}
            </div>
            {freeFlags.map((f,i) => <FlagCard key={i} flag={f} idx={i}/>)}
          </div>
        )}

        {/* Locked red flags */}
        {redFlags.length > 0 && (
          <div style={{marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',color:'#991B1B',marginBottom:10,textTransform:'uppercase'}}>
              🔒 {redFlags.length} high risk clause{redFlags.length!==1?'s':''} — locked
            </div>
            {redFlags.map((f,i) => <LockedFlagCard key={i} flag={f} idx={freeFlags.length+i}/>)}
          </div>
        )}

        {/* Paywall CTA */}
        <div style={{background:'#111827',borderRadius:14,padding:'20px 24px',marginTop:8,marginBottom:16}}>
          <div style={{fontFamily:'Georgia,serif',fontSize:17,color:'#fff',marginBottom:6}}>
            Unlock {redFlags.length} high-risk clause{redFlags.length!==1?'s':''} — $29
          </div>
          <div style={{fontSize:13,color:'#9CA3AF',marginBottom:16,lineHeight:1.6}}>
            See exactly what each red flag says, what it means in plain English, the worst-case outcome, and your negotiation counter-move.
          </div>
          <button onClick={handlePay} disabled={paying}
            style={{width:'100%',padding:'13px 0',border:'none',borderRadius:8,background:paying?'#374151':'#EF4444',color:'#fff',fontSize:15,fontWeight:700,cursor:paying?'default':'pointer',transition:'background 0.2s'}}>
            {paying ? 'Redirecting to payment…' : `Unlock Full Report — $29 →`}
          </button>
          <div style={{fontSize:11,color:'#6B7280',marginTop:10,textAlign:'center'}}>
            Secure checkout via Stripe · One-time payment · Instant access
          </div>
        </div>

        {/* Clean clauses */}
        {clean_clauses.length > 0 && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',color:'#6B7280',marginBottom:10,textTransform:'uppercase'}}>Clean clauses ({clean_clauses.length})</div>
            {clean_clauses.map((c,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:10,marginBottom:6,background:'#F0FDF4',border:'1px solid #BBF7D0'}}>
                <span>✓</span>
                <span style={{fontSize:13,color:'#065F46'}}>{c}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{padding:'12px 14px',borderRadius:8,background:'#F9FAFB',border:'1px solid #E5E7EB',marginBottom:14}}>
          <div style={{fontSize:11,color:'#9CA3AF',lineHeight:1.6}}>⚖ {disclaimer}</div>
        </div>
        <button onClick={reset} style={{width:'100%',padding:'11px 0',border:'1px solid #E5E7EB',borderRadius:8,background:'#fff',color:'#6B7280',fontSize:13,fontWeight:500,cursor:'pointer'}}>
          ← Analyze another contract
        </button>
      </div>
    )
  }

  return null
}
