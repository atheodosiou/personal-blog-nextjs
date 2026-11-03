import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Opt-in production analysis using webpack's own stats, without another dependency.
export class ClientBundleAnalysisPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("ClientBundleAnalysisPlugin", (stats) => {
      const directory = join(compiler.options.output.path, "analyze");
      mkdirSync(directory, { recursive: true });
      writeFileSync(join(directory, "client.json"), JSON.stringify(stats.toJson({
        all: false,
        assets: true,
        chunks: true,
        chunkModules: true,
        modules: true,
        nestedModules: true,
        ids: true,
      })));
    });
  }
}
