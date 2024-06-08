import { VFileHelper, VFileOptions } from "../../public/static/js/filehelper";
import { FILEOPTION } from "../res/appconst";

const template = `
<q-dialog v-model="show" :maximized="capapp.dialog.maximized" @hide="dialogHide">
    <q-card style="width:100%;height:100%;">
    <q-layout view="hHh LpR lff" style="width:inherit;height: inherit;">
    
        <q-header reveal elevated bordered>
        <q-toolbar class="bg-primary text-white">
            
                <q-btn flat round dense icon="menu" @click="leftDrawer_onclick">
                </q-btn>
            
            <q-btn flat round dense icon="refresh" @click="refresh_onclick">
                <q-tooltip v-text="$t('refresh')"></q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="delete" @click="delete_onclick">
                <q-tooltip v-text="$t('cons_delete')"></q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="file_download" @click="download_onclick">
                <q-tooltip v-text="$t('download as file')"></q-tooltip>
            </q-btn>
            <template v-if="chkShareNavigator">
                <q-btn flat round dense icon="share" @click="share_onclick">
                    <q-tooltip v-text="$t('share_file')"></q-tooltip>
                </q-btn>
            </template>
            <q-space></q-space>
            <q-btn flat round dense icon="close" @click="dialogHide">                
            </q-btn>
        </q-toolbar>
        <a href="" ref="lnk_capturedownload" download="pic.png" class="common_ui_off"></a>
        </q-header>
        <q-drawer
            side="left"
            v-model="capapp.left.show"
            bordered 
            :width="300"
            :breakpoint="500"
        >
            <div class="row q-ml-xs q-mr-xs">
                <div class="col-12">

                    <!--q-date v-model="capapp.left.filter_date"
                        :options="capapp.left.date_options" minimal
                        @update:model-value="datefilter_onchange"
                    >
                    </q-date-->
                    <q-input filled v-model="capapp.left.filter_date" mask="date" :rules="['date']">
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="capapp.left.filter_date"
                            :options="capapp.left.date_options"
                            @update:model-value="datefilter_onchange"
                            >
                            <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                            </q-date>
                        </q-popup-proxy>
                        </q-icon>
                    </template>
                    </q-input>
                </div>

            </div>
            <div style="height:calc(100% - 76px);overflow:auto;">
                <q-list bordered>
                    <q-item clickable v-ripple 
                        v-for="(item,index) in capapp.left.list.options" :key="index"
                        :active="list_actived(item)"
                        active-class="list-item-selected"
                        @click="selectListItem(item)"
                    >
                        <q-item-section>
                            <q-item-label>{{ item.text }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    
                </q-list>
            </div>
            
        </q-drawer>
    
        <q-card-section>
            <div class="row">
                <div class="col-12">
                    <q-img
                        :src="capapp.imagepanel.src"
                        :alt="capapp.imagepanel.alt"
                        spinner-color="primary"
                        spinner-size="82px"
                    ></q-img>
                </div>
            </div>
                
        </q-card-section>
    </q-layout>
    </q-card>
</q-dialog>
`;

/*
        <q-page-container  style="width:100%;height:calc(100% - 50px);">
            <q-page padding  style="width:100%;height:100%;overflow: auto;">
            </q-page>
        </q-page-container>

*/
export function defineCaptureDlg(app, Quasar) {
    app.component("CaptureDlg", {
        template: template, 
        props: {
            modelValue: Boolean
        },
        emits : [
            "update:model-value"
        ],
        setup(props, context) {
            const {modelValue } = Vue.toRefs(props);
            const { t  } = VueI18n.useI18n({ useScope: 'global' });

            const capapp = Vue.ref({
                dialog : {
                    maximized: false,
                    styles : {
                        width : "auto",
                        height: "100%",
                    }
                },
                header : {
                    show : true,
                    download : "pose.json",
                    url : null
                },
                appconf : {
                    set_name : "_vvie_aco",
                    confs : {},
                },
                left : {
                    show : true,
                    filter_date : new Date().toFormatText(true,false),
                    date_options: [],
                    list : {
                        options : [],
                        selected : null
                    }
                },
                imagepanel : {
                    src : null
                }
                
            });
            const show = Vue.ref(false);

            const lnk_capturedownload = Vue.ref(null);
            const fileoption = {
                types: [
                    {
                        description : "PNG file",
                        accept : {"application/image": [".png"]}
                    },
                    {
                        description : "JPEG file",
                        accept : {"application/image": [".jpg"]}
                    }
                ]
            };
    
            //---watch ----------------------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
                if (ID("uimode").value == "mobile") {
                    capapp.value.dialog.maximized = true;
                }else{
                    capapp.value.dialog.maximized = false;
                }
                if (newval === true) {
                    loadDateFilter();
                    loadData(new Date().toFormatText(true,false));
                }
                
            });
            const wa_show = Vue.watch(() => show.value, (newval) => {
                //loadDateFilter();
            });
            const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
                capapp.value.elements.panelCSS["q-dark"] = newval;
                capapp.value.elements.panelCSS["text-dark"] = !newval;
            });
            
            //---event-------------------------------------------------
            /**
             * Initially set up file list and date filter 
             */
            const loadDateFilter = () => {
                capapp.value.left.list.options.splice(0, capapp.value.left.list.options.length);
                capapp.value.left.date_options.splice(0,capapp.value.left.date_options.length);
                AppDB.capture.keys().then(result => {
                    for (var i = 0; i < result.length; i++) {
                        var target_date = new Date(parseInt(result[i]));
                        capapp.value.left.list.options.push({
                            text : target_date.toFormatText(true,true),
                            key : result[i],
                            value : ""
                        });
                        var onlydate = target_date.toFormatText(true,false);
                        const finx = capapp.value.left.date_options.findIndex(item => {
                            if (item == onlydate) return true;
                            return false;
                        });
                        if (finx == -1) {
                            capapp.value.left.date_options.push(onlydate);
                        }
                    }
                    return true;
                });
            }
            const loadData = (target) => {
                capapp.value.left.list.options.splice(0, capapp.value.left.list.options.length);
                return AppDB.capture.keys().then(result => {
                    for (var i = 0; i < result.length; i++) {
                        var target_date = new Date(parseInt(result[i]));
                        if ((target == null) ||
                            (target_date.toFormatText(true,false) == target)
                        ) {
                            capapp.value.left.list.options.push({
                                text : target_date.toFormatText(true,true),
                                key : result[i],
                                value : ""
                            });
                        }
                    }
                    return capapp.value.left.list;
                })
            }
            const loadSetting = () => {
                var textdata = localStorage.getItem(capapp.value.appconf.set_name);
                if (textdata) {
                    var tmp = JSON.parse(textdata);
                    capapp.value.appconf.confs = tmp;
                    VFileHelper.setAppConf(capapp.value.appconf);
                }
            }
            //---event---------------------------------------------
            const leftDrawer_onclick = () => {
                capapp.value.left.show = !capapp.value.left.show;
            }
            const datefilter_onchange = () => {
                console.log(capapp.value.left.filter_date);
                loadData(capapp.value.left.filter_date);
            }
            const refresh_onclick = () => {
                loadData(capapp.value.left.filter_date)
                
            }
            const delete_onclick = () => {
                appConfirm(t("msg_img_delconfirm"),()=>{
                    if (capapp.value.left.list.selected) {
                        AppDB.capture.removeItem(capapp.value.left.list.selected.key).then(result=>{
                            refresh_onclick();
                        });
                    }
                });
            }
            const download_onclick = async () => {
                if (capapp.value.left.list.selected) {
                    var opt = new VFileOptions();
                    opt.suggestedName = new Date(parseInt(capapp.value.left.list.selected.key)).toFullText() + ".png";
                    for (var i = 0; i < FILEOPTION.IMAGES.types.length; i++) {
                        opt.types.push(FILEOPTION.IMAGES.types[i]);
                        //opt.types[opt.types.length-1].accept["image/*"] = [["jpg","png","gif"]]
                    }
    
                    var content = capapp.value.imagepanel.src;
    
                    /*
                    if (VFileHelper.checkNativeAPI) {
                        //---convert to binary data
                        var burl = window.atob(capapp.value.imagepanel.src.split(",")[1]);
                        var mimetype = capapp.value.imagepanel.src.match(/(:)([a-z\/]+)(;)/)[2];
                        for( var i=0, l=burl.length, content=new Uint8Array( l ); l>i; i++ ) {
                            content[i] = burl.charCodeAt( i ) ;
                        }
                        //content = new Blob([content], {type : mimetype});
                    }
                    VFileHelper.saveUsingDialog(content, opt, true)
                    .then((value,cd,err) => {
                        
                    });
                    */
                   
                    lnk_capturedownload.value.accept = "png";
                    lnk_capturedownload.value.href = capapp.value.imagepanel.src; //burl;
                    lnk_capturedownload.value.download = new Date(parseInt(capapp.value.left.list.selected.key)).toFullText();// + ".png";
                    lnk_capturedownload.value.click();
                }
            }
            const share_onclick = async (evt) => {
                try {
                    if (capapp.value.left.list.selected) { 
                        
                        var bb = toBlob(capapp.value.imagepanel.src);
                        /*var arb = await bb.arrayBuffer();
                        var bytes = capapp.value.imagepanel.src; //new Uint8Array(arb);
                        VFileHelper.saveToGoogleDrive(true,{
                            name: new Date(parseInt(capapp.value.left.list.selected.key)).toFullText() + ".png",
                            extension : "png"
                        },bytes);
                        */
    
                        //----
                        var shares = {
                            title: new Date(parseInt(capapp.value.left.list.selected.key)).toFullText() + ".png",
                            files : [
                                new File([bb],new Date(parseInt(capapp.value.left.list.selected.key)).toFullText() + ".png",{type:"image/png"})
                            ],
                        }
                        await navigator.share(shares);
                    }
                }catch(e) {
                    console.error(e);
                    appNotifyWarning(e);
                }
            }
    
            const selectListItem = (item) => {
                capapp.value.left.list.selected = item;
                AppDB.capture.getItem(capapp.value.left.list.selected.key)
                .then(res=>{
                    capapp.value.imagepanel.src = res;
                    capapp.value.imagepanel.alt = capapp.value.left.list.selected.text;               
                });
            }
            const list_actived = Vue.computed(() => {
                return (item) => {
                    if (!capapp.value.left.list.selected) return false;
                    return (capapp.value.left.list.selected.key == item.key);
                }
            });
            const chkShareNavigator = Vue.computed(() => {
                return ("share" in navigator);
            });
            const chkMobile = Vue.computed(() => {
                if (Quasar.Screen.name == "xs") {
                    return true;
                }else{
                    return false;
                }
            });
            const dialogHide = (evt) => {
                show.value = false;
                context.emit("update:model-value",show.value);
            }
            
            Vue.onBeforeMount(() => {
                
            });
            Vue.onMounted(() => {
    
                
                loadSetting();
            });
    
            return {
                show,
                capapp,
                lnk_capturedownload,
                //---event---
                leftDrawer_onclick,
                refresh_onclick,delete_onclick,download_onclick,share_onclick,
                selectListItem,
                datefilter_onchange,dialogHide,
                //---computed---
                list_actived,chkShareNavigator,chkMobile,
                //watch----------------
                wa_modelValue,wa_show,wa_dark,
                //---other method---
                loadData,loadSetting,
            };
        }
    });
}