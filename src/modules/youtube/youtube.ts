import { youtube as envs } from "./.envs.ts";
import { X2jOptions, XMLParser } from "fast-xml-parser";
import { FeedEntry, YouTubeFeed } from "./_types.ts";
import { RSSBuilder } from "../../RSSBuilder/rssBuilder.ts";

class YoutubeFeed {
  options: X2jOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "$",
    parseAttributeValue: true,
  };

  parser = new XMLParser(this.options);

  descTrim(description: string) {
    return description.trim().split("\n")[0];
  }

  atomToRSS2(atomFeed: string) {
    const feedObject: YouTubeFeed = this.parser.parse(atomFeed);

    // Make sure it's still an array if there is only a single video
    feedObject.feed.entry = ([] as FeedEntry[]).concat(feedObject.feed.entry);

    const rssBuilder = new RSSBuilder(
      "YouTube Feed",
      `A list of ${feedObject.feed.author.name}'s YouTube videos`,
      `${feedObject.feed.author.uri}`,
    );

    feedObject.feed.entry.forEach((entry) => {
      rssBuilder.addItem({
        title: entry.title,
        description: this.descTrim(entry["media:group"]["media:description"]),
        link: entry.link.$href,
        pubDate: new Date(entry.published),
      });
    });

    return rssBuilder.build();
  }

  async RSS() {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${envs.CHANNEL_ID}`,
    );

    if (res.ok) {
      const atomFeed = await res.text();
      return this.atomToRSS2(atomFeed);
    }

    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }
}

export { YoutubeFeed };
