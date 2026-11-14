import { bindings, defineConfig, defineWorker } from "cf/config";
import { createWorkersResponseStoreSelfContainedConfig } from "@vinext/cloudflare/cache/config";

const PRODUCTION_WORKER_NAME = "feedbacker-frontend";
const DEVELOPMENT_WORKER_NAME = "feedbacker-frontend-dev";
const DEVELOPMENT_DOMAIN = "dev.feedbacker.co.kr";

export default defineConfig(async ({ mode }) => {
  const isProduction = mode === "production";
  const workerName = isProduction
    ? PRODUCTION_WORKER_NAME
    : DEVELOPMENT_WORKER_NAME;
  const cache = await createWorkersResponseStoreSelfContainedConfig({
    worker: workerName,
    bucket: `${workerName}-response-store-cache-bodies`,
  });

  return {
    worker: defineWorker({
      ...cache,
      name: workerName,
      entrypoint: "vinext/server/fetch-handler",
      compatibilityDate: "2026-11-14",
      workersDev: false,
      previewUrls: false,
      domains: isProduction ? [] : [DEVELOPMENT_DOMAIN],
      assets: {
        htmlHandling: "none",
        notFoundHandling: "none",
        runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
      },
      env: {
        ...cache.env,
        ASSETS: bindings.assets(),
        IMAGES: bindings.images(),
      },
    }),
  };
});
