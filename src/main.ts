import {
  Animation,
  MultiTextureBatch,
  PlayMode,
  PolygonBatch,
  Texture,
  TextureAtlas,
  createGameLoop,
  createStage,
  createViewport,
} from "gdxts";
import { loadMemDebugScript, showDebugInfo } from "./util/mem.debug";

const WORLD_WIDTH = 500;
const WORLD_HEIGHT = 1000;

const SHOW_MEMORY = true;

const init = async () => {
  SHOW_MEMORY && (await loadMemDebugScript());

  const stage = createStage();
  const canvas = stage.getCanvas();

  const viewport = createViewport(canvas, WORLD_WIDTH, WORLD_HEIGHT, {
    crop: false,
  });

  const gl = viewport.getContext();
  const camera = viewport.getCamera();
  camera.setYDown(true);

  const batch = new MultiTextureBatch(gl);
  batch.setYDown(true);

  const whiteTexture = Texture.createWhiteTexture(gl);
  const atlas = await TextureAtlas.load(
    gl,
    "./assets/atlas/character_run.atlas"
  );
  const keyFrames = atlas.findRegions("run_full");
  const animation = new Animation(keyFrames, 1 / 32);

  let stateTime = 0;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  const loop = createGameLoop((delta) => {
    stateTime += delta;

    gl.clear(gl.COLOR_BUFFER_BIT);
    PolygonBatch.resetTotalDrawCalls();

    batch.setProjection(camera.combined);
    batch.begin();
    batch.draw(whiteTexture, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    animation
      .getKeyFrame(stateTime, PlayMode.LOOP)
      .draw(batch, 50, 100, 125, 150);
    batch.end();
  });

  SHOW_MEMORY && showDebugInfo(stage.getInfo(), gl, loop);
};

init();
