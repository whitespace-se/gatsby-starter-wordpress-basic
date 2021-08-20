import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_PostForSearch on WP_Post {
    tags {
      nodes {
        link
        name
        slug
        uri
        id
      }
    }
  }
`;
