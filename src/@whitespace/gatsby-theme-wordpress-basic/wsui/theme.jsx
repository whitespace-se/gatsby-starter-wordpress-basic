import parentTheme from "@whitespace/gatsby-theme-wordpress-basic/src/wsui/theme.jsx";
import { mergeThemes } from "@wsui/base";

import childTheme from "../../../wsui/theme.jsx";

export default mergeThemes(parentTheme, childTheme);
