import { X2jOptions, XMLParser } from "fast-xml-parser";
import { FeedEntry, YouTubeFeed } from "./_types.ts";
import { RSSBuilder } from "../../RSSBuilder/rssBuilder.ts";
import { ItemObject } from "../../RSSBuilder/_types.ts";
import { EnvVarManager } from "../../EnvVarManager/envVarManager.ts";
import { EnvVarsData } from "../../EnvVarManager/_types.ts";
import { Module } from "../Module.ts"

class YoutubeRSS implements Module {
  envs: EnvVarsData["modules"]["YoutubeRSS"];
  options: X2jOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "$",
    parseAttributeValue: true,
  };

  parser = new XMLParser(this.options);

  constructor() {
    this.envs = EnvVarManager.vars.modules.YoutubeRSS
  }

  descTrim(description: string) {
    return description.trim().split("\n")[0];
  }

  async generateThumbnailEnclosure(uri: string): Promise<ItemObject["enclosure"]> {
    const res = await fetch(uri, {
      method: "HEAD",
    });

    return {
      $url: uri.replace("hqdefault", "maxresdefault"), // only maxresdefault is always 16:9
      $length: Number(res.headers.get("Content-Length")),
      $type: res.headers.get("Content-Type")!
    }
  }

  async atomToRSS2(atomFeed: string) {
    const feedObject: YouTubeFeed = this.parser.parse(atomFeed);

    // Make sure it's still an array if there is only a single video
    feedObject.feed.entry = ([] as FeedEntry[]).concat(feedObject.feed.entry);

    const rssBuilder = new RSSBuilder(
      "YouTube Feed",
      `A list of ${feedObject.feed.author.name}'s YouTube videos`,
      `${feedObject.feed.author.uri}`,
    );

    await Promise.all(feedObject.feed.entry.map(async (entry) => {
      rssBuilder.addItem({
        title: entry.title,
        description: this.descTrim(entry["media:group"]["media:description"]),
        link: entry.link.$href,
        pubDate: new Date(entry.published),
        category: "youtube/videos",
        enclosure: await this.generateThumbnailEnclosure(
          entry["media:group"]["media:thumbnail"].$url,
        ),
      });
    }));

    return rssBuilder.build();
  }

  async RSS() {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${this.envs.channelId}`,
    );

    if (res.ok) {
      const atomFeed = await res.text();
      return await this.atomToRSS2(atomFeed);
    }

    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }
}

export { YoutubeRSS };
