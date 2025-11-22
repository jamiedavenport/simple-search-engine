import { Post } from "./post";
import { SearchEngine } from "./search";

const searchEngine = new SearchEngine();

await searchEngine.index(new Post(1, "Apple", "Apple is green"));
await searchEngine.index(new Post(2, "Banana", "Banana is yellow"));
await searchEngine.index(new Post(3, "Cherry", "Cherry is red"));

const results = await searchEngine.search("post", "ello");

console.info(results);
