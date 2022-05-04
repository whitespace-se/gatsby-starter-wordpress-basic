import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_ContentTypesForHook on WP {
    contentTypes(first: 1000) {
      nodes {
        labels {
          menuName
          name
          singularName
        }
        name
        slug
        uri
      }
    }
  }
`;
