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
  --color-black-light: ${COLORS.blackLight};
  --color-white: ${COLORS.white};
  --background-gradient-1: linear-gradient(
    320deg,
    hsl(138deg 37% 86%) 0%,
    hsl(143deg 42% 86%) 11%,
    hsl(149deg 45% 86%) 22%,
    hsl(156deg 51% 86%) 32%,
    hsl(161deg 54% 86%) 43%,
    hsl(167deg 59% 87%) 53%,
    hsl(172deg 64% 87%) 62%,
    hsl(177deg 67% 87%) 72%,
    hsl(184deg 73% 87%) 80%,
    hsl(188deg 76% 87%) 100%
  );
  --background-gradient-1-flipped: linear-gradient(
    40deg,
    hsl(138deg 37% 86%) 0%,
    hsl(143deg 42% 86%) 11%,
    hsl(149deg 45% 86%) 22%,
    hsl(156deg 51% 86%) 32%,
    hsl(161deg 54% 86%) 43%,
    hsl(167deg 59% 87%) 53%,
    hsl(172deg 64% 87%) 62%,
    hsl(177deg 67% 87%) 72%,
    hsl(184deg 73% 87%) 80%,
    hsl(188deg 76% 87%) 100%
  );
  --background-gradient-2: linear-gradient(
  45deg,
  hsl(139deg 94% 75%) 1%,
  hsl(150deg 94% 72%) 33%,
  hsl(159deg 93% 69%) 41%,
  hsl(166deg 92% 67%) 45%,
  hsl(171deg 90% 66%) 48%,
  hsl(176deg 88% 65%) 50%,
  hsl(180deg 85% 66%) 53%,
  hsl(184deg 91% 69%) 57%,
  hsl(188deg 97% 73%) 66%,
  hsl(191deg 100% 76%) 99%
);
  --shadow-color-primary: 139deg 94% 75%;
  --shadow-color-secondary: 191deg 100% 76%;
  --shadow-color-black: 0deg 0% 0%;
  --shadow-color-white: 0deg 0% 100%;
  --shadow-elevation-low-primary: 0.3px 0.5px 0.7px hsl(var(--shadow-color-primary) / 0.27),
    0.4px 0.8px 1px -1.2px hsl(var(--shadow-color-primary) / 0.27),
    0.9px 1.8px 2.3px -2.5px hsl(var(--shadow-color-primary) / 0.27);
  --shadow-elevation-medium-primary: 0.3px 0.5px 0.7px hsl(var(--shadow-color-primary) / 0.29),
    0.8px 1.5px 1.9px -0.8px hsl(var(--shadow-color-primary) / 0.29),
    1.9px 3.7px 4.7px -1.7px hsl(var(--shadow-color-primary) / 0.29),
    4.5px 9px 11.3px -2.5px hsl(var(--shadow-color-primary) / 0.29);
  --shadow-elevation-high-primary: 0.3px 0.5px 0.7px hsl(var(--shadow-color-primary) / 0.27),
    1.2px 2.4px 3px -0.4px hsl(var(--shadow-color-primary) / 0.27),
    2.2px 4.4px 5.5px -0.7px hsl(var(--shadow-color-primary) / 0.27),
    3.6px 7.2px 9.1px -1.1px hsl(var(--shadow-color-primary) / 0.27),
    5.7px 11.5px 14.4px -1.4px hsl(var(--shadow-color-primary) / 0.27),
    9px 17.9px 22.5px -1.8px hsl(var(--shadow-color-primary) / 0.27),
    13.6px 27.2px 34.2px -2.1px hsl(var(--shadow-color-primary) / 0.27),
    20px 40px 50.3px -2.5px hsl(var(--shadow-color-primary) / 0.27);
  --shadow-elevation-low-secondary:
    0.3px 0.5px 0.7px hsl(var(--shadow-color-secondary) / 0.27),
    0.4px 0.8px 1px -1.2px hsl(var(--shadow-color-secondary) / 0.27),
    0.9px 1.8px 2.3px -2.5px hsl(var(--shadow-color-secondary) / 0.27);
  --shadow-elevation-medium-secondary:
    0.3px 0.5px 0.7px hsl(var(--shadow-color-secondary) / 0.29),
    0.8px 1.5px 1.9px -0.8px hsl(var(--shadow-color-secondary) / 0.29),
    1.9px 3.7px 4.7px -1.7px hsl(var(--shadow-color-secondary) / 0.29),
    4.5px 9px 11.3px -2.5px hsl(var(--shadow-color-secondary) / 0.29);
  --shadow-elevation-high-secondary:
    0.3px 0.5px 0.7px hsl(var(--shadow-color-secondary) / 0.27),
    1.2px 2.4px 3px -0.4px hsl(var(--shadow-color-secondary) / 0.27),
    2.2px 4.4px 5.5px -0.7px hsl(var(--shadow-color-secondary) / 0.27),
    3.6px 7.2px 9.1px -1.1px hsl(var(--shadow-color-secondary) / 0.27),
    5.7px 11.5px 14.4px -1.4px hsl(var(--shadow-color-secondary) / 0.27),
    9px 17.9px 22.5px -1.8px hsl(var(--shadow-color-secondary) / 0.27),
    13.6px 27.2px 34.2px -2.1px hsl(var(--shadow-color-secondary) / 0.27),
    20px 40px 50.3px -2.5px hsl(var(--shadow-color-secondary) / 0.27);
  --shadow-elevation-low-black:
    0.3px 0.5px 0.7px hsl(var(--shadow-color-black) / 0.27),
    0.4px 0.8px 1px -1.2px hsl(var(--shadow-color-black) / 0.27),
    0.9px 1.8px 2.3px -2.5px hsl(var(--shadow-color-black) / 0.27);
  --shadow-elevation-medium-black:
    0.3px 0.5px 0.7px hsl(var(--shadow-color-black) / 0.29),
    0.8px 1.5px 1.9px -0.8px hsl(var(--shadow-color-black) / 0.29),
    1.9px 3.7px 4.7px -1.7px hsl(var(--shadow-color-black) / 0.29),
    4.5px 9px 11.3px -2.5px hsl(var(--shadow-color-black) / 0.29);
  --shadow-elevation-high-black:
    0.3px 0.5px 0.7px hsl(var(--shadow-color-black) / 0.27),
    1.2px 2.4px 3px -0.4px hsl(var(--shadow-color-black) / 0.27),
    2.2px 4.4px 5.5px -0.7px hsl(var(--shadow-color-black) / 0.27),
    3.6px 7.2px 9.1px -1.1px hsl(var(--shadow-color-black) / 0.27),
    5.7px 11.5px 14.4px -1.4px hsl(var(--shadow-color-black) / 0.27),
    9px 17.9px 22.5px -1.8px hsl(var(--shadow-color-black) / 0.27),
    13.6px 27.2px 34.2px -2.1px hsl(var(--shadow-color-black) / 0.27),
    20px 40px 50.3px -2.5px hsl(var(--shadow-color-black) / 0.27);
  --shadow-elevation-low-white:
    0.3px 0.5px 0.7px hsl(var(--shadow-color-white) / 0.27),
    0.4px 0.8px 1px -1.2px hsl(var(--shadow-color-white) / 0.27),
    0.9px 1.8px 2.3px -2.5px hsl(var(--shadow-color-white) / 0.27);
  --shadow-elevation-medium-white:
    0.3px 0.5px 0.7px hsl(var(--shadow-color-white) / 0.29),
    0.8px 1.5px 1.9px -0.8px hsl(var(--shadow-color-white) / 0.29),
    1.9px 3.7px 4.7px -1.7px hsl(var(--shadow-color-white) / 0.29),
    4.5px 9px 11.3px -2.5px hsl(var(--shadow-color-white) / 0.29);
  --shadow-elevation-high-white:
    0.3px 0.5px 0.7px hsl(var(--shadow-color-white) / 0.27),
    1.2px 2.4px 3px -0.4px hsl(var(--shadow-color-white) / 0.27),
    2.2px 4.4px 5.5px -0.7px hsl(var(--shadow-color-white) / 0.27),
    3.6px 7.2px 9.1px -1.1px hsl(var(--shadow-color-white) / 0.27),
    5.7px 11.5px 14.4px -1.4px hsl(var(--shadow-color-white) / 0.27),
    9px 17.9px 22.5px -1.8px hsl(var(--shadow-color-white) / 0.27),
    13.6px 27.2px 34.2px -2.1px hsl(var(--shadow-color-white) / 0.27),
    20px 40px 50.3px -2.5px hsl(var(--shadow-color-white) / 0.27);
}

a {
  color: inherit;
  text-decoration: none;
}


`;

export default GlobalStyles;
