import { EnvVarsData } from "../EnvVarManager/_types.ts";

interface Module {
  envs: EnvVarsData["modules"][keyof EnvVarsData["modules"]];
  RSS(): Promise<string>;
}

export type { Module }
