import earcut from "earcut";
import * as babylon from "@babylonjs/core";
const buildCar = (scene)=>{
    const outline = [
      new babylon.Vector3(0.4, 0, -0.2),
      new babylon.Vector3(0.35, 0, 0),
      new babylon.Vector3(0.25, 0, 0),
      new babylon.Vector3(0.15, 0, 0.2),
      new babylon.Vector3(-0.15, 0, 0.2),
      new babylon.Vector3(-0.25, 0, 0),
      new babylon.Vector3(-0.35, 0, 0),
      new babylon.Vector3(-0.4, 0, -0.2),
    ]
    const carBody = babylon.MeshBuilder.ExtrudePolygon("carBody",{shape:outline,depth:0.4},scene,earcut)
    
    return carBody
}
const createCar = ()=>{
  const car = buildCar();
  const wheelRB = babylon.MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.2, height: 0.08})
  wheelRB.parent = car;
  wheelRB.position.z = -0.2;
  wheelRB.position.x = -0.2;
  wheelRB.position.y = 0.035;

  const wheelRF = wheelRB.clone("wheelRF");
  wheelRF.position.x = 0.2;

  const wheelLB = wheelRB.clone("wheelLB");
  wheelLB.position.y = -0.4 - 0.035;

  const wheelLF = wheelRF.clone("wheelLF");
  wheelLF.position.y = -0.4 - 0.035;

  return car
  
}
export {createCar}


