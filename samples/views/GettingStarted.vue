<script lang="ts" src="./GettingStarted.ts"></script>

<template>
  <div>
    <canvas ref="canvas" width="500px" height="300px"/>
    <Three v-if="canvas">

      <Renderer :canvas="canvas" camera="main" scene="scene1" :clearColor="0xCCCCCC" antialias shadows/>

      <AssetBundle name="cube">
        <Texture name="crate_Texture" src="/assets/textures/crate.jpg"/>
        <Material name="cube_Mat" :factory="cubeMaterialFactory"/>
        <Geometry name="cube_Geom" :factory="cubeGeometryFactory"/>
      </AssetBundle>

      <Scene name="scene1" assets="cube">

        <Camera name="main" :factory="perspectiveCameraFactory">
          <Position :value="{ x: -3.5, y: 1.75, z: 2.25 }"/>
          <Rotation :value="{ x: -41, y: -52, z: -35 }" />
        </Camera>

        <Light :factory="pointLightFactory">
          <Position :value="{ x: 0, y: 10, z: 5 }"/>
          <Shadows cast/>
        </Light>

        <Mesh material="cube_Mat" geometry="cube_Geom">
          <Position :value="{ x: 0, y: 0, z: 0 }"/>
          <Shadows cast receive/>
        </Mesh>

      </Scene>

    </Three>
  </div>
</template>

