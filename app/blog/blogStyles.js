import Link from "next/link";

export const s = {
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
  h1: { fontSize: "42px", lineHeight: 1.15, fontWeight: 700, margin: "0 0 24px", letterSpacing: "-0.5px" },
  lede: { fontSize: "21px", lineHeight: 1.5, color: "#444", margin: "0 0 12px" },
  p: { fontSize: "19px", lineHeight: 1.65, margin: "0 0 22px" },
  h2: { fontSize: "28px", lineHeight: 1.25, fontWeight: 700, margin: "44px 0 14px", letterSpacing: "-0.3px" },
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
  cta: { margin: "48px 0", padding: "32px 28px", background: "#0f172a", borderRadius: "12px", textAlign: "center" },
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
  card: {
    display: "block",
    padding: "26px 28px",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    marginBottom: "20px",
    textDecoration: "none",
    color: "#1a1a1a",
  },
  cardTitle: { fontSize: "24px", fontWeight: 700, lineHeight: 1.3, margin: "0 0 10px", letterSpacing: "-0.3px" },
  cardDesc: { fontSize: "17px", lineHeight: 1.6, color: "#555", margin: 0 },
  backLink: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    fontSize: "15px",
    color: "#2563eb",
    textDecoration: "none",
  },
};

export function CTA() {
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
