export const metadata = {
  title: 'ContractFlag — Contract Risk Intelligence',
  description: 'Upload any contract and get a plain-English risk report in 60 seconds.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-H951XR5G4C"></script>
        <script dangerouslySetInnerHTML={{__html:`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-H951XR5G4C');
        `}}/>
      </head>
      <body style={{ margin: 0, padding: 0, background: '#fff' }}>{children}</body>
    </html>
  )
}
