<script lang="ts" src="./Crate.ts"></script>

<template>
  <mesh geometry="cube" material="cubeMat">
    <position :value="worldPosition"/>
    <shadows cast receive/>
  </mesh>
</template>

<style>
</style>
