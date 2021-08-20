import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_TaxonomiesForHook on WP {
    tags {
      nodes {
        name
        slug
      }
    }
  }
`;
