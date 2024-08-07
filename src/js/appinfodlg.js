import { VFileHelper } from "../../public/static/js/filehelper";

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
                    <div class="row">
                        <div class="col-6">
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
                        <div class="col-6">
                            <table border="1" style="border-collapse:collapse;">
                                <thead>
                                    <tr>
                                        <th>Width</th>
                                        <th>Height</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="text-align:right;">
                                            <span v-text="data.screen.width"></span> 
                                        </td>
                                    
                                        <td style="text-align:right;">
                                            <span v-text="data.screen.height"></span>
                                        </td>
                                    
                                        <td style="text-align:right;">
                                            <span v-text="data.screen.name"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>

                            </div>
                        </div>
                    </div>
                        {{ data.screen.userAgent }}
                    </div>

                    <div class="absolute-bottom text-subtitle1 text-left q-ml-xs q-mb-xs"></div>
            </q-card-section>
            <q-card-actions align="right">
                <template v-if="!appNative">
                    <template v-if="data.other.urlname == '/'">
                        <q-btn color="secondary" @click="toMUI_onclick">{{ $t("url_to_normal") }}</q-btn>
                    </template>
                    <template v-else-if="data.other.urlname == '/mui'">
                        <q-btn color="secondary" @click="toMUI_onclick">{{ $t("url_to_mobile") }}</q-btn>
                    </template>
                </template>
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
                },
                screen : {
                    width : 0,
                    height: 0,
                    name : "",
                    userAgent : "",
                },
                other: {
                    urlname : "/mui",
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

                    data.screen.userAgent = navigator.userAgent;
                }
                data.screen.width = Math.round(Quasar.Screen.width);
                data.screen.height = Math.round(Quasar.Screen.height);
                data.screen.name = Quasar.Screen.name;
                if (location.pathname == "/mui") {
                    data.other.urlname = "/";
                }else{
                    data.other.urlname = "/mui";
                } 
            });

            //---events --------------------------------------
            const dialogHide = (evt) => {
                context.emit("update:model-value",show.value);
            }
            const toMUI_onclick = () => {
                location.href = data.other.urlname;
            }

            //---computed---------------------------------------
            const appNative = Vue.computed(() => {
                return VFileHelper.checkNativeAPI;
            })

            
            return {
                show,data,
                wa_modelValue,
                dialogHide,
                toMUI_onclick,
                appNative
                
                
            }
        }
    });
}