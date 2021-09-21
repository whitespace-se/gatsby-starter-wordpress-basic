import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_TaxonomiesForHook on WP {
    tags(first: 10000) {
      nodes {
        name
        slug
      }
    }
  }
`;
