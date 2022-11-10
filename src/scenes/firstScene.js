import { Engine } from "@babylonjs/core";
import { Scene } from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core";
import { CreateGround } from "@babylonjs/core";
// import { ArcRotateCamera } from "@babylonjs/core";

import { Vector3 } from "@babylonjs/core";
import { Color3 } from "@babylonjs/core";
import { Color4 } from "@babylonjs/core";
import { HemisphericLight } from "@babylonjs/core";
import { StandardMaterial } from "@babylonjs/core";
import { Animation } from "@babylonjs/core";
// import { MeshBuilder } from "@babylonjs/core";
import "@babylonjs/loaders";

const createScene = (canvas) => {
  const engine = new Engine(canvas);
  const scene = new Scene(engine);

  // const camera = new ArcRotateCamera("camera1", 5, 5, 15, new Vector3(0, 5, 0), scene);
  // camera.setTarget(Vector3.Zero());
  // camera.attachControl(canvas, true);

  new HemisphericLight("light", Vector3.Up(), scene);

  // const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
  // const material = new StandardMaterial("box-material", scene);
  // material.diffuseColor = Color3.Blue();
  // box.material = material;
  const birdMove = new Animation("birdMove", "position.z", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CIRCLE);
  const keys = []
  keys.push({
    frame:0,
    value:1
  },{
    frame:20,
    value:5
  },{
    frame:100,
    value:10
  })
  birdMove.setKeys(keys)
  let yellowAnime
  SceneLoader.ImportMeshAsync("","static/models/", "gray.obj", scene)
  .then(res=>{
      let grayBird = res.meshes[0]
      grayBird.position=new Vector3(0,0,0)
      grayBird.animations=[]
      grayBird.animations.push(birdMove)
      yellowAnime = scene.beginAnimation(grayBird, 0, 60, true)
            return yellowAnime
    })
  window.addEventListener('keydown',(e)=>{
    console.log(e);
    yellowAnime.pause()
  })
  
  scene.clearColor = new Color4(0.4,0.2,0.3,0.5)
  const ground = CreateGround('ground',{
    height:50,
    width:50
  })
  const groundMaterial = new StandardMaterial("box-material", scene);
  groundMaterial.diffuseColor = new Color3(0.2,0.4,0.5);
  ground.material = groundMaterial;
  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener("resize", function () {
    engine.resize();
});
};

export { createScene };