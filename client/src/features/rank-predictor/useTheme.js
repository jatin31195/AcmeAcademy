/**
 * useTheme — light-mode shim for the NIMCET Rank Predictor.
 *
 * The standalone rank-predictor app shipped its own dark/light ThemeContext +
 * toggle in its Navbar. Inside the ACME site we render these pages within the
 * site's own shell (which is light), so we force light mode here. All the
 * `theme === "dark"` branches in the pages simply resolve to the light values,
 * keeping the design consistent with the rest of the website.
 */
export const useTheme = () => ({ theme: "light", toggleTheme: () => {} });
