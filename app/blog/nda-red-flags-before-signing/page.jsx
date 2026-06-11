import Link from "next/link";
import BlogHeader from "../BlogHeader";
import { s, CTA } from "../blogStyles";
import Related from "../Related";

export const metadata = {
  title: "What to Look for in an NDA Before Signing: 8 Red Flags",
  description:
    "Not all NDAs are harmless. These 8 NDA red flags — from perpetual terms to one-way obligations — can restrict your career for years. Check before you sign.",
  alternates: { canonical: "https://contractflag.app/blog/nda-red-flags-before-signing" },
  openGraph: {
    title: "What to Look for in an NDA Before Signing: 8 Red Flags",
    description:
      "From perpetual terms to hidden non-competes — check these before you sign any NDA.",
    url: "https://contractflag.app/blog/nda-red-flags-before-signing",
    type: "article",
  },
};

function Flag({ n, title, children }) {
  return (
    <section>
      <h2 style={s.h2}>
        {n}. {title}
      </h2>
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <div style={s.page}>
      <main style={s.main}>
        <BlogHeader />
        <article>
          <p style={s.kicker}>
            <Link href="/blog" style={s.backLink}>
              ← All guides
            </Link>
          </p>
          <h1 style={s.h1}>What to Look for in an NDA Before Signing: 8 Red Flags</h1>

          <p style={s.lede}>
            &quot;It&apos;s just a standard NDA&quot; is one of the most expensive sentences in
            business.
          </p>
          <p style={s.p}>
            Most NDAs are routine. Some quietly contain non-competes, perpetual obligations, or
            definitions of &quot;confidential information&quot; so broad that everything you learn —
            including general industry knowledge — becomes off-limits. Here&apos;s what to check in
            the five minutes before you sign.
          </p>

          <hr style={s.hr} />

          <Flag n={1} title="One-way vs. mutual">
            <p style={s.p}>
              A <strong>mutual NDA</strong> protects both parties&apos; information. A{" "}
              <strong>one-way (unilateral) NDA</strong> protects only theirs. One-way NDAs are
              normal when only one side is sharing secrets — say, you&apos;re evaluating their
              product. But if you&apos;ll also be sharing your processes, pricing, or client
              information, insist on mutual obligations.
            </p>
            <p style={s.fix}>
              <strong>Red flag:</strong> A one-way NDA in a relationship where information clearly
              flows both directions.
            </p>
          </Flag>

          <Flag n={2} title='The definition of "confidential information"'>
            <p style={s.p}>
              This is the heart of the document. Good definitions are specific: business plans,
              customer lists, technical specifications, financial data. Dangerous definitions are
              circular and unlimited: &quot;any information disclosed by Company, in any form,
              whether or not marked confidential.&quot; Under a definition that broad, a casual
              hallway comment becomes legally protected information you can never use or repeat.
            </p>
            <p style={s.fix}>
              <strong>Red flag:</strong> No requirement that confidential information be
              identified, marked, or reasonably understood to be confidential.
            </p>
          </Flag>

          <Flag n={3} title="Missing standard exclusions">
            <p style={s.p}>
              Every legitimate NDA excludes information that was already public, that you already
              knew before disclosure, that you received lawfully from a third party, or that you
              developed independently. If these exclusions are missing, you could be liable for
              &quot;disclosing&quot; information that was on the company&apos;s own website.
            </p>
          </Flag>

          <Flag n={4} title="Perpetual or undefined terms">
            <p style={s.p}>
              Most trade secrets justify 2–5 years of confidentiality. An NDA with no expiration —
              or &quot;obligations survive indefinitely&quot; — binds you forever. For genuinely
              permanent secrets like formulas or source code, perpetual terms for{" "}
              <em>those specific items</em> can be reasonable. Perpetual terms for{" "}
              <em>everything</em> are not.
            </p>
            <p style={s.fix}>
              <strong>Red flag:</strong> No term length stated anywhere in the document.
            </p>
          </Flag>

          <CTA />

          <Flag n={5} title="Non-competes hiding inside the NDA">
            <p style={s.p}>
              This is the big one. Look for language preventing you from &quot;engaging in any
              business similar to&quot; or &quot;working with competitors of&quot; the disclosing
              party. That&apos;s not confidentiality — that&apos;s a non-compete wearing an NDA
              costume, and it can lock you out of your own industry. Same for{" "}
              <strong>non-solicitation</strong> clauses (can&apos;t hire their people, can&apos;t
              work with their clients) buried in a document labeled &quot;Confidentiality
              Agreement.&quot;
            </p>
          </Flag>

          <Flag n={6} title="IP assignment language">
            <p style={s.p}>
              An NDA&apos;s job is to protect information, not transfer ownership. If you see
              &quot;all ideas, suggestions, or feedback provided by Recipient shall become the sole
              property of Company,&quot; then your input during a &quot;casual exploratory
              conversation&quot; becomes their intellectual property — for free.
            </p>
            <p style={s.fix}>
              <strong>Red flag:</strong> Any clause assigning ownership of your ideas, feedback, or
              work product inside an NDA.
            </p>
          </Flag>

          <Flag n={7} title="Injunctive relief with no balance">
            <p style={s.p}>
              Standard NDAs let the disclosing party seek an injunction — a court order to stop
              disclosure. That&apos;s normal. What&apos;s not: clauses where you waive all
              defenses, agree damages are &quot;irreparable&quot; automatically, or pay their
              attorney&apos;s fees regardless of outcome.
            </p>
          </Flag>

          <Flag n={8} title="Residuals clauses (when you're the discloser)">
            <p style={s.p}>
              If you&apos;re the one sharing information, watch for a &quot;residuals&quot; clause —
              language letting the other party freely use anything their employees &quot;retain in
              unaided memory.&quot; For a technical discussion, that can hollow out the entire NDA.
              Big companies love these against small partners.
            </p>
          </Flag>

          <hr style={s.hr} />

          <h2 style={s.h2}>The 60-second NDA check</h2>
          <p style={s.p}>
            NDAs are short, but the risky language hides in dense paragraphs designed to be
            skimmed. ContractFlag scans your NDA and flags exactly these issues — hidden
            non-competes, perpetual terms, IP grabs — in plain English in under a minute. It&apos;s
            the difference between signing blind and signing informed.
          </p>

          <CTA />

          <Related current="nda-red-flags-before-signing" />

          <p style={s.footer}>
            This article is for informational purposes only and is not legal advice.
          </p>
        </article>
      </main>
    </div>
  );
}
