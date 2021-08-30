import { loadConfig } from "@whitespace/gatsby-theme-wordpress-basic";

loadConfig();

export const siteMetadata = {
  siteUrl: process.env.GATSBY_SITE_URL,
  title: `Wordpress Starter`,
  description: `Starter site using Wordpress and Gatsby`,
};

export const plugins = [
  {
    resolve: "@whitespace/gatsby-theme-wordpress-basic",
    options: {
      basePath: __dirname,
      fragmentsDir: `${__dirname}/src/fragments`,
      i18next: {
        defaultLanguage: "en",
        languages: ["en"],
      },
      wp: {
        url: `${process.env.GATSBY_WORDPRESS_URL}/graphql`,
        refetchInterval: process.env.WORDPRESS_REFETCH_INTERVAL,
        nodesPerFetch: Number(process.env.WORDPRESS_NODES_PER_FETCH),
      },
      // XXX: postcss.config.js doesn’t seem to load automatically
      postCss: { postcssOptions: require("./postcss.config")() },
    },
  },
];
