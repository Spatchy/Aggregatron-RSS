import { Octokit } from "octokit";
import { DOMParser } from "@b-fuze/deno-dom";
import { RSSBuilder } from "../../RSSBuilder/rssBuilder.ts";
import { ItemObject } from "../../RSSBuilder/_types.ts";
import { fetchOptions } from "./fetchOptions.ts";
import { EnvVarManager } from "../../EnvVarManager/envVarManager.ts";
import { EnvVarsData } from "../../EnvVarManager/_types.ts";
import { Module } from "../Module.ts";

class GithubRepos implements Module{
  envs: EnvVarsData["modules"]["GithubRepos"];
  octokit: Octokit;
  rssBuilder: RSSBuilder;

  constructor() {
    this.envs = EnvVarManager.vars.modules.GithubRepos

    this.octokit = new Octokit({ auth: this.envs.auth });

    this.rssBuilder = new RSSBuilder(
      "Github Repos",
      `A list of ${this.envs.user}'s github repos`,
      `https://github.com/${this.envs.user}?tab=repositories`,
    );
  }

  // TODO: Probably a good idea to cache the uris to avoid downloading the dom every time
  async parseDomForOpengraph(repoName:string) {
    const res = await fetch(`https://github.com/${this.envs.user}/${repoName}/`, fetchOptions);

    const dom = await res.text();

    const domParser = new DOMParser()
    const doc = domParser.parseFromString(dom, "text/html");

    const tag = doc.querySelector('meta[property="og:image"]');

    if (tag) {
      const imageUri = tag.getAttribute("content");
      return imageUri!;
    } else {
      throw new Error(`The preview image was not found for ${repoName}`);
    }
  }

  async generateThumbnailEnclosure(
    repoName: string,
  ): Promise<ItemObject["enclosure"]> {
    const uri = await this.parseDomForOpengraph(repoName);

    const res = await fetch(uri, {
      method: "HEAD",
    });

    return {
      $url: uri,
      $length: Number(res.headers.get("Content-Length")),
      $type: res.headers.get("Content-Type")!
    }
  }

  async fetchRepos() {
    const res = await this.octokit.request("GET /users/{username}/repos", {
      username: this.envs.user,
      headers: {
        "X-GitHub-Api-Version": "2026-03-10",
      },
    });

    return res;
  }

  filterRepos(octokitResponse:Awaited<ReturnType<typeof this.fetchRepos>>) {
    let result = octokitResponse.data;

    if (this.envs.filterForks) {
      result = result.filter((repo) => !repo.fork);
    }

    // TODO: find a way to compile multiple filters into one to prevent several iterations
    if (this.envs.filterPrivate) {
      result = result.filter((repo) => !repo.private);
    }

    if (this.envs.filterArchived) {
      result = result.filter((repo) => !repo.archived);
    }

    if (this.envs.filterByName.length > 0) {
      result = result.filter((repo) => !(repo.name in this.envs.filterByName))
    }

    return result;
  }

  async RSS() {
    const reposData = this.filterRepos(await this.fetchRepos());

    await Promise.all(reposData.map(async (repo) => {
      this.rssBuilder.addItem({
        title: repo.name,
        pubDate: new Date(repo.created_at ?? ""),
        description: repo.description ?? "",
        link: repo.html_url,
        category: "github/repos",
        enclosure: await this.generateThumbnailEnclosure(repo.name)
      });
    }));

    return this.rssBuilder.build();
  }
}

export { GithubRepos };
