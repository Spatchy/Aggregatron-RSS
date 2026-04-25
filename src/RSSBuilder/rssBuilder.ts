import XMLBuilder, { XmlBuilderOptions } from "fast-xml-builder"
import { FeedObject, ItemObject } from "./_types.ts";

class RSSBuilder {
  options:XmlBuilderOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "$"
  }

  xmlBuilder = new XMLBuilder(this.options);
  feed:FeedObject; 

  constructor(channelTitle:string, channelDescription:string, channelLink:string) {
    this.feed = {
      rss: {
        $version: "2.0",
        title: channelTitle,
        description: channelDescription,
        link: channelLink,
        item: []
      }
    }
  }

  addItem(item:ItemObject){
    this.feed.rss.item.push(item);
  }

  build() {
    return this.xmlBuilder.build(this.feed)
  }
}

export { RSSBuilder }