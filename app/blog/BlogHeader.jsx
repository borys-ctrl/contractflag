import Link from "next/link";

const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export default function BlogHeader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        flexWrap: "wrap",
        marginBottom: "44px",
        paddingBottom: "20px",
        borderBottom: "1px solid #ECEAE4",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none", color: "#16140F" }}>
        <span
          style={{
            width: "26px",
            height: "26px",
            background: "#E5C97E",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
          }}
        >
          ⚑
        </span>
        <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "18px", fontWeight: 700 }}>
          ContractFlag
        </span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <Link href="/blog" style={{ fontFamily: sans, fontSize: "14px", color: "#5C5A54", textDecoration: "none", fontWeight: 500 }}>
          All guides
        </Link>
        <Link
          href="/app-route"
          style={{
            fontFamily: sans,
            fontSize: "13px",
            fontWeight: 600,
            color: "#fff",
            background: "#16140F",
            padding: "8px 16px",
            borderRadius: "7px",
            textDecoration: "none",
          }}
        >
          Analyze a contract →
        </Link>
      </div>
    </div>
  );
}
