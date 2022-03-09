import { createGlobalStyle } from "styled-components";
import { COLORS } from "~/constants";

const GlobalStyles = createGlobalStyle`

/*
  1. Use a more-intuitive box-sizing model.
*/
*, *::before, *::after {
  box-sizing: border-box;
}
/*
  2. Remove default margin
*/
* {
  margin: 0;
}
/*
  3. Allow percentage-based heights in the application
*/
html, body, #root, #__next {
  height: 100%;
  font-family: 'Varela Round', sans-serif;
}
/*
  Typographic tweaks!
  4. Add accessible line-height
  5. Improve text rendering
*/
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
/*
  6. Improve media defaults
*/
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}
/*
  7. Remove built-in form typography styles
*/
input, button, textarea, select {
  font: inherit;
}
/*
  8. Avoid text overflows
*/
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}
/*
  9. Create a root stacking context
*/
#root, #__next {
  isolation: isolate;
}

html {
  --color-primary: ${COLORS.primary};
  --color-primary-dark: ${COLORS.primaryDark};
  --color-primary-light: ${COLORS.primaryLight};
  --color-secondary: ${COLORS.secondary};
  --color-secondary-dark: ${COLORS.secondaryDark};
  --color-secondary-light: ${COLORS.secondaryLight};
  --color-black: ${COLORS.black};
  --color-white: ${COLORS.white};
  --shadow-color: 139deg 57% 52%;
  --shadow-elevation-low:
    0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.27),
    0.4px 0.8px 1px -1.2px hsl(var(--shadow-color) / 0.27),
    0.9px 1.8px 2.3px -2.5px hsl(var(--shadow-color) / 0.27);
  --shadow-elevation-medium:
    0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.29),
    0.8px 1.5px 1.9px -0.8px hsl(var(--shadow-color) / 0.29),
    1.9px 3.7px 4.7px -1.7px hsl(var(--shadow-color) / 0.29),
    4.5px 9px 11.3px -2.5px hsl(var(--shadow-color) / 0.29);
  --shadow-elevation-high:
    0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.27),
    1.2px 2.4px 3px -0.4px hsl(var(--shadow-color) / 0.27),
    2.2px 4.4px 5.5px -0.7px hsl(var(--shadow-color) / 0.27),
    3.6px 7.2px 9.1px -1.1px hsl(var(--shadow-color) / 0.27),
    5.7px 11.5px 14.4px -1.4px hsl(var(--shadow-color) / 0.27),
    9px 17.9px 22.5px -1.8px hsl(var(--shadow-color) / 0.27),
    13.6px 27.2px 34.2px -2.1px hsl(var(--shadow-color) / 0.27),
    20px 40px 50.3px -2.5px hsl(var(--shadow-color) / 0.27);}

a {
  color: inherit;
  text-decoration: none;
}


`;

export default GlobalStyles;