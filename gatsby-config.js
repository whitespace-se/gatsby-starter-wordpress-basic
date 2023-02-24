const {
  falsey,
  loadConfig,
} = require("@whitespace/gatsby-theme-wordpress-basic");
const { startOfDay, parseISO, format: formatDate } = require("date-fns");
const { createProxyMiddleware } = require("http-proxy-middleware");
const gql = require("tagged-template-noop");

loadConfig();

const algoliaUrl = new URL(
  process.env.API_PROXY ||
    process.env.GATSBY_SITE_URL ||
    "http://localhost:3000",
);

const algoliaHosts = [
  {
    protocol: algoliaUrl.protocol.replace(":", ""),
    url: `${algoliaUrl.host}/api/algolia`,
  },
];
const algoliaIndexName = process.env.GATSBY_ALGOLIA_INDEX_NAME;
const algoliaReplicas = [`${algoliaIndexName}_publish_date`];

exports.developMiddleware = (app) => {
  if (process.env.API_PROXY) {
    app.use(
      "/api",
      createProxyMiddleware({
        target: process.env.API_PROXY,
        secure: falsey(process.env.API_PROXY_INSECURE),
        changeOrigin: true,
        followRedirects: false,
        // subscribe to http-proxy's error event
        onError: function onError(err, req, res) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Something went wrong.");
        },
      }),
    );
  }
};

const siteMetadata = {
  author: ``,
  description: `Starter site using Wordpress and Gatsby`,
  siteUrl: process.env.GATSBY_SITE_URL,
  title: `Wordpress Starter`,
};

exports.siteMetadata = siteMetadata;

exports.plugins = [
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
      disableSearchPlugin: false,
      search: {
        paths: {
          search: {
            context: {
              title: "Search",
            },
          },
        },
        // archives: {
        //   post: {
        //     searchBox: true,
        //     facets: {
        //       dates: false,
        //     },
        //   },
        // },
        algolia: {
          appId: process.env.GATSBY_ALGOLIA_APP_ID,
          // Use Admin API key without GATSBY_ prefix, so that the key isn't exposed in the application
          // Tip: use Search API key with GATSBY_ prefix to access the service from within components
          apiKey: process.env.ALGOLIA_ADMIN_KEY,
          searchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
          indexName: algoliaIndexName, // for all queries
          queries: [
            {
              query: gql`
                query {
                  pages: allSitePage(
                    filter: { context: { isIncludedInSearch: { eq: true } } }
                  ) {
                    nodes {
                      id #required by gatsby-plugin-algolia
                      path
                      context {
                        title
                        textContent
                        language
                        publishDate: dateGmt
                        dates: archiveDates
                        modified: modifiedGmt
                        image: featuredImage {
                          node {
                            databaseId
                            base64
                            src
                            srcSet
                            srcWebp
                            srcSetWebp
                            width
                            height
                            alt
                            # caption
                            # credit
                          }
                        }
                        contentType {
                          name
                        }
                      }
                    }
                  }
                  pdfs: wp {
                    mediaItems(where: { mimeType: APPLICATION_PDF }) {
                      nodes {
                        id
                        title
                        publishDate: dateGmt
                        dates: archiveDates
                        modified: modifiedGmt
                        mediaItemUrl

                        # For thumbnail:
                        databaseId
                        base64: base64Uri
                        src: sourceUrl(size: WIDE_LARGE)
                        srcSet: srcSet(size: WIDE_LARGE)
                        srcWebp: sourceUrl(size: WIDE_LARGE)
                        srcSetWebp: srcSet(size: WIDE_LARGE)
                        width(size: WIDE_LARGE)
                        height(size: WIDE_LARGE)
                        alt: altText
                        caption
                        credit
                      }
                    }
                  }
                }
              `,
              queryVariables: {}, // optional. Allows you to use graphql query variables in the query
              transformer: ({ data }) => {
                // console.log(data.pages.nodes.map((page) => page.path));
                return [
                  ...data.pages.nodes.map(
                    ({ context: { ...context }, ...page }) => {
                      return {
                        ...page,
                        ...context,
                        image: context.image && context.image.node,
                        dates:
                          context.dates &&
                          context.dates.map((date) => {
                            let dateObj = startOfDay(parseISO(date));
                            return {
                              formatted: formatDate(dateObj, "yyyy-MM-dd"),
                              numeric: dateObj.valueOf(),
                            };
                          }),
                      };
                    },
                  ),
                  ...data.pdfs.mediaItems.nodes.map(
                    ({
                      dates,
                      mediaItemUrl,
                      databaseId,
                      base64,
                      src,
                      srcSet,
                      srcWebp,
                      srcSetWebp,
                      width,
                      height,
                      alt,
                      ...attributes
                    }) => {
                      return {
                        ...attributes,
                        language: attributes.language || "sv",
                        contentType: {
                          name: "file",
                        },
                        file: {
                          url: mediaItemUrl,
                        },
                        dates: (dates || []).map((date) => {
                          let dateObj = startOfDay(parseISO(date));
                          return {
                            formatted: formatDate(dateObj, "yyyy-MM-dd"),
                            numeric: dateObj.valueOf(),
                          };
                        }),
                        image: src
                          ? {
                              databaseId,
                              base64,
                              src,
                              srcSet,
                              srcWebp,
                              srcSetWebp,
                              width,
                              height,
                              alt,
                            }
                          : undefined,
                      };
                    },
                  ),
                ];
              }, // optional
              // indexName: "", // overrides main index name, optional
              // settings: {
              //   // optional, any index settings
              //   // Note: by supplying settings, you will overwrite all existing settings on the index
              // },
              // mergeSettings: false, // optional, defaults to false. See notes on mergeSettings below
            },
          ],
          // chunkSize: 10000, // default: 1000
          settings: {
            // optional, any index settings
            // Note: by supplying settings, you will overwrite all existing settings on the index
            searchableAttributes: [
              "title",
              "textContent",
              "file.attachment.content",
            ],
            attributesToHighlight: [
              "title",
              "textContent",
              "file.attachment.content",
            ],
            attachmentAttributes: ["file"],
            attributesForFaceting: ["contentType.name"],
            unretrievableAttributes: ["internal"],
            numericAttributesForFiltering: ["dates.numeric"],
            replicas: algoliaReplicas,
            hitsPerPage: 24,
          },
          // mergeSettings: false, // optional, defaults to false. See notes on mergeSettings below
          // concurrentQueries: false, // default: true
          // dryRun: false, // default: false, only calculate which objects would be indexed, but do not push to Algolia
          // continueOnFailure: false, // default: false, don't fail the build if Algolia indexing fails
          algoliasearchOptions: {
            hosts: algoliaHosts,
          }, // default: { timeouts: { connect: 1, read: 30, write: 30 } }, pass any different options to the algoliasearch constructor
        },
      },
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
