import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_TaxonomyForHook on WP_Taxonomy {
    name
  }
`;
