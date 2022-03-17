const BREAKPOINTS = {
  tablet: 600,
  laptop: 950,
  desktop: 1300,
};

const QUERIES = {
  phoneAndSmaller: `(max-width: ${BREAKPOINTS.tablet / 16}rem)`,
  tabletAndSmaller: `(max-width: ${BREAKPOINTS.laptop / 16}rem)`,
  laptopAndSmaller: `(max-width: ${BREAKPOINTS.desktop / 16}rem)`,
};

export const COLORS = {
  primary: "hsl(139deg 94% 75%)",
  primaryDark: "hsl(139deg 94% 65%)",
  primaryLight: "hsl(139deg 94% 85%)",
  secondary: "hsl(191deg 100% 76%)",
  secondaryDark: "hsl(191deg 100% 61%)",
  secondaryLight: "hsl(191deg 100% 86%)",
  black: "hsl(0deg 0% 0%)",
  blackLight: "hsl(220deg 14% 8%)",
  white: "hsl(0deg 0% 100%)",
};

export const THEME = {
  QUERIES,
};
