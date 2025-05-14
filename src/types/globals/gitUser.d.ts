export type GitHubUser = {
    user: {
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
        name: string;
        company: string;
        blog: string;
        location: string;
        email: string | null;
        bio: string;
        public_repos: number;
        followers: number;
        following: number;
    },
    mostUsedLanguages: { language: string; amount: number }[];
    totalStars: number;
    totalIssues: number;
    totalPRs: number;
    totalCommitsThisYear: number;
    totalCommitsAll: number;
    repos_url: string;
}
