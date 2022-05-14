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

            //---data -----------------------------------------
            const show = Vue.ref(false);
            
            //---watch ----------------------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
            });

            //---events --------------------------------------
            const dialogHide = (evt) => {
                context.emit("update:model-value",show.value);
            }
            
            return {
                show,
                wa_modelValue,
                dialogHide
                
            }
        }
    });
}