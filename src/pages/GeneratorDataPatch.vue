<template>
  <q-page class="flex flex-center flex-column">
    <div class="section">
      <div class="q-mt-md text-h6">SQL Schema</div>
      <q-editor v-model="editor" min-height="30rem"/>
    </div>

    <div class="section">
      <div class="row justify-around">
        <div class="col-2">
          <div style="font-size: 15px">Count</div>
          <q-input v-model="count"/>
        </div>
        <div class="col-4">
          <div style="font-size: 15px">&nbsp;</div>
          <q-btn label="Generator" color="primary" @click="submitInput()"/>
        </div>
        <div class="col-2">
          <div style="font-size: 15px">&nbsp;</div>
          <q-btn label="Copy SQL" color="green" @click="copyToClipboard(sqlStatementElement)"/>
        </div>
        <div class="col-2">
          <div style="font-size: 15px">&nbsp;</div>
          <q-btn label="Copy JSON" color="green" @click="copyToClipboard(jsonStatementElement)"/>
        </div>
      </div>

    </div>
    <div class="section">

      <div class="q-mt-md text-h6">SQL Statement</div>
      <q-card flat bordered>
        <q-card-section>
          <pre class="scrollable-pre" style="white-space: pre-line">{{ sqlStatementElement }}</pre>
        </q-card-section>
      </q-card>
    </div>

    <div class="section">
      <div class="q-mt-md text-h6">JSON Statement</div>
      <q-card flat bordered>
        <q-card-section>
          <pre class="scrollable-pre" style="white-space: pre-line">{{ jsonStatementElement }}</pre>
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
  name: 'GeneratorDataPatch',

  setup() {
    const $q = useQuasar()
    const editor = ref("<pre>CREATE TABLE IEK_GENERATOR (\n" +
      "    id INTEGER PRIMARY KEY,\n" +
      "    bizz VARCHAR(36) NOT NULL,\n" +
      "    topic VARCHAR(20) NOT NULL,\n" +
      "    attribute VARCHAR(20) NOT NULL,\n" +
      "    source LONGTEXT,\n" +
      "    expect LONGTEXT,\n" +
      "    remark VARCHAR(255),\n" +
      "    is_active CHAR(1) NOT NULL CHECK (is_active IN ('Y', 'N')),\n" +
      "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n" +
      "    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n" +
      ");</pre>")
    const count = ref('3')
    const sqlStatementElement = ref('')
    const jsonStatementElement = ref('')

    function stripHtmlAndSpaces(input) {
      const div = document.createElement('div');
      div.innerHTML = input;
      const textContent = div.textContent || div.innerText || '';
      return textContent;
    }


    function submitInput() {

      if (!editor.value || !count.value) {
        $q.dialog({
          title: 'Error',
          message: 'Input value and Count are required fields.',
          color: 'negative',
          position: 'top',
          icon: 'report_problem',
        })
        return
      }
      const createGeneratorData = {
        topic: 'generator_datapatch',
        attribute: 'G_DATA_PATCH',
        source: JSON.stringify({
          statement: stripHtmlAndSpaces(editor.value), // Remove HTML tags and spaces
          count: count.value
        })
      }

      // console.log(createGeneratorData)
      api.post('/generator', createGeneratorData)
        .then((response) => {
          // console.log(response.data.data.expect)
          const responseData = JSON.parse(response.data.data.expect);
          // console.log(responseData)
          // console.log(responseData.sqlStatement.join('\n\n'))
          // console.log(responseData.jsonStatement)
          sqlStatementElement.value = responseData.sqlStatement.join('\n\n');
          jsonStatementElement.value = responseData.jsonStatement.map(item => JSON.stringify(item, null, 2)).join('\n\n');

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

    function copyToClipboard(text) {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      this.$q.notify({
        message: 'Copied to clipboard!',
        color: 'positive',
        position: 'top-right',
        icon: 'done'
      });
    }

    return {
      editor,
      count,
      submitInput,
      sqlStatementElement,
      jsonStatementElement,
      copyToClipboard
    }
  }
})
</script>

<style lang="sass" scoped>
.flex
  display: flex

.flex-center
  align-items: center
  justify-content: center

.flex-column
  flex-direction: column

.section
  margin: 20px
  width: 90%

.scrollable-pre
  max-height: 500px
  overflow-y: scroll

</style>
