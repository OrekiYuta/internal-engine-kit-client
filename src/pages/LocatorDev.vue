<template>
  <div class="q-pa-md">
    <div>
      <q-tabs
        v-model="tab"
        align="justify"
        narrow-indicator

      >
        <q-tab name="items" @click="loadLocatorList()">
          <span class="text-purple custom-tab-label">Items</span>
        </q-tab>
        <q-tab name="create">
          <span class="text-orange custom-tab-label">Create</span>
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="bg-transparent">
        <q-tab-panel name="items">

          <div class="q-pa-md row items-start q-gutter-md ">

            <q-card class="my-card" flat bordered
                    v-for="(item, index) in locatorList"
                    :key="index"
            >
              <q-card-section>
                <div class="q-mx-auto text-h6 q-mt-sm q-mb-xs" style="text-align: center;">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" style="font-size: 18px;">
                    {{ item.website }}
                  </q-tooltip>
                  <a :href="item.website" target="_blank">{{ item.title }}</a>
                </div>
                <div style="word-wrap: break-word; font-size: 16px;">{{ item.account }}</div>
                <div style="word-wrap: break-word; font-size: 16px;">{{ item.hexSecret }}</div>
              </q-card-section>
              <q-separator/>
              <q-card-actions>
                <q-btn flat color="primary" label="Update" @click="openUpdateDialog(index)"/>

                <q-btn flat color="red" label="Delete" @click="deleteLocator(item.bizz)"/>

                <q-space/>

                <q-btn
                  color="grey"
                  round
                  flat
                  :icon="expandedStates[index] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  @click="toggleExpanded(index)"
                />
              </q-card-actions>

              <q-slide-transition>
                <div v-show="expandedStates[index]">
                  <q-separator/>
                  <q-card-section class="text-subitle2">
                    {{ item.remark }}
                  </q-card-section>
                </div>
              </q-slide-transition>
            </q-card>


            <q-dialog v-model="updateDialogVisible" persistent>
              <q-card>
                <q-card-section>
                  <div class="row justify-around">
                    <div class="col-3">
                      <q-input v-model="updateLocatorData.title" label="* Title"/>
                    </div>
                    <div class="col-7">
                      <q-input v-model="updateLocatorData.website" label="* Website"/>
                    </div>
                    <div class="col-5">
                      <q-input v-model="updateLocatorData.account" label="Account"/>
                    </div>
                    <div class="col-5">
                      <q-input v-model="updateLocatorData.hexSecret" label="HexSecret"/>
                    </div>
                    <div class="col-11">
                      <q-input v-model="updateLocatorData.remark" label="Remark"/>
                    </div>
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat color="primary" label="Update Locator" @click="submitUpdateLocator()"/>
                  <q-btn flat color="secondary" label="Cancel" @click="closeUpdateDialog()"/>
                </q-card-actions>
              </q-card>
            </q-dialog>

          </div>

        </q-tab-panel>

        <q-tab-panel name="create">

          <div class="row justify-around">

            <div class="col-3">
              <q-input v-model="createLocatorData.title" label="* Title"/>
            </div>
            <div class="col-7">
              <q-input v-model="createLocatorData.website" label="* Website"/>
            </div>

            <div class="col-5">
              <q-input v-model="createLocatorData.account" label="Account"/>
            </div>
            <div class="col-5">
              <q-input v-model="createLocatorData.hexSecret" label="HexSecret"/>
            </div>

            <div class="col-11">
              <q-input v-model="createLocatorData.remark" label="Remark"/>
            </div>

            <div class="col-12 text-center q-mt-md">
              <q-btn color="primary" label="Create Locator" @click="createLocator()"/>
            </div>
          </div>

        </q-tab-panel>

      </q-tab-panels>
    </div>
  </div>
</template>


<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
  margin: 10px
  padding: 10px

.title-text
  text-align: center
  font-size: 20px
  font-weight: bold
  margin-bottom: 5px

.text-subtitle1
  font-size: 16px
  margin-bottom: 5px

.card-actions
  display: flex
  justify-content: space-between
  align-items: center
  padding: 5px 10px

.remark-section
  padding: 10px
  background-color: #f5f5f5

.custom-tab-label
  font-size: 20px
  font-weight: bold
</style>

<script>
import {defineComponent} from 'vue'
import {ref} from 'vue'
import {api} from 'boot/axios'
import {useQuasar} from 'quasar'

export default defineComponent({
  name: 'LocatorDev',

  setup() {
    const $q = useQuasar()
    // console.log($q.version)
    const locatorList = ref(null)
    const createLocatorData = ref({
      title: '',
      website: '',
      account: '',
      hexSecret: '',
      remark: '',
    });
    const updateDialogVisible = ref(false);
    const updateLocatorIndex = ref(null);
    const updateLocatorData = ref({
      title: '',
      website: '',
      account: '',
      hexSecret: '',
      remark: '',
    });

    const expandedRemark = ref("TODO")
    // Create an array of expanded states, one for each element
    const expandedStates = ref([]);

    function toggleExpanded(index) {
      // Toggle the expanded state for the element at the specified index
      expandedStates.value[index] = !expandedStates.value[index];
    }

    function loadLocatorList() {
      // console.log("load")
      api.get('/locator')
        .then((response) => {
          locatorList.value = response.data.data
          // console.log(response.data)
        })
        .catch(() => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    }

    loadLocatorList()

    function createLocator() {
      // console.log(createLocatorData.value)
      // console.log(createLocatorData.value.title)
      // console.log(createLocatorData.value.website)
      if (!createLocatorData.value.title || !createLocatorData.value.website) {

        $q.dialog({
          title: 'Error',
          message: 'Title and Website are required fields.',
          color: 'negative',
          position: 'top',
          icon: 'report_problem',
        });
        return;
      }
      // console.log(createLocatorData.value)
      api.post('/locator', createLocatorData.value)
        .then((response) => {
          // console.log(response.data)
          $q.dialog({
            title: 'Success',
            message: 'Locator created successfully!',
            color: 'positive',
            position: 'top',
            icon: 'check_circle',
          });
        })
        .catch(() => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    }

    function openUpdateDialog(index) {
      this.updateLocatorIndex = index;
      const selectedItem = this.locatorList[index];
      this.updateLocatorData = {...selectedItem};
      this.updateDialogVisible = true;
    }

    function submitUpdateLocator() {
      // console.log(this.updateLocatorData)
      if (!this.updateLocatorData.title || !this.updateLocatorData.website) {

        this.$q.dialog({
          title: 'Error',
          message: 'Title and Website are required fields.',
          color: 'negative',
          position: 'top',
          icon: 'report_problem',
        });
        return;
      }


      // this.updateLocatorData = this.updateLocatorIndex;

      // console.log(this.updateLocatorData)
      // console.log(this.updateLocatorData.bizz)
      api.put(`/locator/${this.updateLocatorData.bizz}`, this.updateLocatorData)
        .then((response) => {
          // console.log(response.data);
          this.updateDialogVisible = false;
          this.loadLocatorList();

          $q.dialog({
            title: 'Success',
            message: 'Locator updated successfully!',
            color: 'positive',
            position: 'top',
            icon: 'check_circle',
          });
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Update failed',
            icon: 'report_problem'
          });
        });
    }

    function closeUpdateDialog() {
      this.updateDialogVisible = false;
    }


    function deleteLocator(bizz) {
      api.delete(`/locator/${bizz}`)
        .then((response) => {
          // console.log(response.data);
          loadLocatorList(); // Call loadLocatorList to refresh the list
          $q.notify({
            color: 'positive',
            position: 'top',
            message: 'Locator deleted successfully!',
            icon: 'check_circle',
          });
        })
        .catch(() => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Delete failed',
            icon: 'report_problem'
          });
        });
    }

    return {
      locatorList,
      createLocatorData,
      updateLocatorData,

      expandedStates,
      expandedRemark,
      updateDialogVisible,
      updateLocatorIndex,

      tab: ref('items'),

      loadLocatorList,
      toggleExpanded,
      createLocator,
      openUpdateDialog,
      submitUpdateLocator,
      closeUpdateDialog,
      deleteLocator
    }
  }
})
</script>
