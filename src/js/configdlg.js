import { DEFAULTMEM } from "../res/appconst.js";
import { VVAppConfig } from "./appconf.js";

const template = `
<q-dialog v-model="show" persistent style="max-width:600px;max-height:700px;">
    <q-card>
        <q-card-section class="q-ma-none q-pl-xs q-pr-xs" style="width:600px;height:700px;">
            <q-tabs
                v-model="tabIndex"
                class="text-primary"
                no-caps dense
            >
                <q-tab name="application" :label="$t('Application')"></q-tab>
                <q-tab name="files" :label="$t('File')"></q-tab>
                <q-tab name="model"  :label="$t('Model')"></q-tab>
                <q-tab name="animation" :label="$t('Animation')"></q-tab>
                <q-tab name="aiapis" label="AI APIs" class="common_ui_off"></q-tab>
            </q-tabs>
            <q-tab-panels v-model="tabIndex" animated style="height:auto">
                <q-tab-panel name="application">
                    <q-list >
                        <q-item>
                            <q-item-section>
                                <div class="row">
                                    <div class="col-8 q-pt-sm">
                                        <span class="">{{ $t('Memory using limit')}}</span>
                                    </div>
                                    <div class="col-4">
                                        <q-input v-model="appconf.confs.application.UseMemory" type="number" min="1" max="8" step="0.25"  dense></q-input>
                                    </div>
                                    <div class="col-12">
                                        [<span v-text="showPreviewMemory"></span>] MB<br>
                                        <b>{{ $t('msg_memory_using_limit')}}</b>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-8 q-pt-sm">
                                        <span class="">{{ $t('Mouse wheel speed')}}</span>
                                    </div>
                                    <div class="col-4">
                                        <q-input v-model="appconf.confs.application.MouseWheelSpeed" type="number" :in="1" :max="5" :step="0.1" dense></q-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-8 q-pt-sm">
                                        <span class="">{{ $t('msg_CameraKeymoveSpeed')}}</span>
                                    </div>
                                    <div class="col-4">
                                        <q-input v-model="appconf.confs.application.CameraKeymoveSpeed" type="number" :min="0.01" :max="0.25" :step="0.01" dense></q-input>
                                    </div>
                                    <div class="col-8 q-pt-sm">
                                        <span class="">{{ $t('msg_CameraKeyrotateSpeed')}}</span>
                                    </div>
                                    <div class="col-4">
                                        <q-input v-model="appconf.confs.application.CameraKeyrotateSpeed" type="number" :min="0.01" :max="2" :step="0.01" dense></q-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.application.focus_camera_onselect" :label="$t('msg_focus_camera_onselect')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-8 q-pt-sm">
                                        <span class="">{{ $t('msg_distance_camera_viewpoint')}}</span>
                                    </div>
                                    <div class="col-4">
                                        <q-input v-model="appconf.confs.application.distance_camera_viewpoint" type="number" min="0.1" max="5" step="0.1" dense></q-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.application.show_camera_target_object" :label="$t('msg_show_camera_target_object')"></q-checkbox>
                                    </div>
                                    
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.application.UseHTMLCanvasForScreenShot" :label="$t('msg_UseHTMLCanvasForScreenShot')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.application.UseDarkTheme" :label="$t('msg_UseDarkTheme')"></q-checkbox>
                                    </div>
                                </div>
                                
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-tab-panel>
                <q-tab-panel name="files">
                    <q-list>
                        <q-item-section>
                            <div class="row">
                                <div class="col-9">
                                    <q-checkbox v-model="appconf.confs.application.stock_opened_file_history" :label="$t('msg_stock_opened_file_history')"></q-checkbox>
                                </div>
                                <div class="col-3">
                                    <q-btn label="Clear" color="primary" 
                                        @click="historyClear_onclick"
                                    ></q-btn>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <q-checkbox v-model="appconf.confs.application.shortcut_vrminfo_from_history" :label="$t('msg_shortcut_vrminfo_from_history')"></q-checkbox>
                                </div>
                                
                            </div>
                            <div class="row">
                                <div class="col-8 q-pt-sm">
                                    <span class="">{{ $t('msg_not_autoload_over_mb')}}</span>
                                </div>
                                <div class="col-2 q-pl-sm">
                                    <q-input v-model="appconf.confs.application.not_autoload_over_mb" type="number" min="1" max="9999" step="1" dense></q-input>
                                </div>
                                <div class="col-1 q-pt-md">
                                    <span>MB</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <q-checkbox v-model="appconf.confs.application.enable_backup" :label="$t('msg_enable_backup')"></q-checkbox>
                                </div>
                                
                            </div>
                            <div class="row">
                                <div class="col-8 q-pt-sm">
                                    <span>{{ $t('msg_backup_project_interval')}}</span>
                                </div>
                                <div class="col-2 q-pl-sm">
                                    <q-input v-model="appconf.confs.application.backup_project_interval" type="number" min="1" max="10" step="1" dense></q-input>
                                </div>
                                <div class="col-1 q-pt-md">
                                    <span>{{ $t('msg_backup_project_interval2')}}</span>
                                </div>
                            </div>
                        
                        </q-item-section>
                    </q-list>
                </q-tab-panel>
                <q-tab-panel name="model">
                    <q-list >
                        <q-item>
                            <q-item-section>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.model.save_pose_thumbnail_also" :label="$t('msg_save_pose_thumbnail_also')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.model.apply_pose_global_position" :label="$t('msg_apply_pose_global_position')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.model.enable_foot_autorotate" :label="$t('msg_enable_foot_autorotate')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.model.body_natural_limit" :label="$t('msg_body_natural_limit')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-8">
                                        <span>{{ $t('msg_interlock_body') }}</span>
                                    </div>
                                    <div class="col-11 offset-md-1">
                                        <q-checkbox v-model="appconf.confs.model.interlock_body_chest" :label="$t('msg_interlock_body_chest')"></q-checkbox>
                                        <q-checkbox v-model="appconf.confs.model.interlock_body_aim" :label="$t('msg_interlock_body_aim')"></q-checkbox>
                                        <q-checkbox v-model="appconf.confs.model.interlock_body_pelvis" :label="$t('msg_interlock_body_pelvis')"></q-checkbox>
                                        <q-checkbox v-model="appconf.confs.model.interlock_body_arms" :label="$t('msg_interlock_body_arms')"></q-checkbox>
                                        <q-checkbox v-model="appconf.confs.model.interlock_body_legs" :label="$t('msg_interlock_body_legs')"></q-checkbox>
                                    </div>
                                </div>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-tab-panel>
                <q-tab-panel name="animation">
                    <q-list >
                        <q-item>
                            <q-item-section>
                                <div class="row">
                                    <div class="col-8 q-pt-sm">
                                        <span class="">{{ $t('msg_initial_framecount')}}</span>
                                    </div>
                                    <div class="col-4">
                                        <q-input v-model.number="appconf.confs.animation.initial_framecount" type="number" :min="60" :max="300" :step="1" dense></q-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.animation.recover_firstpose_whenfinished" :label="$t('msg_recover_firstpose_whenfinished')"></q-checkbox>
                                    </div>
                                    <div class="col-6 offset-sm-3 q-pt-sm">
                                        {{ $t('msg_recover_firstpose_timeout') }}
                                    </div>
                                    <div class="col-3">
                                        <q-input v-model="appconf.confs.animation.recover_firstpose_timeout" type="number" :min="0" :max="2000" :step="100" dense></q-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.animation.recover_pose_whenselected" :label="$t('msg_recover_pose_whenselected')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.animation.preview_onlyselected_whenselected" :label="$t('msg_preview_onlyselected_whenselected')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row common_ui_off">
                                    <div class="col-8 q-pt-sm">
                                        <span class="">{{ $t('msg_default_baseDuration')}}</span>
                                    </div>
                                    <div class="col-4">
                                        <q-input v-model="appconf.confs.animation.base_duration" type="number" :min="0.01" :max="2" :step="0.01" dense></q-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.animation.off_ikmarker_during_play_animation" :label="$t('msg_off_ikmarker_during_play_animation')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row common_ui_off">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.animation.remove_emptytimeline_whensave" :label="$t('msg_remove_emptytimeline_whensave')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row common_ui_off">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.animation.play_with_record_movie" :label="$t('msg_play_with_record_movie')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.animation.with_compling" :label="$t('msg_with_compling')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.animation.recover_tomax_overframe" :label="$t('msg_recover_tomax_overframe')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.animation.enable_audio_record" :label="$t('msg_enable_audio_record')"></q-checkbox>
                                    </div>
                                </div>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-tab-panel>
                <q-tab-panel name="aiapis" class="common_ui_off">
                    <q-list>
                        <q-item>
                            <q-item-section>
                                <div class="row">
                                    <div class="col-4 q-pt-sm">
                                        <span class="">{{ "URL of Web API" }}</span>
                                    </div>
                                    <div class="col-8">
                                        <q-input v-model="appconf.confs.aiapis.baseurl" type="text" dense></q-input>
                                    </div>
                                </div>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-tabs
                                    v-model="elements.aiapis.tabIndex"
                                    class="text-primary"
                                    no-caps dense
                                >
                                    <q-tab name="txt2img" label="txt2img"></q-tab>
                                    <q-tab name="img2img" label="img2img"></q-tab>
                                </q-tabs>
                                <q-tab-panels v-model="elements.aiapis.tabIndex" style="height:auto">
                                    <q-tab-panel name="txt2img">
                                        <q-card>
                                            <q-card-section>
                                                <div class="row">
                                                    <div class="col-4 q-pt-sm">
                                                        <span class="">{{ "orig width x height" }}</span>
                                                    </div>
                                                    <div class="col-3 offset-sm-1">
                                                        <q-input v-model.number="appconf.confs.aiapis.txt2img.orig_width" type="number" :min="32" :max="1024" :step="8" dense></q-input>
                                                    </div>
                                                    <div class="col-1">
                                                        x
                                                    </div>
                                                    <div class="col-3">
                                                        <q-input v-model.number="appconf.confs.aiapis.txt2img.orig_height" type="number" :min="32" :max="1024" :step="8" dense></q-input>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-6 q-pt-sm">
                                                        <span class="">{{ "sampler name" }}</span>
                                                    </div>
                                                    <div class="col-5">
                                                        <q-select
                                                            :options="elements.aiapis.sampler_name.options"
                                                            v-model="elements.aiapis.txt2img.sampler_name.selected"
                                                        ></q-select>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-8 q-pt-sm">
                                                        <span class="">{{ "steps" }}</span>
                                                    </div>
                                                    <div class="col-4">
                                                        <q-input v-model="appconf.confs.aiapis.txt2img.steps" type="number" :min="1" :max="250" :step="1" dense></q-input>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-8 q-pt-sm">
                                                        <span class="">{{ "cfg scale" }}</span>
                                                    </div>
                                                    <div class="col-4">
                                                        <q-input v-model="appconf.confs.aiapis.txt2img.cfg_scale" type="number" :min="1.0" :max="30.0" :step="0.5" dense></q-input>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-8 q-pt-sm">
                                                        <span class="">{{ "batch counts" }}</span>
                                                    </div>
                                                    <div class="col-4">
                                                        <q-input v-model="appconf.confs.aiapis.txt2img.batch_count" type="number" :min="1" :max="250" :step="1" dense></q-input>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-8 q-pt-sm">
                                                        <span class="">{{ "batch size" }}</span>
                                                    </div>
                                                    <div class="col-4">
                                                        <q-input v-model="appconf.confs.aiapis.txt2img.batch_size" type="number" :min="1" :max="8" :step="1" dense></q-input>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-8 q-pt-sm">
                                                        <span class="">{{ "base size" }}</span>
                                                    </div>
                                                    <div class="col-4">
                                                        <q-input v-model="appconf.confs.aiapis.txt2img.base_size" type="number" :min="64" :max="2048" :step="64" dense></q-input>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-8 q-pt-sm">
                                                        <span class="">{{ "max size" }}</span>
                                                    </div>
                                                    <div class="col-4">
                                                        <q-input v-model="appconf.confs.aiapis.txt2img.max_size" type="number" :min="64" :max="2048" :step="64" dense></q-input>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-8 q-pt-sm">
                                                        <span class="">{{ "seed" }}</span>
                                                    </div>
                                                    <div class="col-4">
                                                        <q-input v-model="appconf.confs.aiapis.txt2img.seed" type="text" dense></q-input>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-12">
                                                        <q-checkbox v-model="appconf.confs.aiapis.txt2img.use_gfpgan" label="Enable GFPGAN (may fix faces)"></q-checkbox>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-12">
                                                        <q-checkbox v-model="appconf.confs.aiapis.txt2img.tiling" label="Enable tiling mode"></q-checkbox>
                                                    </div>
                                                </div>
                                            </q-card-section>
                                        </q-card>
                                    </q-tab-panel>
                                    <q-tab-panel name="img2img">
                                        <q-card>
                                            <q-card-section>
                                                <div class="row">
                                                        <div class="col-6 q-pt-sm">
                                                            <span class="">{{ "sampler name" }}</span>
                                                        </div>
                                                        <div class="col-5">
                                                            <q-select
                                                                :options="elements.aiapis.sampler_name.options"
                                                                v-model="elements.aiapis.img2img.sampler_name.selected"
                                                            ></q-select>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 q-pt-sm">
                                                            <span class="">{{ "steps" }}</span>
                                                        </div>
                                                        <div class="col-4">
                                                            <q-input v-model="appconf.confs.aiapis.img2img.steps" type="number" :min="1" :max="250" :step="1" dense></q-input>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 q-pt-sm">
                                                            <span class="">{{ "cfg scale" }}</span>
                                                        </div>
                                                        <div class="col-4">
                                                            <q-input v-model="appconf.confs.aiapis.img2img.cfg_scale" type="number" :min="1.0" :max="30.0" :step="0.5" dense></q-input>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 q-pt-sm">
                                                            <span class="">{{ "Denoising strength" }}</span>
                                                        </div>
                                                        <div class="col-4">
                                                            <q-input v-model="appconf.confs.aiapis.img2img.denoising_strength" type="number" :min="0.0" :max="1.0" :step="0.01" dense></q-input>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 q-pt-sm">
                                                            <span class="">{{ "batch counts" }}</span>
                                                        </div>
                                                        <div class="col-4">
                                                            <q-input v-model="appconf.confs.aiapis.img2img.batch_count" type="number" :min="1" :max="250" :step="1" dense></q-input>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 q-pt-sm">
                                                            <span class="">{{ "batch size" }}</span>
                                                        </div>
                                                        <div class="col-4">
                                                            <q-input v-model="appconf.confs.aiapis.img2img.batch_size" type="number" :min="1" :max="8" :step="1" dense></q-input>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 q-pt-sm">
                                                            <span class="">{{ "base size" }}</span>
                                                        </div>
                                                        <div class="col-4">
                                                            <q-input v-model="appconf.confs.aiapis.img2img.base_size" type="number" :min="64" :max="2048" :step="64" dense></q-input>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 q-pt-sm">
                                                            <span class="">{{ "max size" }}</span>
                                                        </div>
                                                        <div class="col-4">
                                                            <q-input v-model="appconf.confs.aiapis.img2img.max_size" type="number" :min="64" :max="2048" :step="64" dense></q-input>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 q-pt-sm">
                                                            <span class="">{{ "seed" }}</span>
                                                        </div>
                                                        <div class="col-4">
                                                            <q-input v-model="appconf.confs.aiapis.img2img.seed" type="text" dense></q-input>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-12">
                                                            <q-checkbox v-model="appconf.confs.aiapis.img2img.use_gfpgan" label="Enable GFPGAN (may fix faces)"></q-checkbox>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-12">
                                                            <q-checkbox v-model="appconf.confs.aiapis.img2img.tiling" label="Enable tiling mode"></q-checkbox>
                                                        </div>
                                                    </div>
                                            </q-card-section>
                                        </q-card>
                                    </q-tab-panel>
                                </q-tab-panels>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-tab-panel>
            </q-tab-panels>
        </q-card-section>
        <q-card-actions align="right">
            <q-btn label="OK" color="primary" 
                @click="ok_onclick"
            ></q-btn>
            <q-btn flat label="Cancel" color="primary" @click="cancel_onclick"></q-btn>
            
        </q-card-actions>
    </q-card>
</q-dialog>
`;

export function defineConfigDlg(app, Quasar) {
    app.component("ConfigDlg",{
        template : template,
        props : {
            modelValue : Boolean,
            appconfig : VVAppConfig
        },
        emits : [
            "update:model-value",
            "change-config"
        ],
        setup(props, context) {
            const {modelValue, appconfig } = Vue.toRefs(props);
            const { t  } = VueI18n.useI18n({ useScope: 'global' });

            const show = Vue.ref(false);
            const tabIndex = Vue.ref("application");
            const appconf = Vue.ref(null);
            const elements = Vue.ref({
                application : {
                    preview_memory : new Number(DEFAULTMEM)
                },
                aiapis : {
                    tabIndex: "txt2img",
                    txt2img : {
                        sampler_name : {
                            selected: "k_euler_a"
                        }
                    },
                    img2img : {
                        sampler_name : {
                            selected: "k_euler_a"
                        }
                        
                    },
                    sampler_name : {
                        options: ["DDIM", "PLMS", 'k_dpm_2_a', 'k_dpm_2', 'k_euler_a', 'k_euler', 'k_heun', 'k_lms'],
                    }
                }
            });

            //---watch-----------------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
                if (newval === true) {
                    appconf.value = appconfig.value.copy();

                    elements.value.application.preview_memory = 
                        (DEFAULTMEM * appconf.value.confs.application.UseMemory) / 1024 / 1024;
                }
            });

            //---computed-------------------------------
            const showPreviewMemory = Vue.computed( () => {
                return (DEFAULTMEM * appconf.value.confs.application.UseMemory) / 1024 / 1024;
            })

            //---method----------------------------------
            const historyClear_onclick = () => {
                appConfirm(t("msg_clear_history"),()=>{
                    AppDB.clearHistory();
                });
            }
            const ok_onclick = () => {
                show.value = false;
                context.emit("update:model-value",show.value);
                context.emit("change-config",appconf.value);
            }
            const cancel_onclick = () => {
                show.value = false;
                context.emit("update:model-value",show.value);
            }

            return {
                show, tabIndex, appconf, elements,
                //---watch---
                wa_modelValue,
                //---computed---
                showPreviewMemory,
                //---method---
                ok_onclick,cancel_onclick,historyClear_onclick,
            }
        }
    });
}