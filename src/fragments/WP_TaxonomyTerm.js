import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_TaxonomyTerm on WP_TermNode {
    name
    slug
    count
  }
`;
