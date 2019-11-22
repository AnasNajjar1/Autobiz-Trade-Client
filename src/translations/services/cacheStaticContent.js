import { staticCache, staticFiles, staticContentUrl } from "../../config";

export default async function(language) {
    const cache = await caches.open(staticCache);
    const promises = Object.values(staticFiles).map(file => {
        try {
            file = `${staticContentUrl}/${language}/${file}`;
            return cache.add(file);
        } catch (e) {
            return null;
        }
    });

    await Promise.all(promises);
    window.dispatchEvent(
        new StorageEvent("storage", {
        key: "b2b-plateform"
        })
    );
    return;
}