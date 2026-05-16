interface EnvVarsData {
  general: {
    refreshInterval: number;
  };
  modules: {
    GithubRepos: {
      enable: boolean;
      user: string;
      auth: string;
      filterForks: boolean;
      filterPrivate: boolean;
      filterArchived: boolean;
      filterByName: Array<string>;
    };
    YoutubeRSS: {
      enable: boolean;
      channelId: string;
    };
    Printables: {
      enable: boolean;
      userHandle: string;
    }
  };
}

type ValidationType =
  | "string"
  | "number"
  | "boolean"
  | "array<string>"
  | "array<number>"
  | "array<boolean>";

interface EnvVarNameMap {
  name: string;
  optional: boolean;
  validationType: ValidationType;
}

interface EnvVarsNames {
  general: {
    refreshInterval: EnvVarNameMap;
  };
  modules: {
    GithubRepos: {
      enable: EnvVarNameMap;
      user: EnvVarNameMap;
      auth: EnvVarNameMap;
      filterForks: EnvVarNameMap;
      filterPrivate: EnvVarNameMap;
      filterArchived: EnvVarNameMap;
      filterByName: EnvVarNameMap;
    };
    YoutubeRSS: {
      enable: EnvVarNameMap;
      channelId: EnvVarNameMap;
    };
    Printables: {
      enable: EnvVarNameMap;
      userHandle: EnvVarNameMap;
    }
  };
}

export type { EnvVarsData, EnvVarsNames, ValidationType };
