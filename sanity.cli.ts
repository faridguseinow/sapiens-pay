import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "6m0u8grh",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
});
