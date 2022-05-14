// This is the "Offline page" service worker

// Add this below content to your HTML page, or add the js file to your page at the very top to register service worker

// Check compatibility for the browser we're running this in
if ("serviceWorker" in navigator) {
    //if (navigator.serviceWorker.controller) {
    //    console.log("[PWA Builder] active service worker found, no need to register");
    //} else {
    // Register the service worker
    var config = {
        //scope: "./"
        onUpdate : (upd_reg) => {
            if (upd_reg.waiting) {
                
            }
        }
    };
    navigator.serviceWorker
        .register("./sw.js", config)
        .then(function (reg) {
            console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
            if (reg.installing) {
                console.log("Installing the Service worker...");
            }else if (reg.waiting) {
                console.log("Finished to install the Service worker!");
                if (config && config.onUpdate) {
                    config.onUpdate(reg);
                }
            }else if (reg.active) {

            }
            console.log(reg);
            /*
            reg.onupdatefound = function() {
                console.log('update found');
                //alertify.warning("update found. Please reload this app.");
                $.messager.show({
                    msg : _T("msg_found_update"), 
                    timeout : 4000, 
                    style : { 
                        position : "absolute", 
                        top : 0, right : 0, 
                        left:"", bottom:"", 
                        backgroundColor:"#F1F100"
                    }
                });
                reg.update();
            }
            */
        });
    //}
}
