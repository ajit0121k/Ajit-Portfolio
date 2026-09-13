import Project from '../models/Project.js';
import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getHeaders = () => {
  const token = config.github.token || process.env.GITHUB_TOKEN;
  const headers = {
    'User-Agent': 'Portfolio-App',
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `token ${token}`;
  }
  return headers;
};

const withCache = async (key, fetcher) => {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  }
  try {
    const data = await fetcher();
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    if (error.statusCode) throw error;
    logger.warn(`GitHub API error: ${error.message}`);
    throw ApiError.internal(`Failed to fetch from GitHub: ${error.message}`);
  }
};

export const getUserProfile = async (username) => {
  const user = username || config.github.username || 'ajit0121k';
  return withCache(`profile_${user}`, async () => {
    const res = await fetch(`https://api.github.com/users/${user}`, {
      headers: getHeaders(),
    });
    if (res.status === 403) {
      throw ApiError.tooManyRequests('GitHub API rate limit exceeded');
    }
    if (!res.ok) {
      throw ApiError.badRequest(`GitHub user '${user}' not found`);
    }
    return res.json();
  });
};

export const getRepos = async (username) => {
  const user = username || config.github.username || 'ajit0121k';
  return withCache(`repos_${user}`, async () => {
    const res = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`,
      { headers: getHeaders() }
    );
    if (res.status === 403) {
      throw ApiError.tooManyRequests('GitHub API rate limit exceeded');
    }
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data)
      ? data.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      : [];
  });
};

export const getStats = async (username) => {
  const user = username || config.github.username || 'ajit0121k';
  return withCache(`stats_${user}`, async () => {
    const [profile, repos] = await Promise.all([
      getUserProfile(user).catch(() => ({ public_repos: 0, followers: 0 })),
      getRepos(user).catch(() => []),
    ]);

    const stars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    const languages = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      publicRepos: profile.public_repos || repos.length,
      followers: profile.followers || 0,
      totalStars: stars,
      topLanguages: Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([lang]) => lang),
    };
  });
};

export const importRepo = async (repoData) => {
  const { name, description, html_url, homepage, topics, language } = repoData;
  const tech = [...(topics || [])];
  if (language && !tech.includes(language)) tech.push(language);

  const project = new Project({
    title: name,
    shortDescription: description ? description.slice(0, 280) : '',
    description: description || '',
    githubUrl: html_url || '',
    liveUrl: homepage || '',
    technologies: tech,
    status: 'draft',
  });
  await project.save();
  return project;
};

// Aliases for controller compatibility
export {
  getStats as getGitHubStats,
  getRepos as getGitHubRepos,
  getUserProfile as getGitHubProfile,
  importRepo as importFromGitHub,
};
