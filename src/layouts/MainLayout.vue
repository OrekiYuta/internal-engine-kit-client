<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GNL__toolbar">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />

        <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
          <router-link to="/">
            <img src="../assets/iek-logo.svg" style="height: 40px;">
          </router-link>
        </q-toolbar-title>
        <q-space/>


        <q-space/>
        <img src="../assets/author-logo.svg" style="height: 30px;">

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="280"
    >
      <q-scroll-area class="fit">
        <q-list padding class="text-grey-8">
          <q-banner inline-actions rounded class="bg-blue-4 text-white">
            LOCATOR
          </q-banner>
          <q-item class="GNL__drawer-item" v-ripple v-for="link in iekLocator" :key="link.text"
                  clickable :to="link.route">
            <q-item-section avatar>
              <q-icon :name="link.icon"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-banner inline-actions rounded class="bg-orange-4 text-white">
            GENERATOR
          </q-banner>
          <q-item class="GNL__drawer-item" v-ripple v-for="link in iekGenerator" :key="link.text"
                  clickable :to="link.route">
            <q-item-section avatar>
              <q-icon :name="link.icon"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-banner inline-actions rounded class="bg-green-4 text-white">
            CONVERTOR
          </q-banner>
          <q-item class="GNL__drawer-item" v-ripple v-for="link in iekConvertor" :key="link.text"
                  clickable :to="link.route">
            <!--            <q-item-section>-->
            <!--              <q-item-label>{{ link.text }}-->
            <!--                <q-icon v-if="link.icon" :name="link.icon"/>-->
            <!--              </q-item-label>-->
            <!--            </q-item-section>-->
            <q-item-section avatar>
              <q-icon :name="link.icon"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>


        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {ref} from 'vue'
import {fasEarthAmericas, fasFlask} from '@quasar/extras/fontawesome-v6'
import {useRoute, useRouter} from 'vue-router';

export default {
  name: 'GoogleNewsLayout',

  setup() {
    const leftDrawerOpen = ref(false)
    const search = ref('')
    const showAdvanced = ref(false)
    const showDateOptions = ref(false)
    const exactPhrase = ref('')
    const hasWords = ref('')
    const excludeWords = ref('')
    const byWebsite = ref('')
    const byDate = ref('Any time')

    function onClear() {
      exactPhrase.value = ''
      hasWords.value = ''
      excludeWords.value = ''
      byWebsite.value = ''
      byDate.value = 'Any time'
    }

    function changeDate(option) {
      byDate.value = option
      showDateOptions.value = false
    }

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    return {
      leftDrawerOpen,
      search,
      showAdvanced,
      showDateOptions,
      exactPhrase,
      hasWords,
      excludeWords,
      byWebsite,
      byDate,

      iekLocator: [
        {icon: 'swap_horiz', text: 'ENV-DEV', route: 'locator-dev'},
        // {icon: 'sync_alt', text: 'ENV-PROD', route: 'locator-prod'},
        {icon: 'build', text: 'TODO', route: '/'},
      ],
      iekGenerator: [
        {icon: 'low_priority', text: 'DATA-PATCH', route: 'generator-data-patch'},
        // {icon: 'waves', text: 'STREAM (TODO)', route: 'generator-stream'},
        {icon: 'build', text: 'TODO', route: '/'},

      ],
      iekConvertor: [
        {icon: 'gesture', text: 'UUID', route: 'convertor-uuid'},
        {icon: 'build', text: 'TODO', route: '/'},
      ],

      onClear,
      changeDate,
      toggleLeftDrawer
    }
  }
}
</script>

<style lang="sass">
.GNL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 55%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      .q-icon
        color: #5f6368

    .q-item__label
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>
