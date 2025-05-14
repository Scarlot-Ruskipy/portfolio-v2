import { GitHubUser } from "../globals/gitUser"

export interface EndpointCache {
    data: {
        user: GitHubUser | null;
        mostUsedLanguages: { language: string; amount: number }[];
        totalStars: number;
        totalIssues: number;
        totalPRs: number;
        totalCommitsThisYear: number;
        totalCommitsAll: number;
    } | null | undefined;
    timestamp: number;
    updates: number;
}