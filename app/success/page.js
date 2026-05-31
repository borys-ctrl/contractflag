'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const SEV = {
  RED:    { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', dot: '#EF4444', label: 'High Risk' },
  YELLOW: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', dot: '#F59E0B', label: 'Medium Risk' },
  GREEN:  { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0', dot: '#10B981', label: 'Low Risk' },
}

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
  const c = SEV[flag.severity] || SEV.YELLOW
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
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:'#92400E',marginBottom:4}}>⚠ WORST CASE</div>
            <div style={{fontSize:13,color:'#78350F',lineHeight:1.65}}>{flag.why_it_matters}</div>
          </div>
          <div style={{background:'#EFF6FF',borderRadius:8,padding:'10px 14px'}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:'#1D4ED8',marginBottom:4}}>✦ YOUR COUNTER-MOVE</div>
            <div style={{fontSize:13,color:'#1E40AF',lineHeight:1.65}}>{flag.counter_move}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [stage, setStage] = useState('analyzing')
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [progress, setProgress] = useState(0)
  const [tab, setTab] = useState('flags')

  useEffect(() => {
    if (!sessionId) { setErrorMsg('No payment session found.'); setStage('error'); return }
    const contractText = sessionStorage.getItem('cf_contract')
    if (!contractText) { setErrorMsg('Contract data not found. Please go back and try again.'); setStage('error'); return }
    runAnalysis(sessionId, contractText)
  }, [sessionId])

  const runAnalysis = async (sessionId, contractText) => {
    const tick = setInterval(() => setProgress(p => p < 85 ? p + Math.random() * 5 : p), 400)
    try {
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, contractText }),
      })
      const parsed = await res.json()
      clearInterval(tick)
      setProgress(100)
      if (parsed.error) { setErrorMsg(parsed.error); setStage('error'); return }
      sessionStorage.removeItem('cf_contract')
      setTimeout(() => { setResult(parsed); setStage('result') }, 300)
    } catch (e) {
      clearInterval(tick)
      setErrorMsg('Analysis failed. Please contact support.')
      setStage('error')
    }
  }

  const base = {fontFamily:'system-ui,sans-serif',padding:'24px 20px',maxWidth:640,margin:'0 auto'}

  const Header = () => (
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:28}}>
      <div style={{width:36,height:36,background:'#111827',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>⚑</div>
      <div>
        <div style={{fontFamily:'Georgia,serif',fontSize:20,color:'#111827',lineHeight:1}}>ContractFlag</div>
        <div style={{fontSize:11,color:'#9CA3AF',letterSpacing:'0.06em'}}>CONTRACT RISK INTELLIGENCE</div>
      </div>
    </div>
  )

  if (stage === 'analyzing') return (
    <div style={{...base,textAlign:'center'}}>
      <Header/>
      <div style={{padding:'40px 0'}}>
        <div style={{fontSize:42,marginBottom:20}}>⚑</div>
        <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#111827',marginBottom:6}}>Payment confirmed — analyzing your contract</div>
        <div style={{fontSize:13,color:'#9CA3AF',marginBottom:32}}>Scanning all 8 risk categories…</div>
        <div style={{background:'#F3F4F6',borderRadius:99,height:6,overflow:'hidden',maxWidth:320,margin:'0 auto'}}>
          <div style={{height:'100%',background:'#111827',borderRadius:99,width:`${progress}%`,transition:'width 0.4s ease'}}/>
        </div>
        <div style={{fontSize:12,color:'#9CA3AF',marginTop:10}}>{Math.round(progress)}%</div>
      </div>
    </div>
  )

  if (stage === 'error') return (
    <div style={{...base,textAlign:'center'}}>
      <Header/>
      <div style={{padding:'40px 0'}}>
        <div style={{fontSize:42,marginBottom:16}}>⚠</div>
        <div style={{fontFamily:'Georgia,serif',fontSize:20,color:'#111827',marginBottom:8}}>Something went wrong</div>
        <div style={{fontSize:13,color:'#6B7280',maxWidth:360,margin:'0 auto 12px'}}>{errorMsg}</div>
        <div style={{fontSize:12,color:'#9CA3AF',marginBottom:28}}>Your payment was captured. Email <strong>support@contractflag.com</strong> and we will refund you or fix it immediately.</div>
        <a href="/" style={{padding:'11px 28px',background:'#111827',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer',textDecoration:'none'}}>Try again</a>
      </div>
    </div>
  )

  const { summary, flags=[], clean_clauses=[], disclaimer } = result||{}
  const rc = RISK[summary?.overall_risk]||RISK.MEDIUM
  const reds = flags.filter(f=>f.severity==='RED')
  const yellows = flags.filter(f=>f.severity==='YELLOW')
  const greens = flags.filter(f=>f.severity==='GREEN')

  return (
    <div style={base}>
      <Header/>
      <div style={{background:'#111827',borderRadius:14,padding:'22px 24px',marginBottom:20,color:'#fff'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:20,flexWrap:'wrap'}}>
          <Gauge score={summary?.risk_score||0}/>
          <div style={{flex:1,minWidth:200}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',padding:'3px 10px',borderRadius:99,background:rc.bg,color:rc.text}}>{summary?.overall_risk} RISK</span>
              <span style={{fontSize:12,color:'#6B7280'}}>{summary?.flags_found} issue{summary?.flags_found!==1?'s':''} found</span>
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

      <div style={{display:'flex',gap:4,marginBottom:16,borderBottom:'1px solid #E5E7EB'}}>
        {[{id:'flags',label:`Risk Flags (${flags.length})`},{id:'clean',label:`Clean Clauses (${clean_clauses.length})`}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'8px 16px',border:'none',background:'transparent',fontSize:13,fontWeight:tab===t.id?600:400,color:tab===t.id?'#111827':'#9CA3AF',borderBottom:tab===t.id?'2px solid #111827':'2px solid transparent',cursor:'pointer',marginBottom:-1}}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==='flags' && (
        <div>
          {flags.length===0&&<div style={{textAlign:'center',color:'#9CA3AF',fontSize:13,padding:'32px 0'}}>No significant risk flags found.</div>}
          {flags.map((f,i)=><FlagCard key={i} flag={f} idx={i}/>)}
        </div>
      )}
      {tab==='clean' && (
        <div>
          {clean_clauses.map((c,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:10,marginBottom:8,background:'#F0FDF4',border:'1px solid #BBF7D0'}}>
              <span style={{fontSize:16}}>✓</span>
              <span style={{fontSize:13,color:'#065F46'}}>{c}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{marginTop:24,padding:'16px',borderRadius:10,background:'#F0FDF4',border:'1px solid #BBF7D0'}}>
        <div style={{fontSize:13,fontWeight:600,color:'#065F46',marginBottom:4}}>📩 Want this report sent to your email?</div>
        <div style={{fontSize:12,color:'#6B7280',marginBottom:10}}>Enter your email and we'll send you a copy to share with your team or lawyer.</div>
        <EmailCapture />
      </div>

      <div style={{marginTop:16,padding:'12px 14px',borderRadius:8,background:'#F9FAFB',border:'1px solid #E5E7EB'}}>
        <div style={{fontSize:11,color:'#9CA3AF',lineHeight:1.6}}>⚖ {disclaimer}</div>
      </div>
      <a href="/" style={{display:'block',width:'100%',marginTop:14,padding:'11px 0',border:'1px solid #E5E7EB',borderRadius:8,background:'#fff',color:'#6B7280',fontSize:13,fontWeight:500,cursor:'pointer',textAlign:'center',textDecoration:'none',boxSizing:'border-box'}}>
        ← Analyze another contract
      </a>
    </div>
  )
}

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  return sent ? (
    <div style={{fontSize:13,color:'#065F46',fontWeight:500}}>✓ Got it — we'll be in touch!</div>
  ) : (
    <div style={{display:'flex',gap:8}}>
      <input type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)}
        style={{flex:1,padding:'8px 12px',border:'1px solid #D1D5DB',borderRadius:6,fontSize:13,outline:'none'}}/>
      <button onClick={()=>{if(email.includes('@'))setSent(true)}}
        style={{padding:'8px 16px',background:'#111827',color:'#fff',border:'none',borderRadius:6,fontSize:13,fontWeight:600,cursor:'pointer'}}>
        Send
      </button>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{padding:40,textAlign:'center',fontFamily:'system-ui,sans-serif',color:'#9CA3AF'}}>Loading…</div>}>
      <SuccessContent />
    </Suspense>
  )
}
