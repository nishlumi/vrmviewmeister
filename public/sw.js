if(!self.define){let e,i={};const s=(s,a)=>(s=new URL(s+".js",a).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(a,c)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let r={};const d=e=>s(e,t),n={module:{uri:t},exports:r,require:d};i[t]=Promise.all(a.map((e=>n[e]||d(e)))).then((e=>(c(...e),r)))}}define(["./workbox-fa7e2619"],(function(e){"use strict";e.setCacheNameDetails({prefix:"main"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"static/js/client_cld01.js",revision:"9254891ce79eb0ab0c05a529fa6963bd"},{url:"static/js/client_cld04.js",revision:"0b498457b54f3b5d8b691682fd179327"},{url:"static/js/client_cldbonetran.js",revision:"e244b99458f6f4065d832c2ca936a6e5"},{url:"static/js/client_cldcapture.js",revision:"2d3bcaafef2d546e0a84ee443aa6c710"},{url:"static/js/client_cldkeyfrm.js",revision:"31d804c923476da3d4ad2a78e48fd233"},{url:"static/js/client_cldmp.js",revision:"664f42111136491f36bfc9e1f2343064"},{url:"static/js/client_cldnavwin.js",revision:"30e376d8186c6a2000092770173e4ea6"},{url:"static/js/client_cldpose.js",revision:"1a5a64e7c012b29b29e7a755def4022e"},{url:"static/js/client_cldvplayer.js",revision:"afc160b3562c576a1c63a8491ad173b0"},{url:"static/js/cls_appqueue.js",revision:"a06bb2dad3c7e75419d48ba68b0942b1"},{url:"static/js/cls_childreturner.js",revision:"33493080999fe803eb93bf793994f86a"},{url:"static/js/filehelper.js",revision:"4b906409b694eb521d2af32c874fecc3"},{url:"static/js/index.js",revision:"99017f5f4f7ba5be1b54b7683f240fef"},{url:"static/js/node_modules_electron_index_js.index.js",revision:"0bbcc9ea637814ca4cacc8611fa28a07"},{url:"static/js/pt_index.js",revision:"45f82de4c1b6162be5fd2e3eab685f1b"},{url:"static/js/setuplang.js",revision:"9d2c10a475f6c3b021d853018fda22e0"},{url:"static/js/util.js",revision:"3225b0fd1e648490566cfef28c350c89"},{url:"static/js/webapi.js",revision:"34c74fbdf6a764c43e47f6856991b1c3"},{url:"static/lib/interactjs/interact.min.js",revision:"2e97977aea1159b0512d2c32c17d184b"},{url:"static/lib/js-yaml.min.js",revision:"99f96803d123239c14d61d54de76a2bf"},{url:"static/lib/jsuites/jspreadsheet.css",revision:"fe6bf23b5ff03d01377ae6932256e919"},{url:"static/lib/jsuites/jspreadsheet.datatables.css",revision:"0027da05c6f1491def247155afebcb75"},{url:"static/lib/jsuites/jspreadsheet.js",revision:"0026964f3d7c0790cef6cb378cf54a6f"},{url:"static/lib/jsuites/jspreadsheet.theme.css",revision:"2bd2e3f8013b7cf53d3f58ffe723359e"},{url:"static/lib/jsuites/jsuites.css",revision:"6161ceb688ce9c35dbfff5199c006531"},{url:"static/lib/jsuites/jsuites.js",revision:"54c6fed7c8d9866d322f5d3de0d69085"},{url:"static/lib/jsuites/jsuites.layout.css",revision:"d23647e79a0b870162d2e0cc8b5e671d"},{url:"static/lib/jsuites/jsuites.layout.js",revision:"ea857f10a65e1bc60b35b06364f1f00c"},{url:"static/lib/jsuites/lemonade.js",revision:"23b71f57a22b481b1e3fdd6d43c08700"},{url:"static/lib/jsuites/lemonade.photo.js",revision:"efc7989d17d71204a047989c981bfe4f"},{url:"static/lib/localforage.min.js",revision:"971e2b863ccdb5d43003cdc5f4e0d923"},{url:"static/lib/mediapipe/camera_utils/camera_utils.js",revision:"0a7ee6cbc26e861ef4c09dabec9c7bb2"},{url:"static/lib/mediapipe/control_utils_3d/control_utils_3d.js",revision:"c0d85a7670e6a1845161646c7698f4b8"},{url:"static/lib/mediapipe/control_utils_3d/landmark_grid.css",revision:"9cb494e5ef536d1deae6a48ba9c6d244"},{url:"static/lib/mediapipe/control_utils/control_utils.css",revision:"29c4cb149ccec3cbee74cf1b9b7e12ca"},{url:"static/lib/mediapipe/control_utils/control_utils.js",revision:"97ca2dd8cb85e5298633fd78e020cfba"},{url:"static/lib/mediapipe/drawing_utils/drawing_utils.js",revision:"4117c46812493bd8c99b924a43b2506d"},{url:"static/lib/mediapipe/pose/package.json",revision:"26dc86079402205735564b6bdba8289e"},{url:"static/lib/mediapipe/pose/pose.js",revision:"cdd64f51033ebe7d74fb49bc5c377717"},{url:"static/lib/quasar/lang/en-US.umd.prod.js",revision:"e94e529f7f822e99567e9e02e44c2446"},{url:"static/lib/quasar/lang/eo.umd.prod.js",revision:"cc4f8395f12b184be43799d2f9073a08"},{url:"static/lib/quasar/lang/ja.umd.prod.js",revision:"2549bcedbfe79ffedadb394251ecbceb"},{url:"static/lib/quasar/quasar.prod.css",revision:"e10f8a061dc23e2c11fe7b3028953255"},{url:"static/lib/quasar/quasar.rtl.prod.css",revision:"0c821cb605269ca6fd02d79985404b51"},{url:"static/lib/quasar/quasar.umd.js",revision:"1333031c537eae9589b961eea3b403f4"},{url:"static/lib/quasar/quasar.umd.prod.js",revision:"79156c0634538aef1e80cb82b7b8a563"},{url:"static/lib/vue/vue-i18n.global.js",revision:"d89c1d83c0d6157a394f05b829c8ac62"},{url:"static/lib/vue/vue-i18n.global.prod.js",revision:"b0d93eb0e380e2f6706c635c003bc3e4"},{url:"static/lib/vue/vue.global.js",revision:"e8ce2de3e87b1c9ce3f4cff635bc31d6"},{url:"static/lib/vue/vue.global.prod.js",revision:"3d909a96d34b21b6bbe171233037ccc8"},{url:"static/css/cls_vtimeline.css",revision:"9065a1c3d16aa9ca91a462b728cb9b45"},{url:"static/css/cls_vtimeline2.css",revision:"ca5f63afd1f9f5df02b14284885d49b8"},{url:"static/css/dmy_style.css",revision:"0d639ed9efe75cbc29fc6d748bb0c9ba"},{url:"static/css/index.css",revision:"001019e0337dd09235171c532f5b5404"},{url:"static/css/pt.css",revision:"5de0432e3ce825e607dbb1b698070988"},{url:"static/css/ribbon.css",revision:"bfcd57276d7a56baca9f8fb08e864ce3"},{url:"TemplateData/style.css",revision:"ed1919d976687514d64870c1d176bd13"},{url:"TemplateData/unistyle.css",revision:"fc2625d4684f623a77f7b1c2dd520290"},{url:"Build/Builds.loader.js",revision:"5336a4b2c43054286fd70b1faa467eee"},{url:"pwa-sw-regi.js",revision:"07537a7d40397fe582251fae7d4f8acb"},{url:"static/locales/en.js",revision:"a02c015bce60d3b106153b59fbe24783"},{url:"static/locales/eo.js",revision:"02db1ad697d11c25a005fc244c9c5868"},{url:"static/locales/index.js",revision:"6469d06919ae1b21449baf6344e3efce"},{url:"static/locales/ja.js",revision:"b1375babe01ad29e8c8a3fe249a927fb"},{url:"static/res/appconst.js",revision:"0571dca11bd89866f5fc7de76ce6fd48"},{url:"static/win/mp/mp.js",revision:"9ec2d5251a286628583db1a234b76133"},{url:"static/win/mp/pose_solution_packed_assets_loader.js",revision:"12fb9715a28735c9f8b8db105bad9a1f"},{url:"static/win/mp/pose_solution_simd_wasm_bin.js",revision:"23fc766bac12a56d527a501e2297cd22"},{url:"static/win/mp/pose_solution_wasm_bin.js",revision:"12d178720ca20246649e98354168cfd5"},{url:"static/win/mp/pose.js",revision:"505ed63a784d029d6eef04d37c306596"},{url:"static/win/mp/testtest.js",revision:"308321575911bcf4697b31604e72e937"},{url:"manifest.json",revision:"8c0be65b8b4d08b41a7e52d345970d5e"},{url:"static/res/effectlist.json",revision:"ec3ac4026e451a5e761880ec2cddce21"},{url:"static/win/mp/package.json",revision:"ad77f69840ee9b918c3960a85cd938f8"},{url:"StreamingAssets/aa/catalog.json",revision:"66564c58ffc54cdcc07879d8b33c3f7c"},{url:"StreamingAssets/aa/settings.json",revision:"a3f5683b4de0bf83894ef4226077aa8d"},{url:"StreamingAssets/aa/WebGL/catalog_100b.json",revision:"66564c58ffc54cdcc07879d8b33c3f7c"},{url:"static/img/app_icon.png",revision:"97833a2757c58ff674ab111c21c517e5"},{url:"static/img/app_og_image.png",revision:"221ead9fdac52ddf0faf1cd3ad214e69"},{url:"static/img/maskable_icon.png",revision:"28a7203dc36f3ce8370194e94abb2798"},{url:"static/img/pic_audio.png",revision:"36a350ec41e6fa8855055dd5fdeef7be"},{url:"static/img/pic_camera.png",revision:"c2eb0b128719df24ff924645ffb91817"},{url:"static/img/pic_effect.png",revision:"d2e8a25c0555a7e39c7a611b567755b1"},{url:"static/img/pic_image.png",revision:"ef7c9d3c5a69ccbc50c995a4d85c06cd"},{url:"static/img/pic_light.png",revision:"6475738e881861477b6eb90eacf51b31"},{url:"static/img/pic_otherobject.png",revision:"6500673f158e0e600f5984e67ead89ed"},{url:"static/img/pic_stage.png",revision:"f975746b08bdc286938e21d7d2b4bb00"},{url:"static/img/pic_text.png",revision:"7c5417a150cf97d9502ad3bef77aae73"},{url:"static/img/pic_uimage.png",revision:"aaf7aa8a1504e0cc945e44fcc9fd0dc4"},{url:"static/img/pic_undefined.png",revision:"920271673919f573bf782aaad1d9c281"},{url:"static/img/smp_uiimg01a.png",revision:"21b7e8a64faa04cc86f710471cbf5ae5"},{url:"static/img/smp_uiimg01b.png",revision:"2ee52a0d4e20b3ab2f001cfe57c6da6c"},{url:"static/img/smp_uiimg01c.png",revision:"dda095013bb11e66f60cd8504f6fef34"},{url:"static/img/vvmico_bn_aim.png",revision:"3ebec27f24ea96e6be4e44151b2ad2e1"},{url:"static/img/vvmico_bn_chest.png",revision:"46aaf52185fecbc4138df7a2597b0a66"},{url:"static/img/vvmico_bn_eyeviewhandle.png",revision:"a343fd95b8c689ad8c6a69ee7c268682"},{url:"static/img/vvmico_bn_head.png",revision:"1163bd049308539fad945523b4ed100b"},{url:"static/img/vvmico_bn_ikparent.png",revision:"7abf30f1b1766b3b494f02647c448acf"},{url:"static/img/vvmico_bn_lefthand.png",revision:"d354a091046b3fe0207ab892cdfe9049"},{url:"static/img/vvmico_bn_leftleg.png",revision:"11a0e51e29632644aa2b711a0458521e"},{url:"static/img/vvmico_bn_leftlowerarm.png",revision:"e35b454097f893e6ce5b993cec5aae70"},{url:"static/img/vvmico_bn_leftlowerleg.png",revision:"e80ded43c33b536982967decb1e49b08"},{url:"static/img/vvmico_bn_leftshoulder.png",revision:"a1cf1cc43fa876c2bbc04229fa7b1c3a"},{url:"static/img/vvmico_bn_lookat.png",revision:"77797de9d9881f0dc057581279585fbb"},{url:"static/img/vvmico_bn_pelvis.png",revision:"0fa504fab879b40fd752747e76cb133d"},{url:"static/img/vvmico_bn_righthand.png",revision:"44454c62cd2cfefefc61f310c8e43a1e"},{url:"static/img/vvmico_bn_rightleg.png",revision:"208f05c4afe20da6d4dfd53c5de76291"},{url:"static/img/vvmico_bn_rightlowerarm.png",revision:"ad5f9f54c1c3cc9d338dc74a4b222cdf"},{url:"static/img/vvmico_bn_rightlowerleg.png",revision:"16636a7a3cdd77f01571aa31980bcaeb"},{url:"static/img/vvmico_bn_rightshoulder.png",revision:"790b951412b34c0fe66a99b0267e9eee"},{url:"static/res/aud01_capture.mp3",revision:"e6655ae346e7e8ec6c317899d120e707"},{url:"TemplateData/fullscreen-button.png",revision:"489a5a9723567d8368c9810cde3dc098"},{url:"TemplateData/progress-bar-empty-dark.png",revision:"781ae0583f8c2398925ecedfa04b62df"},{url:"TemplateData/progress-bar-empty-light.png",revision:"4412cb4b67a2ae33b3e99cccf8da54c9"},{url:"TemplateData/progress-bar-full-dark.png",revision:"99949a10dbeffcdf39821336aa11b3e0"},{url:"TemplateData/progress-bar-full-light.png",revision:"9524d4bf7c6e05b2aa33d1a330491b24"},{url:"TemplateData/unity-logo-dark.png",revision:"59fa0334e801c9d8fe14af70400ee200"},{url:"TemplateData/unity-logo-light.png",revision:"3c8bc23981828d69f857a5feafc1b699"},{url:"TemplateData/webgl-logo.png",revision:"ddd95c65824da6c6223f48b961a583e4"},{url:"Build/Builds.data.unityweb",revision:"f2e492b9879d673f6ff7f9ab9031b473"},{url:"Build/Builds.framework.js.unityweb",revision:"036ae069a4b416eb8f2098965efd4e63"},{url:"Build/Builds.wasm.unityweb",revision:"a4055461b11c8da66ff28287b120dfb9"},{url:"StreamingAssets/aa/AddressablesLink/link.xml",revision:"c48364bf25dcd2eb69e3ddcfd6e1fd41"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.registerRoute("/",new e.NetworkFirst({cacheName:"page",plugins:[new e.ExpirationPlugin({maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/^.*static\/win\/mp\/.(data|tflite|wasm)/,new e.CacheFirst({cacheName:"mediapipe",plugins:[new e.ExpirationPlugin({maxAgeSeconds:2678400})]}),"GET"),e.registerRoute(/.*StreamingAssets\/aa\/WebGL\/.*\.(bundle)/,new e.CacheFirst({cacheName:"streamingasset",plugins:[new e.ExpirationPlugin({maxAgeSeconds:2678400})]}),"GET"),e.registerRoute(/^https\:\/\/cdn\.jsdelivr\.net\/npm\/.*\.(js|css)/,new e.CacheFirst({cacheName:"jsdelivr",plugins:[new e.ExpirationPlugin({maxAgeSeconds:2678400})]}),"GET"),e.registerRoute(/^https\:\/\/fonts\.googleapis\.com\/css.*/,new e.CacheFirst({cacheName:"googlefont1",plugins:[new e.ExpirationPlugin({maxAgeSeconds:1209600})]}),"GET"),e.registerRoute(/^https\:\/\/fonts\.gstatic\.com\/.*(woff|woff2|ttf|eot)/,new e.CacheFirst({cacheName:"googlefont2",plugins:[new e.ExpirationPlugin({maxAgeSeconds:1209600})]}),"GET")}));
//# sourceMappingURL=sw.js.map
