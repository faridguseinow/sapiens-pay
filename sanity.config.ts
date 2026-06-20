import { documentInternationalization } from "@sanity/document-internationalization";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { useAutoTranslatePostAction } from "./sanity/actions/auto-translate-post-action";
import { autoTranslateNewDocument } from "./sanity/lib/post-translations";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "6m0u8grh";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const translatedSchemaTypes = ["post"];

export default defineConfig({
  name: "default",
  title: "Sapiens Pay Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool(),
    documentInternationalization({
      supportedLanguages: [
        { id: "az", title: "Azerbaijani" },
        { id: "ru", title: "Russian" },
        { id: "en", title: "English" },
      ],
      schemaTypes: translatedSchemaTypes,
      weakReferences: true,
      // Temporary migration helper for tying together pre-existing documents.
      allowCreateMetaDoc: true,
      metadataOmnisearchVisibility: false,
      callback: autoTranslateNewDocument,
    }),
  ],
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "post") {
        return [useAutoTranslatePostAction, ...prev];
      }

      return prev;
    },
  },
  schema: {
    types: schemaTypes,
  },
});
