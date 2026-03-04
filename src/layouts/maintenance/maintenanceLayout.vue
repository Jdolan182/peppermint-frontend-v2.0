<template>

    <div class="h-full w-full">
        <div class="h-full overflow-hidden shadow-sm sm:rounded-lg">
            <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <!-- TODO logo -->
                    <!-- <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> -->
                    <HeaderTwo
                    :header=props.title
                    :stlye=1 
                    />
                </div>
        
                <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div class="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 space-y-6">
                        <div class="text-center">
                            <ErrorLabel
                                :label="form.maintenance.errorMessage"
                                :error="form.maintenance.error"

                            />
                        </div>
                        <div>
                            <Label
                                for="password" 
                                label="Password"
                            />
                            <div class="mt-1">
                            <Input 
                                name="password"
                                placeholder="Password"
                                @input-value="(value) => (form.password.value = value)"
                                :error="form.password.error"
                                :error-message="form.password.errorMessage"
                                type="password"
                            />
                            </div>
                        </div>
                
            
                        <div class="mt-1">
                            <Submit 
                            label="Submit"
                            @click="submit"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
    import Input from '@/components/inputs/Input.vue'
    import Label from '@/components/labels/Label.vue'
    import ErrorLabel from '@/components/labels/ErrorLabel.vue'
    import HeaderTwo from '@/components/labels/HeaderTwo.vue'
    import Submit from '@/components/buttons/Submit.vue'
    import { createForm } from "@/composables/forms";
    import { useMaintenanceStore } from '@/store/admin/maintenance';


    const maintenanceStore = useMaintenanceStore();

    const form = createForm([
      { key: 'password', default: '' }, 
      { key: 'maintenance', default: '' },
    ])

    const props = defineProps({
      title: {
        type: [String, Number],
        default: "Enter password to bypass maintenance mode",
      }
    });

    const emit = defineEmits(['updateMaintenanceMode'])

    const submit = async ({}) => {

        if(form.value.password.value == import.meta.env.VITE_MAINTENANCE_PASSWORD){
            maintenanceStore.setMode(0)
            emit('updateMaintenanceMode');
        }
       
    };
</script>