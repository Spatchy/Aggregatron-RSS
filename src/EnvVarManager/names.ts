import { EnvVarsNames } from "./_types.ts";

const envVarsNames: EnvVarsNames = {
  general: {
    refreshInterval: {
      name: "REFRESH_INTERVAL_MINUTES",
      optional: false,
      validationType: "number",
    },
  },
  modules: {
    githubRepos: {
      enable: {
        name: "GITHUB_REPOS_ENABLE",
        optional: true,
        validationType: "boolean",
      },
      user: {
        name: "GITHUB_REPOS_USER",
        optional: false,
        validationType: "string",
      },
      auth: {
        name: "GITHUB_REPOS_AUTH_KEY",
        optional: false,
        validationType: "string",
      },
      filterForks: {
        name: "GITHUB_REPOS_FILTER_OUT_FORKS",
        optional: true,
        validationType: "boolean",
      },
      filterPrivate: {
        name: "GITHUB_REPOS_FILTER_OUT_FORKS",
        optional: true,
        validationType: "boolean",
      },
      filterArchived: {
        name: "GITHUB_REPOS_FILTER_OUT_ARCHIVED",
        optional: true,
        validationType: "boolean",
      },
      filterByName: {
        name: "GITHUB_REPOS_FILTER_BY_NAME",
        optional: true,
        validationType: "array<string>",
      },
    },
    YoutubeRSS: {
      enable: {
        name: "YOUTUBE_RSS_ENABLE",
        optional: true,
        validationType: "boolean",
      },
      channelId: {
        name: "YOUTUBE_RSS_PERMANENT_CHANNEL_ID",
        optional: false,
        validationType: "string",
      },
    },
  },
};

export { envVarsNames };
