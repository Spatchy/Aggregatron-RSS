import { EnvVarsData, ToEnvVarNamesShape } from "./_types.ts";

const envVarsNames = {
  general: {
    refreshInterval: {
      name: "REFRESH_INTERVAL_MINUTES",
      optional: false,
      validationType: "number",
    },
    feedUrl: {
      name: "FEED_URL",
      optional: false,
      validationType: "string",
    },
    feedTitle: {
      name: "FEED_TITLE",
      optional: true,
      validationType: "string",
    },
    feedDescription: {
      name: "FEED_DESCRIPTION",
      optional: true,
      validationType: "string",
    },
  },
  modules: {
    GithubRepos: {
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
    Printables: {
      enable: {
        name: "PRINTABLES_ENABLE",
        optional: true,
        validationType: "boolean",
      },
      userHandle: {
        name: "PRINTABLES_USER_HANDLE",
        optional: false,
        validationType: "string",
      },
      skipReuploads: {
        name: "PRINTABLES_SKIP_REUPLOADS",
        optional: true,
        validationType: "boolean",
      },
      skipNsfw: {
        name: "PRINTABLES_SKIP_NSFW",
        optional: true,
        validationType: "boolean",
      },
      useThumbnailImage: {
        name: "PRINTABLES_USE_SITE_LISTING_THUMBNAIL",
        optional: true,
        validationType: "boolean",
      },
      minRating: {
        name: "PRINTABLES_MINIMUM_RATING",
        optional: true,
        validationType: "number",
      }
    },
  },
} satisfies ToEnvVarNamesShape<EnvVarsData>;

export { envVarsNames };
