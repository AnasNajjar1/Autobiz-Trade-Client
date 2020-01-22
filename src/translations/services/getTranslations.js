import { staticCache, staticFiles, staticContentUrl } from "../../config"

import translations_fr from "../fr";
import translations_de from "../de";
import translations_es from "../es";

export const languages = { fr: translations_fr, de: translations_de, es: translations_es };

export default async function(language=process.env.REACT_APP_LANG) {
    if(language===undefined) language = process.env.REACT_APP_LANG
    const cache = await caches.open(staticCache)
    let dict = await cache.match(`${staticContentUrl}/${language}/${staticFiles.locale}`)
    if(dict===undefined && languages.hasOwnProperty(language)) dict = languages[language]
    else dict = await dict.json()
    return dict
}