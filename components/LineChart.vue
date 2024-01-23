<template>
  <div class="rounded-md border bg-white p-4">
    <div class="relative space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-sm">
          <strong>Total {{ type === 'impressions' ? 'impressions' : 'visitors' }}:</strong>
          {{ total }}
        </span>

        <component
          v-pruvious-tooltip="'Unique visitors are counted per interval in the graph'"
          :is="ButtonGroupField"
          :modelValue="type"
          :options="{ choices: { impressions: 'Impressions', uniques: 'Unique visitors' } }"
          @update:modelValue="$emit('update:type', $event as 'impressions' | 'uniques')"
          class="ml-auto !w-auto"
        />
      </div>

      <Line :data="{ datasets, labels }" :options="chartOptions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getRawToken } from '#pruvious/client'
import { fields } from '#pruvious/dashboard'
import { CategoryScale, Chart as ChartJS, Filler, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js'
import { Line } from 'vue-chartjs'

const props = defineProps({
  type: {
    type: String as PropType<'impressions' | 'uniques'>,
    required: true,
  },
  site: {
    type: String,
    required: true,
  },
  timeRange: {
    type: Object as PropType<[number, number]>,
    required: true,
  },
})

defineEmits<{
  'update:type': ['impressions' | 'uniques']
}>()

// Register the chart components
// @see https://vue-chartjs.org/guide/
ChartJS.register(CategoryScale, Filler, LineElement, LinearScale, PointElement, Tooltip)

// All Pruvious fields can be dynamically imported like this
const ButtonGroupField = fields['button-group']()

// Refs
const datasets = ref<[{ data: number[] }]>([{ data: [] }])
const labels = ref<string[]>([])
const total = computed(() => datasets.value[0].data.reduce((a, b) => a + b, 0))

// Chart options
// @see https://www.chartjs.org/docs/latest/charts/line.html
const chartOptions = {
  aspectRatio: 4,
  backgroundColor: 'rgba(6, 82, 221, 0.05)',
  borderColor: '#b7e1ff',
  fill: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const subject = props.type === 'impressions' ? 'impression' : 'unique visitor'
          return ctx.dataset.data[ctx.dataIndex] + ` ${subject}` + (ctx.dataset.data[ctx.dataIndex] !== 1 ? 's' : '')
        },
      },
      displayColors: false,
      padding: 8,
    },
  },
  pointBackgroundColor: '#2491ff',
  pointRadius: 5,
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: false }, min: 0, ticks: { stepSize: 100 } },
  },
}

watchDebounced(
  () => [props.type, props.site, props.timeRange],
  async () => {
    const response = await $fetch<{ data: number[]; labels: string[] }>(`/api/${props.type}-chart`, {
      query: {
        site: props.site,
        from: props.timeRange[0],
        to: props.timeRange[1],
        timezoneOffset: new Date().getTimezoneOffset(),
      },
      headers: { authorization: `Bearer ${getRawToken()}` },
    })

    labels.value = response.labels
    datasets.value = [{ data: response.data }]
  },
  { immediate: true, debounce: 25 },
)
</script>
