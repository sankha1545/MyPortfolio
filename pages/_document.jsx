import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Basic SEO */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Site Verification (optional later) */}
        {/* <meta name="google-site-verification" content="XXXX" /> */}

        {/* JSON-LD: Person / Developer Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Sankha Subhra Das",
              url: "https://www.sankhasubhradasportfolio.in",
              jobTitle: "Full-Stack Developer",
              sameAs: [
                "https://github.com/sankha1545",
                "https://www.linkedin.com/in/sankha-subhra-das-625ab6201/",
              ],
              knowsAbout: [
                "React",
                "Next.js",
                "Node.js",
                "Docker",
                "AWS",
                "DevOps",
                "CI/CD",
                "Web Performance",
              ],
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
