import { ThemeProps } from "🎰/types/utils/useTheme";
import React from "react";

export default function Theme(Props: ThemeProps) {
    const [Theme, setTheme] = React.useState(Props.defaultTheme);

    React.useEffect(() => {
        let loop: NodeJS.Timeout;

        if (typeof window !== "undefined") {
            let LocalStorage = localStorage.getItem("theme");

            if (LocalStorage) {
                setTheme(LocalStorage);

                loop = setInterval(() => {
                    LocalStorage = localStorage.getItem("theme");

                    setTheme(LocalStorage!);
                }, 125);
            } else {
                localStorage.setItem("theme", Props.defaultTheme);
            }
        }

        return () => {
            clearInterval(loop);
        };
    }, [Props.defaultTheme]);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", Theme);

            const allThemes = ["dark", "light", "system", ...Props.themes];

            allThemes.forEach((theme) => {
                if (Theme === theme) {
                    document.documentElement.classList.add(theme);
                } else {
                    document.documentElement.classList.remove(theme);
                }
            });

            if (Theme === "system") {
                const PreferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";

                if (PreferredTheme === "dark") {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
            }
        }
    }, [Theme, Props.themes]);

    (globalThis as any).themeProvider = {
        theme: Theme,
        setTheme: setTheme,
    };

    return Props.children;
}

export const useTheme = () => {
    return (globalThis as any).themeProvider;
};