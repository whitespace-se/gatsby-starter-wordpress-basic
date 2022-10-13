import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_PageForPageTree on WP_Page {
    label
    ... on WP_NodeWithFeaturedImage {
      featuredImage {
        node {
          ...WP_ImageMedium
        }
      }
    }
  }
`;
