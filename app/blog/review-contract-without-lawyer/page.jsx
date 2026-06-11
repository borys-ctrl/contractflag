import Link from "next/link";
import { s, CTA } from "../blogStyles";

export const metadata = {
  title: "How to Review a Contract Without a Lawyer: 7-Step Checklist",
  description:
    "Can't justify $400 for a lawyer review? Use this 7-step process to review any business contract yourself — what to read first, what to skip, and when you actually need an attorney.",
  alternates: { canonical: "https://contractflag.app/blog/review-contract-without-lawyer" },
  openGraph: {
    title: "How to Review a Contract Without a Lawyer: 7-Step Checklist",
    description:
      "A systematic way to review any business contract yourself, plus when you really need an attorney.",
    url: "https://contractflag.app/blog/review-contract-without-lawyer",
    type: "article",
  },
};

function Step({ n, title, children }) {
  return (
    <section>
      <h2 style={s.h2}>
        Step {n}: {title}
      </h2>
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <div style={s.page}>
      <main style={s.main}>
        <article>
          <p style={s.kicker}>
            <Link href="/blog" style={s.backLink}>
              ← All guides
            </Link>
          </p>
          <h1 style={s.h1}>How to Review a Contract Without a Lawyer: A 7-Step Checklist</h1>

          <p style={s.lede}>
            A lawyer review costs $300–$700 per contract. If you&apos;re a freelancer or small
            business owner signing a $1,500 project agreement, that math is broken — you&apos;d
            spend 20–40% of the contract value just checking the contract.
          </p>
          <p style={s.p}>
            The good news: most business contracts follow predictable patterns, and most of the
            danger lives in the same six or seven clauses. Here&apos;s a systematic way to review a
            contract yourself, plus the honest answer on when you really do need an attorney.
          </p>

          <hr style={s.hr} />

          <Step n={1} title="Read the money clauses first">
            <p style={s.p}>
              Skip the recitals and definitions. Go straight to the payment amount and schedule, the
              payment terms (Net 15, 30, 60?), late payment consequences, and who covers expenses.
              Anything past Net 30 means you&apos;re financing your client. No late fee clause means
              no teeth.
            </p>
            <p style={s.fix}>
              <strong>If the money section is vague, stop.</strong> Everything else is secondary to
              whether you get paid, how much, and when.
            </p>
          </Step>

          <Step n={2} title="Find the termination clause">
            <p style={s.p}>
              Every contract ends eventually — the question is how. Can either party terminate, or
              only one? How much notice is required? What happens to work in progress and money
              owed? A contract that lets the other party walk away anytime with no payment for
              completed work is a contract that protects only them.
            </p>
          </Step>

          <Step n={3} title="Check who owns what (IP and deliverables)">
            <p style={s.p}>
              Search the document for &quot;intellectual property,&quot; &quot;work product,&quot;
              and &quot;ownership.&quot; The key question: <em>when</em> does ownership transfer?
              &quot;Upon creation&quot; means you lose leverage immediately. &quot;Upon final
              payment&quot; means your invoice has enforcement power built in.
            </p>
            <p style={s.p}>
              On the client side, flip it: confirm you actually receive full ownership of what
              you&apos;re paying for, including source files.
            </p>
          </Step>

          <Step n={4} title="Hunt for the liability bombs">
            <p style={s.p}>
              Three terms to search for: <strong>indemnify</strong>, <strong>liability</strong>,
              and <strong>warranty</strong>. Are you agreeing to cover the other party&apos;s legal
              costs — for anything, or only your own negligence? Is your exposure capped (good) or
              unlimited (bad)? Are you promising the work will be &quot;error-free&quot;? Nobody can
              guarantee that.
            </p>
            <p style={s.fix}>
              <strong>Don&apos;t skip these.</strong> Liability clauses are where small contracts
              create six-figure exposure — and they&apos;re the clauses non-lawyers skim because the
              language is densest.
            </p>
          </Step>

          <CTA />

          <Step n={5} title="Scan for restrictive covenants">
            <p style={s.p}>
              Non-compete, non-solicitation, and exclusivity clauses can quietly restrict who
              you&apos;re allowed to work with after this contract ends. A 12-month non-compete in
              your niche is a much bigger cost than anything in the payment section. If you find
              one, ask: would I sign this if it were the only thing on the page?
            </p>
          </Step>

          <Step n={6} title="Check dispute resolution and jurisdiction">
            <p style={s.p}>
              Where do disputes get resolved, and how? Courts in a distant state effectively mean
              you can&apos;t enforce the contract — travel and local counsel cost more than most
              disputes are worth. Remote arbitration or your home jurisdiction keeps enforcement
              realistic.
            </p>
          </Step>

          <Step n={7} title='Run the "blank spaces" check'>
            <p style={s.p}>
              Before signing, confirm all blanks are filled in (dates, amounts, names), that
              referenced exhibits actually exist and are attached, and that the legal entity names
              match reality — if you&apos;re signing with &quot;ABC Holdings LLC,&quot; is that who
              you think you&apos;re working with?
            </p>
          </Step>

          <hr style={s.hr} />

          <h2 style={s.h2}>When you actually do need a lawyer</h2>
          <p style={s.p}>
            Self-review works for routine agreements. Get an attorney when the contract value makes
            a $500 review cheap insurance (rule of thumb: $25k+), when real estate, equity,
            partnership, or employment is involved, when you&apos;re asked to personally guarantee
            anything, or when the other side has lawyers and you&apos;re negotiating heavily
            modified terms.
          </p>

          <h2 style={s.h2}>The faster way to do steps 1–6</h2>
          <p style={s.p}>
            The seven steps above take 45–60 minutes per contract if you&apos;re thorough.
            ContractFlag does the heavy lifting in under a minute: upload your contract and it flags
            risky clauses — unlimited liability, IP traps, one-sided termination — explained in
            plain English. Then you spend your 10 minutes negotiating the flagged items instead of
            decoding legalese.
          </p>

          <CTA />

          <p style={s.footer}>
            This article is for informational purposes only and is not legal advice.
          </p>
        </article>
      </main>
    </div>
  );
}
