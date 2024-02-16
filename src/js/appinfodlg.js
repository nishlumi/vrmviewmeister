
const template = `
    <q-dialog v-model="show" @hide="dialogHide">
        <q-card class="q-dialog-plugin">
            <q-card-section class="row items-center q-pa-none">
                <q-img
                    src="static/img/app_og_image.png"
                    :ratio="16/9"
                    spinner-color="primary"
                    spinner-size="82px"
                >
                    
                </q-img>
            </q-card-section>
            <q-card-section>
                
                    <span >{{ description }}</span><br>
                    <b >Version</b>:<span v-text="version"></span><br>
                    <b >Revision</b>:<span v-text="revision"></span><br>
                    <b >Platform</b>:<span v-text="platform"></span><br>
                    <div>
                    <b>Memory</b>:<br>
                    <table border="1" style="border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Used (MB)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Javascript</td>
                                <td style="text-align:right;">
                                    <span v-text="data.memory.js.use"></span> 
                                </td>
                            </tr>
                            <tr>
                                <td>WebGL</td>
                                <td style="text-align:right;">
                                    <span v-text="data.memory.wgl.use"></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    </div>

                    <div class="absolute-bottom text-subtitle1 text-left q-ml-xs q-mb-xs"></div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat @click="show=false">OK</q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
`;

export function defineAppInfoDlg(app,Quasar) {
    app.component("AppinfoDlg",{
        template : template,
        props : {
            modelValue : Boolean,
            //show : Boolean,
            name : {
                type : String,
                required : true
            },
            description : {
                type : String,
                default : ""
            },
            version : String,
            revision : String,
            platform : String
        },
        emits : [
            "update:model-value"
        ],
        setup(props,context) {
            const {modelValue} = Vue.toRefs(props);

            const { t   } = VueI18n.useI18n({ useScope: 'global' });

            //---data -----------------------------------------
            const show = Vue.ref(false);

            const data = Vue.reactive({
                memory : {
                    js: {
                        use : 0,
                        total : 0
                    },
                    wgl: {
                        use : 0,
                        total : 0
                    }
                    
                }
            });

            const UnityConfig = Vue.inject("UNITYCONFIG");

            
            //---watch ----------------------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
                if (newval === true) {
                    var gmem = UnityConfig.instance.GetMemoryInfo();
                    data.memory.js.use = (gmem.usedJSHeapSize / 1024 / 1024).toFixed();
                    data.memory.js.total = (gmem.totalJSHeapSize / 1024 / 1024).toFixed();
                    data.memory.wgl.use = (gmem.usedWASMHeapSize / 1024 / 1024).toFixed();
                    data.memory.wgl.total = (gmem.totalWASMHeapSize / 1024 / 1024).toFixed();
                }
            });

            //---events --------------------------------------
            const dialogHide = (evt) => {
                context.emit("update:model-value",show.value);
            }

            
            return {
                show,data,
                wa_modelValue,
                dialogHide,
                
                
            }
        }
    });
}