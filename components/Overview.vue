<template>
  <PruviousBase>
    <div
      class="sticky top-0 z-[31] flex min-h-[6.25rem] items-center justify-between gap-8 bg-gray-50/75 p-8 backdrop-blur backdrop-filter"
    >
      <h1 class="truncate text-xl">Overview</h1>

      <div class="flex gap-2">
        <div v-pruvious-tooltip="'Site'" class="tw-w-44">
          <component
            v-model="selectedSite"
            :is="SelectField"
            :options="{ choices: siteChoices, placeholder: 'Select a site' }"
          />
        </div>

        <component
          :is="ButtonGroupField"
          :modelValue="
            selectedTimeRange[0] === monthStart && selectedTimeRange[1] && selectedTimeRange[1] > todayStart
              ? 'month'
              : selectedTimeRange[0] === yesterdayStart && selectedTimeRange[1] === yesterdayEnd
                ? 'yesterday'
                : selectedTimeRange[0] === todayStart
                  ? 'today'
                  : null
          "
          :options="{ choices: { month: 'Month', yesterday: 'Yesterday', today: 'Today' } }"
          @update:modelValue="
            (value) => {
              if (value === 'month') {
                selectedTimeRange = [monthStart, new Date().setMilliseconds(0)]
              } else if (value === 'yesterday') {
                selectedTimeRange = [yesterdayStart, yesterdayEnd]
              } else if (value === 'today') {
                selectedTimeRange = [todayStart, new Date().setMilliseconds(0)]
              }
            }
          "
          class="!w-auto"
        />

        <div class="tw-w-128">
          <component
            v-model="selectedTimeRange"
            :is="DateTimeRangeField"
            :options="{ min: -8639999949600000, max: 8639999949600000 }"
          />
        </div>
      </div>
    </div>

    <div v-if="selectedSite && selectedTimeRange[0] && selectedTimeRange[1]" class="p-8 pt-0 tw-space-y-6">
      <LineChart v-model:type="type" :site="selectedSite" :timeRange="[selectedTimeRange[0], selectedTimeRange[1]]" />

      <div class="grid gap-6 tw-grid-cols-2">
        <div><List :data="pages" title="Page" /></div>
        <div><List :data="referrers" title="Referrer" /></div>
      </div>

      <div class="grid gap-6 tw-grid-cols-3">
        <div><List :data="countries" title="Country" /></div>
        <div><List :data="cities" title="City" /></div>
        <div><List :data="os" title="Operating system" /></div>
      </div>
    </div>

    <div v-else class="mt-0 flex rounded-md border p-8 text-sm text-gray-500 tw-m-8 tw-h-[calc(100%-8.25rem)]">
      <p class="m-auto">No data available</p>
    </div>
  </PruviousBase>
</template>

<script lang="ts" setup>
import type { CastedFieldType, PaginateResult } from '#pruvious'
import { getRawToken, pruviousFetch } from '#pruvious/client'
import { fields } from '#pruvious/dashboard'
import '~/assets/css/tailwind.css'

// All Pruvious fields can be dynamically imported like this
const ButtonGroupField = fields['button-group']()
const DateTimeRangeField = fields['date-time-range']()
const SelectField = fields.select()

// Resolve the site choices
const sitesResponse = await pruviousFetch<PaginateResult<Partial<CastedFieldType['impressions']>>>(
  'collections/impressions',
  { query: { select: 'site', group: 'site' } },
)
const siteChoices = Object.fromEntries(
  sitesResponse.success ? sitesResponse.data.records.map(({ site }) => [site, site]) : [],
)
const selectedSite = ref<string | null>(Object.keys(siteChoices)[0] ?? null)

// Prepare the time ranges
const todayStart = new Date().setHours(0, 0, 0, 0)
const yesterdayStart = new Date(todayStart).setDate(new Date().getDate() - 1)
const yesterdayEnd = new Date(todayStart).setSeconds(-1)
const monthStart = new Date(todayStart).setDate(1)
const selectedTimeRange = ref<[number | null, number | null]>([todayStart, new Date().setMilliseconds(0)])

// Other refs
const type = ref<'impressions' | 'uniques'>('impressions')
const pages = ref<{ label: string; count: number }[]>([])
const referrers = ref<{ label: string; count: number }[]>([])
const countries = ref<{ label: string; count: number }[]>([])
const cities = ref<{ label: string; count: number }[]>([])
const os = ref<{ label: string; count: number }[]>([])

watchDebounced(
  [type, selectedSite, selectedTimeRange],
  async () => {
    pages.value = await $fetch<{ label: string; count: number }[]>(`/api/${type.value}-pages`, {
      query: { site: selectedSite.value, from: selectedTimeRange.value[0], to: selectedTimeRange.value[1] },
      headers: { authorization: `Bearer ${getRawToken()}` },
    })

    referrers.value = await $fetch<{ label: string; count: number }[]>(`/api/${type.value}-referrers`, {
      query: { site: selectedSite.value, from: selectedTimeRange.value[0], to: selectedTimeRange.value[1] },
      headers: { authorization: `Bearer ${getRawToken()}` },
    })

    countries.value = await $fetch<{ label: string; count: number }[]>(`/api/${type.value}-countries`, {
      query: { site: selectedSite.value, from: selectedTimeRange.value[0], to: selectedTimeRange.value[1] },
      headers: { authorization: `Bearer ${getRawToken()}` },
    })

    cities.value = await $fetch<{ label: string; count: number }[]>(`/api/${type.value}-cities`, {
      query: { site: selectedSite.value, from: selectedTimeRange.value[0], to: selectedTimeRange.value[1] },
      headers: { authorization: `Bearer ${getRawToken()}` },
    })

    os.value = await $fetch<{ label: string; count: number }[]>(`/api/${type.value}-os`, {
      query: { site: selectedSite.value, from: selectedTimeRange.value[0], to: selectedTimeRange.value[1] },
      headers: { authorization: `Bearer ${getRawToken()}` },
    })
  },
  { immediate: true, debounce: 25 },
)
</script>
