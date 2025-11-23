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
        v-for="(v, i) in values"
        :key="i"
        :x="i * (barW + gap)"
        :y="chartH - (v / maxVal) * chartH"
        :width="barW"
        :height="(v / maxVal) * chartH"
        fill="url(#g)"
        rx="4" />
    </g>

    <!-- labels -->
    <g :transform="`translate(${padLeft}, ${padTop + chartH + 6})`" font-size="10" fill="var(--muted)">
      <text v-for="(lbl, i) in labels" :key="i" :x="i * (barW + gap) + barW / 2" text-anchor="middle" :y="12">
        {{ lbl }}
      </text>
    </g>

    <!-- y axis ticks -->
    <g :transform="`translate(${padLeft - 6}, ${padTop})`" fill="var(--muted)" font-size="9" text-anchor="end">
      <text v-for="t in ticks" :key="t" :y="(1 - t / maxVal) * chartH + 4">{{ Math.round(t) }}</text>
    </g>
  </svg>
</template>

<script setup>
import { computed } from "vue";
import { toDisplayString } from "@vue/shared";

const props = defineProps({
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  width: { type: Number, default: 600 },
  height: { type: Number, default: 240 },
  bars: { type: Number, default: null },
});

const padLeft = 40;
const padTop = 20;
const chartW = computed(() => props.width - padLeft - 20);
const chartH = computed(() => props.height - padTop - 50);
const maxVal = computed(() => Math.max(1, ...props.values.map((v) => Number(v) || 0)));
const barCount = computed(() => props.bars || Math.max(1, props.values.length));
const gap = 10;
const barW = computed(() => Math.max(6, (chartW.value - (barCount.value - 1) * gap) / barCount.value));

const ticks = computed(() => {
  const m = maxVal.value;
  const t1 = m / 4;
  return [0, t1, t1 * 2, t1 * 3, m];
});
</script>

<style scoped>
svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
