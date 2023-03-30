import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_PostForSearch on WP_Post {
    __typename # Placeholder value to prevent Gatsby from throwing an error.
  }
`;
