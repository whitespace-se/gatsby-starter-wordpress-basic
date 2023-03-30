import { mergeThemes } from "@wsui/base";
import theme from "@wsui/theme-standard";

import "./index.css";

export default mergeThemes(theme, {
  typography: {
    fonts: {
      Inter: "/fonts/Inter.var.woff2",
    },
  },
});
