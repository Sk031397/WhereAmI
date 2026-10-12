import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../lib/googleMaps.js";

// Renders Google Photorealistic 3D Tiles via the experimental Map3DElement.
// Implements spec.md > Components > World3D and prd.md > Features and Behavior
// > Fly and explore the 3D scene. The camera repositions when `camera` changes.
export default function World3D({ camera }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  // Load the API and create the 3D map element once.
  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then(async () => {
        const maps3d = await window.google.maps.importLibrary("maps3d");
        if (cancelled || !containerRef.current) return;

        const { Map3DElement } = maps3d;
        // Map3DMode may arrive via the library object or the global namespace,
        // depending on API version; fall back to the string value if neither.
        const Map3DMode =
          maps3d.Map3DMode || window.google.maps.maps3d?.Map3DMode;
        const satelliteMode = Map3DMode ? Map3DMode.SATELLITE : "SATELLITE";

        const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
        const options = {
          center: camera.center,
          range: camera.range,
          tilt: camera.tilt,
          heading: camera.heading,
          // `mode` is required to render the 3D map (API v3.60.1+).
          // SATELLITE = photorealistic imagery with no labels — labels would
          // give away the location, so SATELLITE fits the guessing game.
          mode: satelliteMode,
          // Disable Google's built-in controls (incl. click/double-click
          // "fly to this point" navigation) so clicking the 3D view doesn't
          // teleport the camera — the player should fly manually and guess
          // on the corner map, not click to jump around.
          defaultUIDisabled: true,
        };
        // A vector Map ID is required for 3D maps in current API versions.
        if (mapId) options.mapId = mapId;

        const map3d = new Map3DElement(options);
        map3d.style.width = "100%";
        map3d.style.height = "100%";
        containerRef.current.appendChild(map3d);
        mapRef.current = map3d;
      })
      .catch((err) => {
        if (!cancelled) {
          // Surface the real reason in the console for diagnosis.
          console.error("World3D failed to load:", err);
          setError(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly the camera when the location changes.
  useEffect(() => {
    const map3d = mapRef.current;
    if (!map3d || !camera) return;
    if (typeof map3d.flyCameraTo === "function") {
      map3d.flyCameraTo({
        endCamera: {
          center: camera.center,
          range: camera.range,
          tilt: camera.tilt,
          heading: camera.heading,
        },
        durationMillis: 1500,
      });
    } else {
      map3d.center = camera.center;
      map3d.range = camera.range;
      map3d.tilt = camera.tilt;
      map3d.heading = camera.heading;
    }
  }, [camera]);

  if (error) {
    return (
      <div className="world3d world3d--error" role="alert">
        <div className="world3d__error-card">
          <h2>Couldn&apos;t load the 3D world</h2>
          <p>{error}</p>
          <p className="world3d__error-hint">
            Add a Google Maps API key to <code>.env</code> as
            <code> VITE_GOOGLE_MAPS_API_KEY</code>, then restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  return <div className="world3d" ref={containerRef} />;
}
