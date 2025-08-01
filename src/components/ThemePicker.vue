<!-- src/components/ThemePicker.vue -->
<template>
    <el-color-picker v-model="settingsStore.themeColor" />
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'
const settingsStore = useSettingsStore()
</script>