import { EnvVarsData } from "../../EnvVarManager/_types.ts";
import { EnvVarManager } from "../../EnvVarManager/envVarManager.ts";
import { ItemObject } from "../../RSSBuilder/_types.ts";
import { RSSBuilder } from "../../RSSBuilder/rssBuilder.ts";
import { Module } from "../Module.ts";
import { ListUserModelsResponseItems, ModelDetail } from "./_types.ts";
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
  rssBuilder: RSSBuilder;

  constructor() {
    this.envs = EnvVarManager.vars.modules.Printables;
    this.envs.userHandle = this.envs.userHandle.replace("@", ""); // Allow for handles starting with @ sign

    this.rssBuilder = new RSSBuilder(
      "Github Repos",
      `A list of @${this.envs.userHandle}'s 3D models on Printables`,
      `https://www.printables.com/@${this.envs.userHandle}`,
    );
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
    let cursor: string = "";
    const allModelsData: ListUserModelsResponseItems[] = [];

    while (hasNext) {
      const listedModelsJson = await GraphQLManager.listModelsForUser(
        userId,
        cursor,
      );

      cursor = listedModelsJson.data.models.cursor;
      allModelsData.push(...listedModelsJson.data.models.items);

      if (!cursor) {
        hasNext = false;
      }
    }

    return allModelsData;
  }

  async getModelDetails(
    model: ListUserModelsResponseItems,
  ): Promise<ModelDetail["data"]["model"]> {
    const modelDetailsJson = await GraphQLManager.fetchModelDetails(model.id);
    return modelDetailsJson.data.model;
  }

  async generateThumbnailEnclosure(
    imageUriFragment: string,
  ): Promise<ItemObject["enclosure"]> {
    const uri = `https://media.printables.com/${imageUriFragment}`;

    const res = await fetch(uri, {
      method: "HEAD",
    });

    return {
      $url: uri,
      $length: Number(res.headers.get("Content-Length")),
      $type: res.headers.get("Content-Type")!,
    };
  }

  async RSS(): Promise<string> {
    const userId = await this.getUserId();
    const modelsData = await this.listAllUserModels(userId);

    await Promise.all(modelsData.map(async (model) => {
      const details = await this.getModelDetails(model);

      this.rssBuilder.addItem({
        title: model.name,
        pubDate: new Date(model.firstPublish),
        description: details.summary,
        link: `https://printables.com/model/${model.id}-${model.slug}`,
        category: "printables/models",
        enclosure: await this.generateThumbnailEnclosure(
          details.previewFile.filePreviewPath,
        ),
      });
    }));

    return this.rssBuilder.build();
  }
}

export { Printables };
