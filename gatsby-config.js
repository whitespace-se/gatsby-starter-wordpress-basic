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
      search: {
        paths: ["search"],
      },
      // XXX: postcss.config.js doesn’t seem to load automatically
      postCss: { postcssOptions: require("./postcss.config")() },
    },
  },
  {
    resolve: "@whitespace/gatsby-plugin-matomo",
    options: {
      mtmContainerId: "1234567890",
      includeInDevelopment: true,
      // mtmDefaultDataVariable: Joi.alternatives()
      //   .try(Joi.object(), Joi.function())
      //   .default(null)
      //   .description(
      //     `Data variable to be set before Matomo plugin is loaded. Should be an object or a function.`,
      //   ),
      // mtmDataVariableName: Joi.string().description(`Data variable name.`),
      // mtmPAQDefaultDataVariable: Joi.alternatives()
      //   .try(Joi.object(), Joi.function())
      //   .default(null)
      //   .description(
      //     `Data variable for PAQ to be set before Matomo plugin is loaded. Should be an object or a function.`,
      //   ),
      // mtmPAQDataVariableName: Joi.string().description(`PAQ Data variable name.`),
      routeChangeEventName: `gatsby-route-change`,
      mtmHost: `https://matomo.example.com`,
    },
  },
];
