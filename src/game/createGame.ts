import * as Phaser from "phaser";
import { StudyRoomScene, type StudyRoomSceneData } from "./scenes/StudyRoomScene";

/** Boots the Phaser game inside `parent`. Loaded only on the client, via dynamic import. */
export function createGame(parent: HTMLElement, data: StudyRoomSceneData): Phaser.Game {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: "#3f5141",
    scale: { mode: Phaser.Scale.RESIZE, width: parent.clientWidth, height: parent.clientHeight },
    render: { antialias: true },
    input: { mouse: { preventDefaultWheel: false } },
    banner: false,
  });
  game.scene.add("StudyRoom", StudyRoomScene, true, data);
  // Dev-only handle for debugging and browser tests.
  if (process.env.NODE_ENV === "development") (window as unknown as { __game: Phaser.Game }).__game = game;
  return game;
}
