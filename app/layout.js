export const metadata = {
  title: 'ContractFlag — Contract Risk Intelligence',
  description: 'Upload any contract and get a plain-English risk report in 60 seconds.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#fff' }}>{children}</body>
    </html>
  )
}
