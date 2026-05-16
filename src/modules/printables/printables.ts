import { EnvVarsData } from "../../EnvVarManager/_types.ts";
import { EnvVarManager } from "../../EnvVarManager/envVarManager.ts";
import { Module } from "../Module.ts";
import { ListUserModelsResponseItems } from "./_types.ts";
import { GraphQLManager } from "./graphqlManager.ts";

class UserNotFoundError extends Error {
  constructor(userHandle: string) {
    super(
      `A user with the handle ${userHandle} was not found. Make sure you are using the handle (the part after the @ sign) and not the display name`,
    );
    this.name = "UserNotFoundError";
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

class Printables implements Module {
  envs: EnvVarsData["modules"]["Printables"];

  constructor() {
    this.envs = EnvVarManager.vars.modules.Printables;
  }

  async getUserId() {
    const foundUsersJson = await GraphQLManager.searchUser(
      this.envs.userHandle,
    );
    const userid = foundUsersJson.data.searchUsers2.items.find((item) =>
      item.handle === this.envs.userHandle
    )?.id;

    if (!userid) {
      throw new UserNotFoundError(this.envs.userHandle);
    }

    return userid;
  }

  async listAllUserModels(userId: string) {
    let hasNext: boolean = true;
    let cursor: string | null = null;
    const allModelsData: ListUserModelsResponseItems[] = [];

    while (hasNext) {
      const listedModelsJson = await GraphQLManager.listModelsForUser(
        userId,
        cursor,
      );

      cursor = listedModelsJson.data.models.cursor;
      allModelsData.push(...listedModelsJson.data.models.items);

      if (cursor === null) {
        hasNext = false;
      }
    }

    return allModelsData; // TODO: Do something with this data
  }

  async RSS(): Promise<string> {
    return "";
  }
}

export { Printables };
