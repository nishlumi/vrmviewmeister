import { ChildReturner } from "../../public/static/js/cls_childreturner";
import { VFileHelper, VFileOptions } from "../../public/static/js/filehelper";
import { AF_TARGETTYPE, SAMPLEKEY, SAMPLEURL } from "../res/appconst";
import { VVAppConfig } from "./appconf";
import { UnityCallbackFunctioner } from "./model/callback";
import { AnimationParsingOptions } from "./prop/cls_unityrel";
import { VVAvatar, VVCast } from "./prop/cls_vvavatar";

const template = `
<div class="vvposecatalog-area" v-if="poseapp.show" :class="poseapp.toppanelCSS">
    <div class="vvps-seekbar" :style="poseapp.seekbar_styles">
        <q-toolbar >
            <q-btn flat round dense icon="close" @click="close_onclick"></q-btn>
            <q-btn flat round dense icon="refresh" @click="refresh_onclick">
                <q-tooltip v-text="$t('refresh')"></q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="bookmark_added" :label="$t('cons_apply')" class="desktop-only"
                @click="apply_onclick" no-caps style="width:7rem;"
            >
                <q-tooltip v-text="$t('cons_apply')"></q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="bookmark_added" class="mobile-only"
                @click="apply_onclick" no-caps style="width:7rem;"
            >
                <q-tooltip v-text="$t('cons_apply')"></q-tooltip>
            </q-btn>

            <!--q-btn flat round dense icon="delete" 
                @click="delete_onclick"
                :disable="poseapp.header.list_selected.value == 'mystorage' ? false : true"
            >
                <q-tooltip v-text="$t('cons_delete')"></q-tooltip>
            </q-btn-->
            <!--q-btn flat round dense icon="file_download" @click="download_onclick">
                <q-tooltip v-text="$t('download as file')"></q-tooltip>
            </q-btn-->
            <q-btn flat round dense icon="file_upload" @click="upload_onclick"
                :disable="poseapp.header.list_selected.value == 'mystorage' ? false : true"
            >
                <q-tooltip v-text="$t('open from file')"></q-tooltip>
            </q-btn>
            <q-btn-toggle v-model="poseapp.states.item_mode"
                toggle-color="secondary" push
                :options="poseapp.btntoggle.options"
                @update:model-value="modetab_change"
            >
                <template v-slot:pose>
                    <div class="row items-center no-wrap">
                        <q-icon left name="directions_walk"></q-icon>
                        <q-tooltip class="text-center">
                            Pose
                        </q-tooltip>
                    </div>
                </template>
                <template v-slot:motion>
                    <div class="row items-center no-wrap">
                        <q-icon left name="animation"></q-icon>
                        <q-tooltip class="text-center">
                            Motion
                        </q-tooltip>
                    </div>
                </template>
            </q-btn-toggle>
            <q-select v-model="poseapp.header.list_selected" 
                :options="poseapp.header.list_origin" 
                filled dense
                @update:model-value="listorigin_onchange"
            ></q-select>
            <q-space></q-space>
            <q-input v-model="poseapp.search_str"  class="desktop-only"
                type="text" label="Search..." dense outlined
                @update:model-value="onchange_searchstr"
            ></q-input>
            <q-spinner v-if="poseapp.header.loading"
                color="secondary"
                size="3em"
            ></q-spinner>
            <q-space></q-space>
            <q-btn flat round :icon="poseapp.toggleIcon" class="desktop-only"
                @click="panelToggleBtn_onclick"
            ></q-btn>
        </q-toolbar>
    </div>
    <div class="q-pa-none" style="height:calc(100% - 50px);">
        <q-scroll-area class="row poseliststyle" style="height: calc(100%);overflow:auto">
            <div class="row no-wrap">
                <template v-for="(item,index) in poseapp.list.options">
                    <div class="vvposecatalog-card"
                        :key="index"
                        v-if="item.visibility==true"
                        @dblclick="apply_onclick"
                    >
                        <q-card v-ripple :class="item.styleclass" @click.stop="selectListItem(item)">
                            <template v-if="poseapp.states.item_mode == 'pose'">
                                <q-card-section class="q-pa-xs ellipsis">
                                    <div class="text-h5">{{ item.name.replace(".vvmpose","") }}</div>
                                </q-card-section>
                                <q-card-section horizontal>
                                    <q-img :src="item.thumbnail" style="height:128px;max-width:150px;" :alt="item.name"></q-img>
                                    <q-card-section>
                                        
                                        
                                        
                                    </q-card-section>
                                    
                                </q-card-section>
                                <q-tooltip>
                                    <div class="text-h5">{{ item.name}}</div>
                                    <div class="row">
                                        <div class="col-12 text-subtitle1">
                                            <b>{{ $t("Sample avatar") }}:</b>
                                        </div>
                                        <div class="col-11 offset-1 text-subtitle1">
                                            {{ item.sample }}
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 text-subtitle1">
                                            <b>{{ $t("Recommended height") }}:</b>
                                        </div>
                                        <div class="col-6 text-subtitle1">
                                            {{ listitem_height(item) }}
                                        </div>
                                    </div>
                                </q-tooltip>
                            </template>
                            <template v-else-if="poseapp.states.item_mode == 'motion'">
                                <q-card-section class="q-pa-xs ellipsis">
                                    <div class="text-h5">{{ item.name.replace(".vvmmot","") }}</div>
                                </q-card-section>
                                <q-card-section horizontal>
                                    <q-img :src="item.thumbnail" style="height:128px;max-width:150px;" :alt="item.name"></q-img>
                                    <q-card-section>
                                        
                                        
                                    </q-card-section>
                                    
                                </q-card-section>
                                <q-tooltip>
                                    <div class="text-h5">{{ item.name}}</div>
                                    <div class="row">
                                        <div class="col-6 offset-1">
                                            <b>{{ $t("type") }}:</b>
                                        </div>
                                        <div class="col-5">
                                            {{ targetTypeName(item.type) }}
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 offset-1">
                                            <b>{{ $t("fileformatver") }}:</b>
                                        </div>
                                        <div class="col-5">
                                            {{ item.version }}
                                        </div>
                                    </div>
                                    <div class="row" v-if="item.type == 0">
                                        <div class="col-6 offset-1">
                                            <b>{{ $t("Recommended height") }}:</b>
                                        </div>
                                        <div class="col-5">
                                            {{ item.height }} m
                                        </div>
                                    </div>
                                    <div class="row q-mt-sm">
                                        <div class="col-12">
                                            <b>{{ $t("frameinfo") }}</b>
                                        </div>
                                        <div class="col-4">
                                            <b>{{ $t("framecount") }}</b>
                                        </div>
                                        <div class="col-4">
                                            <b>{{ $t("framestart") }}</b>
                                        </div>
                                        <div class="col-4">
                                            <b>{{ $t("frameend") }}</b>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-4">
                                            {{ item.frameCount }}
                                        </div>
                                        <div class="col-4">
                                            {{ item.startFrame }}
                                        </div>
                                        <div class="col-4">
                                            {{ item.endFrame }}
                                        </div>
                                    </div>
                                </q-tooltip>
                            </template>
                            <q-menu context-menu touch-position>
                                <q-list dense>
                                    <q-item clickable v-close-popup 
                                        @click="download_onclick"
                                    >
                                        <q-item-section avatar>
                                            <q-icon name="file_download"></q-icon>
                                        </q-item-section>
                                        <q-item-section>
                                            {{ $t('download as file') }}
                                        </q-item-section>
                                    </q-item>
                                    <template v-if="poseapp.header.list_selected.value == 'mystorage'">
                                        <q-item clickable v-close-popup 
                                            @click="delete_onclick"
                                        >
                                            <q-item-section avatar>
                                                <q-icon name="delete"></q-icon>
                                            </q-item-section>
                                            <q-item-section>
                                                {{ $t('cons_delete') }}
                                            </q-item-section>
                                        </q-item>
                                    </template>
                                </q-list>
                            </q-menu>
                            
                        </q-card>
                    </div>
                </template>
            </div>
        </q-scroll-area>
    </div>
    
</div>
`;

export function definePoseMotionPanel(app, Quasar) {
    app.component("PosemotionPanel", {
        template: template,
        props : {
            modelValue: Boolean,
            mode : {
                type: String,
                default: "p",
            },
            darkmode: Boolean,
            appconf : VVAppConfig,
            avatar: VVAvatar,
            cast: VVCast,
            
        },
        emits : [
            "update:model-value",
            "applyafter",
            "hidepanel",
        ],
        setup(props, context) {
            const { modelValue, mode, darkmode, appconf, avatar, cast } = Vue.toRefs(props);
            const { t  } = VueI18n.useI18n({ useScope: 'global' });

            var cns_list_origin = [
                {label:t("Internal Storage"),value:"mystorage"},
            ];
            const UnityCallback = Vue.inject("UNITYCALLBACK");

            const poseapp = Vue.ref({
                show: false,
                dialog : {
                    maximized: false,
                    fullwidth: false,
                    fullheight: false,
                    styles : {
                        width : "auto",
                        height: "100%",
                    }
                },
                toggleIcon : "expand_more",
                toppanelCSS : {
                    "q-dark" : false,
                    "text-dark" : true,
                },
                btntoggle : {
                    options : [
                        {value:"pose", slot:"pose"},
                        {value:"motion", slot:"motion"}
                    ],
                    selected : {label: "Pose", value:"pose"}
                },
                seekbar_styles : {
                    height : "48px",
                },
                card: {
                    styles : {
                        "grid-template-columns": "100%",
                        "padding-left":"2px",
                        "padding-right": "2px",
                    }
                },
                header : {
                    show : true,
                    loading : false,
                    download : "pose.json",
                    url : null,
                    list_origin : cns_list_origin,
                    list_selected : cns_list_origin[0],
                },
                appconf : {
                    set_name : "_vvie_aco",
                    /**
                     * @type {VVConfigTemplate}
                     */
                    confs : {},
                },
                search_str: "",
                list : {
                    options : [],
                    selected : null,
                    tbl : {
                        columns : [
                            {name:"frameCount",label:t("framecount"), field:"frameCount"},
                            {name:"startFrame",label:t("target_begin_frame"), field:"startFrame"},
                            {name:"endFrame",label:t("target_end_frame"), field:"endFrame"},
                        ]
                    }
                },
                states : {
                    item_mode : "pose", //pose, motion
                },
                constant : {
                    poseurl : "1cJkuegzP0FBVJ0XE4uyhu4qF32WZAME7",
                    motionurl : "11Atv_WPyrh892VKZL7o0ZZgulvFQ1ECq"
                }
            });
            const fileoption = {
                POSE: {
                    types: [
                        {
                            description : "VVM pose file",
                            accept : {"application/json": [".vvmpose",".json"]}
                        }
                    ]
                },
                MOTION : {
                    types: [
                        {
                            description : "VVM motion file",
                            accept : {"application/json": [".vvmmot",".json"]}
                        }
                    ]
                }
                
            };

            const loadData = () => {
                poseapp.value.header.loading = true;
                poseapp.value.list.options.splice(0, poseapp.value.list.options.length);
                if (poseapp.value.states.item_mode == "pose") {
                    AppDB.pose.iterate((value,key,index)=>{
                        poseapp.value.list.options.push({
                            thumbnail : value.thumbnail,
                            name : key,
                            bodyinfo : value.frameData.bodyHeight,
                            sample : value.sampleavatar,
                            visibility : true,
                            styleclass : {
                                "list-item-selected" : false
                            },
                            isLoaded:true,
                            id: "",
                            data : value
                        });
                    }).then(()=>{
                        //console.log(opener._REFMYAPP.states.selectedAvatar);
                        poseapp.value.header.loading = false;
                    });
                }else if (poseapp.value.states.item_mode == "motion") {
                    AppDB.motion.iterate((value,key,index)=>{
                        poseapp.value.list.options.push({
                            thumbnail : value.thumbnail,
                            name: key,
                            type: value.targetType,
                            version : value.version,
                            height : Math.round(value.bodyHeight[1] * 1000) / 1000,
                            
                            frameCount : value.frames.length,
                            startFrame : value.frames[0].index,
                            endFrame : value.frames[value.frames.length-1].index,
                            
                            visibility : true,
                            styleclass : {
                                "list-item-selected" : false
                            },
                            isLoaded:true,
                            id: "",
                            data: value
                        });
                    }).then(()=>{
                        poseapp.value.header.loading = false;
                    });
                }
                
            }
            const loadSetting = () => {
                var textdata = localStorage.getItem(poseapp.value.appconf.set_name);
                if (textdata) {
                    var tmp = JSON.parse(textdata);
                    poseapp.value.appconf.confs = tmp;
                }
            }
            const generate_tempkey = (itemtype, server) => {
                return `pmdlg_temp_${itemtype}_${server}`;
            }
            //---watch--------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                poseapp.value.show = newval;
                if (newval === true) {
                    
                }
            });
            const wa_mode = Vue.watch(() => mode.value, (newval) => {
                if (newval == "p") {
                    poseapp.value.states.item_mode = "pose";
                }
                else if (newval == "m") {
                    poseapp.value.states.item_mode = "motion";
                }
                modetab_change();
            });
            const wa_darkmode = Vue.watch(()=> darkmode.value, (newval) => {
                poseapp.value.toppanelCSS["q-dark"] = newval.value;
                poseapp.value.toppanelCSS["text-dark"] = !newval.value;
                
            });

            //---event---------------------------------------------
            const refresh_onclick = () => {
                var tempkey = generate_tempkey(poseapp.value.states.item_mode,poseapp.value.header.list_selected.value);
                AppDB.temp.removeItem(tempkey)
                .then(val => {
                    listorigin_onchange(poseapp.value.header.list_selected);
                });
                
            }
            const apply_onclick = async () => {
                if (poseapp.value.list.selected) {
                    /*
                    //opener._REFMYAPP.returnPoseDialogValue(sel.data);
                    var js = new ChildReturner();
                    js.origin = location.origin;
                    js.windowName = "pose";
                    if (poseapp.value.states.item_mode == "pose") {
                        js.funcName = "apply_pose";
                    }else if (poseapp.value.states.item_mode == "motion") {
                        js.funcName = "apply_motion";
                    }
                    
                    js.data = JSON.stringify(poseapp.value.list.selected.data);
                    opener.postMessage(js);
                    */
                    if (
                        (!poseapp.value.list.selected.isLoaded) &&
                        (
                            //(poseapp.value.header.list_selected.value == "appserver") ||
                            (poseapp.value.header.list_selected.value == "gdrive")
                        )
                    ){
                        var baseurl = poseapp.value.appconf.confs.fileloader.gdrive.url;
                        var apikey = poseapp.value.appconf.confs.fileloader.gdrive.apikey;
                        var urlparams = new URLSearchParams();

                        //---decide URL
                        if (poseapp.value.header.list_selected.value == "appserver") {
                            baseurl = SAMPLEURL;
                            apikey = SAMPLEKEY;
                        }
                              
                        
                        //---setting URL parameters
                        urlparams.append("mode","load");
                        urlparams.append("apikey",apikey);

                        urlparams.append("fileid",poseapp.value.list.selected.id);
                        if (poseapp.value.states.item_mode == "pose") {
                            urlparams.append("extension","vvmpose");
                        }else if (poseapp.value.states.item_mode == "motion") {
                            urlparams.append("extension","vvmmot");
                        }

                        poseapp.value.header.loading = true;
                        //poseapp.value.list.options.splice(0, poseapp.value.list.options.length);
                        //---application google drive
                        //var finalurl = `${baseurl}?mode=enumdir&apikey=${apikey}&extension=${extension}&withdata=1`;
                        var finalurl = baseurl;
                        finalurl += "?" + urlparams.toString();

                        var fetchret = await fetch(finalurl);
                        if (fetchret.ok) {
                            var fetchjs = await fetchret.json();
                            if (typeof fetchjs.data == "object") {
                                poseapp.value.list.selected.data = fetchjs.data;
                            }else{
                                poseapp.value.list.selected.data = JSON.parse(fetchjs.data);
                            }
                            
                            poseapp.value.list.selected.isLoaded = true;
                            
                        }
                        poseapp.value.header.loading = false;
                    }
                    
                    if (poseapp.value.states.item_mode == "pose") {
                        if (!cast.value.avatar) {
                            appAlert(t("msg_pose_noselectmodel"));
                            return;
                        }
                        if (cast.value.avatar.type != AF_TARGETTYPE.VRM) {
                            appAlert(t("msg_pose_noselectmodel"));
                            return;
                        }
                        var pose = JSON.parse(JSON.stringify(poseapp.value.list.selected.data));
                        if (!appconf.value.confs.model.apply_pose_global_position) {
                            //---apply global position of pose data or not apply
                            for (var i = pose.frameData.frames[0].movingData.length-1; i >= 0; i--) {
                                var ln = pose.frameData.frames[0].movingData[i];
                                var arr = ln.split(",");
                                if (arr[0] == "0") {
                                    pose.frameData.frames[0].movingData.splice(i,1);
                                }
                            }
                        }
                        AppQueue.add(new queueData(
                            {target:cast.value.avatar.id,method:'AnimateAvatarTransform',param:JSON.stringify(pose)},
                            "",QD_INOUT.toUNITY,
                            null
                        ));
                        AppQueue.start();
                    }else if (poseapp.value.states.item_mode == "motion") {
                        var motion = JSON.parse(JSON.stringify(poseapp.value.list.selected.data));

                        if (cast.value.avatar.type != motion.targetType) {
                            appAlert(t("msg_openmotion_error2"));
                            return;
                        }
                        var tmpcast = cast.value;
                        var motiondata = JSON.stringify(motion);
                
                        //---Firstly, set target.
                        AppQueue.add(new queueData(
                            {target:AppQueue.unity.ManageAnimation,method:'SetLoadTargetSingleMotion',param:tmpcast.roleName},
                            "",QD_INOUT.toUNITY,
                            null
                        ));
                        //---Second load a motion data.
                        AppQueue.add(new queueData(
                            {target:AppQueue.unity.ManageAnimation,method:'LoadSingleMotionDirect',param:motiondata},
                            "openmotionresult",QD_INOUT.returnJS,
                            UnityCallback.openmotionresult,
                            {callback:UnityCallback}
                        ));
                        {
                            var param = new AnimationParsingOptions();
                            param.index = 1;
                            param.isCameraPreviewing = 0;
                            
                            param.isExecuteForDOTween = 1;
                            param.targetRole = tmpcast.roleName;
                            param.targetType = tmpcast.type.toString();
                
                            var js = JSON.stringify(param);
                
                            AppQueue.add(new queueData(
                                {target:AppQueue.unity.ManageAnimation,method:'PreviewSingleFrame',param:js},
                                "",QD_INOUT.toUNITY,
                                null
                            ));
                        }
                        AppQueue.start();
                    }
                    
                }
            }
            const delete_onclick = () => {
                if (poseapp.value.states.item_mode == "pose") {
                    appConfirm(t("msg_pose_delconfirm"),()=>{
                        if (poseapp.value.list.selected) {
                            AppDB.pose.removeItem(poseapp.value.list.selected.name).then(result=>{
                                refresh_onclick();
                            });
                        }
                    });
                }else if (poseapp.value.states.item_mode == "motion") {
                    appConfirm(t("msg_motion_delconfirm"),()=>{
                        if (poseapp.value.list.selected) {
                            AppDB.motion.removeItem(poseapp.value.list.selected.name).then(result=>{
                                refresh_onclick();
                            });
                        }
                    });
                }
            }
            const download_onclick = async () => {
                if (poseapp.value.list.selected) {
                    var opt = new VFileOptions();
                    
                    if (poseapp.value.states.item_mode == "pose") {
                        opt.types = fileoption.POSE.types;
                        opt.suggestedName = poseapp.value.list.selected.name + (poseapp.value.list.selected.name.toLowerCase().indexOf(".vvmpose") > 0 ? "" : ".vvmpose");
                    }else if (poseapp.value.states.item_mode == "motion") {
                        opt.types = fileoption.MOTION.types;
                        opt.suggestedName = poseapp.value.list.selected.name + (poseapp.value.list.selected.name.toLowerCase().indexOf(".vvmmot") > 0 ? "" : ".vvmmot");
                    }
                    

                    var content = null;
                    var useHTMLSaving = false;

                    //---for security
                    const tmpjs = JSON.original(poseapp.value.list.selected.data);
                    //tmpjs.thumbnail = "";

                    if (VFileHelper.checkNativeAPI) {
                        content = JSON.stringify(tmpjs);

                        VFileHelper.saveUsingDialog(
                            content,
                            opt,
                            useHTMLSaving
                        );
                    }else{
                        /*var bb = new Blob([JSON.stringify(poseapp.value.list.selected.data)], { type: "application/json" });
                        if (poseapp.value.header.url) window.URL.revokeObjectURL(poseapp.value.header.url);
        
                        poseapp.value.header.url = window.URL.createObjectURL(bb);
                        content = poseapp.value.header.url;
                        */
                        var tmpcontent = JSON.stringify(tmpjs);

                        var acckey = "";
                        var accval = "";
                        for (var obj in opt.types[0].accept) {
                            acckey = obj;
                            accval = opt.types[0].accept[obj];
                            break;
                        }
                        content = new Blob([tmpcontent], {type : acckey});
                        var burl = URL.createObjectURL(content);

                        var ret = await VFileHelper.saveUsingDialog(
                            burl,
                            opt,
                            useHTMLSaving
                        );
                        if (ret.cd == 0) {

                        }else{

                        }
                        URL.revokeObjectURL(burl);
                    
                    }
                    
                    
                }
            }
            const upload_onclick = async () => {
                //fl_openpose.value.click();
                var lfileoption = null;
                if (poseapp.value.states.item_mode == "pose") lfileoption = fileoption.POSE;
                if (poseapp.value.states.item_mode == "motion") lfileoption = fileoption.MOTION;


                VFileHelper.openFromDialog(lfileoption, 0, async (files,cd,err)=>{
                    if (files) {
                        var data = null;
                        if (files[0].data instanceof File) {
                            data = await files[0].data.text();
                        }else{
                            data = files[0].data;
                        }
                        if (data) {
                            var js = JSON.parse(data);
                            if (poseapp.value.states.item_mode == "pose") {
                                if ((!js) || 
                                    !("frameData" in js)
                                ) {
                                    appAlert(t("msg_pose_erroropen"));
                                    return;
                                }
                                //---for security
                                if ("thumbnail" in js) js.thumbnail = ""
                                else js["thumbnail"] = "";

                            }else if (poseapp.value.states.item_mode == "motion") {
                                if ((!js) || 
                                    !("frames" in js)
                                ) {
                                    appAlert(t("msg_motion_erroropen"));
                                    return;
                                }
                            }
                            
                            var filename = files[0].name.split(".")[0];
                            var reff = null;
                            if (poseapp.value.states.item_mode == "pose") {
                                reff = AppDB.pose.setItem(filename,js);
                            }else if (poseapp.value.states.item_mode == "motion") {
                                reff = AppDB.motion.setItem(filename,js);
                            }
                            reff.then(data => {
                                //console.log(data);
                                refresh_onclick();
                            })
                            .catch(err => {
                                console.error(err);
                            });
                            
                        }
                    }
                });
            }

            const selectListItem = (item) => {
                poseapp.value.list.selected = item;

                poseapp.value.list.options.forEach(v => {
                    v.styleclass["list-item-selected"] = false;
                });
                item.styleclass["list-item-selected"] = true;
            }
            const modetab_change = (val) => {
                refresh_onclick();
            }
            const close_onclick = () => {
                poseapp.value.show = false;
                context.emit("update:model-value",poseapp.value.show);
            }
            const panelToggleBtn_onclick = () => {
                if (poseapp.value.toggleIcon == "expand_less") {
                    poseapp.value.toggleIcon = "expand_more";
                }else{
                    poseapp.value.toggleIcon = "expand_less";
                }
                context.emit("hidepanel",poseapp.value.toggleIcon);
            }

            //---computed---------------------------------------------
            const list_actived = Vue.computed(() => {
                return (item) => {
                    if (!poseapp.value.list.selected) return false;
                    return (poseapp.value.list.selected.name == item.name);
                }
            });
            const listitem_height = Vue.computed(() => {
                return (item) => {
                    return Math.round(parseFloat(item.bodyinfo[1]) * 100);
                }
            });
            const targetTypeName = (targetType) => {
                const TYPENAME = ["VRM","OtherObject","Light","Camera",
                    "Text","Image","UImage","Audio","Effect","SystemEffect","Stage"
                ];

                return TYPENAME[targetType];
            }

            const onchange_searchstr = (val) => {
                const cval = val.toLowerCase();
                for (var i = 0; i < poseapp.value.list.options.length; i++) {
                    if (val == "") {
                        poseapp.value.list.options[i].visibility = true;
                    }else{
                        if (poseapp.value.list.options[i].name.toLowerCase().indexOf(cval) > -1) {
                            poseapp.value.list.options[i].visibility = true;
                        }else{
                            poseapp.value.list.options[i].visibility = false;
                        }
                    }
                    
                }
                
            }

            /**
             * load function main body by each storages.
             * @param {*} val 
             */
            const listorigin_onchange = (val) =>  {
                const enumrate_data = (data, originType) => {
                    for (var obj of data) {
                        let posedata = (typeof obj.data == "string" ? JSON.parse(obj.data) : obj.data);
                        if (poseapp.value.states.item_mode == "pose") {
                            poseapp.value.list.options.push({
                                thumbnail : posedata.thumbnail,
                                name : obj.name,
                                bodyinfo : posedata.frameData.bodyHeight,
                                sample : posedata.sampleavatar,
                                visibility : true,
                                styleclass : {
                                    "list-item-selected" : false
                                },
                                isLoaded: (originType == "appserver") ? true : false,
                                id: obj.id,
                                data : posedata
                            });
                        }else if (poseapp.value.states.item_mode == "motion") {
                            poseapp.value.list.options.push({
                                thumbnail : posedata.thumbnail,
                                name: obj.name,
                                type: posedata.targetType,
                                version : posedata.version,
                                height: Math.round(posedata.bodyHeight[1] * 1000) / 1000,
                                
                                frameCount : posedata.frames.length,
                                startFrame : posedata.frames[0].index,
                                endFrame : posedata.frames[posedata.frames.length-1].index,
                                
                                visibility : true,
                                styleclass : {
                                    "list-item-selected" : false
                                },
                                isLoaded: (originType == "appserver") ? true : false,
                                id: obj.id,
                                data: posedata
                            });
                        }
                        
                    }
                }
                var remoteload = (url, originType) => {
                    fetch(url)
                    .then(async ret => {
                        if (ret.ok) {
                            var js = await ret.json();
                            if (js.cd == 0) {
                                enumrate_data(js.data, originType);
                                //---save to cache
                                let key = generate_tempkey(poseapp.value.states.item_mode,val.value);
                                AppDB.temp.setItem(key,js.data);
                            }else{
                                alert(js.msg);
                            }
                        }
                    })
                    .finally(() => {
                        poseapp.value.header.loading = false;
                    });
                }
                console.log(val);
                if (
                    (val.value == "gdrive")
                ) {
                    var baseurl = poseapp.value.appconf.confs.fileloader.gdrive.url;
                    var apikey = poseapp.value.appconf.confs.fileloader.gdrive.apikey;
                    var urlparams = new URLSearchParams();

                           
                    
                    //---setting URL parameters
                    urlparams.append("mode","enumdir");
                    urlparams.append("apikey",apikey);
                    urlparams.append("withdata","1");

                    if (poseapp.value.states.item_mode == "pose") {
                        urlparams.append("extension","vvmpose");

                        //extension = "vvmpose";
                        if (val.value == "gdrive") {
                            //---user folder id
                            urlparams.append("dirid",poseapp.value.appconf.confs.fileloader.gdrive.user.pose);
                        }
                    }else if (poseapp.value.states.item_mode == "motion") {
                        urlparams.append("extension","vvmmot");

                        //extension = "vvmmot";
                        if (val.value == "gdrive") {
                            //---user folder id
                            urlparams.append("dirid", poseapp.value.appconf.confs.fileloader.gdrive.user.motion);
                        }
                    }

                    poseapp.value.header.loading = true;
                    poseapp.value.list.options.splice(0, poseapp.value.list.options.length);
                    //---application google drive
                    //var finalurl = `${baseurl}?mode=enumdir&apikey=${apikey}&extension=${extension}&withdata=1`;
                    var finalurl = baseurl;
                    finalurl += "?" + urlparams.toString();
                    /*if  (dirid != "") {
                        //---specified google drive id
                        finalurl += `&dirid=${dirid}`;
                    }*/
                    var tempkey = generate_tempkey(poseapp.value.states.item_mode,val.value);
                    AppDB.temp.getItem(tempkey)
                    .then((data)=> {
                        if (data) {
                            poseapp.value.header.loading = false;
                            enumrate_data(data, val.value);
                        }else{
                            remoteload(finalurl,val.value);
                        }
                    });
                    
                }else if (val.value == "appserver") {
                    //---decide URL
                    var baseurl = "/samplesv/enumdir";

                    poseapp.value.header.loading = true;
                    poseapp.value.list.options.splice(0, poseapp.value.list.options.length);
                    if (window.elecAPI) {
                        var options = {
                            container_name : "",
                            withdata : "1"
                        };
                        if (poseapp.value.states.item_mode == "pose") {
                            options.container_name = "vvmpose";
                        }else if (poseapp.value.states.item_mode == "motion") {
                            options.container_name = "vvmmot";
                        }
                        elecAPI.callSampleSV(baseurl,options)
                        .then(result => {
                            if (result.cd == 0) {
                                poseapp.value.header.loading = false;
                                enumrate_data(result.data, val.value);
                            }
                        });
                    }else{
                        var urlparams = new URLSearchParams();
                        if (poseapp.value.states.item_mode == "pose") {
                            urlparams.append("container_name","vvmpose");
                        }else if (poseapp.value.states.item_mode == "motion") {
                            urlparams.append("container_name","vvmmot");
                        }
                        urlparams.append("withdata","1");

                        var finalurl = baseurl;
                        finalurl += "?" + urlparams.toString();

                        //remoteload(finalurl,val.value);
                        var tempkey = generate_tempkey(poseapp.value.states.item_mode,val.value);
                        AppDB.temp.getItem(tempkey)
                        .then((data)=> {
                            if (data) {
                                poseapp.value.header.loading = false;
                                enumrate_data(data, val.value);
                            }else{
                                remoteload(finalurl,val.value);
                            }
                        });
                    }
                }else if (val.value == "mystorage") {
                    loadData();
                }
            }
            const checkSelectVRMObject = () => {
                var sinfo = opener._REFAPP.childreturner["select_info"];
                if (sinfo) {
                    console.log(sinfo);
                    if (sinfo.type == 0) {
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return true;
                }
            }
            const btn_savebvhmotion_onclick = () => {
                /*
                var js = new ChildReturner();
                js.origin = location.origin;
                js.windowName = "pose";
                js.funcName = "savebvhmotion";
                
                
                js.data = JSON.stringify(poseapp.value.list.selected.data);
                opener.postMessage(js);
                */

                if (cast.value.avatar.type != AF_TARGETTYPE.VRM) {
                    appAlert(t("msg_error_mediapipe1"));
                    return;
                }
                var tmpcast = cast.value;
        
                var param = tmpcast.roleName + "," + tmpcast.type + ",m";
                //AppQueue.unity.ManageAnimation
                AppQueue.add(new queueData(
                    {target:tmpcast.avatar.id,method:'ExportRecordedBVH'},
                    "savebvhmotion",QD_INOUT.returnJS,
                    UnityCallback.savebvhmotion,
                    {callback: UnityCallback, selRoleTitle: tmpcast.roleTitle}
                ));
                AppQueue.start();
            }
            const btn_saveanimmotion_onclick = () => {
                /*
                var sinfo = opener._REFAPP.childreturner["select_info"];
                if (sinfo) {
                    console.log(sinfo);
                    //return;
                }
                var js = new ChildReturner();
                js.origin = location.origin;
                js.windowName = "pose";
                js.funcName = "saveanimmotion";
                
                
                js.data = JSON.stringify({});
                opener.postMessage(js);
                */

                if (cast.value.avatar.type != AF_TARGETTYPE.VRM) {
                    appAlert(t("msg_error_mediapipe1"));
                    return;
                }
                var tmpcast = cast.value;
                var param = tmpcast.roleName + "," + tmpcast.type + ",m";
                //AppQueue.unity.ManageAnimation
                AppQueue.add(new queueData(
                    {target:tmpcast.avatar.id,method:'GenerateAnimationCurve'},
                    "savebvhmotion",QD_INOUT.returnJS,
                    UnityCallback.saveanimmotion,
                    {callback: UnityCallback, selRoleTitle: tmpcast.roleTitle}
                ));
                AppQueue.start();
            }
            const btn_savevrmamotion_onclick = () => {
                /*
                var sinfo = opener._REFAPP.childreturner["select_info"];
                if (sinfo) {
                    console.log(sinfo);
                    //return;
                }
                var js = new ChildReturner();
                js.origin = location.origin;
                js.windowName = "pose";
                js.funcName = "savevrmamotion";
                
                
                js.data = JSON.stringify({});
                opener.postMessage(js);
                */

                if (cast.value.avatar.type != AF_TARGETTYPE.VRM) {
                    appAlert(t("msg_error_mediapipe1"));
                    return;
                }
                var tmpcast = cast.value;
                var param = tmpcast.roleName + "," + tmpcast.type + ",m";
                //AppQueue.unity.ManageAnimation
                AppQueue.add(new queueData(
                    {target:tmpcast.avatar.id,method:'ExportVRMA'},
                    "savebvhmotion",QD_INOUT.returnJS,
                    UnityCallback.value.savevrmamotion,
                    {callback: UnityCallback.value, selRoleTitle: tmpcast.roleTitle}
                ));
                AppQueue.start();
            }

            const dialogHide = (evt) => {
                context.emit("update:model-value",poseapp.show);
            }
            /*
            Vue.onBeforeMount(() => {
                var darktheme = sessionStorage.getItem("UseDarkTheme");
                if (darktheme) {
                    if (darktheme == "1") {
                        Quasar.Dark.set(true);
                    }else{
                        Quasar.Dark.set(false);
                    }
                }
                var qloc = [
                    loc.replace("-",""),    //en-US -> enUS
                    loc.split("-")[0]       //en-US -> en
                ];
                var qlang = Quasar.lang[qloc[0]] || Quasar.lang[qloc[1]];
                if (qlang) {
                    Quasar.lang.set(qlang);
                }else{
                    Quasar.lang.set(Quasar.lang.enUS);
                }
                if (location.search != "") {
                    var s = location.search.replace("?","").split("&");
                    var svobj = {};
                    for (var si = 0; si < s.length; si++) {
                        var item = s[si].split("=");
                        svobj[item[0]] = item[1];
                    }
                    console.log(svobj);

                    if ("mode" in svobj) {
                        if (svobj["mode"] == "p") {
                            poseapp.value.states.item_mode = "pose";
                        }
                        else if (svobj["mode"] == "m") {
                            poseapp.value.states.item_mode = "motion";
                        }
                    }
                }
            });*/
            Vue.onMounted(() => {

                loadData();
                loadSetting();

                if ("fileloader" in poseapp.value.appconf.confs) {
                    if (poseapp.value.appconf.confs.fileloader.gdrive.enabled && 
                        (poseapp.value.appconf.confs.fileloader.gdrive.url != "")
                    ) {
                        poseapp.value.header.list_origin.push({label:t("Google Drive"),value:"gdrive"});
                    }
                }
                
                poseapp.value.header.list_origin.push({label:t("Application"),value:"appserver"});
                //console.log(opener);
                //VFileHelper.flags.isEnableFSAA = false;
            });

            return {
                poseapp,
                //---event---
                refresh_onclick,close_onclick,
                apply_onclick,delete_onclick,download_onclick,upload_onclick,
                selectListItem,onchange_searchstr,
                listorigin_onchange,modetab_change,
                btn_savebvhmotion_onclick,btn_saveanimmotion_onclick,btn_savevrmamotion_onclick,
                checkSelectVRMObject,
                dialogHide,panelToggleBtn_onclick,
                //---watch------
                wa_modelValue, wa_mode,wa_darkmode,
                //---computed---
                list_actived,listitem_height,targetTypeName,
                //---other method---
                loadData,loadSetting,
            };
        }
    });

}