import Link from "next/link";
import { s } from "./blogStyles";

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
  const others = all.filter((a) => a.slug !== current).slice(0, 3);
  return (
    <div style={{ margin: "48px 0 0" }}>
      <h2 style={{ ...s.h2, fontSize: "22px", margin: "0 0 16px" }}>Related guides</h2>
      {others.map((a) => (
        <p key={a.slug} style={{ ...s.p, margin: "0 0 10px" }}>
          <Link href={`/blog/${a.slug}`} style={{ color: "#9A7B2D" }}>
            {a.title} →
          </Link>
        </p>
      ))}
    </div>
  );
}
