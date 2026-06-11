import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "10 Freelance Contract Red Flags to Catch Before You Sign (2026)",
  description:
    "These 10 freelance contract red flags cost freelancers thousands every year. Learn how to spot unpaid revision traps, IP grabs, and payment term tricks before signing.",
  alternates: { canonical: "https://contractflag.app/blog/freelance-contract-red-flags" },
  openGraph: {
    title: "10 Freelance Contract Red Flags to Catch Before You Sign",
    description:
      "Spot unpaid revision traps, IP grabs, and payment term tricks before signing.",
    url: "https://contractflag.app/blog/freelance-contract-red-flags",
    type: "article",
  },
};

function CTA() {
  return (
    <div className="my-10 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
      <p className="mb-4 text-lg font-semibold text-gray-900">
        Not sure what&apos;s hiding in your contract?
      </p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Scan your contract with ContractFlag →
      </Link>
      <p className="mt-3 text-sm text-gray-500">
        Flags risky clauses in plain English in under a minute.
      </p>
    </div>
  );
}

function Flag({
  n,
  title,
  children,
  fix,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  fix: string;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-2xl font-bold text-gray-900">
        {n}. {title}
      </h2>
      <p className="mb-3 leading-relaxed text-gray-700">{children}</p>
      <p className="leading-relaxed text-gray-700">
        <strong>Fix:</strong> {fix}
      </p>
    </section>
  );
}

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <article>
        <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900">
          10 Freelance Contract Red Flags to Catch Before You Sign
        </h1>

        <p className="mb-4 leading-relaxed text-gray-700">
          You found a great client. The project sounds exciting. Then the
          contract lands in your inbox — eight pages of legal language
          you&apos;re expected to sign by Friday.
        </p>
        <p className="mb-8 leading-relaxed text-gray-700">
          Most freelancers skim it and sign. That&apos;s how you end up doing
          unlimited revisions for free, waiting 90 days to get paid, or
          discovering the client owns work you never delivered. Here are the
          ten red flags that show up most often in freelance contracts, what
          they actually mean, and what to push back on.
        </p>

        <Flag
          n={1}
          title='"Unlimited revisions until client satisfaction"'
          fix='Cap revisions explicitly. "Two rounds of revisions included; additional rounds billed at $X/hour."'
        >
          This is the most common trap in creative and development contracts.
          &quot;Satisfaction&quot; is subjective and undefined, which means the
          project ends when the client says it ends — not when you&apos;ve
          delivered the scope.
        </Flag>

        <Flag
          n={2}
          title="Payment terms longer than Net 30"
          fix="Net 15 or Net 30, with a deposit upfront (25–50% is standard). Add a late fee clause: 1.5% per month is typical and enforceable in most states."
        >
          Net 60 and Net 90 terms mean you&apos;re floating a loan to your
          client interest-free. For a $5,000 project on Net 90, you&apos;re
          working in January and eating ramen until April.
        </Flag>

        <Flag
          n={3}
          title="IP transfers before payment"
          fix='"Intellectual property transfers to Client upon receipt of final payment." One sentence. Total game-changer.'
        >
          Watch for language like &quot;all work product shall be the sole
          property of Client upon creation.&quot; If the IP transfers the
          moment you create it, you lose your only leverage when the invoice
          goes unpaid.
        </Flag>

        <Flag
          n={4}
          title="Broad indemnification clauses"
          fix="Narrow it to claims arising from your breach or negligence, and cap your total liability at the fees paid under the contract."
        >
          If the contract says you&apos;ll &quot;indemnify and hold harmless
          the Client from any and all claims,&quot; you&apos;ve just agreed to
          pay the client&apos;s legal bills if anyone sues them over anything
          connected to the project — even things outside your control.
        </Flag>

        <CTA />

        <Flag
          n={5}
          title="Non-compete clauses that kill your business"
          fix="Strike it, or narrow it to direct solicitation of the client's own customers."
        >
          Some client contracts quietly prohibit you from working with
          &quot;competitors&quot; for 12–24 months. If you&apos;re a freelancer
          who specializes in an industry, a non-compete in your niche is a
          career ban.
        </Flag>

        <Flag
          n={6}
          title="Termination for convenience — for them, not you"
          fix="Mutual termination rights, plus payment for all work completed through the termination date and a kill fee (often 25% of remaining contract value)."
        >
          A clause letting the client cancel at any time with no kill fee means
          they can pull the plug mid-project and owe you nothing for work in
          progress.
        </Flag>

        <Flag
          n={7}
          title="Vague scope of work"
          fix="Attach a specific deliverables list with quantities, formats, and deadlines. Anything outside it requires a written change order."
        >
          &quot;Designer will provide design services as requested by
          Client&quot; is not a scope. It&apos;s a blank check the client gets
          to cash with your time.
        </Flag>

        <Flag
          n={8}
          title='"Work for hire" combined with portfolio bans'
          fix='Add a portfolio rights clause: "Contractor may display the completed work in portfolios and marketing materials."'
        >
          Work-for-hire is normal in client work. But combined with a
          confidentiality clause that prevents you from showing the work, you
          can&apos;t use the project to win your next client.
        </Flag>

        <Flag
          n={9}
          title="Automatic renewal with locked rates"
          fix="Auto-renewal is fine if rates reset annually or either party can adjust terms with 30 days' notice."
        >
          Retainer agreements that auto-renew at the same rate lock you into
          2024 pricing in 2026. Inflation alone makes this a pay cut.
        </Flag>

        <Flag
          n={10}
          title="Jurisdiction in a state (or country) you've never visited"
          fix="Your home state, or at minimum, binding arbitration that can be conducted remotely."
        >
          If disputes must be resolved in Delaware courts and you live in
          Hawaii, enforcement just got expensive enough that you&apos;ll never
          pursue it — which the client knows.
        </Flag>

        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          The 5-minute check before you sign
        </h2>
        <p className="mb-4 leading-relaxed text-gray-700">
          Reading a contract line-by-line takes an hour you don&apos;t have,
          and a lawyer review costs $300–$500 per contract. That math
          doesn&apos;t work for a $2,000 project.
        </p>
        <p className="mb-4 leading-relaxed text-gray-700">
          That&apos;s why we built ContractFlag. Upload your contract, and in
          under a minute it flags risky clauses — unlimited revisions, IP
          traps, indemnification bombs — in plain English, so you know exactly
          what to negotiate before you sign.
        </p>

        <CTA />

        <p className="mt-10 text-sm italic text-gray-500">
          This article is for informational purposes only and is not legal
          advice. For complex or high-value agreements, consult a licensed
          attorney.
        </p>
      </article>
    </main>
  );
}
