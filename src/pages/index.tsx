import { useEffect, useState } from "react";
import { BadgeAlert, BadgeCheck, BookCopy, CalendarDays, Code2, ExternalLink, FileWarning, Folders, GitPullRequest, Moon, PhoneCallIcon, Star, Sun, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import DiscordIcon from "🎰/components/icons/Discord";
import GithubIcon from "🎰/components/icons/Github";
import { Button } from "🎰/components/ui/button";
import { Separator } from "🎰/components/ui/separator";
import { GitHubUser } from "🎰/types/globals/gitUser";
import TikTokIcon from "🎰/components/icons/TikTok";

type AcceptedThemes = "dark" | "light" | "system";

export default function Base() {
    const [theme, setTheme] = useState<AcceptedThemes>("light");
    const [GithubUser, setGithubUser] = useState<GitHubUser | null>(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedTheme = localStorage.getItem("theme") as AcceptedThemes;
            setTheme(storedTheme || "light");

            window.addEventListener("scroll", () => {
                setIsScrolling(window.scrollY > 0);
            });

            return () => {
                window.removeEventListener("scroll", () => {
                    setIsScrolling(window.scrollY > 0);
                });
            };
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!GithubUser) {
                setError("Something went wrong, please contact scarlot!\n" + "Timeout after 30 seconds.");
                setIsLoading(false);
            }
        }, 30000);

        if (GithubUser) {
            setIsLoading(false);
            clearTimeout(timeout);
        }

        if (!GithubUser) {
            fetch("/api/git")
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.data) {
                        setGithubUser(data.data);
                    } else {
                        setError("Something went wrong, please contact scarlot!\n" + data.error);
                    }
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching GitHub user data:", err);
                    setError("Something went wrong, please contact scarlot!\n" + err.message);
                    setIsLoading(false);
                });
        }

        return () => clearTimeout(timeout);
    }, [GithubUser]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <p className="text-xl text-muted-foreground">Loading portfolio...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <p className="text-xl text-destructive">{error}</p>
            </div>
        );
    }

    type SYButtonProps = {
        icon?: React.ReactNode;
        text?: string;
        target?: string;
        link?: string;
        onSubmit?: () => void;
        className?: string;
    }

    const SYButton = function (props: SYButtonProps) {
        if (!props.link && !props.onSubmit) {
            return null;
        }

        return (
            <Button
                variant="ghost"
                size={props.text ? "default" : "icon"}
                className={`border bg-muted hover:bg-muted/50 transition-all ${props.className || ""}`}
                onClick={() => {
                    if (props.onSubmit && props.link) {
                        window.open(props.link, props.target || "_blank");
                        props.onSubmit();
                    } else if (props.onSubmit && !props.link) {
                        props.onSubmit();
                    } else if (props.link && !props.onSubmit) {
                        window.open(props.link, props.target || "_blank");
                    } else {
                        console.error("No link or onSubmit function provided.");
                    }
                }}
            >
                {props.icon}
                {props.text && (
                    <span className="text-sm text-muted-foreground ml-2">
                        {props.text}
                    </span>
                )}
            </Button>
        );
    };

    const GetButtons = () => (
        GithubUser && (
            <div className="flex items-center gap-4">
                <SYButton
                    icon={
                        <TikTokIcon
                            className="text-foreground"
                            width={24}
                            height={24}
                            fill="currentColor"
                        />
                    }
                    link="https://tiktok.com/@scarlotruskipy"
                />


                <SYButton
                    icon={
                        <DiscordIcon
                            className="text-discord"
                            width={24}
                            height={24}
                            fill="currentColor"
                        />
                    }
                    link="https://discord.gg/EF7TZWEgjT"
                />

                <SYButton
                    icon={
                        <GithubIcon
                            className="text-foreground"
                            width={24}
                            height={24}
                            fill="currentColor"
                        />
                    }
                    link="https://github.com/Scarlot-Ruskipy"
                />

                <Separator orientation="vertical" className="!h-5 !w-0.5 rounded-full" />

                <SYButton
                    icon={theme === "dark" ? (
                        <Moon className="text-foreground" />
                    ) : (
                        <Sun className="text-muted-foreground" />
                    )}
                    onSubmit={() => {
                        setTheme(theme === "dark" ? "light" : "dark");
                    }}
                />
            </div>
        )
    )

    const Projects = [
        {
            title: "PhantomGuard",
            description: "A powerful and easy to use standalone anti-cheat for FiveM.",
            image: "/assets/images/FB1UwA1yV8ukWcuvYiQJ.png",
            link: "https://phantomguard.eu",
            languages: ["Lua", "JavaScript", "TypeScript", "React"],
            discontinued: false,
            owned_by_me: true
        },
        {
            title: "Ikcheatniet",
            description: "Ikcheatniet is a simple API that allows you to check if a Discord User is inside of a cheating server.",
            image: "/assets/images/g7FJjW17AZeo9HN9VsKL.png",
            link: "https://ikcheatniet.nl",
            languages: ["TypeScript"],
            discontinued: false,
            owned_by_me: true
        },
        {
            title: "Urlcut",
            description: "An encrypted URL shortener, with a focus on privacy and speed.",
            image: "/assets/images/50WJnJzrcnNiXIVYwwpu.png",
            link: "https://urlcut.co.uk",
            languages: ["TypeScript", "React"],
            discontinued: true,
            owned_by_me: false
        },
    ]

    return (
        <>
            <header
                className={`container mx-auto py-8 px-4 sticky top-0 z-10 backdrop-blur-sm border-b transition-all ${isScrolling ? "-translate-y-5" : ""
                    }`}
                onMouseEnter={() => setIsScrolling(false)}
                onMouseLeave={() => {
                    let IsScrolling = false;

                    if (typeof window !== "undefined") {
                        IsScrolling = window.scrollY > 0;
                    }

                    setIsScrolling(IsScrolling);
                }}
            >
                <div
                    className={`flex flex-col md:flex-row justify-between items-center gap-4 select-none ${!isScrolling ? "opacity-100" : "opacity-50"
                        }`}
                >
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight animate-fade-in">
                            {GithubUser && GithubUser.user.name}
                        </h1>
                    </div>
                    <GetButtons />
                </div>
            </header>

            {/* Intro */}
            <main className="container mx-auto px-4 pb-16">
                <section className="py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    <div className="flex-1 justify-center animate-fade-in-right select-none flex md:hidden">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4">
                            {GithubUser ? (
                                <Image width={512} height={512} src={GithubUser.user.avatar_url} alt={`Profile Picture`} draggable={"false"} />
                            ) : (
                                <div className="p-5 bg-gray-200 h-full blur-2xl"></div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 animate-fade-in-left">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Who am I?</h2>
                        <p className="text-xl text-muted-foreground">
                            {GithubUser && GithubUser.user.bio}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <SYButton
                                icon={
                                    <BookCopy />
                                }
                                text="Projects"
                                target="_self"
                                link="#projects"
                            />
                            <SYButton
                                icon={
                                    <PhoneCallIcon />
                                }
                                text="Contact"
                                target="_self"
                                link="#contact"
                            />
                        </div>
                    </div>

                    <div className="flex-1 justify-center animate-fade-in-right select-none hidden md:flex">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4">
                            {GithubUser ? (
                                <Image width={512} height={512} src={GithubUser.user.avatar_url} alt={`Profile Picture`} draggable={"false"} />
                            ) : (
                                <div className="p-5 bg-gray-200 h-full blur-2xl"></div>
                            )}
                        </div>
                    </div>
                </section>

                {/* GitHub stats */}
                <section className="px-4 py-16 md:py-24 flex flex-col items-center gap-8 md:gap-16 max-w-full">
                    <div className="flex-1 space-y-4 animate-fade-in-left text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
                            <span className="github-font">GitHub</span> Stats
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground">
                            A quick overview of my GitHub activity, repositories, and contributions.
                        </p>
                    </div>

                    {GithubUser ? (
                        <div className="p-4 sm:p-8 bg-card rounded-lg shadow-md w-full max-w-8xl select-none">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                                {/* Public Repositories */}
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl sm:text-4xl bg-secondary p-3 sm:p-4 rounded-full text-foreground">
                                        <Folders className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold">Public Repositories</h3>
                                        <p className="text-xl sm:text-2xl font-bold">{GithubUser.user.public_repos}</p>
                                    </div>
                                </div>

                                {/* Followers */}
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl sm:text-4xl bg-secondary p-3 sm:p-4 rounded-full text-foreground">
                                        <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold">Followers</h3>
                                        <p className="text-xl sm:text-2xl font-bold">{GithubUser.user.followers}</p>
                                    </div>
                                </div>

                                {/* Following */}
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl sm:text-4xl bg-secondary p-3 sm:p-4 rounded-full text-foreground">
                                        <UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold">Following</h3>
                                        <p className="text-xl sm:text-2xl font-bold">{GithubUser.user.following}</p>
                                    </div>
                                </div>

                                {/* Total Stars */}
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl sm:text-4xl bg-secondary p-3 sm:p-4 rounded-full text-foreground">
                                        <Star className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold">Total Stars</h3>
                                        <p className="text-xl sm:text-2xl font-bold">{GithubUser.totalStars}</p>
                                    </div>
                                </div>

                                {/* Total Issues */}
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl sm:text-4xl bg-secondary p-3 sm:p-4 rounded-full text-foreground">
                                        <FileWarning className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold">Total Issues</h3>
                                        <p className="text-xl sm:text-2xl font-bold">{GithubUser.totalIssues}</p>
                                    </div>
                                </div>

                                {/* Total Pull Requests */}
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl sm:text-4xl bg-secondary p-3 sm:p-4 rounded-full text-foreground">
                                        <GitPullRequest className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold">Total Pull Requests</h3>
                                        <p className="text-xl sm:text-2xl font-bold">{GithubUser.totalPRs}</p>
                                    </div>
                                </div>

                                {/* Commits This Year */}
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl sm:text-4xl bg-secondary p-3 sm:p-4 rounded-full text-foreground">
                                        <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold">Commits This Year</h3>
                                        <p className="text-xl sm:text-2xl font-bold">{GithubUser.totalCommitsThisYear}</p>
                                    </div>
                                </div>

                                {/* Total Commits */}
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl sm:text-4xl bg-secondary p-3 sm:p-4 rounded-full text-foreground">
                                        <Code2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold">Total Commits</h3>
                                        <p className="text-xl sm:text-2xl font-bold">{GithubUser.totalCommitsAll}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Most Used Languages */}
                            <div className="mt-4 sm:mt-8">
                                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Most Used Languages</h3>
                                <ul className="space-y-2">
                                    {GithubUser.mostUsedLanguages.map((lang, index) => (
                                        <li
                                            key={index}
                                            className="flex justify-between items-center bg-secondary p-2 sm:p-3 rounded-md"
                                        >
                                            <span className="text-sm sm:text-base">{lang.language}</span>
                                            <span className="badge bg-primary text-primary-foreground px-2 py-1 rounded-lg text-xs sm:text-sm">
                                                {lang.amount}%
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <p>Loading GitHub stats...</p>
                        </div>
                    )}
                </section>

                {/* Projects Section */}
                <section className="px-4 py-16 md:py-24 flex flex-col items-center gap-8 md:gap-16">
                    <div className="flex-1 space-y-4 animate-fade-in-left text-center" id="projects">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">Projects</h2>
                        <p className="text-lg sm:text-xl text-muted-foreground">
                            Here are some of my projects that I have worked on. Click on the button to view the project&apos;s page.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full">
                        {Projects.map((project, index) => (
                            <div
                                key={index}
                                className="p-4 bg-card rounded-lg shadow-md flex flex-col items-start justify-between"
                            >
                                <div>
                                    <div className="relative w-full h-40 rounded-md overflow-hidden mb-4">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-base sm:text-lg font-semibold">{project.title}</h3>
                                        <div className="flex gap-2">
                                            {project.owned_by_me && (
                                                <span className="badge bg-primary text-primary-foreground px-2 py-1 rounded text-xs items-center">
                                                    Owned <BadgeCheck className="inline h-4 w-4 text-yellow-600" />
                                                </span>
                                            )}
                                            {project.discontinued && (
                                                <span className="badge bg-destructive text-white px-2 py-1 rounded text-xs items-center">
                                                    Discontinued <BadgeAlert className="inline h-4 w-4 text-white" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.languages.map((lang, langIndex) => (
                                            <span
                                                key={langIndex}
                                                className="badge bg-primary text-primary-foreground px-2 py-1 rounded text-xs items-center"
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm sm:text-base text-foreground/75 mb-4">
                                        {project.description}
                                    </p>
                                </div>

                                {project.discontinued && (
                                    <div className="mb-2 text-sm text-muted-foreground">
                                        This project is discontinued. The link may not work or be outdated.
                                    </div>
                                )}

                                <SYButton
                                    icon={
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    }
                                    text={project.discontinued ? "View Old Project" : "View Project"}
                                    link={project.link}
                                    target="_blank"
                                    className="w-full"
                                />

                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="flex flex-col items-center gap-8 w-full mt-16 justify-center">
                    <div className="flex-1 space-y-4 animate-fade-in-left text-center" id="contact">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">Contact</h2>
                        <p className="text-lg sm:text-xl text-muted-foreground">
                            Feel free to reach out to me on Discord or GitHub. I&apos;ll be happy to help you with any questions or projects you have in mind.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full max-w-[13rem] justify-center">
                        <SYButton
                            icon={
                                <DiscordIcon
                                    className="text-discord"
                                    width={24}
                                    height={24}
                                    fill="currentColor"
                                />
                            }
                            className="w-full"
                            text="Discord"
                            link="https://discord.gg/EF7TZWEgjT"
                        />

                        <SYButton
                            icon={
                                <GithubIcon
                                    className="text-foreground"
                                    width={24}
                                    height={24}
                                    fill="currentColor"
                                />
                            }
                            className="w-full"
                            text="GitHub"
                            link="https://github.com/Scarlot-Ruskipy"
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Scarlot. All rights reserved.
                    </p>
                </footer>
            </main>
        </>
    );
}

Base.metadata = {
    title: "Scarlot's Portfolio",
    description: "A portfolio introducing myself, my projects, and my skills.",
    keywords: [
        "portfolio",
        "projects",
        "skills",
        "Scarlot",
        "Ruskipy",
        "web developer",
        "programmer",
    ],
};