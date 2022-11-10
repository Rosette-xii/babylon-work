<template>
  <div>
    <canvas ref="bjsCanvas" touch-action="none" />
  </div>
</template>

<script>
// import { createScene } from "../scenes/BasicScene";
// import earcut from "earcut";
import * as babylon from "@babylonjs/core";
// import {createCar} from "@/scenes/createCar.js"
import "@babylonjs/loaders";
export default {
  name: "BabylonScene",
  data() {
    return {
      engine: null,
      scene: null,
      camera: null,
      light: null,
      target: null,
      car: null,
      step: 6,
    };
  },
  methods: {
    createCar() {
      babylon.SceneLoader.ImportMeshAsync(
        "",
        "static/models/",
        "low_poly_car2.glb",
        this.scene
      ).then((res) => {
        this.car = res.meshes[0];
        this.car.scaling.scaleInPlace(0.1);
        this.camera.setTarget(this.car);

        // Some software saves all meshes with a rotationQuaternion set and you cannot then use the rotation methods unless you first add:
        this.car.rotationQuaternions = null;
        this.car.rotation = babylon.Vector3.Zero();
        // moveForward
        const moveForward = new babylon.Animation(
          "moveForward",
          "position.z",
          30,
          babylon.Animation.ANIMATIONTYPE_FLOAT,
          babylon.Animation.ANIMATIONLOOPMODE_RELATIVE
        );
        const moveForwardKeys = [];
        moveForwardKeys.push(
          {
            frame: 0,
            value: 0,
          },
          {
            frame: 30,
            value: this.step,
          }
        );
        moveForward.setKeys(moveForwardKeys);
        const moveForwardGroup = new babylon.AnimationGroup("moveForwardGroup");
        moveForwardGroup.addTargetedAnimation(moveForward, this.car);
        // turn left
        const turnLeftAnim = new babylon.Animation(
          "turnLeft",
          "rotation.y",
          30,
          babylon.Animation.ANIMATIONTYPE_FLOAT,
          babylon.Animation.ANIMATIONLOOPMODE_RELATIVE
        );
        const turnLeftKeys = [];
        turnLeftKeys.push(
          {
            frame: 0,
            value: 0,
          },
          {
            frame: 15,
            value: -Math.PI / 6,
          },
          {
            frame: 30,
            value: 0,
          }
        );
        turnLeftAnim.setKeys(turnLeftKeys);
        const moveLeftAnim = new babylon.Animation(
          "moveLeft",
          "position.x",
          30,
          babylon.Animation.ANIMATIONTYPE_FLOAT,
          babylon.Animation.ANIMATIONLOOPMODE_RELATIVE
        );
        const moveLeftKeys = [];
        moveLeftKeys.push(
          {
            frame: 0,
            value: 0,
          },
          {
            frame: 30,
            value: -this.step,
          }
        );
        moveLeftAnim.setKeys(moveLeftKeys);
        const turnLeftGroup = new babylon.AnimationGroup("turnLeftGroup");
        turnLeftGroup.addTargetedAnimation(turnLeftAnim, this.car);
        turnLeftGroup.addTargetedAnimation(moveLeftAnim, this.car);

        // turn right
        const turnRightAnim = new babylon.Animation(
          "turnRight",
          "rotation.y",
          30,
          babylon.Animation.ANIMATIONTYPE_FLOAT,
          babylon.Animation.ANIMATIONLOOPMODE_RELATIVE
        );
        const turnRightKeys = [];
        turnRightKeys.push(
          {
            frame: 0,
            value: 0,
          },
          {
            frame: 15,
            value: Math.PI / 6,
          },
          {
            frame: 30,
            value: 0,
          }
        );
        turnRightAnim.setKeys(turnRightKeys);
        const moveRightAnim = new babylon.Animation(
          "moveRight",
          "position.x",
          30,
          babylon.Animation.ANIMATIONTYPE_FLOAT,
          babylon.Animation.ANIMATIONLOOPMODE_RELATIVE
        );
        const moveRightKeys = [];
        moveRightKeys.push(
          {
            frame: 0,
            value: 0,
          },
          {
            frame: 30,
            value: this.step,
          }
        );
        moveRightAnim.setKeys(moveRightKeys);
        const turnRightGroup = new babylon.AnimationGroup("turnRightGroup");
        turnRightGroup.addTargetedAnimation(turnRightAnim, this.car);
        turnRightGroup.addTargetedAnimation(moveRightAnim, this.car);

        this.scene.onKeyboardObservable.add((e) => {
          console.log(e.event.code);
          if (e.event.type === "keydown") {
            switch (e.event.code) {
              case "ArrowLeft":
                turnLeftGroup.play(false);
                break;
              case "ArrowRight":
                turnRightGroup.play(false);
                break;
              case "Space":
                if (moveForwardGroup.isPlaying) {
                  moveForwardGroup.pause();
                } else {
                  moveForwardGroup.play(true);
                }
                break;
            }
          }
        });
      });
    },
    createGround() {
      this.ground = babylon.CreateGround("ground", {
        height: 400,
        width: 30,
      });
      const groundMat = new babylon.StandardMaterial("groundMat", this.scene);
      groundMat.diffuseColor = new babylon.Color3(0.3, 0.3, 0.3);
      this.ground.material = groundMat;
      const lines = [];
      const line = new babylon.MeshBuilder.CreatePlane(
        "line",
        {
          width: 0.5,
          height: 5,
        },
        this.scene
      );
      const lineMat = new babylon.StandardMaterial("lineMat");
      lineMat.diffuseColor = new babylon.Color3(1, 0.8, 0);
      line.material = lineMat;
      line.position.y = 0.1;
      line.rotation.x = Math.PI / 2;
      line.position.x = -3;
      for (let i = 1; i < 20; i++) {
        lines[i] = line.createInstance("line" + i);
        if (i < 10) {
          lines[i].position.z = i * 10;
        } else {
          lines[i].position.z = (i - 10) * 10;
          lines[i].position.x = 3;
        }
      }
    },
    init() {
      const canvas = this.$refs.bjsCanvas;
      this.engine = new babylon.Engine(canvas);
      this.scene = new babylon.Scene(this.engine);
      this.camera = new babylon.ArcRotateCamera(
        "camera1",
        -Math.PI / 2,
        Math.PI / 4,
        50,
        new babylon.Vector3(0, 0, 0),
        this.scene
      );
      // this.camera.attachControl(canvas, true);
      this.light = new babylon.HemisphericLight(
        "light",
        new babylon.Vector3(0, 1, 0),
        this.scene
      );
      this.light.intensity = 0.7;
      this.scene.clearColor = new babylon.Color3(0, 0.5, 1);

      this.createGround();
      this.createCar();

      this.engine.runRenderLoop(() => {
        this.scene.render();
        this.engine.resize();
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  width: 100%;
  height: 100vh;
}
</style>
