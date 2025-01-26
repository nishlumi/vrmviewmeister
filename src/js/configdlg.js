import { DEFAULTMEM } from "../res/appconst.js";
import { VVAppConfig, VVConfigTemplate } from "./appconf.js";

const template = `
<q-dialog v-model="show" persistent full-width full-height style="max-width:600px;max-height:700px;">
    <q-card>
        <q-card-section class="q-ma-none q-pl-xs q-pr-xs scroll" style="width:100%;height:calc(100% - 52px);">
            <q-tabs
                v-model="tabIndex"
                class="text-primary"
                no-caps dense
            >
                <q-tab name="application" :label="$t('Application')"></q-tab>
                <q-tab name="files" :label="$t('File')"></q-tab>
                <q-tab name="model"  :label="$t('Model')"></q-tab>
                <q-tab name="animation" :label="$t('Animation')"></q-tab>
                <q-tab name="fileloader" :label="$t('File loader')"></q-tab>
                <q-tab name="aiapis" label="AI APIs" class="common_ui_off"></q-tab>
            </q-tabs>
            <q-tab-panels v-model="tabIndex" animated style="height:calc(100% - 36px);overflow:auto;">
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
                                <q-separator class="q-mt-sm q-mb-md"></q-separator>
                                <div class="row">
                                    <div class="col-12">
                                        <b>{{ $t("MainCamera Configuration") }}</b>
                                    </div>
                                </div>
                                <div class="row q-pt-sm" style="margin-left:1rem;">
                                    <div class="col-7 col-md-3">
                                        <span class="">{{ $t('msg_distance_camera_viewpoint')}}</span>
                                    </div>
                                    <div class="col-4 col-md-2">
                                        <q-input v-model="appconf.confs.application.distance_camera_viewpoint" type="number" min="0.1" max="5" step="0.1" dense></q-input>
                                    </div>
                                    <div class="col-1 col-md-7">
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.focus_camera_onselect" :label="$t('msg_focus_camera_onselect')"></q-checkbox>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.show_camera_target_object" :label="$t('msg_show_camera_target_object')"></q-checkbox>
                                    </div>
                                </div>
                                
                                <div class="row" style="margin-left:1rem;">
                                    <div class="col-12">
                                        <b>{{ $t('msg_CameraKeyArea') }}</b>
                                    </div>
                                    <div class="col-3 offset-1">
                                        <span class="">{{ $t('msg_vpad_rotaterate')}}</span>
                                    </div>
                                    <div class="col-2">
                                        <q-input v-model="appconf.confs.application.CameraKeyrotateSpeed" type="number" :min="0.01" :max="2" :step="0.01" dense></q-input>
                                    </div>
                                    <div class="col-3 offset-1">
                                        <span class="">{{ $t('msg_vpad_translaterate')}}</span>
                                    </div>
                                    <div class="col-2">
                                        <q-input v-model="appconf.confs.application.CameraKeymoveSpeed" type="number" :min="0.01" :max="0.25" :step="0.01" dense></q-input>
                                    </div>
                                </div>
                                <div class="row" style="margin-left:1rem;">
                                    <div class="col-12">
                                        <b>V-Pad</b>
                                    </div>
                                    <div class="col-3 offset-1">
                                        <span class="">{{ $t('msg_vpad_rotaterate')}}</span>
                                    </div>
                                    <div class="col-2">
                                        <q-input v-model.number="appconf.confs.application.vpad_rotaterate" type="number" :min="0.01" :max="0.1" :step="0.01" dense></q-input>
                                    </div>
                                    <div class="col-3 offset-1">
                                        <span class="">{{ $t('msg_vpad_translaterate')}}</span>
                                    </div>
                                    <div class="col-2">
                                        <q-input v-model.number="appconf.confs.application.vpad_translaterate" type="number" :min="0.1" :max="2" :step="0.01" dense></q-input>
                                    </div>
                                </div>
                                <div class="row" style="margin-left:1rem;">
                                    <div class="col-12">
                                        <b>VR/AR</b>
                                    </div>
                                    <div class="col-3 offset-1">
                                        <span class="">{{ $t('msg_vpad_rotaterate')}}</span>
                                    </div>
                                    <div class="col-2">
                                        <q-input v-model="appconf.confs.application.vrar_rotaterate" type="number" :min="0.01" :max="9999" :step="0.01" dense></q-input>
                                    </div>
                                    <div class="col-3 offset-1">
                                        <span class="">{{ $t('msg_vpad_translaterate')}}</span>
                                    </div>
                                    <div class="col-2">
                                        <q-input v-model="appconf.confs.application.vrar_moverate" type="number" :min="0.01" :max="9999" :step="0.01" dense></q-input>
                                    </div>
                                </div>

                                
                                <q-separator class="q-mt-sm q-mb-md"></q-separator>
                                <div class="row">
                                    <div class="col-12">
                                        <b>{{ $t("UI Configuration") }}</b>
                                    </div>
                                </div>
                                <div class="row" style="margin-left:1rem;">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.application.UseDarkTheme" :label="$t('msg_UseDarkTheme')"></q-checkbox>
                                    </div>
                                </div>
                                <q-separator class="q-mt-sm q-mb-md"></q-separator>
                                <div class="row">
                                    <div class="col-12">
                                        <b>{{ $t("Dialog Configuration") }}</b>
                                    </div>
                                </div>
                                <div class="row" style="margin-left:1rem;">
                                <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.is_externalwin_capture" :label="$t('msg_is_externalwin_capture')"></q-checkbox>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.is_externalwin_keyframe" :label="$t('msg_is_externalwin_keyframe')"></q-checkbox>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.is_externalwin_pose" :label="$t('msg_is_externalwin_pose')"></q-checkbox>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.is_externalwin_bonetran" :label="$t('msg_is_externalwin_bonetran')"></q-checkbox>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.is_externalwin_gravitybone" :label="$t('msg_is_externalwin_gravitybone')"></q-checkbox>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.is_externalwin_transref" :label="$t('msg_is_externalwin_transref')"></q-checkbox>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.is_externalwin_easyik" :label="$t('msg_is_externalwin_easyik')"></q-checkbox>
                                    </div>
                                </div>
                                <q-separator class="q-mt-sm q-mb-md"></q-separator>
                                <div class="row">
                                    <div class="col-12">
                                        <b>{{ $t("Other Configuration") }}</b>
                                    </div>
                                </div>
                                <div class="row" style="margin-left:1rem;">
                                    <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.UseHTMLCanvasForScreenShot" :label="$t('msg_UseHTMLCanvasForScreenShot')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row" style="margin-left:1rem;">
                                    <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.use_gamepad" :label="$t('msg_use_gamepad')"></q-checkbox>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-checkbox v-model="appconf.confs.application.gamepad_using_html" :label="$t('msg_gamepad_using_html')"
                                            :disable="!appconf.confs.application.use_gamepad"
                                        ></q-checkbox>
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
                        <q-item-section>
                            <div class="row">
                                <div class="col-12 q-pt-sm">
                                    <span>{{ $t('easyik sampleurl') }}</span>
                                </div>
                                <div class="col-1">
                                    <q-btn round icon="restart_alt" color="primary" @click="easyIkModeURL_reset_onclick">
                                        <q-tooltip>Reset</q-tooltip>
                                    </q-btn>
                                </div>
                                <div class="col-11">
                                    <q-input v-model="appconf.confs.fileloader.easyik.sampleurl" type="text" dense></q-input>
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
                                <!--div class="row">
                                    <div class="col-8">
                                        <span>{{ $t('msg_related_arm') }}</span>
                                    </div>
                                    <div class="col-11 offset-md-1">
                                        <q-checkbox v-model="appconf.confs.model.related_left_armhand" label="LeftLowerArm ~ Hand"></q-checkbox>
                                        <q-checkbox v-model="appconf.confs.model.related_right_armhand" label="RightLowerArm ~ Hand"></q-checkbox>
                                    </div>
                                </div-->
                                <div class="row">
                                    <div class="col-12">
                                        <strong>VR/AR</strong>
                                    </div>
                                    <!--
                                    <div class="col-4 offset-xs-1">
                                        <span>{{ $t('rightpanel_lefthand') }}</span>
                                    </div>
                                    <div class="col-7">
                                        <q-select v-model="elements.model.vrarctrl_left.selected"
                                            :options="elements.model.vrarctrl_left.options"
                                            @update:model-value="vrarctrl_panel_left_onchange"
                                        ></q-select>
                                    </div>
                                    <div class="col-4 offset-xs-1">
                                        <span>{{ $t('rightpanel_righthand') }}</span>
                                    </div>
                                    <div class="col-7">
                                        <q-select v-model="elements.model.vrarctrl_right.selected"
                                            :options="elements.model.vrarctrl_right.options"
                                            @update:model-value="vrarctrl_panel_right_onchange"
                                        ></q-select>
                                    </div>
                                    -->
                                </div>
                                <div class="row q-pt-sm">
                                    <div class="col-6">
                                        <span>{{ $t('msg_vrar_camera_initpos')}}</span>
                                    </div>
                                    <div class="col-6">
                                        <q-checkbox v-model="appconf.confs.model.vrar_save_camerapos" :label="$t('msg_vrar_save_camerapos')"></q-checkbox>
                                    </div>
                                    <div class="col-3"></div>
                                    <div class="col-3 q-pl-xs">
                                        <q-input label="X:" v-model="appconf.confs.model.vrar_camera_initpos_x" type="number" min="-99" max="99" step="0.01" dense :disable="appconf.confs.model.vrar_save_camerapos"></q-input>
                                    </div>
                                    <div class="col-3 q-pl-xs">
                                        <q-input label="Y:" v-model="appconf.confs.model.vrar_camera_initpos_y" type="number" min="-99" max="99" step="0.01" dense :disable="appconf.confs.model.vrar_save_camerapos"></q-input>
                                    </div>
                                    <div class="col-3 q-pl-xs">
                                        <q-input label="Z:" v-model="appconf.confs.model.vrar_camera_initpos_z" type="number" min="-99" max="99" step="0.01" dense :disable="appconf.confs.model.vrar_save_camerapos"></q-input>
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
                                    <div class="col-8 q-pt-sm">
                                        <span class="">{{ $t('msg_default_baseDuration')}}</span>
                                    </div>
                                    <div class="col-4">
                                        <q-input v-model="appconf.confs.animation.base_duration" type="number" :min="0.01" :max="2" :step="0.01" dense></q-input>
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
                                    <div class="col-12 col-sm-6">
                                        <q-checkbox v-model="appconf.confs.animation.recover_pose_whenselected" :label="$t('msg_recover_pose_whenselected')"></q-checkbox>
                                    </div>
                                
                                    <div class="col-12 col-sm-6">
                                        <q-checkbox v-model="appconf.confs.animation.preview_onlyselected_whenselected" :label="$t('msg_preview_onlyselected_whenselected')"></q-checkbox>
                                    </div>
                                
                                    <div class="col-12 col-sm-6">
                                        <q-checkbox v-model="appconf.confs.animation.off_ikmarker_during_play_animation" :label="$t('msg_off_ikmarker_during_play_animation')"></q-checkbox>
                                    </div>
                                
                                    <div class="col-12 col-sm-6">
                                        <q-checkbox v-model="appconf.confs.animation.recover_tomax_overframe" :label="$t('msg_recover_tomax_overframe')"></q-checkbox>
                                    </div>
                                
                                    <div class="col-12 col-sm-6">
                                        <q-checkbox v-model="appconf.confs.animation.enable_audio_record" :label="$t('msg_enable_audio_record')"></q-checkbox>
                                    </div>
                                
                                    <div class="col-12 col-sm-6">
                                        <q-checkbox v-model="appconf.confs.animation.save_previous_value_in_keyframeregister" :label="$t('msg_save_previous_value_in_keyframeregister')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row ">
                                    <div class="col-12">
                                        <q-checkbox v-model="appconf.confs.animation.with_compling" :label="$t('msg_with_compling')"></q-checkbox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12 col-sm-6">
                                        <q-input filled label="Color of Onion skin"
                                            v-model="appconf.confs.animation.onion_skin_color"
                                        >
                                            <template v-slot:append>
                                                <q-icon name="colorize" class="cursor-pointer">
                                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                        <q-color v-model="appconf.confs.animation.onion_skin_color"></q-color>
                                                    </q-popup-proxy>
                                                </q-icon>
                                            </template>
                                        </q-input>
                                    </div>
                                </div>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-tab-panel>
                <q-tab-panel name="fileloader">
                    <q-list>
                        <q-item>
                            <q-item-section>
                                <div class="row">
                                    <div class="col-12 q-pt-sm">
                                        <span>{{ $t('gdrive_loader_url') }}</span>
                                        <q-checkbox v-model="appconf.confs.fileloader.gdrive.enabled"></q-checkbox>
                                    </div>
                                    <div class="col-11 offset-1">
                                        <q-input v-model="appconf.confs.fileloader.gdrive.url" type="text" dense></q-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-2 q-pt-sm">
                                        <span>APIKEY</span>
                                    </div>
                                    <div class="col-10">
                                        <q-input v-model="appconf.confs.fileloader.gdrive.apikey" type="text" dense></q-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        {{ $t('gdrive_userfolder') }}
                                    </div>
                                </div>
                                <div class="row q-pl-md">
                                    <div class="col-2">
                                        Project
                                    </div>
                                    <div class="col-7">
                                        <q-input v-model="appconf.confs.fileloader.gdrive.user.project" type="text" dense></q-input>
                                    </div>
                                    <div class="col-3">
                                        <q-toggle v-model="appconf.confs.fileloader.gdrive.userByName.project" :label="$t('gdrive_by_name')"></q-toggle>
                                    </div>

                                    <div class="col-2">
                                        Motion
                                    </div>
                                    <div class="col-7">
                                        <q-input v-model="appconf.confs.fileloader.gdrive.user.motion" type="text" dense></q-input>
                                    </div>
                                    <div class="col-3">
                                        <q-toggle v-model="appconf.confs.fileloader.gdrive.userByName.motion" :label="$t('gdrive_by_name')"></q-toggle>
                                    </div>

                                    <div class="col-2">
                                        Pose
                                    </div>
                                    <div class="col-7">
                                        <q-input v-model="appconf.confs.fileloader.gdrive.user.pose" type="text" dense></q-input>
                                    </div>
                                    <div class="col-3">
                                        <q-toggle v-model="appconf.confs.fileloader.gdrive.userByName.pose" :label="$t('gdrive_by_name')"></q-toggle>
                                    </div>

                                    <div class="col-2">
                                        VRM
                                    </div>
                                    <div class="col-7">
                                        <q-input v-model="appconf.confs.fileloader.gdrive.user.vrm" type="text" dense></q-input>
                                    </div>
                                    <div class="col-3">
                                        <q-toggle v-model="appconf.confs.fileloader.gdrive.userByName.vrm" :label="$t('gdrive_by_name')"></q-toggle>
                                    </div>

                                    <div class="col-2">
                                        OtherObject
                                    </div>
                                    <div class="col-7">
                                        <q-input v-model="appconf.confs.fileloader.gdrive.user.other" type="text" dense></q-input>
                                    </div>
                                    <div class="col-3">
                                        <q-toggle v-model="appconf.confs.fileloader.gdrive.userByName.other" :label="$t('gdrive_by_name')"></q-toggle>
                                    </div>

                                    <div class="col-2">
                                        Image
                                    </div>
                                    <div class="col-7">
                                        <q-input v-model="appconf.confs.fileloader.gdrive.user.image" type="text" dense></q-input>
                                    </div>
                                    <div class="col-3">
                                        <q-toggle v-model="appconf.confs.fileloader.gdrive.userByName.image" :label="$t('gdrive_by_name')"></q-toggle>
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

            const cns_vrarctrllist = [
                {label:t("vrarctrl_panel_0"), value:1},
                {label:t("vrarctrl_panel_1"), value:0},
            ];

            const show = Vue.ref(false);
            const tabIndex = Vue.ref("application");
            const appconf = Vue.ref(new VVAppConfig());
            const elements = Vue.ref({
                application : {
                    preview_memory : new Number(DEFAULTMEM)
                },
                model : {
                    vrarctrl_left : {
                        options : cns_vrarctrllist,
                        selected : cns_vrarctrllist[0],
                    },
                    vrarctrl_right : {
                        options : cns_vrarctrllist,
                        selected : cns_vrarctrllist[1],
                    }
                },
                fileloader : {
                    isName : {
                        project : false, motion: false, pose : false,
                        vrm : false, other: false, image: false
                    }
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
            var backupdata = {};

            //---watch-----------------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
                if (newval === true) {
                    appconf.value.confs = JSON.original(appconfig.value.confs); //Vue.toRaw(appconfig.value); //.copy();
                    backupdata = JSON.original(appconfig.value);

                    elements.value.application.preview_memory = 
                        (DEFAULTMEM * appconf.value.confs.application.UseMemory) / 1024 / 1024;
                    
                    elements.value.model.vrarctrl_left.selected = cns_vrarctrllist[appconf.value.confs.model.vrarctrl_panel_left];
                    elements.value.model.vrarctrl_right.selected = cns_vrarctrllist[appconf.value.confs.model.vrarctrl_panel_right];
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
                console.log(appconf.value);
                console.log(backupdata);
                context.emit("update:model-value",show.value);
            }
            const vrarctrl_panel_left_onchange = (val) => {
                console.log(val);
                appconf.value.confs.model.vrarctrl_panel_left = val.value;
            }
            const vrarctrl_panel_right_onchange = (val) => {
                console.log(val);
                appconf.value.confs.model.vrarctrl_panel_right = val.value;
            }
            const fileloader_isName_OnChange = (val) => {

            }
            const easyIkModeURL_reset_onclick = () => {
                const tmpcon = new VVConfigTemplate();
                appconf.value.confs.fileloader.easyik.sampleurl = tmpcon.fileloader.easyik.sampleurl;
            }

            return {
                show, tabIndex, appconf, elements,
                //---watch---
                wa_modelValue,
                //---computed---
                showPreviewMemory,
                //---method---
                ok_onclick,cancel_onclick,historyClear_onclick,
                vrarctrl_panel_left_onchange,vrarctrl_panel_right_onchange,
                easyIkModeURL_reset_onclick,
            }
        }
    });
}