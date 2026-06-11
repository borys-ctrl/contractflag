'use client'
import { useState, useEffect, useRef } from 'react'

export default function Landing() {
  const [scrollY, setScrollY] = useState(0)
  const [visible, setVisible] = useState({})
  const refs = useRef({})

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.dataset.id]: true }))
      }),
      { threshold: 0.12 }
    )
    Object.values(refs.current).forEach(r => r && observer.observe(r))
    return () => observer.disconnect()
  }, [])

  const ref = (id) => el => { refs.current[id] = el; if (el) el.dataset.id = id }
  const fadeUp = (id, delay = 0) => ({
    opacity: visible[id] ? 1 : 0,
    transform: visible[id] ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  })

  const scenarios = [
    { icon: '🏗️', who: 'Startup founder', when: 'Before signing a SaaS tool or software agreement', risk: 'Auto-renewal trap with 90-day cancellation window' },
    { icon: '🏢', who: 'Small business owner', when: 'Before hiring an agency or consultant', risk: 'IP clause that gives them rights to your deliverables' },
    { icon: '🛒', who: 'E-commerce operator', when: 'Before signing with a supplier or 3PL warehouse', risk: 'One-sided termination with no data retrieval rights' },
    { icon: '👩‍💼', who: 'Freelancer or agency', when: 'Before taking on a major client engagement', risk: 'Non-compete that blocks your next 3 clients' },
    { icon: '🏥', who: 'Healthcare or professional practice', when: 'Before signing a billing or practice software deal', risk: 'Liability cap at 1 month of fees — for a data breach' },
    { icon: '🏠', who: 'Property manager or developer', when: 'Before signing a proptech platform agreement', risk: 'Mandatory arbitration in another state, at your cost' },
  ]

  const steps = [
    { n: '01', title: 'Upload your contract', body: 'PDF or paste text. Takes 10 seconds. Your contract is never stored on our servers.' },
    { n: '02', title: 'Get your free risk preview', body: 'See your risk score and all medium and low risk issues instantly — no payment required.' },
    { n: '03', title: 'Unlock the full report', body: 'Pay $29 to reveal every high-risk clause with plain-English explanation, worst-case outcome, and your negotiation counter-move.' },
  ]

  const features = [
    { label: 'Risk score', desc: 'A 0–100 score and HIGH / MEDIUM / LOW rating so you know immediately how serious it is.' },
    { label: 'Verbatim clause', desc: 'The exact language from your contract, highlighted, so you can find it yourself.' },
    { label: 'Plain English', desc: 'What it actually means — written for a founder, not a lawyer.' },
    { label: 'Worst case', desc: 'The realistic financial or operational damage if this clause is triggered against you.' },
    { label: 'Counter-move', desc: 'Exactly what to ask the vendor to change — ready to paste into an email.' },
    { label: 'Clean clauses', desc: 'Which of the 8 risk categories are actually fine — so you know what not to worry about.' },
  ]

  const faqs = [
    { q: 'Is this legal advice?', a: 'No — and we\'re upfront about that. ContractFlag is risk intelligence: it tells you what to look for and what to ask your lawyer about. Most users save hundreds in legal fees by knowing exactly which clauses need attention before the lawyer call.' },
    { q: 'What types of contracts does it work on?', a: 'Any vendor, SaaS, supplier, agency, consulting, or service agreement in English. It\'s not designed for employment contracts, real estate deeds, or government contracts.' },
    { q: 'Is my contract kept private?', a: 'Yes. Your contract text is processed by the AI and immediately discarded. We do not store, log, or read your contracts.' },
    { q: 'What if I\'m not satisfied?', a: 'Email us at support@contractflag.app within 24 hours and we\'ll refund you, no questions asked.' },
  ]

  const ink = '#16140F'
  const sub = '#5C5A54'
  const faint = '#8A877F'
  const gold = '#E5C97E'
  const goldDark = '#9A7B2D'
  const line = '#ECEAE4'

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#FFFFFF', color: ink, minHeight: '100vh', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:#E5C97E;color:#16140F}
        .btn{display:inline-block;background:#16140F;color:#fff;padding:14px 30px;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer;border:none;transition:all 0.18s;letter-spacing:0.01em;text-decoration:none}
        .btn:hover{background:#2B2820;transform:translateY(-1px);box-shadow:0 8px 24px rgba(22,20,15,0.18)}
        .btn-lg{padding:18px 38px;font-size:16px}
        .sc{background:#FBFAF7;border:1px solid #ECEAE4;border-radius:14px;padding:30px;transition:all 0.2s}
        .sc:hover{border-color:#E5C97E;box-shadow:0 10px 30px rgba(22,20,15,0.07);transform:translateY(-3px)}
      `}</style>

      {/* Nav */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,padding:'0 5vw',height:64,display:'flex',alignItems:'center',justifyContent:'space-between',background:scrollY>30?'rgba(255,255,255,0.94)':'transparent',backdropFilter:scrollY>30?'blur(16px)':'none',borderBottom:scrollY>30?`1px solid ${line}`:'none',transition:'all 0.25s'}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none',color:ink}}>
          <div style={{width:28,height:28,background:gold,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:ink}}>⚑</div>
          <span style={{fontFamily:"'DM Serif Display',serif",fontSize:18}}>ContractFlag</span>
        </a>
        <div style={{display:'flex',alignItems:'center',gap:26}}>
          <a href="/blog" style={{fontSize:14,color:sub,textDecoration:'none',fontWeight:500}}>Blog</a>
          <a href="/app-route" className="btn" style={{padding:'9px 20px',fontSize:13}}>Analyze a contract →</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{minHeight:'92vh',display:'flex',flexDirection:'column',justifyContent:'center',padding:'140px 5vw 100px',maxWidth:1160,margin:'0 auto'}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:'0.16em',color:goldDark,marginBottom:28}}>CONTRACT RISK INTELLIGENCE</div>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(46px,7.5vw,92px)',lineHeight:1.04,letterSpacing:'-0.02em',marginBottom:32,maxWidth:880}}>
          Your contract has<br/>
          <em style={{color:goldDark,fontStyle:'italic'}}>traps in it.</em><br/>
          We find them.
        </h1>
        <p style={{fontSize:19,color:sub,lineHeight:1.75,maxWidth:540,marginBottom:44}}>
          Upload any vendor, SaaS, or supplier contract. Get a plain-English risk report in 60 seconds — before you sign something you'll regret for years.
        </p>
        <div style={{display:'flex',gap:18,flexWrap:'wrap',alignItems:'center',marginBottom:72}}>
          <a href="/app-route" className="btn btn-lg">Analyze your contract — free preview →</a>
          <span style={{fontSize:14,color:faint}}>Full report $29 · No account needed</span>
        </div>
        <div style={{display:'flex',gap:56,flexWrap:'wrap',borderTop:`1px solid ${line}`,paddingTop:40}}>
          {[['60 sec','To get your report'],['8','Risk categories checked'],['$29','Full report, one-time'],['0','Contracts stored']].map(([n,l])=>(
            <div key={l}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:36,color:ink,lineHeight:1}}>{n}</div>
              <div style={{fontSize:12,color:faint,marginTop:7,letterSpacing:'0.06em'}}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section style={{background:'#FBF6E9',borderTop:`1px solid ${line}`,borderBottom:`1px solid ${line}`,padding:'88px 5vw'}}>
        <div style={{maxWidth:1160,margin:'0 auto'}}>
          <p style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(22px,3vw,36px)',lineHeight:1.5,maxWidth:840,color:ink}}>
            "Most business owners sign contracts without reading them fully — or they pay $400/hr for a lawyer to review every page. There's been nothing in between. Until now."
          </p>
          <p style={{marginTop:18,fontSize:12,color:goldDark,fontFamily:"'DM Mono',monospace",letterSpacing:'0.12em'}}>THE GAP CONTRACTFLAG FILLS</p>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{padding:'130px 5vw',maxWidth:1160,margin:'0 auto'}}>
        <div ref={ref('who')} style={fadeUp('who')}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:'0.16em',color:goldDark,marginBottom:18}}>WHO IT'S FOR</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(32px,4vw,54px)',lineHeight:1.1,marginBottom:16}}>Anyone who signs<br/>a business contract</h2>
          <p style={{fontSize:16,color:sub,marginBottom:60,maxWidth:480,lineHeight:1.7}}>You don't need a lawyer for every contract. You need to know which ones are worth the lawyer's time.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:22}}>
          {scenarios.map((s,i)=>(
            <div key={i} ref={ref('sc'+i)} style={{...fadeUp('sc'+i,i*0.07)}} className="sc">
              <div style={{fontSize:28,marginBottom:16}}>{s.icon}</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:19,marginBottom:6}}>{s.who}</div>
              <div style={{fontSize:14,color:sub,marginBottom:16,lineHeight:1.6}}>{s.when}</div>
              <div style={{display:'flex',alignItems:'flex-start',gap:9,background:'#FDF3F2',border:'1px solid #F5DDDA',borderRadius:8,padding:'12px 14px'}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#DC2626',marginTop:6,flexShrink:0}}/>
                <div style={{fontSize:12.5,color:'#B42318',lineHeight:1.6,fontFamily:"'DM Mono',monospace"}}>{s.risk}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{background:'#FBFAF7',borderTop:`1px solid ${line}`,borderBottom:`1px solid ${line}`,padding:'130px 5vw'}}>
        <div style={{maxWidth:1160,margin:'0 auto'}}>
          <div ref={ref('how')} style={fadeUp('how')}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:'0.16em',color:goldDark,marginBottom:18}}>HOW IT WORKS</div>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(32px,4vw,54px)',lineHeight:1.1,marginBottom:64}}>Three steps.<br/>60 seconds.</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:56}}>
            {steps.map((s,i)=>(
              <div key={i} ref={ref('step'+i)} style={fadeUp('step'+i,i*0.1)}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:46,color:gold,fontWeight:500,lineHeight:1,marginBottom:24}}>{s.n}</div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:23,marginBottom:12}}>{s.title}</div>
                <div style={{fontSize:15,color:sub,lineHeight:1.8}}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's in the report */}
      <section style={{padding:'130px 5vw',maxWidth:1160,margin:'0 auto'}}>
        <div ref={ref('feat')} style={fadeUp('feat')}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:'0.16em',color:goldDark,marginBottom:18}}>WHAT'S IN THE FULL REPORT</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(32px,4vw,54px)',lineHeight:1.1,marginBottom:64}}>Every red flag, explained<br/><em style={{fontStyle:'italic'}}>like you're a human.</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:22}}>
          {features.map((f,i)=>(
            <div key={i} ref={ref('f'+i)} style={{...fadeUp('f'+i,i*0.06),padding:'30px 26px',background:'#FBFAF7',border:`1px solid ${line}`,borderRadius:14}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:19,marginBottom:10,color:ink}}>{f.label}</div>
              <div style={{fontSize:14,color:sub,lineHeight:1.75}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{background:'#FBFAF7',borderTop:`1px solid ${line}`,padding:'130px 5vw'}}>
        <div style={{maxWidth:720,margin:'0 auto'}}>
          <div ref={ref('faq')} style={fadeUp('faq')}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:'0.16em',color:goldDark,marginBottom:18}}>QUESTIONS</div>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(30px,4vw,46px)',lineHeight:1.1,marginBottom:56}}>The ones people<br/>actually ask.</h2>
          </div>
          {faqs.map((o,i)=>(
            <div key={i} ref={ref('faq'+i)} style={{...fadeUp('faq'+i,i*0.07),borderBottom:`1px solid ${line}`,paddingBottom:32,marginBottom:32}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20,marginBottom:12}}>{o.q}</div>
              <div style={{fontSize:15,color:sub,lineHeight:1.85}}>{o.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{padding:'150px 5vw',textAlign:'center'}}>
        <div ref={ref('cta')} style={fadeUp('cta')}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:'0.16em',color:goldDark,marginBottom:22}}>GET STARTED</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(38px,6vw,72px)',lineHeight:1.05,marginBottom:24}}>
            You're about to<br/>sign <em style={{color:goldDark,fontStyle:'italic'}}>something.</em>
          </h2>
          <p style={{fontSize:16,color:sub,marginBottom:44,maxWidth:400,margin:'0 auto 44px',lineHeight:1.7}}>Know what's in it first. Free preview, 60 seconds, no account needed.</p>
          <a href="/app-route" className="btn btn-lg">Analyze your contract — free →</a>
          <div style={{marginTop:18,fontSize:12,color:faint,fontFamily:"'DM Mono',monospace",letterSpacing:'0.08em'}}>FULL REPORT $29 · ONE-TIME PAYMENT · NO SUBSCRIPTION</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:`1px solid ${line}`,padding:'34px 5vw',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:24,height:24,background:gold,borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:ink}}>⚑</div>
          <span style={{fontFamily:"'DM Serif Display',serif",fontSize:16}}>ContractFlag</span>
        </div>
        <a href="/blog" style={{fontSize:13,color:goldDark,textDecoration:'none',fontFamily:"'DM Mono',monospace",letterSpacing:'0.08em'}}>BLOG</a>
        <div style={{fontSize:12,color:faint,fontFamily:"'DM Mono',monospace",letterSpacing:'0.05em'}}>
          NOT LEGAL ADVICE · RISK INTELLIGENCE ONLY · support@contractflag.app
        </div>
      </footer>
    </div>
  )
}
