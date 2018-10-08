<script lang="ts" src="./About.ts"></script>

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

        <scene :name="scene1.name" :active.sync="scene1.active">
          <template slot="preload">
            <material name="cubeMat" :factory="cubeMaterialFactory"/>
            <geometry name="cube" :factory="cubeFactory"/>

            <material name="waterMat" :factory="waterMaterialFactory"/>
            <geometry name="plane" :factory="planeFactory"/>
          </template>

          <camera name="mainCamera">
            <position :value="{x: 0, y: 10, z: 0}"/>
          </camera>

          <light name="light" :factory="lightFactory">
            <position :value="{x: 0, y: 10, z: 0}"/>
            <shadows cast/>
          </light>

          <mesh name="waterPlane" geometry="plane" material="waterMat">
            <rotation :value="{ x: -90, y: 0, z: 0 }"/>
            <shadows receive/>
          </mesh>

          <mesh v-for="(field, index) in scene1.fields"
            :key="field.x + ' ' + field.y"
            :name="'field-'+index"
            geometry="cube"
            material="cubeMat"
            >
            <position :value="{ x: field.x * 2, y: 0, z: field.y * 2}"/>
            <scale :value="{ x: 1.2, y: 0.7, z: 1.2}"/>
            <shadows cast receive/>
          </mesh>
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
