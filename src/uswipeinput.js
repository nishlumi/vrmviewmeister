
const template = `
<div>
    <template v-if="direction == 'tb'">
        <q-card
            v-touch-pan.prevent.mouse.up.down="card_onswipe"
            class="cursor-pointer shadow-1 relative-position row flex-center"
        >
            <div class="text-center" style="width:100%;overflow:hidden;">
                <div class="row items-center">
                    <div class="col-2">
                        <q-icon name="chevron_left" v-ripple @click.stop="chevronleft_onclick"></q-icon>
                    </div>
                    <div class="col-8">
                        <template v-if="showIcon == true">
                            <q-icon :name="appdata.elements.icon" size="sm"></q-icon>
                        </template>
                        <template v-else>
                            <span v-text="modelValue"></span>
                        </template>
                    </div>
                    <div class="col-2">
                        <q-icon name="chevron_right" v-ripple @click.stop="chevronright_onclick"></q-icon>
                    </div>
                </div>
            </div>
        </q-card>
    </template>
    <template v-else-if="direction == 'lr'">
        <q-card
            v-touch-pan.prevent.mouse.left.right="card_onswipe"
            class="cursor-pointer shadow-1 relative-position row flex-center"
        >
            <div class="text-center" style="width:100%;overflow:hidden;">
                <div class="row items-center">
                    <div class="col-2">
                        <q-icon name="chevron_left" v-ripple @click.stop="chevronleft_onclick"></q-icon>
                    </div>
                    <div class="col-8">
                        <template v-if="showIcon == true">
                            <q-icon :name="appdata.elements.icon" size="sm"></q-icon>
                        </template>
                        <template v-else>
                            <span v-text="modelValue"></span>
                        </template>
                    </div>
                    <div class="col-2">
                        <q-icon name="chevron_right" v-ripple @click.stop="chevronright_onclick"></q-icon>
                    </div>
                </div>
            </div>
        </q-card>
    </template>
    <template v-else-if="direction == 'all'">
        <q-card
            v-touch-pan.prevent.mouse="card_onswipe"
            class="cursor-pointer shadow-1 relative-position row flex-center"
        >
            <div class="text-center" style="width:100%;overflow:hidden;">
                
                <div class="row items-center" >
                    <div class="col-2">
                        <q-icon name="chevron_left" v-ripple @click.stop="chevronleft_onclick"></q-icon>
                    </div>
                    <div class="col-8">
                        <template v-if="showIcon == true">
                            <q-icon :name="appdata.elements.icon" size="sm"></q-icon>
                        </template>
                        <template v-else>
                            <span v-text="modelValue"></span>
                        </template>
                    </div>
                    <div class="col-2">
                        <q-icon name="chevron_right" v-ripple @click.stop="chevronright_onclick"></q-icon>
                    </div>
                </div>
                
            </div>
        </q-card>
    </template>
</div>
`;

export function defineUswipeInput(app, Quasar) {
    app.component("UswipeInput",{
        template : template,
        props : {
            modelValue: Number,
            min: Number,
            max: Number,
            step: Number,
            showIcon: {
                type: Boolean,
                default: false
            },
            loopValue: {
                type: Boolean,
                default: false,
            },
            disable: {
                type: Boolean,
                default: false
            },
            direction: {
                type: String,
                /**
                 * @type {String} tb - top-bottom, lr - left-right, all - all
                 */
                default : "all"
            }
        },
        emits: ["update:modelValue","change"],
        setup(props,context) {
            const { modelValue,min,max,step,direction, showIcon, loopValue, disable } = Vue.toRefs(props);
            const appdata = Vue.reactive({
                elements : {
                    val : 0,
                    icon : ""
                }
            });

            Vue.onBeforeMount(() => {
                appdata.elements.val = modelValue.value;
            });

            const card_onswipe = ({evt, ...newInfo}) => {
                //var moveVal = newInfo.offset;
                //moveVal.x = moveVal.x * parseFloat(rotateRate);
                //moveVal.y = moveVal.y * parseFloat(rotateRate);
                
                if (disable.value == true) return;
        
                if (newInfo.direction == "up") {
                    appdata.elements.val += step.value;
                    appdata.elements.icon = "add";
                }else if (newInfo.direction == "down") {
                    appdata.elements.val -= step.value;
                    appdata.elements.icon = "remove";
                }else if (newInfo.direction == "left") {
                    appdata.elements.val -= step.value;
                    appdata.elements.icon = "remove";
                }else if (newInfo.direction == "right") {
                    appdata.elements.val += step.value;
                    appdata.elements.icon = "add";
                }else{
                    appdata.elements.icon = "";
                }
                if (appdata.elements.val < min.value) {
                    if (loopValue.value == true) {
                        appdata.elements.val = max.value;
                    }else{
                        appdata.elements.val = min.value;
                    }                    
                }
                if (appdata.elements.val > max.value) {
                    if (loopValue.value == true) {
                        appdata.elements.val = min.value;
                    }else{
                        appdata.elements.val = max.value;
                    }
                }

                context.emit("update:modelValue",appdata.elements.val);
            }
            const chevronleft_onclick = () => {
                if (disable.value == true) return;
                appdata.elements.val -= step.value;
                appdata.elements.icon = "remove";

                if (appdata.elements.val < min.value) {
                    if (loopValue.value == true) {
                        appdata.elements.val = max.value;
                    }else{
                        appdata.elements.val = min.value;
                    }                    
                }
                context.emit("update:modelValue",appdata.elements.val);
            }
            const chevronright_onclick = () => {
                if (disable.value == true) return;
                appdata.elements.val += step.value;
                appdata.elements.icon = "add";

                if (appdata.elements.val > max.value) {
                    if (loopValue.value == true) {
                        appdata.elements.val = min.value;
                    }else{
                        appdata.elements.val = max.value;
                    }
                }
                context.emit("update:modelValue",appdata.elements.val);
            }

            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                appdata.elements.val = modelValue.value;
            });

            return {
                wa_modelValue,
                appdata,
                card_onswipe,
                chevronleft_onclick,
                chevronright_onclick
            };
        }
    });
}