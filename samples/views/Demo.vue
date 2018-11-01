<script lang="ts" src="./Demo.ts"></script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <button @click="changeScene(scene1)">Scene 1</button>
      <button @click="changeScene(scene2)">Scene 2</button>
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
        <renderer :canvas="canvas" camera="main" :scene="activeScene" antialias shadows/>

        <asset-bundle name="PolygonMini" preload>
          <texture name="PolygonMini_Tex" src="/assets/textures/PolygonMinis_Texture_01.png"/>

          <material name="PolygonMini_Mat" :factory="polygonMaterialFactory"/>

          <model name="grassModel" src="/assets/models/SM_Env_Grass_01.fbx" materials="PolygonMini_Mat"/>
          <model name="PM_column" src="/assets/models/SM_Tile_Hex_Column_02.fbx" materials="PolygonMini_Mat"/>
          <model name="PM_flat" src="/assets/models/SM_Tile_Hex_Flat_01.fbx" materials="PolygonMini_Mat"/>
        </asset-bundle>

        <asset-bundle name="Crate" preload>
          <texture name="crateTex" src="/assets/textures/crate.jpg"/>
          <material name="cubeMat" :factory="cubeMaterialFactory"/>
          <geometry name="cube" :factory="cubeFactory"/>
        </asset-bundle>

        <asset-bundle dependencies="Crate" name="Scene1" preload>

          <geometry name="plane" :factory="planeFactory"/>
          <material name="waterMat" :factory="waterMaterialFactory"/>

        </asset-bundle>

        <scene name="scene1" assets="PolygonMini, Scene1, Crate, Crate" @load="startLoading" @load-progress="loadingProgress" @loaded="finishLoading">

          <fog exp2/>

          <camera name="main" :factory="cameraFactory">
            <position :value="scene1.camera.position"/>
            <rotation :value="scene1.camera.rotation" rad/>

            <my-behaviour :data="scene1.camera"/>
          </camera>

          <camera name="secondary" :factory="cameraFactory">
            <position :value="{ x: 0, y: 10, z: 0 }"/>
            <rotation :value="{ x: -90, y: 0, z: 0 }"/>
          </camera>

          <light name="sun" :factory="lightFactory">
            <position :value="{x: -5, y: 10, z: -5}"/>
            <shadows cast/>
          </light>

          <grid>
            <position :value="{ x: -10, y: 0.5, z: -10 }"/>
          </grid>
          <axes>
            <position :value="{ x: -10, y: 0.5, z: -10 }"/>
          </axes>

          <group>
            <position :value="{ x: 0, y: 0, z: 0 }"/>

            <mesh name="waterPlane" geometry="plane" material="waterMat">
              <rotation :value="{ x: -90, y: 0, z: 0 }"/>
              <shadows receive/>
            </mesh>


            <mesh model="grassModel" name="grass">
              <position :value="{ x: 10, y: 3, z: 10 }"/>
              <scale :value="{ x: 0.05, y: 0.05, z: 0.05 }"/>
              <shadows cast receive recursive/>
            </mesh>

            <group>
              <position :value="{ x: 10, y: 3, z: 10 }"/>
              <scale :value="{ x: 0.01, y: 0.01, z: 0.01 }"/>
              <shadows cast receive recursive/>

              <mesh model="PM_column" name="column">
                <shadows cast receive recursive/>
              </mesh>
              <mesh model="PM_flat" name="flat_grass">
                <shadows cast receive recursive/>
              </mesh>
            </group>

            <mesh v-for="field in scene1.fields"
              :key="field.id"
              geometry="cube"
              material="cubeMat"
              >
              <position :value="{ x: field.x * 2, y: field.y + 5, z: field.z * -2}"/>
              <scale :value="{ x: 1.2, y: 1.2, z: 1.2}"/>
              <shadows cast receive/>

              <!-- <hover-behaviour :position="field" :distance="5"/> -->
            </mesh>
          </group>

        </scene>

        <scene name="scene2" assets="PolygonMini, Scene1, Crate, Crate" @load="startLoading" @load-progress="loadingProgress" @loaded="finishLoading">
          <!-- <template slot="preload">
            <material name="scene2_mat" :factory="materialFactory"/>
            <geometry name="scene2_field" :factory="geometryFactory"/>
          </template>

          <camera name="menuCamera"/>
          <mesh name="y-1" geometry="field"/>
          <mesh name="y-2" geometry="field"/>
          <mesh name="y-3" geometry="edge"/> -->
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
  /* height: auto; */
  /* margin: auto; */
  /* max-height: 100vh; */
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
