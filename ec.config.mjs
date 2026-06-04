import { defineEcConfig } from 'astro-expressive-code'
import {expressiveCodeLinksPlugin} from "./src/utils/expressive-code-links.ts";

export default defineEcConfig({
    plugins: [
        expressiveCodeLinksPlugin(),
    ],
});
