import Link from "next/link";
import { s, CTA } from "./blogStyles";

export const metadata = {
  title: "Contract Review Guides & Red Flag Checklists | ContractFlag Blog",
  description:
    "Plain-English guides to reviewing contracts: freelance contract red flags, NDA checklists, indemnification explained, and how to review agreements without a lawyer.",
  alternates: { canonical: "https://contractflag.app/blog" },
};

const posts = [
  {
    slug: "ai-contract-review",
    title: "AI Contract Review in 2026: What It Catches, What It Misses, What It Costs",
    desc: "An honest breakdown of AI contract review — what it reliably flags, where a lawyer still wins, and the cost math for freelancers and small businesses.",
  },
  {
    slug: "indemnification-clause-explained",
    title: "Indemnification Clauses Explained in Plain English (With Examples)",
    desc: "What 'indemnify, defend, and hold harmless' actually commits you to — and the three exact sentences to negotiate so a $4,000 project can't become unlimited liability.",
  },
  {
    slug: "nda-red-flags-before-signing",
    title: "What to Look for in an NDA Before Signing: 8 Red Flags",
    desc: "One-way obligations, perpetual terms, hidden non-competes — the eight things to check in the five minutes before you sign any NDA.",
  },
  {
    slug: "freelance-contract-red-flags",
    title: "10 Freelance Contract Red Flags to Catch Before You Sign",
    desc: "Unpaid revision traps, IP grabs, indemnification bombs — the ten clauses that cost freelancers the most, and exactly what to push back on.",
  },
  {
    slug: "review-contract-without-lawyer",
    title: "How to Review a Contract Without a Lawyer: A 7-Step Checklist",
    desc: "A systematic way to review any business contract yourself — what to read first, what to skip, and the honest answer on when you need an attorney.",
  },
];

export default function Blog() {
  return (
    <div style={s.page}>
      <main style={s.main}>
        <p style={s.kicker}>ContractFlag Blog</p>
        <h1 style={s.h1}>Contract guides, in plain English</h1>
        <p style={{ ...s.lede, marginBottom: "40px" }}>
          Checklists and explainers for reviewing contracts before you sign — no law degree
          required.
        </p>
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} style={s.card}>
            <h2 style={s.cardTitle}>{p.title}</h2>
            <p style={s.cardDesc}>{p.desc}</p>
          </Link>
        ))}
        <CTA />
      </main>
    </div>
  );
}
