import type * as Phaser from "phaser";
import { WORLD_HEIGHT, WORLD_WIDTH } from "@/game/config/world";

/**
 * Per-client horizontal follow camera (spec §4.2).
 * Zoom fits the world's height to the viewport; the camera only scrolls
 * sideways once the target leaves a central deadzone, and stops at the edges.
 */
export function setupFollowCamera(scene: Phaser.Scene, target: Phaser.GameObjects.Components.Transform & Phaser.GameObjects.GameObject) {
  const cam = scene.cameras.main;
  cam.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  cam.setRoundPixels(false);
  cam.startFollow(target, false, 0.12, 0.12);

  const fit = (width: number, height: number) => {
    cam.setSize(width, height);
    const zoom = Math.max(0.4, height / WORLD_HEIGHT);
    cam.setZoom(zoom);
    // Deadzone is in world units: middle 40% of what's visible.
    cam.setDeadzone((width / zoom) * 0.4, WORLD_HEIGHT);
  };

  fit(scene.scale.width, scene.scale.height);
  const onResize = (size: Phaser.Structs.Size) => fit(size.width, size.height);
  scene.scale.on("resize", onResize);
  scene.events.once("shutdown", () => scene.scale.off("resize", onResize));
}
