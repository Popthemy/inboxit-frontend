import { Helmet } from "react-helmet-async";

const SITE_URL = "https://inboxit-frontend.vercel.app";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  jsonLd?: object | object[];
  noindex?: boolean;
}

export function SEO({ title, description, path = "/", type = "website", jsonLd, noindex }: SEOProps) {
  const url = `${SITE_URL}${path}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
}
