<template>
  <main>
     <component v-for="section in sections"  :is="components[section.page_section_template.template]" :data="section.data"> </component>
 </main>
</template>

<script setup>

  import { useAxios } from "@/composables/request.js";
  import { ref, onMounted, defineAsyncComponent, shallowRef } from 'vue'

  const data = ref({});
  const sections = ref({});
  const components = shallowRef([]);
  
  onMounted(async () => {
    getData('home')
  })
 
  const getData = async (slug) => {
    try {

      const res = await useAxios.get(`/api/pages/${slug}`)

      if(res.status == 200){
        data.value = res.data.data
        sections.value = data.value.sections

        sections.value.forEach((value) => {

          const section = defineAsyncComponent(() => 
            import('../../views/pageTemplates/'+ value.page_section_template.template + '.vue'),
          )
          components.value[value.page_section_template.template] = section

        })

      }

    } catch (e) {
    }
  }

</script>

