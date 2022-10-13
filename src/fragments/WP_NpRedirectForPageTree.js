import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_NpRedirectForPageTree on WP_NpRedirect {
    id
  }
`;
