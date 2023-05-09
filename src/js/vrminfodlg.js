const template = `
    <q-dialog v-model="show" @hide="dialogHide" persistent>
        <q-card class="q-dialog-plugin" style="width:800px;height:500px;">
            <q-card-section class="row" style="width:100%" v-if="selectAvatar">
                <div class="row"  style="width:100%">
                    <div class="col-3 ">
                        <q-img :src="selectAvatar.thumbnail" alt="Thumbnail" width="128" height="128" style="width:128px"></q-img>
                    </div>
                    <div class="col-9">
                        <b v-text="selectAvatar.title" style="font-size: 1.5rem;"></b>
                        <table class="vrminfo-info1-table" >
                            <tr>
                                <td class="vv-translation">{{$t("vrmdlg_version")}}</td><td><span v-text="selectAvatar.version"></span></td>
                            </tr>
                            <tr>
                                <td class="vv-translation">{{$t("vrmdlg_expoter")}}</td><td><span v-text="selectAvatar.exportedVersion"></span></td>
                            </tr>
                            <tr>
                                <td class="vv-translation">{{$t("vrmdlg_author")}}</td><td><span v-text="selectAvatar.author"></span></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="row"  style="width:100%">
                    <div class="col-12">
                        <table class="vrminfo-info1-table" >
                            
                            
                            <tr>
                                <td class="vv-translation">{{$t("vrmdlg_contact")}}</td><td><span v-text="selectAvatar.contactInformation"></span></td>
                            </tr>
                            <tr>
                                <td class="vv-translation">{{$t("vrmdlg_license")}}</td><td><span v-text="selectAvatar.licenseType"></span></td>
                            </tr>
                            <tr>
                                <td class="vv-translation">{{$t("vrmdlg_reference")}}</td><td><span v-text="selectAvatar.reference"></span></td>
                            </tr>
                            <tr>
                                <td class="vv-translation">{{$t("vrmdlg_height")}}</td><td><span v-text="selectAvatar.height"></span></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="row"  style="width:100%">
                    <div class="col-12">
                        <table class="vrminfo-info2-table" >
                            <tr>
                                <td colspan="2">
                                    <q-icon name="manage_accounts" size="2rem"></q-icon>
                                    <span>{{$t("vrminfo_allowedUser")}}</span>
                                </td>
                                <td colspan="2">
                                    <!--<q-icon :name="showIconAllowed(selectAvatar.allowedUser)"  :class="styleIconAllowed(selectAvatar.allowedUser)" size="2rem"></q-icon>-->
                                    {{ showAllowUserLabel(selectAvatar.allowedUser) }}
                                </td>
                                
                            </tr>
                            <tr>
                                <td>
                                    <q-icon name="thumbs_up_down" size="2rem" ></q-icon>
                                    <span>{{$t("vrminfo_violentUssage")}}</span>
                                </td>
                                <td>
                                    <q-icon :name="showIconAllowed(selectAvatar.violentUssage)" :class="styleIconAllowed(selectAvatar.violentUssage)" size="2rem"></q-icon>
                                </td>
                                <td>
                                    <q-icon name="self_improvement" size="2rem" ></q-icon>
                                    <span>{{$t("vrminfo_politicalUssage")}}</span>
                                </td>
                                <td>
                                    <q-icon :name="showIconAllowed(selectAvatar.potilicalUssage)" :class="styleIconAllowed(selectAvatar.potilicalUssage)" size="2rem"></q-icon>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <q-icon name="favorite_border" size="2rem"></q-icon>
                                    <span class="vv-translation">{{$t("vrminfo_sexualUssage")}}</span>
                                </td>
                                <td>
                                    <q-icon :name="showIconAllowed(selectAvatar.sexualUssage)" :class="styleIconAllowed(selectAvatar.sexualUssage)" size="2rem"></q-icon>
                                </td>
                                <td>
                                    <q-icon name="masks" size="2rem" ></q-icon>
                                    <span>{{$t("vrminfo_antisocialUssage")}}</span>
                                </td>
                                <td>
                                    <q-icon :name="showIconAllowed(selectAvatar.antisocialUssage)" :class="styleIconAllowed(selectAvatar.antisocialUssage)" size="2rem"></q-icon>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <q-icon name="store" size="2rem" ></q-icon>
                                    <span class="vv-translation">{{$t("vrminfo_commercialUssage")}}</span>
                                </td>
                                <td>
                                    <q-icon :name="showIconAllowed(selectAvatar.commercialUssage)" :class="styleIconAllowed(selectAvatar.commercialUssage)" size="2rem"></q-icon>
                                </td>
                                <td>
                                    <q-icon name="announcement" size="2rem" ></q-icon>
                                    <span>{{$t("vrminfo_credit")}}</span>
                                </td>
                                <td>
                                    <span v-text="showCreditRequire(selectAvatar.creditNotation)"></span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <q-icon name="share" size="2rem" ></q-icon>
                                    <span>{{$t("vrminfo_redistribution")}}</span>
                                </td>
                                <td>
                                    <q-icon :name="showIconAllowed(selectAvatar.allowRedistribution)" :class="styleIconAllowed(selectAvatar.allowRedistribution)" size="2rem"></q-icon>
                                </td>
                                <td>
                                    <q-icon name="edit" size="2rem" ></q-icon>
                                    <span>{{$t("vrminfo_modification")}}</span>
                                </td>
                                <td>
                                    <q-icon :name="showIconAllowed(selectAvatar.allowModification)" :class="styleIconAllowed(selectAvatar.allowModification)" size="2rem"></q-icon>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <q-icon name="assignment" size="2rem" ></q-icon>
                                    <span class="vv-translation">{{$t("vrmdlg_other_permissionurl")}}</span>
                                </td>
                                <td colspan="2">
                                    <span id="vrmdlg_other_permissionurl"></span>
                                </td>
                                
                            </tr>
                        </table>
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <template v-if="!showMode">
                    <q-btn color="primary" label="OK" @click="OkBtn_Onclick" ></q-btn>
                </template>
                <q-btn :label="$t('cons_cancel')" no-caps @click="Cancel_Onclick" ></q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
`;

import { VVAvatar } from "./prop/cls_vvavatar.js";

export function defineVrmInfoDlg(app, Quasar) {
    app.component("VrminfoDlg", {
        template : template,
        props : {
            modelValue : Boolean,
            showMode : Boolean,
            selectAvatar : VVAvatar
        },
        emits: [
            "update:model-value",
            "apply"
        ], 
        setup(props, context) {   
            const {modelValue, showMode, selectAvatar} = Vue.toRefs(props);
            const { t  } = VueI18n.useI18n({ useScope: 'global' });

            const show = Vue.ref(false);

            //---watch ----------------------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
            });

            //---events --------------------------------------
            const dialogHide = (evt) => {
                context.emit("update:model-value",show.value);
            }
            const showAllowUserLabel = Vue.computed(() => {
                return (val) => {
                    var allowedUserBox = [
                        t("vrminfo_alloweduser0"),t("vrminfo_alloweduser1"),t("vrminfo_alloweduser2"),
                    ];
                    return  allowedUserBox[val];
                }
            });
            const showIconAllowed = Vue.computed(() => {
                return (flag) => {
                    const ussage = ["sentiment_very_dissatisfied","sentiment_very_satisfied"];
                    return ussage[flag ? 1 : 0];
                }
            });
            const styleIconAllowed = Vue.computed(() => {
                return (flag) => {
                    var ussage_judge = [
                        "vrmussage_ng","vrmussage_ok"
                    ];
                    return ussage_judge[flag ? 1 : 0];
                }
            });
            const showCreditRequire = Vue.computed(() => {
                return (val) => {
                    const reqmsg = [
                        t("vrminfo_credit_req"),t("vrminfo_credit_none")
                    ]
                    return reqmsg[val];
                }
            });
    
            const OkBtn_Onclick = () => {
                show.value = false;
                context.emit("apply",show.value);
            }
            const Cancel_Onclick = () => {
                show.value = false;
                context.emit("update:model-value",show.value);
            }
            return {
                show,wa_modelValue,
                dialogHide,
                showAllowUserLabel,showIconAllowed,styleIconAllowed,
                showCreditRequire,
                OkBtn_Onclick,Cancel_Onclick,
            }
        }
    });
}