<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="width: 80%">
      <div class="q-mt-md text-h6">Source</div>
      <q-input v-model="inputValue"/>
      <q-btn color="primary" label="Convertor" @click="submitInput" class="q-mb-md"/>
      <div class="q-mt-md text-h6">Expert</div>
      <q-card>
        <q-card-section>
          <p>{{ responseValue }}</p>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'
import {ref} from 'vue'
import {api} from 'boot/axios'
import {useQuasar} from 'quasar'

export default defineComponent({
  name: 'ConvertorUuid',

  setup() {
    const $q = useQuasar()
    const inputValue = ref('de467d96-33d0-4c14-92ce-885e24a3506c')
    const responseValue = ref(null)

    function submitInput() {
      if (!inputValue.value) {
        $q.dialog({
          title: 'Error',
          message: 'Input value is required.',
          color: 'negative',
          position: 'top',
          icon: 'report_problem',
        })
        return
      }

      const createConverterData = {
        topic: 'converter_uuid',
        attribute: 'C_UUID',
        source: inputValue.value,
      }

      // console.log(createConverterData)
      api.post('/converter', createConverterData)
        .then((response) => {
          // console.log(response.data)
          responseValue.value = response.data.data.expect
        })
        .catch(() => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Submission failed',
            icon: 'report_problem',
          })
        })
    }

    return {
      inputValue,
      responseValue,
      submitInput,
    }
  },
})
</script>
