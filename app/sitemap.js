export default function sitemap() {
  const base = "https://contractflag.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/blog/freelance-contract-red-flags`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/review-contract-without-lawyer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/nda-red-flags-before-signing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
