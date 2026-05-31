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
Customer shall indemnify, defend, and hold harmless Provider and its officers, directors, employees, and agents from any claims, damages, or expenses (including reasonable attorney's fees) arising out of Customer's use of the Platform.

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

export default function ContractFlag() {
  const [contractText, setContractText] = useState('')
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
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
      try {
        const text = await extractPdfText(file)
        setContractText(text)
      } catch (e) {
        setErrorMsg(e.message)
      }
    } else {
      const reader = new FileReader()
      reader.onload = e => setContractText(e.target.result)
      reader.readAsText(file)
    }
  }, [])

  const handlePay = async () => {
    if (!contractText.trim() || paying) return
    setPaying(true)
    setErrorMsg('')
    try {
      // Save contract to sessionStorage so success page can retrieve it
      sessionStorage.setItem('cf_contract', contractText)

      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText }),
      })
      const data = await res.json()
      if (data.error) { setErrorMsg(data.error); setPaying(false); return }
      // Redirect to Stripe
      window.location.href = data.url
    } catch (e) {
      setErrorMsg('Could not start checkout. Please try again.')
      setPaying(false)
    }
  }

  const base = { fontFamily: 'system-ui,sans-serif', padding: '24px 20px', maxWidth: 640, margin: '0 auto' }

  return (
    <div style={base}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:28}}>
        <div style={{width:36,height:36,background:'#111827',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>⚑</div>
        <div>
          <div style={{fontFamily:'Georgia,serif',fontSize:20,color:'#111827',lineHeight:1}}>ContractFlag</div>
          <div style={{fontSize:11,color:'#9CA3AF',letterSpacing:'0.06em'}}>CONTRACT RISK INTELLIGENCE</div>
        </div>
      </div>

      {/* Hero text */}
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#111827',marginBottom:6}}>Find the hidden traps in your contract</div>
        <div style={{fontSize:13,color:'#6B7280',lineHeight:1.6}}>Upload any vendor, SaaS, or supplier contract. Get a plain-English risk report — 8 categories, flagged and explained — in 60 seconds.</div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true)}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0])}}
        onClick={()=>fileRef.current.click()}
        style={{border:`2px dashed ${dragging?'#6366F1':'#D1D5DB'}`,borderRadius:14,padding:'28px 24px',textAlign:'center',cursor:'pointer',marginBottom:16,background:dragging?'#EEF2FF':'#F9FAFB',transition:'all 0.2s'}}
      >
        <div style={{fontSize:32,marginBottom:8}}>{pdfLoading?'⏳':'📄'}</div>
        <div style={{fontWeight:600,fontSize:14,color:'#111827',marginBottom:3}}>
          {pdfLoading ? 'Reading PDF…' : fileName || 'Drop your contract here'}
        </div>
        <div style={{fontSize:12,color:'#9CA3AF'}}>
          {pdfLoading ? 'Extracting text…'
            : fileName ? 'File loaded — ready to analyze'
            : 'PDF or TXT — click to browse or drag and drop'}
        </div>
        <input ref={fileRef} type="file" accept=".txt,.pdf" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>
      </div>

      <div style={{textAlign:'center',color:'#9CA3AF',fontSize:12,margin:'0 0 10px'}}>— or paste contract text —</div>

      <textarea
        rows={7}
        placeholder="Paste the full contract text here..."
        value={contractText}
        onChange={e=>{setContractText(e.target.value);setFileName('');setErrorMsg('')}}
        style={{width:'100%',boxSizing:'border-box',border:'1px solid #E5E7EB',borderRadius:10,padding:'12px 14px',fontSize:13,color:'#374151',lineHeight:1.6,resize:'vertical',fontFamily:'inherit',background:'#FAFAFA',outline:'none'}}
      />

      {errorMsg && (
        <div style={{marginTop:8,fontSize:12,color:'#EF4444'}}>{errorMsg}</div>
      )}

      {/* CTA buttons */}
      <div style={{display:'flex',gap:10,marginTop:14}}>
        <button
          onClick={()=>{setContractText(SAMPLE_CONTRACT);setFileName('sample_saas_agreement.txt');setErrorMsg('')}}
          style={{flex:1,padding:'11px 0',border:'1px solid #E5E7EB',borderRadius:8,background:'#fff',color:'#6B7280',fontSize:13,fontWeight:500,cursor:'pointer'}}
        >
          Try sample
        </button>
        <button
          onClick={handlePay}
          disabled={!contractText.trim() || pdfLoading || paying}
          style={{flex:2,padding:'11px 0',border:'none',borderRadius:8,background:contractText.trim()&&!pdfLoading&&!paying?'#111827':'#E5E7EB',color:contractText.trim()&&!pdfLoading&&!paying?'#fff':'#9CA3AF',fontSize:14,fontWeight:600,cursor:contractText.trim()&&!pdfLoading&&!paying?'pointer':'default',transition:'background 0.2s'}}
        >
          {paying ? 'Redirecting to payment…' : 'Analyze for $29 →'}
        </button>
      </div>

      {/* Trust line */}
      <div style={{marginTop:20,display:'flex',alignItems:'center',justifyContent:'center',gap:16,flexWrap:'wrap'}}>
        {['🔒 Secure checkout via Stripe','📄 PDF & TXT supported','⚖ Not legal advice — risk intelligence'].map(t=>(
          <span key={t} style={{fontSize:11,color:'#9CA3AF'}}>{t}</span>
        ))}
      </div>
    </div>
  )
}
