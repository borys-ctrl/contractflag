'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ConfirmedContent() {
  const params = useSearchParams()
  const status = params.get('status')
  const ok = status === 'ok'

  return (
    <div style={{fontFamily:'system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px',background:'#0C0C0B'}}>
      <div style={{maxWidth:440,textAlign:'center'}}>
        <div style={{width:48,height:48,background:'#E5C97E',borderRadius:8,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:24,color:'#0C0C0B',marginBottom:24}}>⚑</div>
        {ok ? (
          <>
            <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#F2EDE4',marginBottom:12}}>Email confirmed ✓</h1>
            <p style={{fontSize:15,color:'rgba(242,237,228,0.55)',lineHeight:1.7,marginBottom:28}}>
              Thanks for confirming. You're on the list — we'll send you contract tips and your report. In the meantime, you can analyze another contract anytime.
            </p>
          </>
        ) : (
          <>
            <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#F2EDE4',marginBottom:12}}>Link expired</h1>
            <p style={{fontSize:15,color:'rgba(242,237,228,0.55)',lineHeight:1.7,marginBottom:28}}>
              This confirmation link didn't work. No problem — just analyze your contract again and re-enter your email.
            </p>
          </>
        )}
        <a href="/app-route" style={{display:'inline-block',background:'#E5C97E',color:'#0C0C0B',padding:'13px 28px',borderRadius:4,fontWeight:600,fontSize:14,textDecoration:'none'}}>
          Analyze a contract →
        </a>
      </div>
    </div>
  )
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<div style={{padding:40,textAlign:'center',color:'#999'}}>Loading…</div>}>
      <ConfirmedContent />
    </Suspense>
  )
}
