<script lang="ts" src="./Demo.ts"></script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <button @click="changeScene(scene1)">Scene 1</button>
      <button @click="changeScene(scene2)">Scene 2</button>
    </div>

    <canvas ref="canvas" class="webglCanvas"></canvas>
    <div v-if="canvas">
      <three :canvas="canvas" antialias>

        <scene :name="scene1.name" :active.sync="scene1.active" @load="startLoading" @load-progress="loadingProgress" @loaded="finishLoading">
          <template slot="preload">
            <div>
              <material name="cubeMat" :factory="cubeMaterialFactory"/>
              <material name="waterMat" :factory="waterMaterialFactory"/>
            </div>

            <geometry name="cube" :factory="cubeFactory"/>
            <geometry name="plane" :factory="planeFactory"/>

          </template>

          <fog exp2/>

          <camera name="mainCamera" :factory="cameraFactory">
            <position :value="scene1.camera.position"/>
            <rotation :value="scene1.camera.rotation" rad/>

            <my-behaviour :data="scene1.camera"/>
          </camera>

          <light name="light" :factory="lightFactory">
            <position :value="{x: 0, y: 10, z: 0}"/>
            <shadows cast/>
          </light>

          <group name="group">
            <position :value="{ x: 0, y: 0, z: 0 }"/>

            <mesh name="waterPlane" geometry="plane" material="waterMat">
              <rotation :value="{ x: -90, y: 0, z: 0 }"/>
              <shadows receive/>
            </mesh>

            <mesh v-for="field in scene1.fields"
              :key="field.id"
              :name="'field-'+field.id"
              geometry="cube"
              material="cubeMat"
              >
              <position :value="{ x: field.x * 2, y: 0, z: field.y * 2}"/>
              <scale :value="{ x: 1.2, y: 0.7, z: 1.2}"/>
              <shadows cast receive/>
            </mesh>
          </group>

        </scene>

        <scene :name="scene2.name" :active.sync="scene2.active">
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
.webglCanvas {
  width: 80% !important;
  height: auto !important;
  max-height: 100vh;
}
</style>
