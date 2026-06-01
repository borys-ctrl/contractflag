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

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0C0C0B', color: '#F2EDE4', minHeight: '100vh', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:#E5C97E;color:#0C0C0B}
        .btn{display:inline-block;background:#E5C97E;color:#0C0C0B;padding:13px 28px;border-radius:3px;font-weight:600;font-size:14px;cursor:pointer;border:none;transition:all 0.18s;letter-spacing:0.01em;text-decoration:none}
        .btn:hover{background:#F0D88A;transform:translateY(-1px);box-shadow:0 6px 20px rgba(229,201,126,0.25)}
        .btn-lg{padding:16px 36px;font-size:16px}
        .sc{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:24px;transition:all 0.2s}
        .sc:hover{background:rgba(229,201,126,0.05);border-color:rgba(229,201,126,0.18);transform:translateY(-2px)}
      `}</style>

      {/* Nav */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,padding:'0 5vw',height:58,display:'flex',alignItems:'center',justifyContent:'space-between',background:scrollY>30?'rgba(12,12,11,0.96)':'transparent',backdropFilter:scrollY>30?'blur(16px)':'none',borderBottom:scrollY>30?'1px solid rgba(255,255,255,0.05)':'none',transition:'all 0.25s'}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:26,height:26,background:'#E5C97E',borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'#0C0C0B'}}>⚑</div>
          <span style={{fontFamily:"'DM Serif Display',serif",fontSize:16}}>ContractFlag</span>
        </a>
        <a href="/app-route" className="btn" style={{padding:'7px 18px',fontSize:13}}>Analyze a contract →</a>
      </nav>

      {/* Hero */}
      <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',padding:'100px 5vw 80px',maxWidth:1160,margin:'0 auto',position:'relative'}}>
        <div style={{position:'absolute',top:'15%',right:'5%',width:480,height:480,background:'radial-gradient(circle,rgba(229,201,126,0.07) 0%,transparent 65%)',pointerEvents:'none'}}/>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.14em',color:'#E5C97E',marginBottom:22,opacity:0.75}}>CONTRACT RISK INTELLIGENCE</div>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(44px,7.5vw,88px)',lineHeight:1.03,letterSpacing:'-0.025em',marginBottom:26,maxWidth:860}}>
          Your contract has<br/>
          <em style={{color:'#E5C97E',fontStyle:'italic'}}>traps in it.</em><br/>
          We find them.
        </h1>
        <p style={{fontSize:17,color:'rgba(242,237,228,0.55)',lineHeight:1.75,maxWidth:500,marginBottom:36}}>
          Upload any vendor, SaaS, or supplier contract. Get a plain-English risk report in 60 seconds — before you sign something you'll regret for years.
        </p>
        <div style={{display:'flex',gap:14,flexWrap:'wrap',alignItems:'center',marginBottom:56}}>
          <a href="/app-route" className="btn btn-lg">Analyze your contract — free preview →</a>
          <span style={{fontSize:13,color:'rgba(242,237,228,0.3)'}}>Full report $29 · No account needed</span>
        </div>
        <div style={{display:'flex',gap:36,flexWrap:'wrap'}}>
          {[['60 sec','To get your report'],['8','Risk categories checked'],['$29','Full report, one-time'],['0','Contracts stored']].map(([n,l])=>(
            <div key={l}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:34,color:'#E5C97E',lineHeight:1}}>{n}</div>
              <div style={{fontSize:11,color:'rgba(242,237,228,0.35)',marginTop:4,letterSpacing:'0.05em'}}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section style={{background:'#E5C97E',color:'#0C0C0B',padding:'56px 5vw'}}>
        <div style={{maxWidth:1160,margin:'0 auto'}}>
          <p style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(20px,3vw,34px)',lineHeight:1.45,maxWidth:820}}>
            "Most business owners sign contracts without reading them fully — or they pay $400/hr for a lawyer to review every page. There's been nothing in between. Until now."
          </p>
          <p style={{marginTop:14,fontSize:11,opacity:0.45,fontFamily:"'DM Mono',monospace",letterSpacing:'0.1em'}}>THE GAP CONTRACTFLAG FILLS</p>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{padding:'96px 5vw',maxWidth:1160,margin:'0 auto'}}>
        <div ref={ref('who')} style={fadeUp('who')}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.14em',color:'#E5C97E',marginBottom:14,opacity:0.75}}>WHO IT'S FOR</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(30px,4vw,52px)',lineHeight:1.1,marginBottom:10}}>Anyone who signs<br/>a business contract</h2>
          <p style={{fontSize:14,color:'rgba(242,237,228,0.4)',marginBottom:48,maxWidth:460}}>You don't need a lawyer for every contract. You need to know which ones are worth the lawyer's time.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:14}}>
          {scenarios.map((s,i)=>(
            <div key={i} ref={ref('sc'+i)} style={{...fadeUp('sc'+i,i*0.07)}} className="sc">
              <div style={{fontSize:26,marginBottom:12}}>{s.icon}</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:16,marginBottom:3}}>{s.who}</div>
              <div style={{fontSize:12,color:'rgba(242,237,228,0.4)',marginBottom:12,lineHeight:1.55}}>{s.when}</div>
              <div style={{display:'flex',alignItems:'flex-start',gap:7}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:'#EF4444',marginTop:5,flexShrink:0}}/>
                <div style={{fontSize:11,color:'rgba(239,68,68,0.75)',lineHeight:1.55,fontFamily:"'DM Mono',monospace"}}>{s.risk}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{background:'rgba(255,255,255,0.018)',borderTop:'1px solid rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'96px 5vw'}}>
        <div style={{maxWidth:1160,margin:'0 auto'}}>
          <div ref={ref('how')} style={fadeUp('how')}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.14em',color:'#E5C97E',marginBottom:14,opacity:0.75}}>HOW IT WORKS</div>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(30px,4vw,52px)',lineHeight:1.1,marginBottom:48}}>Three steps.<br/>60 seconds.</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:52}}>
            {steps.map((s,i)=>(
              <div key={i} ref={ref('step'+i)} style={fadeUp('step'+i,i*0.1)}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:44,color:'rgba(229,201,126,0.12)',fontWeight:500,lineHeight:1,marginBottom:20}}>{s.n}</div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:21,marginBottom:9}}>{s.title}</div>
                <div style={{fontSize:13,color:'rgba(242,237,228,0.45)',lineHeight:1.75}}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's in the report */}
      <section style={{padding:'96px 5vw',maxWidth:1160,margin:'0 auto'}}>
        <div ref={ref('feat')} style={fadeUp('feat')}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.14em',color:'#E5C97E',marginBottom:14,opacity:0.75}}>WHAT'S IN THE FULL REPORT</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(30px,4vw,52px)',lineHeight:1.1,marginBottom:48}}>Every red flag, explained<br/><em style={{fontStyle:'italic'}}>like you're a human.</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:3}}>
          {features.map((f,i)=>(
            <div key={i} ref={ref('f'+i)} style={{...fadeUp('f'+i,i*0.06),padding:'26px 22px',background:i%2===0?'rgba(255,255,255,0.02)':'transparent',borderRadius:5}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:17,marginBottom:8,color:'#E5C97E'}}>{f.label}</div>
              <div style={{fontSize:12,color:'rgba(242,237,228,0.4)',lineHeight:1.7}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{background:'rgba(255,255,255,0.018)',borderTop:'1px solid rgba(255,255,255,0.05)',padding:'96px 5vw'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <div ref={ref('faq')} style={fadeUp('faq')}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.14em',color:'#E5C97E',marginBottom:14,opacity:0.75}}>QUESTIONS</div>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(28px,4vw,44px)',lineHeight:1.1,marginBottom:44}}>The ones people<br/>actually ask.</h2>
          </div>
          {faqs.map((o,i)=>(
            <div key={i} ref={ref('faq'+i)} style={{...fadeUp('faq'+i,i*0.07),borderBottom:'1px solid rgba(255,255,255,0.07)',paddingBottom:26,marginBottom:26}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:18,marginBottom:9}}>{o.q}</div>
              <div style={{fontSize:13,color:'rgba(242,237,228,0.45)',lineHeight:1.8}}>{o.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{padding:'120px 5vw',textAlign:'center',position:'relative'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:560,height:560,background:'radial-gradient(circle,rgba(229,201,126,0.06) 0%,transparent 65%)',pointerEvents:'none'}}/>
        <div ref={ref('cta')} style={{...fadeUp('cta'),position:'relative'}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.14em',color:'#E5C97E',marginBottom:18,opacity:0.75}}>GET STARTED</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(36px,6vw,68px)',lineHeight:1.05,marginBottom:18}}>
            You're about to<br/>sign <em style={{color:'#E5C97E',fontStyle:'italic'}}>something.</em>
          </h2>
          <p style={{fontSize:15,color:'rgba(242,237,228,0.35)',marginBottom:36,maxWidth:380,margin:'0 auto 36px'}}>Know what's in it first. Free preview, 60 seconds, no account needed.</p>
          <a href="/app-route" className="btn btn-lg">Analyze your contract — free →</a>
          <div style={{marginTop:14,fontSize:11,color:'rgba(242,237,228,0.22)',fontFamily:"'DM Mono',monospace",letterSpacing:'0.07em'}}>FULL REPORT $29 · ONE-TIME PAYMENT · NO SUBSCRIPTION</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:'1px solid rgba(255,255,255,0.05)',padding:'28px 5vw',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:14}}>
        <div style={{display:'flex',alignItems:'center',gap:7}}>
          <div style={{width:22,height:22,background:'#E5C97E',borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#0C0C0B'}}>⚑</div>
          <span style={{fontFamily:"'DM Serif Display',serif",fontSize:15}}>ContractFlag</span>
        </div>
        <div style={{fontSize:11,color:'rgba(242,237,228,0.2)',fontFamily:"'DM Mono',monospace",letterSpacing:'0.05em'}}>
          NOT LEGAL ADVICE · RISK INTELLIGENCE ONLY · support@contractflag.app
        </div>
      </footer>
    </div>
  )
}
