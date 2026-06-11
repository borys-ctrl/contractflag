import Link from "next/link";

export const metadata = {
  title: "10 Freelance Contract Red Flags to Catch Before You Sign (2026)",
  description:
    "These 10 freelance contract red flags cost freelancers thousands every year. Learn how to spot unpaid revision traps, IP grabs, and payment term tricks before signing.",
  alternates: { canonical: "https://contractflag.app/blog/freelance-contract-red-flags" },
  openGraph: {
    title: "10 Freelance Contract Red Flags to Catch Before You Sign",
    description: "Spot unpaid revision traps, IP grabs, and payment term tricks before signing.",
    url: "https://contractflag.app/blog/freelance-contract-red-flags",
    type: "article",
  },
};

const s = {
  page: { background: "#fff", minHeight: "100vh" },
  main: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "56px 20px 80px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#1a1a1a",
  },
  kicker: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#2563eb",
    marginBottom: "16px",
  },
  h1: {
    fontSize: "42px",
    lineHeight: 1.15,
    fontWeight: 700,
    margin: "0 0 24px",
    letterSpacing: "-0.5px",
  },
  lede: { fontSize: "21px", lineHeight: 1.5, color: "#444", margin: "0 0 12px" },
  p: { fontSize: "19px", lineHeight: 1.65, margin: "0 0 22px" },
  h2: {
    fontSize: "28px",
    lineHeight: 1.25,
    fontWeight: 700,
    margin: "44px 0 14px",
    letterSpacing: "-0.3px",
  },
  fix: {
    fontSize: "17px",
    lineHeight: 1.6,
    margin: "0 0 8px",
    padding: "14px 18px",
    background: "#f0f7ff",
    borderLeft: "4px solid #2563eb",
    borderRadius: "0 6px 6px 0",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  },
  hr: { border: "none", borderTop: "1px solid #e5e5e5", margin: "48px 0" },
  cta: {
    margin: "48px 0",
    padding: "32px 28px",
    background: "#0f172a",
    borderRadius: "12px",
    textAlign: "center",
  },
  ctaHead: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    fontSize: "22px",
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 16px",
  },
  ctaBtn: {
    display: "inline-block",
    background: "#2563eb",
    color: "#fff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    fontSize: "17px",
    fontWeight: 600,
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
  },
  ctaSub: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    fontSize: "14px",
    color: "#94a3b8",
    margin: "14px 0 0",
  },
  footer: { fontSize: "15px", fontStyle: "italic", color: "#777", marginTop: "56px" },
};

function CTA() {
  return (
    <div style={s.cta}>
      <p style={s.ctaHead}>Not sure what&apos;s hiding in your contract?</p>
      <Link href="/" style={s.ctaBtn}>
        Scan your contract with ContractFlag →
      </Link>
      <p style={s.ctaSub}>Flags risky clauses in plain English in under a minute.</p>
    </div>
  );
}

function Flag({ n, title, children, fix }) {
  return (
    <section>
      <h2 style={s.h2}>
        {n}. {title}
      </h2>
      <p style={s.p}>{children}</p>
      <p style={s.fix}>
        <strong>Fix:</strong> {fix}
      </p>
    </section>
  );
}

export default function Page() {
  return (
    <div style={s.page}>
      <main style={s.main}>
        <article>
          <p style={s.kicker}>Contracts · Freelancing</p>
          <h1 style={s.h1}>10 Freelance Contract Red Flags to Catch Before You Sign</h1>

          <p style={s.lede}>
            You found a great client. The project sounds exciting. Then the contract lands in your
            inbox — eight pages of legal language you&apos;re expected to sign by Friday.
          </p>
          <p style={s.p}>
            Most freelancers skim it and sign. That&apos;s how you end up doing unlimited revisions
            for free, waiting 90 days to get paid, or discovering the client owns work you never
            delivered. Here are the ten red flags that show up most often in freelance contracts,
            what they actually mean, and what to push back on.
          </p>

          <hr style={s.hr} />

          <Flag
            n={1}
            title='"Unlimited revisions until client satisfaction"'
            fix='Cap revisions explicitly. "Two rounds of revisions included; additional rounds billed at $X/hour."'
          >
            This is the most common trap in creative and development contracts.
            &quot;Satisfaction&quot; is subjective and undefined, which means the project ends when
            the client says it ends — not when you&apos;ve delivered the scope.
          </Flag>

          <Flag
            n={2}
            title="Payment terms longer than Net 30"
            fix="Net 15 or Net 30, with a deposit upfront (25–50% is standard). Add a late fee clause: 1.5% per month is typical and enforceable in most states."
          >
            Net 60 and Net 90 terms mean you&apos;re floating a loan to your client interest-free.
            For a $5,000 project on Net 90, you&apos;re working in January and eating ramen until
            April.
          </Flag>

          <Flag
            n={3}
            title="IP transfers before payment"
            fix='"Intellectual property transfers to Client upon receipt of final payment." One sentence. Total game-changer.'
          >
            Watch for language like &quot;all work product shall be the sole property of Client
            upon creation.&quot; If the IP transfers the moment you create it, you lose your only
            leverage when the invoice goes unpaid.
          </Flag>

          <Flag
            n={4}
            title="Broad indemnification clauses"
            fix="Narrow it to claims arising from your breach or negligence, and cap your total liability at the fees paid under the contract."
          >
            If the contract says you&apos;ll &quot;indemnify and hold harmless the Client from any
            and all claims,&quot; you&apos;ve just agreed to pay the client&apos;s legal bills if
            anyone sues them over anything connected to the project — even things outside your
            control.
          </Flag>

          <CTA />

          <Flag
            n={5}
            title="Non-compete clauses that kill your business"
            fix="Strike it, or narrow it to direct solicitation of the client's own customers."
          >
            Some client contracts quietly prohibit you from working with &quot;competitors&quot;
            for 12–24 months. If you&apos;re a freelancer who specializes in an industry, a
            non-compete in your niche is a career ban.
          </Flag>

          <Flag
            n={6}
            title="Termination for convenience — for them, not you"
            fix="Mutual termination rights, plus payment for all work completed through the termination date and a kill fee (often 25% of remaining contract value)."
          >
            A clause letting the client cancel at any time with no kill fee means they can pull the
            plug mid-project and owe you nothing for work in progress.
          </Flag>

          <Flag
            n={7}
            title="Vague scope of work"
            fix="Attach a specific deliverables list with quantities, formats, and deadlines. Anything outside it requires a written change order."
          >
            &quot;Designer will provide design services as requested by Client&quot; is not a
            scope. It&apos;s a blank check the client gets to cash with your time.
          </Flag>

          <Flag
            n={8}
            title='"Work for hire" combined with portfolio bans'
            fix='Add a portfolio rights clause: "Contractor may display the completed work in portfolios and marketing materials."'
          >
            Work-for-hire is normal in client work. But combined with a confidentiality clause that
            prevents you from showing the work, you can&apos;t use the project to win your next
            client.
          </Flag>

          <Flag
            n={9}
            title="Automatic renewal with locked rates"
            fix="Auto-renewal is fine if rates reset annually or either party can adjust terms with 30 days' notice."
          >
            Retainer agreements that auto-renew at the same rate lock you into 2024 pricing in
            2026. Inflation alone makes this a pay cut.
          </Flag>

          <Flag
            n={10}
            title="Jurisdiction in a state (or country) you've never visited"
            fix="Your home state, or at minimum, binding arbitration that can be conducted remotely."
          >
            If disputes must be resolved in Delaware courts and you live in Hawaii, enforcement
            just got expensive enough that you&apos;ll never pursue it — which the client knows.
          </Flag>

          <hr style={s.hr} />

          <h2 style={s.h2}>The 5-minute check before you sign</h2>
          <p style={s.p}>
            Reading a contract line-by-line takes an hour you don&apos;t have, and a lawyer review
            costs $300–$500 per contract. That math doesn&apos;t work for a $2,000 project.
          </p>
          <p style={s.p}>
            That&apos;s why we built ContractFlag. Upload your contract, and in under a minute it
            flags risky clauses — unlimited revisions, IP traps, indemnification bombs — in plain
            English, so you know exactly what to negotiate before you sign.
          </p>

          <CTA />

          <p style={s.footer}>
            This article is for informational purposes only and is not legal advice. For complex or
            high-value agreements, consult a licensed attorney.
          </p>
        </article>
      </main>
    </div>
  );
}
