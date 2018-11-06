<script lang="ts" src="./Demo.ts"></script>

<template>
  <div class="demo">
    <h1>Demo page</h1>
    <div>
      <button @click="changeScene('scene1')">Scene 1</button>
      <button @click="changeScene('scene2')">Scene 2</button>
    </div>

    <div>
      <div class="screen">
        <canvas ref="canvas" class="screen-canvas"></canvas>
        <div class="screen-loading" v-if="isLoading">
          <div>
            <p>Loading...</p>
            <p>{{loadingAmount}} / {{loadingTotal}}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="canvas">
      <three>
        <renderer :canvas="canvas" :camera="activeCamera" :scene="activeScene" antialias shadows/>

        <asset-bundle name="PolygonMini" preload>
          <texture name="PolygonMini_Tex" src="/assets/textures/PolygonMinis_Texture_01.png"/>

          <standard-material name="PolygonMini_Mat" map="PolygonMini_Tex"/>

          <model name="PM_column" src="/assets/models/SM_Tile_Hex_Column_02.fbx" materials="PolygonMini_Mat"/>
          <model name="PM_flat" src="/assets/models/SM_Tile_Hex_Flat_01.fbx" materials="PolygonMini_Mat"/>
        </asset-bundle>

        <asset-bundle name="Forms">
          <geometry name="cube" :factory="cubeFactory"/>
          <geometry name="plane" :factory="planeFactory"/>
        </asset-bundle>

        <asset-bundle dependencies="Forms" name="Crate" preload>
          <texture name="crateTex" src="/assets/textures/crate.jpg"/>
          <standard-material name="cubeMat" map="crateTex"/>
        </asset-bundle>

        <asset-bundle dependencies="Forms" name="Water" preload>
          <standard-material name="waterMat" color="#9c9cff"/>
        </asset-bundle>

        <scene name="scene1" assets="PolygonMini, Water, Crate" @load="startLoading" @load-progress="loadingProgress" @loaded="finishLoading">

          <fog exp2/>

          <camera name="main" :factory="cameraFactory">
            <position :value="scene1.camera.position"/>
            <rotation :value="scene1.camera.rotation" rad/>
            <orbit-behaviour :data="scene1.camera"/>
          </camera>

          <light name="sun" :factory="lightFactory">
            <position :value="{x: -5, y: 10, z: -5}"/>
            <shadows cast/>
          </light>

          <mesh name="waterPlane" geometry="plane" material="waterMat">
            <rotation :value="{ x: -90, y: 0, z: 0 }"/>
            <shadows receive/>
          </mesh>

          <group>
            <position :value="{ x: 10, y: 3, z: 10 }"/>
            <scale :value="{ x: 0.01, y: 0.01, z: 0.01 }"/>
            <shadows cast receive/>

            <mesh model="PM_column" name="column-body">
              <shadows cast receive deep/>
            </mesh>
            <mesh model="PM_flat" name="column-top">
              <shadows cast receive deep/>
            </mesh>
          </group>

          <crate v-for="field in scene1.fields" :key="field.id" :position="field"/>

        </scene>

        <scene name="scene2" assets="Water" @load="startLoading" @load-progress="loadingProgress" @loaded="finishLoading">

          <fog exp2/>

          <camera name="main" :factory="cameraFactory">
            <position :value="scene1.camera.position"/>
            <rotation :value="scene1.camera.rotation" rad/>

            <orbit-behaviour :data="scene1.camera"/>
          </camera>

          <light name="sun" :factory="lightFactory">
            <position :value="{x: -5, y: 10, z: -5}"/>
            <shadows cast/>
          </light>

          <mesh name="waterPlane" geometry="plane" material="waterMat">
            <rotation :value="{ x: -90, y: 0, z: 0 }"/>
            <shadows receive/>
          </mesh>
        </scene>

      </three>
    </div>
  </div>
</template>

<style>
.fullscreen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
}

.screen {
  position: relative;
  width: 100%;
  height: 100%;
}
.screen-canvas {
  width: 100% !important;
  height: 100% !important;
  max-height: 100vh;
}
.screen-loading {
  position: absolute;
  top: 0;
  left: 0;
  background: black;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
</style>
