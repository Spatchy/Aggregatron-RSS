import { EnvVarsData } from "./_types.ts";

const envVarsDefaults: EnvVarsData = {
  general: {
    refreshInterval: 120
  },
  modules: {
    GithubRepos: {
      enable: false,
      user: "",
      auth: "",
      filterForks: false,
      filterPrivate: true,
      filterArchived: false,
      filterByName: [],
    },
    YoutubeRSS: {
      enable: false,
      channelId: "",
    },
    Printables: {
      enable: false,
      userHandle: "",
    }
  },
};

export { envVarsDefaults };
