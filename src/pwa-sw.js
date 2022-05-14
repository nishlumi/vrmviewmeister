//This is the service worker with the Cache-first network

var CACHE = "vrmview-0100-20220117-01";
var precacheFiles = [
    /* Add an array of files to precache for your app */
    "/",
    "/pwa-sw-regi.js",
    "/TemplateData/unistyle.css",
    "/index.html",
    "/manifest.json",
    "/Build/Builds.data.unityweb",
    "/Build/Builds.framework.js.unityweb",
    "/Build/Builds.loader.js",
    "/Build/Builds.wasm.unityweb",
    "/static/css/cls_vtimeline.css",
    "/static/css/index.css",
    "/static/css/user-loading.css",
    "/static/css/pt.css",
    "/static/img/app_icon.png",
    "/static/img/app_og_image.png",
    "/static/img/pic_audio.png",
    "/static/img/pic_camera.png",
    "/static/img/pic_effect.png",
    "/static/img/pic_image.png",
    "/static/img/pic_light.png",
    "/static/img/pic_otherobject.png",
    "/static/img/pic_text.png",
    "/static/img/pic_uimage.png",
    "/static/img/pic_stage.png",
    "/static/img/pic_undefined.png",
    "/static/js/client_cb1.js",
    "/static/js/client_cld01.js",
    "/static/js/client_cld02.js",
    "/static/js/client_cld03.js",
    "/static/js/client_cld04.js",
    "/static/js/client_cld05.js",
    "/static/js/cl_ribbon.js",
    "/static/js/cl_left.js",
    "/static/js/cl_right.js",
    "/static/js/cl_south.js",
    "/static/js/client_evt.js",
    "/static/js/client_gen.js",
    "/static/js/clientclass.js",
    "/static/js/clientdiv1.js",
    "/static/js/cls_apprel.js",
    "/static/js/cls_dragwindow.js",
    "/static/js/cls_session.js",
    "/static/js/cls_unityrel.js",
    "/static/js/cls_vtimeline.js",
    "/static/js/cls_clipboard.js",
    "/static/js/index.js",
    "/static/js/mixin.js",
    "/static/js/util.js",
    "/static/js/posetracking_index.js",
    "/static/js/win/bonetrans.js",
    "/static/js/win/dndconfirm.js",
    "/static/js/win/equipment.js",
    "/static/js/win/gravitybone.js",
    "/static/js/win/projrole.js",
    "/static/js/win/vrminfo.js",
    
    "/static/lib/jscolor.min.js",
    "/static/lib/localforage.min.js",
    "/static/lib/jquery.kontrol.js",
    "/static/lib/alertify/alertify.min.js",
    "/static/lib/alertify/css/alertify.min.css",
    "/static/lib/alertify/css/themes/default.min.css",
    "/static/lib/jsuites/jsuites.css",
    "/static/lib/jsuites/jsuites.layout.css",
    "/static/lib/jsuites/jsuites.js",
    "/static/lib/jsuites/jsuites.layout.js",
    "/static/lib/easyui/jquery.easyui.min.js",
    "/static/lib/easyui/jquery.min.js",
    "/static/lib/easyui/locale/easyui-lang-jp.js",
    "/static/lib/easyui/ribbon/jquery.ribbon.js",
    "/static/lib/easyui/themes/icon.css",
    "/static/lib/easyui/themes/color.css",
    "/static/lib/easyui/themes/material-blue/easyui.css",
    "/static/lib/easyui/ribbon/ribbon-icon.css",
    "/static/lib/easyui/ribbon/ribbon.css",
    "/static/lib/easyui/easyui-user-style1.css",
    "/static/lib/mdifont/materialIcons/icon.css",
    "/static/lib/mdifont/materialIcons/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
    "/static/lib/mdifont/css/materialdesignicons.min.css",
    "/static/lib/mdifont/fonts/materialdesignicons-webfont.eot",
    "/static/lib/mdifont/fonts/materialdesignicons-webfont.ttf?v=5.9.55",
    "/static/lib/mdifont/fonts/materialdesignicons-webfont.woff?v=5.9.55",
    "/static/lib/mdifont/fonts/materialdesignicons-webfont.woff2?v=5.9.55",
    "/static/lib/mediapipe/camera_utils/camera_utils.js",
    "/static/lib/mediapipe/control_utils_3d/control_utils_3d.js",
    "/static/lib/mediapipe/control_utils/control_utils.js",
    "/static/lib/mediapipe/drawing_utils/drawing_utils.js",
    "/static/lib/paste.js",
    "/static/locales/en.json",
    "/static/locales/eo.json",
    "/static/locales/ja.json",
    "/static/res/appconst.js",
    "static/res/manifest.json",
    "/static/res/aud01_capture.mp3",
    "/static/win/cld01_objlst.html",
    "/static/win/cld02_poselst.html",
    "/static/win/cld03_capture.html",
    "/static/win/cld04_tl.html",
    "/static/win/posetracking.html",
    "/static/win/pose_landmark_full.tflite",
    "/static/win/pose_landmark_heavy.tflite",
    "/static/win/pose_landmark_lite.tflite",
    "/static/win/pose_solution_packed_assets.data",
    "/static/win/pose_solution_packed_assets_loader.js",
    "/static/win/pose_solution_simd_wasm_bin.data",
    "/static/win/pose_solution_simd_wasm_bin.js",
    "/static/win/pose_solution_simd_wasm_bin.wasm",
    "/static/win/pose_solution_wasm_bin.js",
    "/static/win/pose_solution_wasm_bin.wasm",
    "/static/win/pose_web.binarypb"

];
//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener("install", function(evt) {
    console.log("[PWA Builder] The service worker is being installed.");
    evt.waitUntil(
        precache().then(function() {
            console.log("[PWA Builder] Skip waiting on install");
            return self.skipWaiting();
        })
    );
});

//allow sw to control of current page
self.addEventListener("activate", function(evt) {
    console.log("[PWA Builder] Claiming clients for current page");
    //return self.clients.claim();
    var cacheWhitelist = [CACHE];

    evt.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // ホワイトリストにないキャッシュ(古いキャッシュ)は削除する
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    if (!self.registration.navigationPreload) {
        console.log("navigationPreload not supported")
    }
    console.log("navigationPreload supported")
    evt.waitUntil(self.registration.navigationPreload.enable())
});

self.addEventListener("fetch", function(evt) {
    //console.log("[PWA Builder] The service worker is serving the asset.",evt.request.url);
    evt.respondWith(
        caches.match(evt.request)
        .then((response) => {
            if (response) {
                return response;
            }
    
            // 重要：リクエストを clone する。リクエストは Stream なので
            // 一度しか処理できない。ここではキャッシュ用、fetch 用と2回
            // 必要なので、リクエストは clone しないといけない
            let fetchRequest = evt.request.clone();
    
            return fetch(fetchRequest)
            .then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
        
                if (evt.preloadResponse) {
                    evt.preloadResponse.then((res) => {
                        //console.info('preload res', res)
                        if (res) return res
                
                        //console.log('fetch')
                        return fetch(evt.request)
                    });
                }
                // 重要：レスポンスを clone する。レスポンスは Stream で
                // ブラウザ用とキャッシュ用の2回必要。なので clone して
                // 2つの Stream があるようにする
                let responseToCache = response.clone();
        
                caches.open(CACHE)
                .then((cache) => {
                    cache.put(evt.request, responseToCache);
                });
        
                return response;
            });
        })
    );
});
self.addEventListener("push", function(event) {
    console.log("Received a push message", event, event.data.json());
    var js = event.data.json();

    event.waitUntil(
        self.registration.showNotification(js.title, {
            body: js.body,
            icon: js.icon,
        })
    );
});
self.addEventListener("notificationclick",
    function(event) {
        console.log("n click=",event);
        event.notification.close();
        clients.openWindow("/notifications");
    },
    false
);

function precache() {
    return caches.open(CACHE).then(function(cache) {
        return cache.addAll(precacheFiles);
    });
}

function fromCache(request) {
    //we pull files from the cache first thing so we can show them fast
    return caches.open(CACHE).then(function(cache) {
        return cache.match(request).then(function(matching) {
            return matching || Promise.reject("no-match");
        });
    });
}

function update(request) {
    //this is where we call the server to get the newest version of the
    //file to use the next time we show view
    return caches.open(CACHE).then(function(cache) {
        return fetch(request).then(function(response) {
            return cache.put(request, response);
        });
    });
}

function fromServer(request) {
    //this is the fallback if it is not in the cache to go to the server and get it
    return fetch(request).then(function(response) {
        return response;
    });
}
