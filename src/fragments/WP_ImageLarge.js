import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_ImageLarge on WP_MediaItem {
    base64: base64Uri
    src: sourceUrl(size: LARGE)
    srcSet: srcSet(size: LARGE)
    srcWebp: sourceUrl(size: LARGE)
    srcSetWebp: srcSet(size: LARGE)
    width(size: LARGE)
    height(size: LARGE)
    alt: altText
    caption
  }
`;
