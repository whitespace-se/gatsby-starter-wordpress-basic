const fs = require("fs");
const path = require("path");

const { loadConfig } = require("@whitespace/gatsby-theme-wordpress-basic");
const fetch = require("node-fetch");

loadConfig();

fetch(`${process.env.GATSBY_WORDPRESS_URL}/graphql`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then((result) => result.json())
  .then((result) => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      (type) => type.possibleTypes !== null,
    );
    result.data.__schema.types = filteredData;
    fs.writeFileSync(
      path.resolve(__dirname, "../shared/wp-fragment-types.json"),
      JSON.stringify(result.data),
      (err) => {
        if (err) {
          console.error("Error writing fragmentTypes file", err);
        } else {
          console.info("Fragment types successfully extracted!");
        }
      },
    );
  });
