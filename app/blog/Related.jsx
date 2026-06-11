import Link from "next/link";
import { s } from "./blogStyles";

const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const all = [
  {
    slug: "freelance-contract-red-flags",
    title: "10 Freelance Contract Red Flags to Catch Before You Sign",
  },
  {
    slug: "review-contract-without-lawyer",
    title: "How to Review a Contract Without a Lawyer: A 7-Step Checklist",
  },
  {
    slug: "nda-red-flags-before-signing",
    title: "What to Look for in an NDA Before Signing: 8 Red Flags",
  },
  {
    slug: "indemnification-clause-explained",
    title: "Indemnification Clauses Explained in Plain English",
  },
  {
    slug: "ai-contract-review",
    title: "AI Contract Review: What It Catches, What It Misses, What It Costs",
  },
];

export default function Related({ current }) {
  const i = all.findIndex((a) => a.slug === current);
  const next = all[(i + 1) % all.length];
  const others = all.filter((a) => a.slug !== current && a.slug !== next.slug);
  return (
    <div style={{ margin: "48px 0 0" }}>
      <Link
        href={`/blog/${next.slug}`}
        style={{
          display: "block",
          padding: "22px 24px",
          border: "1px solid #ECEAE4",
          borderLeft: "4px solid #E5C97E",
          borderRadius: "12px",
          textDecoration: "none",
          color: "#16140F",
          background: "#FBFAF7",
          marginBottom: "28px",
        }}
      >
        <span
          style={{
            display: "block",
            fontFamily: sans,
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#9A7B2D",
            marginBottom: "8px",
          }}
        >
          READ NEXT
        </span>
        <span style={{ fontSize: "21px", fontWeight: 700, lineHeight: 1.35 }}>{next.title} →</span>
      </Link>
      <h2 style={{ ...s.h2, fontSize: "20px", margin: "0 0 14px" }}>More guides</h2>
      {others.map((a) => (
        <p key={a.slug} style={{ ...s.p, margin: "0 0 10px", fontSize: "17px" }}>
          <Link href={`/blog/${a.slug}`} style={{ color: "#9A7B2D" }}>
            {a.title} →
          </Link>
        </p>
      ))}
    </div>
  );
}
