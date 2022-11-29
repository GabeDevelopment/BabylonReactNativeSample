/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

 import React, { useState, FunctionComponent, useEffect, useCallback } from "react";
 import { Button, SafeAreaView, StatusBar, View, ViewProps } from "react-native";
 import { EngineView, useEngine } from "@babylonjs/react-native";
 import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
 import { Camera } from "@babylonjs/core/Cameras/camera";
 import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
 import { Scene } from "@babylonjs/core/scene";
 import {
   WebXRSessionManager, WebXRTrackingState, WebXRHitTest, WebXRFeatureName,
   WebXRBackgroundRemover, WebXRAnchorSystem
 } from "@babylonjs/core/XR";
 import {
   HemisphericLight, Vector3, Quaternion, Color3, FreeCamera, MeshBuilder,
   StandardMaterial, CubeTexture, Texture, PBRMaterial, ReflectionProbe,
   Mesh, PointerEventTypes
 } from "@babylonjs/core";
 import "@babylonjs/loaders/glTF";
 
 //import * as BABYLON from "@babylonjs/core";
 
 const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
   const engine = useEngine();
   const [camera, setCamera] = useState<Camera>();
   const [xrSession, setXrSession] = useState<WebXRSessionManager>();
   const [trackingState, setTrackingState] = useState<WebXRTrackingState>();
   const [scene, setScene] = useState<Scene>();
 
   useEffect(() => {
     if (engine) {
 
       //var scene = new Scene(engine);
       const url = "https://raw.githubusercontent.com/MarcoGilardi81/3DAssets/main/GoldenCubePlaceholder1.gltf"
       SceneLoader.LoadAsync(url, undefined, engine,).then
         (
           (scene) => {
             setScene(scene);
 
             //Camera Stuff
             scene.createDefaultCamera(true, undefined, true);
             (scene.activeCamera as ArcRotateCamera).alpha += Math.PI;
             (scene.activeCamera as ArcRotateCamera).radius = 10;
             setCamera(scene.activeCamera!);
             
             //Lights Stuff
             var light = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
             
             //Loaded model stuff
             var cube = scene.meshes[0] as Mesh;
             cube.scaling = new Vector3(.1,.1,.1);
             cube.translate(new Vector3(0,0,-1), 5);
             
             //XR Stuff
             (async () => {
               if (xrSession) {
                 await xrSession.exitXRAsync();
               } else {
                 if (scene !== undefined) {
                   const xr = await scene.createDefaultXRExperienceAsync(
                     {
                       disableDefaultUI: true,
                       disableTeleportation: true,
                     });
 
                   const session = await xr.baseExperience.enterXRAsync(
                     "immersive-ar",
                     "unbounded",
                     xr.renderTarget,
                   );
 
                   setXrSession(session);
                   session.onXRSessionEnded.add(() => {
                     setXrSession(undefined);
                     setTrackingState(undefined);
                   });
                   
                   setTrackingState(xr.baseExperience.camera.trackingState);
                   xr.baseExperience.camera.onTrackingStateChanged.add
                     (
                       newTrackingState => {
                         setTrackingState(newTrackingState);
                       },
                     );
                 }
               }
             }
             )();
           }
         )
 
     }
   }, [engine]);
 
   return (
     <>
       <View style={props.style}>
         <View style={{ flex: 1 }}>
           <EngineView camera={camera} displayFrameRate={true} />
         </View>
       </View>
     </>
   );
 };
 
 const App = () => {
   return (
     <>
       <StatusBar barStyle="dark-content" />
       <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
         <EngineScreen style={{ flex: 1 }} />
       </SafeAreaView>
     </>
   );
 };
 
 export default App;
 