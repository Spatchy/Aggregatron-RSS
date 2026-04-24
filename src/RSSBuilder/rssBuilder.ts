import XMLBuilder from "fast-xml-builder"
import { feedObject, itemObject } from "./_types.ts";

class RSSBuilder {
  xmlBuilder = new XMLBuilder();
  feed:feedObject; 

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

  addItem(item:itemObject){
    this.feed.rss.item.push(item);
  }

  build() {
    return this.xmlBuilder.build(this.feed)
  }
}

export { RSSBuilder }