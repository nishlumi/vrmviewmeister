
const template = `
<div>
    <q-input
        filled
        v-model="colorval"
        
        dense
        :label="label"
    >
        <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-color v-model="colorval" 
                    @change="color_change"
                ></q-color>
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
</div>
`;

export function defineUcolorPicker(app,Quasar) {
    app.component("UcolorPicker",{
        template : template,
        props : {
            modelValue : String,
            label : String,
        },
        emits: ['update:modelValue',"change"],
        setup(props,context) {
            const { modelValue } = Vue.toRefs(props);
            const colorval = Vue.ref("");
    
            Vue.onMounted(()=>{
                colorval.value = modelValue.value;
            });
    
            const color_change = (e) => {
                context.emit("change",colorval.value);
    
            }
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                colorval.value = modelValue.value;
            });
            const wa_color = Vue.watch(() => colorval.value, (newval, oldval)=>{
              context.emit("update:modelValue",newval);
            });
    
    
            return {
                colorval,
                color_change,
                wa_modelValue,wa_color,
            };
        },
    });
    //customElements.define("ucolor-picker",UcolorPicker);
}

