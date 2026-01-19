import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { API_URLS } from '@/utils/constants';

interface GitHubStatsContextType {
  version: string | null;
  releaseDate: string | null;
  stars: number | null;
  downloads: number | null;
  loading: boolean;
  error: string | null;
}

const GitHubStatsContext = createContext<GitHubStatsContextType | undefined>(undefined);

const CACHE_KEY = 'github_stats_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

interface CacheData {
  timestamp: number;
  data: Omit<GitHubStatsContextType, 'loading' | 'error'>;
}

export function GitHubStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<Omit<GitHubStatsContextType, 'loading' | 'error'>>({
    version: null,
    releaseDate: null,
    stars: null,
    downloads: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached) as CacheData;
          if (Date.now() - timestamp < CACHE_DURATION) {
            setStats(data);
            setLoading(false);
            return;
          }
        }

        // Fetch GitHub data
        const [repoRes, latestReleaseRes, allReleasesRes] = await Promise.all([
          fetch(API_URLS.repo),
          fetch(API_URLS.latestRelease),
          fetch(API_URLS.allReleases),
        ]);

        if (!repoRes.ok || !latestReleaseRes.ok || !allReleasesRes.ok) {
          throw new Error('Failed to fetch GitHub stats');
        }

        const repoData = await repoRes.json();
        const latestReleaseData = await latestReleaseRes.json();
        const allReleasesData = await allReleasesRes.json();

        // Calculate total GitHub downloads
        const totalDownloads = Array.isArray(allReleasesData)
          ? allReleasesData.reduce((acc: number, release: any) => {
            return acc + (release.assets || []).reduce((sum: number, asset: any) => sum + asset.download_count, 0);
          }, 0)
          : 0;

        const newStats = {
          version: latestReleaseData.tag_name,
          releaseDate: new Date(latestReleaseData.published_at).getFullYear().toString(),
          stars: repoData.stargazers_count,
          downloads: totalDownloads,
        };

        setStats(newStats);

        // Update cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: newStats
        }));

      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');

        // Fallback to cache if available even if expired, or static defaults
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          setStats(JSON.parse(cached).data);
        } else {
          // Fallback defaults
          setStats({
            version: 'v1.0.0',
            releaseDate: '2025',
            stars: null,
            downloads: null,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const value = {
    ...stats,
    loading,
    error
  };

  return (
    <GitHubStatsContext.Provider value={value}>
      {children}
    </GitHubStatsContext.Provider>
  );
}

export function useGitHubStats() {
  const context = useContext(GitHubStatsContext);
  if (context === undefined) {
    throw new Error('useGitHubStats must be used within a GitHubStatsProvider');
  }
  return context;
}