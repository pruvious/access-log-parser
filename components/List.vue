<template>
  <div class="rounded-md border bg-white p-4">
    <div class="relative space-y-4">
      <div class="flex justify-between gap-6 text-sm">
        <strong class="truncate">{{ title }}</strong>
        <span>
          <strong>Total:</strong>
          {{ total }}
        </span>
      </div>

      <ol v-if="data.length" class="tw-space-y-1">
        <li v-for="{ label, count } of expanded ? data : data.slice(0, 10)" class="flex justify-between gap-6 text-sm">
          <span :title="label" class="truncate">{{ label }}</span>
          <span>{{ count }}</span>
        </li>

        <li v-if="!expanded && data.length > 10" class="pt-1">
          <button @click="expanded = true" class="hocus:text-primary-700 text-sm font-medium transition">
            Show {{ data.length - 10 }} more
          </button>
        </li>
      </ol>

      <p v-else class="text-sm text-gray-400">No data available</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Array as PropType<{ label: string; count: number }[]>,
    required: true,
  },
})

const total = computed(() => props.data.reduce((a, b) => a + b.count, 0))
const expanded = ref(false)

watch(
  () => props.data,
  () => (expanded.value = false),
)
</script>
