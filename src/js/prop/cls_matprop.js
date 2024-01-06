import { appDataObjectProp } from "./appobjpropdata";

export const SHADERINDEX = {
    STD : 0,
    VRM : 1,
    VRM10 : 2,
    WTR : 3,
    SKT : 4,
    PSKT : 5,
    //REAL : 6,
    COMIC : 6,
    ICE : 7,
    PIX : 8,
    CUTOUT : 9,
}
export const UITYPE = {
    RADIO : "radio",
    SELECT : "select",
    CHECK : "checkbox",
    COLOR : "color",
    SLIDER : "slider",
    QUATER : "quaternion"
};
export class MaterialUIItem {
    constructor(shader,uitype, objprop, objlabel, objpropEvent, objcompute, options) {
        this.shader = shader;
        this.uitype = uitype;
        this.vmodel = objprop;
        this.label = objlabel;
        this.event = objpropEvent;
        this.options = options;
        this.vif = objcompute;
    }
}

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {appDataObjectProp} objpropData 
 * @param {*} objpropEvent 
 * @returns 
 */
export function defineMaterialPropertyUI(app,Quasar,objpropData, objpropEvent) {
    const { t } = VueI18n.useI18n({ useScope: 'global' });

    const shaderarr = objpropData.elements.objectui.matopt.shader;

    const mat_standard = [
        new MaterialUIItem(shaderarr[SHADERINDEX.STD],UITYPE.COLOR,"colorselected", t('Color filter'), objpropEvent.objectShaderColor_onchange,null),
        //new MaterialUIItem(shaderarr[SHADERINDEX.STD],UITYPE.SELECT,blendmodeselected, t('Blend mode'), objpropEvent.objectBlendmode_onchange,null,{
        //    options : blendmode
        //}),
        new MaterialUIItem(shaderarr[SHADERINDEX.STD],UITYPE.SLIDER,"metallic", t('Metallic'), objpropEvent.objectMetallic_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.STD],UITYPE.SLIDER,"glossiness", t('Glossiness'), objpropEvent.objectGlossiness_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.STD],UITYPE.COLOR,"emissioncolor", t('Emission color'), objpropEvent.objectEmissionColor_onchange,null ),
        //new MaterialUIItem(shaderarr[SHADERINDEX.STD],UITYPE.COLOR,"shadetexcolor", t('Shade color'), objpropEvent.objectShadetexColor_onchange,null ),

    ];
    const mat_vrmmtoon = [
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.COLOR,"colorselected", t('Color filter'), objpropEvent.objectShaderColor_onchange,null ),
        //new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.RADIO,"cullmodeselected", t('Cull mode'), objpropEvent.objectCullmode_onchange,null,{
        //    options: cullmode
        //} ),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.SLIDER,"cutoff", t("Cut Off"),objpropEvent.objectCutOff_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        //new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.RADIO,blendmodeselected, t('Blend mode'), objpropEvent.objectBlendmode_onchange,null,{
        //    options: blendmode
        //} ),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.COLOR,"emissioncolor", t('Emission color'), objpropEvent.objectEmissionColor_onchange,null ),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.COLOR,"shadetexcolor", t('Shade color'), objpropEvent.objectShadetexColor_onchange,null ),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.SLIDER,"shadingtoony", t("Shading Toony"),objpropEvent.objectShadingToony_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.SLIDER,"shadingshift", t("Shade Shift"),objpropEvent.objectShadingShift_onchange,null,{
            min : -1, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.SLIDER,"receiveshadow", t("Receive Shadow"),objpropEvent.objectReceiveShadow_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.SLIDER,"shadinggrade", t("Shading Grade"),objpropEvent.objectShadingGrade_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.SLIDER,"lightcolorattenuation", t("Light Color Attenuation"),objpropEvent.objectLightColorAttenuation_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.COLOR,"rimcolor", t('Rim color'), objpropEvent.objectRimColor_onchange,null ),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.SLIDER,"rimfresnel", t("Rim Fresnel Power"),objpropEvent.objectRimFresnel_onchange,null,{
            min : 0, max: 100, step:0.1
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.SLIDER,"srcblend", t("SrcBlend"),objpropEvent.objectSrcblend_onchange,null,{
            min : 0, max: 5, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM],UITYPE.SLIDER,"dstblend", t("DstBlend"),objpropEvent.objectDstblend_onchange,null,{
            min : 0, max: 5, step:0.01
        }),
    ];
    const mat_vrmmtoon10 = [
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.COLOR,"colorselected", t('Color filter'), objpropEvent.objectShaderColor_onchange,null ),
        //new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.RADIO,"cullmodeselected", t('Cull mode'), objpropEvent.objectCullmode_onchange,null,{
        //    options: cullmode
        //} ),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.SLIDER,"cutoff", t("Cut Off"),objpropEvent.objectCutOff_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        //new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.RADIO,"blendmodeselected", t('Blend mode'), objpropEvent.objectBlendmode_onchange,null,{
        //    options: blendmode
        //} ),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.COLOR,"emissioncolor", t('Emission color'), objpropEvent.objectEmissionColor_onchange,null ),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.COLOR,"shadetexcolor", t('Shade color'), objpropEvent.objectShadetexColor_onchange,null ),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.SLIDER,"shadingtoony", t("Shading Toony"),objpropEvent.objectShadingToony_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.SLIDER,"shadingshift", t("Shade Shift"),objpropEvent.objectShadingShift_onchange,null,{
            min : -1, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.SLIDER,"receiveshadow", t("Receive Shadow"),objpropEvent.objectReceiveShadow_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.SLIDER,"shadinggrade", t("Shading Grade"),objpropEvent.objectShadingGrade_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.SLIDER,"lightcolorattenuation", t("Light Color Attenuation"),objpropEvent.objectLightColorAttenuation_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.COLOR,"rimcolor", t('Rim color'), objpropEvent.objectRimColor_onchange,null ),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.SLIDER,"rimfresnel", t("Rim Fresnel Power"),objpropEvent.objectRimFresnel_onchange,null,{
            min : 0, max: 100, step:0.1
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.SLIDER,"srcblend", t("SrcBlend"),objpropEvent.objectSrcblend_onchange,null,{
            min : 0, max: 5, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.VRM10],UITYPE.SLIDER,"dstblend", t("DstBlend"),objpropEvent.objectDstblend_onchange,null,{
            min : 0, max: 5, step:0.01
        }),
    ];
    const mat_water = [
        new MaterialUIItem(shaderarr[SHADERINDEX.WTR],UITYPE.SLIDER,"fresnelScale", t("Fresnel Scale"),objpropEvent.objectFresnelScale_onchange,null,{
            min : 0.15, max: 4, step:0.1
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.WTR],UITYPE.COLOR,"reflectionColor", t('Reflection color'), objpropEvent.objectReflectionColor_onchange,null ),
        new MaterialUIItem(shaderarr[SHADERINDEX.WTR],UITYPE.COLOR,"specularColor", t('Specular color'), objpropEvent.objectSpecularColor_onchange,null ),
        new MaterialUIItem(shaderarr[SHADERINDEX.WTR],UITYPE.QUATER,"waveAmplitude", t('Wave Amplitude'), objpropEvent.objectWaveAmplitude_onchange,null,{
            min : -10, max:10, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.WTR],UITYPE.QUATER,"waveFrequency", t('Wave Frequency'), objpropEvent.objectWaveFrequency_onchange,null,{
            min : -10, max:10, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.WTR],UITYPE.QUATER,"waveSteepness", t('Wave Steepness'), objpropEvent.objectWaveSteepness_onchange,null,{
            min : -10, max:10, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.WTR],UITYPE.QUATER,"waveSpeed", t('Wave Speed'), objpropEvent.objectWaveSpeed_onchange,null,{
            min : -10, max:10, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.WTR],UITYPE.QUATER,"waveDirectionAB", t('Wave Direction AB'), objpropEvent.objectWaveDirectionAB_onchange,null,{
            min : -10, max:10, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.WTR],UITYPE.QUATER,"waveDirectionCD", t('Wave Direction CD'), objpropEvent.objectWaveDirectionCD_onchange,null,{
            min : -10, max:10, step:0.01
        }),
    ];

    const mat_sketch = [
        new MaterialUIItem(shaderarr[SHADERINDEX.SKT],UITYPE.SLIDER,"outlineWidth", t("Outline width"),objpropEvent.objectOutlineWidth_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.SKT],UITYPE.SLIDER,"strokeDensity", t("Stroke density"),objpropEvent.objectStrokeDensity_onchange,null,{
            min : 1, max: 10, step:0.5
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.SKT],UITYPE.SLIDER,"addBrightness", t("Add brightness"),objpropEvent.objectAddBrightness_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.SKT],UITYPE.SLIDER,"multBrightness", t("Mult brightness"),objpropEvent.objectMultBrightness_onchange,null,{
            min : 0.1, max: 5, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.SKT],UITYPE.SLIDER,"shadowBrightness", t("Shadow brightness"),objpropEvent.objectShadowBrightness_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
    ];
    const mat_postsketch = [
        new MaterialUIItem(shaderarr[SHADERINDEX.PSKT],UITYPE.SLIDER,"outlineWidth", t("Outline width"),objpropEvent.objectOutlineWidth_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.PSKT],UITYPE.SLIDER,"strokeDensity", t("Stroke density"),objpropEvent.objectStrokeDensity_onchange,null,{
            min : 1, max: 10, step:0.5
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.PSKT],UITYPE.SLIDER,"addBrightness", t("Add brightness"),objpropEvent.objectAddBrightness_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.PSKT],UITYPE.SLIDER,"multBrightness", t("Mult brightness"),objpropEvent.objectMultBrightness_onchange,null,{
            min : 0.1, max: 5, step:0.01
        }),
    ];

    const mat_realtoon = [
        new MaterialUIItem(shaderarr[SHADERINDEX.REAL],UITYPE.SLIDER,"enableTexTransparent",t('enable texture transparent'),objpropEvent.objectEnableTexTransparent_onchange,null,{
            min : -2, max: 2, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.REAL],UITYPE.SLIDER,"mainColorInAmbientLightOnly",t('main color in ambient light only'),objpropEvent.objectMCIALO_onchange,null,{
            min : -2, max: 2, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.REAL],UITYPE.SLIDER,"doubleSided",t('double sided'),objpropEvent.objectDoubleSided_onchange,null,{
            min : -2, max: 2, step:1
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.REAL],UITYPE.SLIDER,"outlineZPosCam", t("Outline Z position in camera"),objpropEvent.objectOutlineZPosCam_onchange,null,{
            min : -2, max: 2, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.REAL],UITYPE.SLIDER,"thresHold", t('Self shadow threshold'),objpropEvent.objectThresHold_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.REAL],UITYPE.SLIDER,"shadowHardness", t('Self shadow hardness'),objpropEvent.objectShadowHardness_onchange,null,{
            min : 0, max: 1, step:0.01
        }),
    ];
    const mat_comicshader = [
        new MaterialUIItem(shaderarr[SHADERINDEX.COMIC],UITYPE.SLIDER,"enableTexTransparent",t('enable texture transparent'),objpropEvent.objectEnableTexTransparent_onchange,null,{
            min : -2, max: 2, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.COMIC],UITYPE.SLIDER,"lineWidth", t("Line width"),objpropEvent.objectLineWidth_onchange,null,{
            min : 0, max: 1, step:0.001
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.COMIC],UITYPE.COLOR,"lineColor", t('Color filter'), objpropEvent.objectLineColor_onchange,null ),
        new MaterialUIItem(shaderarr[SHADERINDEX.COMIC],UITYPE.SLIDER,"tone1Threshold", t("Tone threshold"),objpropEvent.objectTone1Threshold_onchange,null,{
            min : 0, max: 1, step:0.005
        }),
    ];

    const mat_iceshader = [
        new MaterialUIItem(shaderarr[SHADERINDEX.ICE],UITYPE.COLOR,"iceColor", t('Color filter'), objpropEvent.objectIceColor_onchange,null ),
        new MaterialUIItem(shaderarr[SHADERINDEX.ICE],UITYPE.SLIDER,"transparency", t("Transparency"),objpropEvent.objectTransparency_onchange,null,{
            min : -2, max: 2, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.ICE],UITYPE.SLIDER,"baseTransparency", t("Base Transparency"),objpropEvent.objectBaseTransparency_onchange,null,{
            min : -2, max: 2, step:0.01
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.ICE],UITYPE.SLIDER,"iceRoughness", t("Ice roughness"),objpropEvent.objectIceRoughness_onchange,null,{
            min : 0, max: 1, step:0.001
        }),
        new MaterialUIItem(shaderarr[SHADERINDEX.ICE],UITYPE.SLIDER,"distortion", t("Distortion"),objpropEvent.objectDistortion_onchange,null,{
            min : 0, max: 1, step:0.01
        })
    ];
    const mat_pixeilizeshader = [
        new MaterialUIItem(shaderarr[SHADERINDEX.PIX],UITYPE.SLIDER,"pixelSize", t("PixelSize"),objpropEvent.objectPixelSize_onchange,null,{
            min : 0.001, max: 0.1, step:0.001
        }),
    ];
    const mat_customcutout = [
        new MaterialUIItem(shaderarr[SHADERINDEX.CUTOUT],UITYPE.COLOR,"colorselected", t('Color filter'), objpropEvent.objectShaderColor_onchange,null),        
    ];

    const UIMaterials = [
        mat_standard,
        mat_vrmmtoon,
        mat_vrmmtoon10,
        mat_water,
        mat_sketch,
        mat_postsketch,
        //mat_realtoon,
        mat_comicshader,
        mat_iceshader,
        mat_pixeilizeshader,
        mat_customcutout
    ];
    return {
        UIMaterials
    }
}