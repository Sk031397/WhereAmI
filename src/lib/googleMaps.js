// Loads the Google Maps JavaScript API once, on the `alpha` channel
// (required for the experimental 3D Maps `Map3DElement`).
// See spec.md > External Services and Dependencies.
//
// Returns a promise that resolves when google.maps is ready, or rejects
// if no usable key is configured or the script fails to load.

const PLACEHOLDER_KEY = "your-key-here";
let loaderPromise = null;

export function loadGoogleMaps() {
  if (loaderPromise) return loaderPromise;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === PLACEHOLDER_KEY) {
    loaderPromise = Promise.reject(
      new Error(
        "No Google Maps API key configured. Set VITE_GOOGLE_MAPS_API_KEY in your .env file."
      )
    );
    return loaderPromise;
  }

  loaderPromise = new Promise((resolve, reject) => {
    // Official inline bootstrap loader, trimmed to what we need.
    ((g) => {
      let p;
      const d = document;
      const u = "The Google Maps JavaScript API";
      const m = "google";
      const b = m + "maps";
      const a = "importLibrary";
      const c = "__ib__";
      const h = {};
      let e;
      const promise = new Promise(async (res, rej) => {
        await (p = h[a] = h[a] || null);
        if (!(b in window) || !window[m]?.maps?.[a]) {
          const f = d.createElement("script");
          const g2 = { key: g.key, v: g.v, channel: g.channel };
          const params = Object.entries(g2)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join("&");
          f.src = `https://maps.${m}apis.com/maps/api/js?` + params + `&loading=async&callback=${c}`;
          window[c] = res;
          f.onerror = () => rej(new Error(u + " failed to load."));
          f.async = true;
          d.head.append(f);
        } else {
          res();
        }
      });
      promise.then(resolve).catch(reject);
    })({ key: apiKey, v: "alpha", channel: "alpha" });
  });

  return loaderPromise;
}
