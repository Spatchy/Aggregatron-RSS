interface EnvVarsData {
  general: {
    refreshInterval: number;
    feedUrl: string;
    feedTitle: string;
    feedDescription: string;
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
      skipReuploads: boolean;
      skipNsfw: boolean;
      useThumbnailImage: boolean;
      minRating: number;
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

interface EnvVarNameMap<T extends ValidationType> {
  name: string;
  optional: boolean;
  validationType: T;
}

type ToValidationType<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends Array<string> ? "array<string>" :
  T extends Array<number> ? "array<number>" :
  T extends Array<boolean> ? "array<boolean>" :
  never;

type ToEnvVarNamesShape<T> = {
  // deno-lint-ignore no-explicit-any
  [K in keyof T]: T[K] extends Array<any>
    ? EnvVarNameMap<ToValidationType<T[K]>>
    : T[K] extends object
    ? ToEnvVarNamesShape<T[K]>
    : EnvVarNameMap<ToValidationType<T[K]>>;
};

export type { EnvVarsData, ToEnvVarNamesShape, ValidationType };
