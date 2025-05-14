import type { NextApiRequest, NextApiResponse } from 'next';
import { EndpointCache } from '🎰/types/api/git';
import { GitHubUser } from '🎰/types/globals/gitUser';

let cache: EndpointCache = { data: null, timestamp: 0, updates: 0 };
let int_updates: number = 0;
const CACHE_DURATION: number = 2 * 60 * 1000;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    res.status(200).json(cache);
    return;
  }

  try {
    int_updates++;

    // Fetch GitHub user data
    const userResponse = await fetch(`https://api.github.com/users/Scarlot-Ruskipy`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });
    if (!userResponse.ok) {
      res.status(userResponse.status).json({
        error: 'Failed to fetch GitHub user',
        timestamp: now,
        updates: int_updates,
      });
      return;
    }
    const userData: GitHubUser = await userResponse.json();

    // Fetch user's repositories
    const reposResponse = await fetch(userData.repos_url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });
    if (!reposResponse.ok) {
      res.status(reposResponse.status).json({
        error: 'Failed to fetch repositories',
        timestamp: now,
        updates: int_updates,
      });
      return;
    }
    const repos = await reposResponse.json();

    // Initialize metrics
    let totalStars = 0;
    let totalIssues = 0;
    let totalPRs = 0;
    let totalCommitsThisYear = 0;
    let totalCommitsAll = 0;

    // Calculate most used languages and aggregate metrics
    const languageCounts: Record<string, number> = {};
    let totalReposWithLanguages = 0;

    for (const repo of repos) {
      // Count languages
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        totalReposWithLanguages++;
      }

      // Aggregate stars, issues, and PRs
      totalStars += repo.stargazers_count || 0;
      totalIssues += repo.open_issues_count || 0;

      // Fetch PRs and commits for each repository
      const [prsResponse, commitsResponse] = await Promise.all([
        fetch(`${repo.url}/pulls?state=all`, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }),
        fetch(`${repo.url}/commits`, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }),
      ]);

      if (prsResponse.ok) {
        const prs = await prsResponse.json();
        totalPRs += prs.length;
      }

      if (commitsResponse.ok) {
        const commits = await commitsResponse.json();
        totalCommitsAll += commits.length;

        // Filter commits for 2025
        const commitsThisYear = commits.filter((commit: any) =>
          commit.commit.author.date.startsWith(new Date().getFullYear().toString())
        );
        totalCommitsThisYear += commitsThisYear.length;
      }
    }

    const mostUsedLanguages = Object.entries(languageCounts)
      .map(([language, count]) => ({
        language,
        amount: parseFloat(((count / totalReposWithLanguages) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.amount - a.amount);

    cache = {
      data: {
        user: userData,
        mostUsedLanguages,
        totalStars,
        totalIssues,
        totalPRs,
        totalCommitsThisYear,
        totalCommitsAll,
      },
      timestamp: now,
      updates: int_updates,
    };

    res.status(200).json(cache);
  } catch (error: unknown) {
    res.status(500).json({
      error: 'Internal Server Error',
      timestamp: now,
      updates: int_updates,
    });

    console.error('Error fetching GitHub user or repositories:', error);
  }
}