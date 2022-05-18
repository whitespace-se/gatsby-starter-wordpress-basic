import { graphql } from "gatsby";

export const query = graphql`
  fragment SitePageContextForPageBreadcrumbs on SitePageContext {
    title
    isArchivePage
    isSiteIndexPage
    label
  }
`;
