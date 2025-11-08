import React from "react";
import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  url,
  image,
  keywords,
  noindex = false,
  jsonLd,
}) {
  return (
    <Helmet>
      {/* ✅ Basic Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="googlebot" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={url} />

      {/* ✅ Open Graph (Facebook / LinkedIn) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      {/* ✅ Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* ✅ Structured Data (JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
