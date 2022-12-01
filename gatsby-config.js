import { loadConfig, truey } from "@whitespace/gatsby-theme-wordpress-basic";

loadConfig();

export const siteMetadata = {
  author: ``,
  description: `Starter site using Wordpress and Gatsby`,
  siteUrl: process.env.GATSBY_SITE_URL,
  title: `Wordpress Starter`,
};

export const plugins = [
  {
    resolve: "@whitespace/gatsby-theme-wordpress-basic",
    options: {
      basePath: __dirname,
      fragmentsDir: `${__dirname}/src/fragments`,
      siteMetadata,
      i18next: {
        defaultLanguage: "en",
        languages: ["en"],
      },
      wp: {
        url: process.env.GATSBY_WORDPRESS_URL,
        refetchInterval: process.env.WORDPRESS_REFETCH_INTERVAL,
        nodesPerFetch: Number(process.env.WORDPRESS_NODES_PER_FETCH),
      },
      search: {
        paths: ["search"],
      },
      disableSearchPlugin: false,
      disableDefaultArchivePages: false,
      siteIndex: {
        includePage: ({ page }) =>
          page.context.contentType && page.context.contentType.name === "page",
        localizations: {
          en: {
            basePath: "/content",
            alphabet: Array.from("abcdefghijklmnopqrstuvwxyz"),
            restInitial: {
              path: "/other-pages",
              title: "Other pages",
              label: "#",
            },
          },
        },
      },
      enableSEO: true,
      manifest: {
        name: siteMetadata.title,
        short_name: siteMetadata.title,
        start_url: "/",
        background_color: "#336699",
        theme_color: "#336699",
        display: "standalone",
        icon: "src/images/icon.png",
        crossOrigin: `use-credentials`,
        include_favicon: true,
      },
      robotsTxt: {
        host: `${siteMetadata.siteUrl}`,
        sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
        env: {
          development: {
            policy: [{ userAgent: "*", disallow: ["/"] }],
          },
          production: {
            policy: [{ userAgent: "*", allow: "/" }],
          },
        },
      },
      // XXX: postcss.config.js doesn’t seem to load automatically
      postCss: { postcssOptions: require("./postcss.config")() },
    },
  },
  {
    resolve: "@whitespace/gatsby-plugin-cookie-consent",
    options: { head: true },
  },
];
