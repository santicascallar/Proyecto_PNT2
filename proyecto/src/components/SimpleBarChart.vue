<template>
  <svg :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height">
    <defs>
      <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.9" />
      </linearGradient>
    </defs>

    <!-- bars -->
    <g :transform="`translate(${padLeft}, ${padTop})`">
      <rect
        <template>
          <!-- SimpleBarChart removed; keep minimal stub to avoid import errors -->
          <div class="muted">(chart component removed)</div>
        </template>

        <script setup>
        // placeholder
        </script>

        <style scoped>
        .muted{ color: var(--muted); }
        </style>
      <text v-for="(lbl, i) in labels" :key="i" :x="i * (barW + gap) + barW / 2" text-anchor="middle" :y="12">
