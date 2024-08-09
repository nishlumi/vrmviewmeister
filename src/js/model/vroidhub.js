import { VOSFile } from "../../../public/static/js/filehelper";
import { STORAGE_TYPE } from "../../res/appconst";
import { appMainData } from "../prop/appmaindata";
import { appDataRibbon } from "../prop/appribbondata";
import { UnityCallbackFunctioner } from "./callback";
import { appModelOperator } from "./operator";

export class VRoidHubConnector {
    constructor() {
        this.type = "oauth";
        this.scope = "default";
        this.urls = {
            accessTokenUrl: "https://hub.vroid.com/oauth/token",
            requestTokenUrl: "https://hub.vroid.com/oauth/token",
            authorizationUrl: "https://hub.vroid.com/oauth/authorize?response_type=code",
            profileUrl: "https://hub.vroid.com/api/account",
            base : "https://hub.vroid.com/api",
        };
        this.params = { 
            grant_type: "authorization_code"
        };
        this.headers = {
            "X-Api-Version" : 11,

        };
        this.savedata = {
            appid: "",
            token : {},
            code : "",
        };

        this.states = {
            enable_token : false
        };
        this.session = {
            licenses:[],
        };

    }
    destroy() {
        //---Remove licenses in bulk
        for (var i = 0; i < this.session.licenses.length; i++) {
            this.delete_download_licenses(this.session.licenses[i]);
        }
    }
    /**
     * 
     * @param {*} vrms 
     */
    logout(vrms) {
        this.savedata.token = null;
        this.savedata.token = {};
        this.savedata.code = "";
        AppDB.app.removeItem("vrh_save");
        this.states.enable_token = false;
    }
    setHeaders() {
        this.headers["Authorization"] = `Bearer ${this.savedata.token.access_token}`;
    }
    save() {
        AppDB.app.setItem("vrh_save",Vue.toRaw(this.savedata));
    }
    /**
     * 
     * @returns {Promise<Boolean>}
     */
    async load() {
        var result = await AppDB.app.getItem("vrh_save");
        
        if (result) {
            this.savedata = result;
            this.states.enable_token = true;
        }
        return this.states.enable_token;
        
    }
    delete_data() {
        AppDB.app.remove("vrh_save");
    }
    /**
     * 
     * @param {appMainData} mainData 
     */
    generateAuthLink(mainData = null) {
        if (window.elecAPI) {
            elecAPI.callVroidHub("/vroidhub/authorize",{
                "redirect_uri" : location.origin + "/redirect"
            })
            .then(async res => {
                mainData.elements.vroidhubAuthorizer.url = res.url;
                mainData.elements.vroidhubAuthorizer.show = true;
                /*appPrompt("Do you open VRoidHub authorize page?\nPlease paste to browser.", (res) => {
                    
                    appPrompt("Input code.",(val) => {
                        mainData.vroidhubapi.request_token(val)
                        .then(res => {
                            Quasar.LocalStorage.remove("callback_code");
                            mainData.states.vroidhub_api = true;
                        });
                    });
                },res.url);*/
            });
            //TODO
            //don't jump, manually authorize...
        }else{
            var params = {
                headers : this.headers,
            }
            var uparams = new URLSearchParams();
            uparams.append("redirect_uri",location.origin + "/redirect");
    
            fetch("/vroidhub/authorize?" + uparams.toString(),{
                "method": "GET",
            })
            .then(async result => {
                if (result.ok) {
                    var resjs = await result.json();
                    if (resjs.cd == 0) {
                        console.log(resjs.url);
                        location.href = resjs.url;
                    }else{
                        alert("Error: connecting VRoidHub...");
                    }
                    
                }
            });
        }
    }
    async request_token(code,grantopt = "authorization_code") {
        var def = new Promise(async (resolve,reject) => {
            if (window.elecAPI) {
                elecAPI.callVroidHub("/vroidhub/request-token",{
                    "redirect_uri" : location.origin + "/redirect",
                    "grant_type" : grantopt,
                    "code" : code
                })
                .then(resjs => {
                    if (resjs.cd == 0) {
                        this.savedata.appid = resjs.appid;
                        
                        this.savedata.token = resjs.data;
                        this.savedata.code = code;
                        this.states.enable_token = true;
                        this.save();
                        resolve(resjs.data);
                    }else{
                        reject({cd:9, err:result.msg});
                    }
                });
            }else{
                //var csrf = await fetch("/csrf-token");
                //var jscsrf = await csrf.json();

                var uparams = new URLSearchParams();
                uparams.append("redirect_uri",location.origin + "/redirect");
                uparams.append("grant_type",grantopt);
                uparams.append("code",code);
    
                var finalheaders = {};
                for (var obj in this.headers) {
                    finalheaders[obj] = this.headers[obj];
                }
                finalheaders["Content-Type"] = "application/json";
                finalheaders["x-csrf-token"] = document.getElementById("_csrf").value; // jscsrf.token;
    
                var finalurl = `/vroidhub/request-token?${uparams.toString()}`;
                //---generate real url with invisible parameter
                fetch(finalurl,{
                    method: "POST",
                    headers: finalheaders
                })
                .then(async result => {
                    if (result.ok) {
                        var resjs = await result.json();
                        if (resjs.cd == 0) {
                            this.savedata.appid = resjs.appid;
                            
                            this.savedata.token = resjs.data;
                            this.savedata.code = code;
                            this.states.enable_token = true;
                            this.save();
                            resolve(resjs.data);
                            
                            
                            /*
                            var req = new Request(resjs.url,{
                                method : "POST",
                                headers : finalheaders,
                                body : JSON.stringify(resjs.prm)
                            });
                            //---access real server.
                            var resacc = await fetch(req);
                            console.log(resacc);
                            if (resacc.ok) {
                                var accjs = await resacc.json();
                                this.savedata.token = accjs;
                                this.states.enable_token = true;
                                resolve(accjs);
                            }else{
                                reject({cd:9, err:resacc.statusText});
                            }
                            */
                        }else{
                            reject({cd:9, err:result.msg});
                        }
                    }
                });
            }
            
        });
        return def;        
    }
    /**
     * get models created by you
     * @param {*} options 
     * @returns 
     */
    async list_character_models(options) {
        var ret = {
        }
        var uparams = new URLSearchParams();
        if ("max_id" in options) {
            uparams.append("max_id",options.max_id);
        }
        if ("count" in options) {
            uparams.append("count",options.count);
        }
        if ("publication" in options) {
            uparams.append("publication",options.publication);
        }
        this.setHeaders();
        
        var url = "/vroidhub/account/character_models";
        if (window.elecAPI) {
            var result = await elecAPI.callVroidHub(url,{
                headers: Vue.toRaw(this.headers),
                query : options,
            })
            
            if (result.cd == 0) {
                var anc = document.createElement("a");
                var maxid = ["",""];
                if (result.data._links && result.data._links.next) {
                    anc.href = result.data._links.next.href;
                    maxid = anc.search.replace("?","").split("=");
                }
                return {
                    cd: result.cd, 
                    data: result.data.data,
                    error: result.data.error,
                    rand: result.data.rand,
                    next: {"maxid": maxid[1]}
                };
            }else{
                ret = result;
            }
            
            
        }else{
            
            var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
            var result = await fetch(finalurl,{
                method: "GET",
                headers: this.headers,
            })
            if (result.ok) {
                var ret = await result.json();
                var anc = document.createElement("a");
                var maxid = ["",""];
                if (ret.data._links && ret.data._links.next) {
                    anc.href = ret.data._links.next.href;
                    maxid = anc.search.replace("?","").split("=");
                }
                return {
                    cd: ret.cd, 
                    data: ret.data.data,
                    error: ret.data.error,
                    rand: ret.data.rand,
                    next: {"maxid": maxid[1]}
                };
            }else{
                ret = {
                    cd : result.status,
                    msg : result.statusText,
                    data : null
                };
            }
        }

        return ret;
    }
    /**
     * get your hearted models
     * @param {*} options 
     * @returns 
     */
    async list_hearts(options) {
        var ret = {
        }
        var uparams = new URLSearchParams();
        if ("max_id" in options) {
            uparams.append("max_id",options.max_id);
        }
        if ("count" in options) {
            uparams.append("count",options.count);
        }
        if ("is_downloadable" in options) {
            uparams.append("is_downloadable",options.is_downloadable);
        }
        if ("characterization_allowed_user" in options) {
            uparams.append("characterization_allowed_user",options.characterization_allowed_user);
        }
        if ("violent_expression" in options) {
            uparams.append("violent_expression",options.violent_expression);
        }
        if ("sexual_expression" in options) {
            uparams.append("sexual_expression",options.sexual_expression);
        }
        if ("corporate_commercial_use" in options) {
            uparams.append("corporate_commercial_use",options.corporate_commercial_use);
        }
        if ("personal_commercial_use" in options) {
            uparams.append("personal_commercial_use",options.personal_commercial_use);
        }
        if ("political_or_religious_usage" in options) {
            uparams.append("political_or_religious_usage",options.political_or_religious_usage);
        }
        if ("antisocial_or_hate_usage" in options) {
            uparams.append("antisocial_or_hate_usage",options.antisocial_or_hate_usage);
        }
        if ("modification" in options) {
            uparams.append("modification",options.modification);
        }
        if ("redistribution" in options) {
            uparams.append("redistribution",options.redistribution);
        }
        if ("credit" in options) {
            uparams.append("credit",options.credit);
        }
        if ("has_booth_items" in options) {
            uparams.append("has_booth_items",options.has_booth_items);
        }
        if ("booth_part_categories" in options) {
            uparams.append("booth_part_categories",options.booth_part_categories);
        }
        this.setHeaders();

        var url = "/vroidhub/hearts";
        if (window.elecAPI) {
            var result = await elecAPI.callVroidHub(url,{
                headers: Vue.toRaw(this.headers),
                query : options,
            });
            if (result.cd == 0) {
                var anc = document.createElement("a");
                var maxid = ["",""];
                if (result.data._links && result.data._links.next) {
                    anc.href = result.data._links.next.href;
                    maxid = anc.search.replace("?","").split("=");
                }
                ret = {
                    cd: result.cd, 
                    data: result.data.data,
                    error: result.data.error,
                    rand: result.data.rand,
                    next: {"maxid": maxid[1]}
                };
            }else{
                ret = result;
            }
        }else{
            var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
            
            var result = await fetch(finalurl,{
                method:"GET",
                headers: this.headers,
            });
            
            if (result.ok) {
                ret = await result.json();
                var anc = document.createElement("a");
                var maxid = ["",""];
                if (ret.data._links && ret.data._links.next) {
                    anc.href = ret.data._links.next.href;
                    maxid = anc.search.replace("?","").split("=");
                }
                return {
                    cd: ret.cd, 
                    data: ret.data.data,
                    error: ret.data.error,
                    rand: ret.data.rand,
                    next: {"maxid": maxid[1]}
                };
            }else{
                ret = {
                    cd : result.status,
                    msg : result.statusText,
                    data : null
                };
            }
        }
        
        return ret;
    }
    /**
     * get staff pick up models
     * @param {*} options 
     * @returns 
     */
    async list_staff_picks(options) {
        var ret = {
        }
        var uparams = new URLSearchParams();
        if ("max_id" in options) {
            uparams.append("max_id",options.max_id);
        }
        if ("count" in options) {
            uparams.append("count",options.count);
        }
        this.setHeaders();

        var url = `/vroidhub/staff_picks`;
        if (window.elecAPI) {
            var result = await elecAPI.callVroidHub(url,{
                headers: Vue.toRaw(this.headers),
                query : options,
            });
            if (result.cd == 0) {
                var anc = document.createElement("a");
                var maxid = ["",""];
                if (result.data._links && result.data._links.next) {
                    anc.href = result.data._links.next.href;
                    maxid = anc.search.replace("?","").split("=");
                }
                ret = {
                    cd: result.cd, 
                    data: result.data.data.map( v => v.character_model),
                    error: result.data.error,
                    rand: result.data.rand,
                    next: {"maxid": maxid[1]}
                };
            }else{
                ret = result;
            }
        }else{
            var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
            var result = await fetch(finalurl,{
                method:"GET",
                headers: this.headers,
            });
            if (result.ok) {
                ret = await result.json();
                var anc = document.createElement("a");
                var maxid = ["",""];
                if (ret.data._links && ret.data._links.next) {
                    anc.href = ret.data._links.next.href;
                    maxid = anc.search.replace("?","").split("=");
                }
                return {
                    cd: ret.cd, 
                    data: ret.data.data.map( v => v.character_model),
                    error: ret.data.error,
                    rand: ret.data.rand,
                    next: {"maxid": maxid[1]}
                };
            }else{
                ret = {
                    cd : result.status,
                    msg : result.statusText,
                    data : null
                };
            }
        }
        
        return ret;
    }
    /**
     * publish download license
     * @param {*} options 
     * @returns 
     */
    async request_download_licenses(options) {
        var ret = {
        }
        var uparams = new URLSearchParams();
        if ("character_model_id" in options) {
            uparams.append("character_model_id",options.character_model_id);
        }
        this.setHeaders();
        var finalheaders = {};
        for (var obj in this.headers) {
            finalheaders[obj] = this.headers[obj];
        }
        finalheaders["Content-Type"] = "application/json";

        var url = `/vroidhub/download_licenses/publish`;
        if (window.elecAPI) {
            var result = await elecAPI.callVroidHub(url,{
                headers: Vue.toRaw(finalheaders),
                query : options,
            });
            if (result.cd == 0) {
                var anc = document.createElement("a");
                var maxid = ["",""];
                if (result.data._links && result.data._links.next) {
                    anc.href = result.data._links.next.href;
                    maxid = anc.search.replace("?","").split("=");
                }
                ret = {
                    cd: result.cd, 
                    data: result.data.data,
                    error: result.data.error,
                    rand: result.data.rand,
                    next: {"maxid": maxid[1]}
                };
            }else{
                ret = result;
            }
        }else{
            var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
            var result = await fetch(finalurl,{
                method:"GET",
                headers: finalheaders,
            });
            if (result.ok) {
                ret = await result.json();
                var anc = document.createElement("a");
                var maxid = ["",""];
                if (ret.data._links && ret.data._links.next) {
                    anc.href = ret.data._links.next.href;
                    maxid = anc.search.replace("?","").split("=");
                }
                return {
                    cd: ret.cd, 
                    data: ret.data.data,
                    error: ret.data.error,
                    rand: ret.data.rand,
                    next: {"maxid": maxid[1]}
                };
            }else{
                ret = {
                    cd : result.status,
                    msg : result.statusText,
                    data : null
                };
            }
        }
        
        return ret;
    }
    async get_download_licenses(id) {
        var ret = {
        }

        this.setHeaders();

        var uparams = new URLSearchParams();
        if ("id" in options) {
            uparams.append("id",options.id);
        }

        var url = `/vroidhub/download_licenses`;
        if (window.elecAPI) {
            var result = await elecAPI.callVroidHub(url,{
                headers: Vue.toRaw(finalheaders),
                query : {id},
            });
            if (result.cd == 0) {
                var anc = document.createElement("a");
                var maxid = ["",""];
                if (result.data._links && result.data._links.next) {
                    anc.href = result.data._links.next.href;
                    maxid = anc.search.replace("?","").split("=");
                }
                ret = {
                    cd: result.cd, 
                    data: result.data.data,
                    error: result.data.error,
                    rand: result.data.rand,
                    next: {"maxid": maxid[1]}
                };
            }else{
                ret = result;
            }
        }else{
            var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
            var result = await fetch(finalurl,{
                method:"GET",
                headers: this.headers,
            });
            if (result.ok) {
                ret = await result.json();
                var anc = document.createElement("a");
                var maxid = ["",""];
                if (ret.data._links && ret.data._links.next) {
                    anc.href = ret.data._links.next.href;
                    maxid = anc.search.replace("?","").split("=");
                }
                return {
                    cd: ret.cd, 
                    data: ret.data.data,
                    error: ret.data.error,
                    rand: ret.data.rand,
                    next: {"maxid": maxid[1]}
                };
            }else{
                ret = {
                    cd : result.status,
                    msg : result.statusText,
                    data : null
                };
            }
        }
        
        return ret;
    }
    async delete_download_licenses(id) {
        var ret = {
        }

        this.setHeaders();

        var uparams = new URLSearchParams();
        if ("id" in options) {
            uparams.append("id",options.id);
        }

        var url = `/vroidhub/download_licenses/delete`;
        if (window.elecAPI) {
            var result = await elecAPI.callVroidHub(url,{
                headers: Vue.toRaw(finalheaders),
                query : {id},
            });
            if (result.cd == 0) {
                console.log(result);
                ret = result;
            }else{
                ret = result;
            }
        }else{
            var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
            var result = await fetch(finalurl,{
                method:"GET",
                headers: this.headers,
            });
            if (result.ok) {
                ret = await result.json();
            }else{
                ret = {
                    cd : result.status,
                    msg : result.statusText,
                    data : null
                };
            }
        }
        
        return ret;
    }
    /**
     * Get URL of effective model data.
     * @param {*} id 
     * @returns {Object} {location: String}
     */
    async download_model(id) {
        var ret = {
        }

        var ishit = this.session.licenses.findIndex(v => { 
            if (v == id) return true;
            return false;
        });
        if (ishit == -1) this.session.licenses.push(id);

        this.setHeaders();
        var finalheaders = {};
        for (var obj in this.headers) {
            finalheaders[obj] = this.headers[obj];
        }
        //finalheaders["Accept-Encoding"] = "gzip";

        if (window.elecAPI) {
            var url = "/vroidhub/download_licenses/download"
            var result = await elecAPI.callVroidHub(url,{
                headers: Vue.toRaw(finalheaders),
                params : {id},
            });
            if (result.cd == 0) {
                //ret = {
                //    location : result.headers.get("location")
                //};
                ret = result;
            }else{
                ret = result;
            }
        }else{
            var url = `/vroidhub/download_licenses/${id}/download`;
            //var url = `${this.urls.base}/download_licenses/${id}/download`;
            var finalurl = `${url}`;
            var result = await fetch(finalurl,{
                method:"GET",
                //redirect: "manual",
                headers: finalheaders,
            });
            if (result.ok) {
                ret = await result.json();
                //ret = {
                //    location : result.headers.get("location")
                //};
                console.log(ret);
            }else{
                ret = {
                    cd : result.status,
                    msg : result.statusText,
                    data : null
                };
            }
        }
        
        return ret;
    }
    /**
     * Download effective model data
     * @param {*} url 
     * @returns {Blob}
     */
    async realdownload(url) {
        var ret = null;
        var result = await fetch(url);
        if (result.ok) {
            const vrmreader = result.body.getReader();
            var chunks = [];
            var recbyte = 0;
            while (true) {
                const {done, value} = await vrmreader.read();
                if (done) break;

                chunks.push(value);
                recbyte += value.length;
                //---update receive infos...
            }
            const modelbb = new Blob(chunks);
            //const vrmurl = URL.createObjectURL(modelbb);
            ret = modelbb;
        }
        return ret;
    }
}

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {appMainData} mainData 
 * @param {appDataRibbon} ribbonData
 * @param {defineModelLoader.modelLoader} modelLoader
 * @param {appModelOperator} modelOperator
 * @param {UnityCallbackFunctioner} callback 
 * @returns 
 */
export function defineVroidhubSelector(app, Quasar, mainData, ribbonData, modelLoader, modelOperator, callback) {
    const { t  } = VueI18n.useI18n({ useScope: 'global' });

    //===watch-----------------------------------------
    const wa_vroidhubSelector_show = Vue.watch( () => mainData.elements.vroidhubSelector.show, (newval) => {
        mainData.elements.vroidhubSelector.searchstr = "";

        if (Quasar.Screen.name == "xs") {
            mainData.elements.vroidhubSelector.style.width = "100%";
            mainData.elements.vroidhubSelector.style.height = "100%";
            mainData.elements.vroidhubSelector.maximized = true;
            mainData.elements.vroidhubSelector.fullwidth = false;
            mainData.elements.vroidhubSelector.fullheight = false;
            
        }else if (Quasar.Screen.name == "sm") {
            mainData.elements.vroidhubSelector.style.width = "100%";
            mainData.elements.vroidhubSelector.style.height = "100%";
            mainData.elements.vroidhubSelector.maximized = false;
            mainData.elements.vroidhubSelector.fullwidth = true;
            mainData.elements.vroidhubSelector.fullheight = true;
        }
    });
    const wa_vroidhubAuthorizer_show = Vue.watch( () => mainData.elements.vroidhubAuthorizer.show, (newval) => {        

        if (Quasar.Screen.name == "xs") {
            mainData.elements.vroidhubAuthorizer.style.width = "100%";
            mainData.elements.vroidhubAuthorizer.style.height = "100%";
            mainData.elements.vroidhubAuthorizer.maximized = true;
            mainData.elements.vroidhubAuthorizer.fullwidth = false;
            mainData.elements.vroidhubAuthorizer.fullheight = false;
            
        }else if (Quasar.Screen.name == "sm") {
            mainData.elements.vroidhubAuthorizer.style.width = "100%";
            mainData.elements.vroidhubAuthorizer.style.height = "100%";
            mainData.elements.vroidhubAuthorizer.maximized = false;
            mainData.elements.vroidhubAuthorizer.fullwidth = true;
            mainData.elements.vroidhubAuthorizer.fullheight = true;
        }else{
            mainData.elements.vroidhubAuthorizer.style.width = "640px";
            mainData.elements.vroidhubAuthorizer.style.height = "280px";
            mainData.elements.vroidhubAuthorizer.maximized = false;
            mainData.elements.vroidhubAuthorizer.fullwidth = false;
            mainData.elements.vroidhubAuthorizer.fullheight = false;
        }
    });
    const cmp_item_thumbnail = (item) => {
        if (Quasar.Screen.md || Quasar.Screen.lg || Quasar.Screen.xl) {
            return item.data.portrait_image.sq150.url;
        }else{
            return item.data.portrait_image.sq150.url;
        }
    }

    //===event------------------------------------------
    const list_reloaded = () => {
        var options = {};
        if (mainData.elements.vroidhubSelector.next.maxid != "") {
            options["max_id"] = mainData.elements.vroidhubSelector.next.maxid;
        }
        var funcbody = res => {
            console.log(res);
            if (res.cd == 0) {
                
                if ("maxid" in res.next) mainData.elements.vroidhubSelector.next.maxid = res.next.maxid;
                if ("previd" in res.next) mainData.elements.vroidhubSelector.next.previd = res.next.previd;
                mainData.elements.vroidhubSelector.rand = res.rand;

                res.data.forEach(v1 => {
                    var ishit = mainData.elements.vroidhubSelector.files.findIndex(v2 => {
                        if (v2.data.character.id == v1.character.id) return true;
                        return false;
                    });
                    if (ishit == -1) {
                        mainData.elements.vroidhubSelector.files.push({
                            data: v1,
                            selectStyle: ""
                        });
                    }
                });
                
                mainData.elements.vroidhubSelector.loading = false;
            }else if (res.cd == 401){
                appAlert($t("msg_vrh401"));
                mainData.elements.vroidhubSelector.loading = false;
            }else if (res.cd == 404) {
                Quasar.Notify.create({
                    message : t("cons_notfounddata"), 
                    position : "bottom-right",
                    color : "negative",
                    textColor : "white",
                    timeout : 3000, 
                    multiLine : true
                });
                mainData.elements.vroidhubSelector.loading = false;
            }
        };
        
        mainData.elements.vroidhubSelector.loading = true;
        if (mainData.elements.vroidhubSelector.kind == "models") {
            mainData.vroidhubapi.list_character_models(options)
            .then(funcbody);
        }else if (mainData.elements.vroidhubSelector.kind == "hearts") {
            mainData.vroidhubapi.list_hearts(options)
            .then(funcbody);
        }else if (mainData.elements.vroidhubSelector.kind == "staffpicks") { 
            mainData.vroidhubapi.list_staff_picks(options)
            .then(funcbody);
        }

    }
    const item_onclick = (item) => {
        for (var i = 0; i < mainData.elements.vroidhubSelector.files.length; i++) {
            mainData.elements.vroidhubSelector.files[i].selectStyle = "";
        }
        item.selectStyle = "check_box";

        mainData.elements.vroidhubSelector.selected = item;
        console.log(mainData.elements.vroidhubSelector.selected);
    }
    const onclick_ok_vroidhubSelector = () => {
        appConfirm(t("msg_vrh_loading"),async () => {
            var ret = await mainData.vroidhubapi.request_download_licenses({
                character_model_id: mainData.elements.vroidhubSelector.selected.data.id
            });
            //console.log(ret);
            mainData.vroidhubdata["license"] = ret.data;

            //---real download
            var ret2 = await mainData.vroidhubapi.download_model(mainData.vroidhubdata["license"].id);
            //console.log(ret2);
            mainData.vroidhubdata["real"] = ret2;

            var retbb = await mainData.vroidhubapi.realdownload(ret2.location);
            var vosfile = new VOSFile({});
            vosfile.name = mainData.elements.vroidhubSelector.selected.data.character.name;
            vosfile.id = mainData.elements.vroidhubSelector.selected.data.id;
            vosfile.path = mainData.elements.vroidhubSelector.selected.data.character.name;
            vosfile.size = retbb.size;
            vosfile.encoding = "binary";
            vosfile.lastModified = new Date(mainData.elements.vroidhubSelector.selected.data.published_at);
            vosfile.data = retbb;
            vosfile.storageType = STORAGE_TYPE.VROIDHUB;

            var fdata = URL.createObjectURL(vosfile.data);
            mainData.data.objectUrl.vrm = fdata;
            mainData.states.fileloadname = vosfile.name;
            mainData.states.fileloadtype = "v";
            mainData.states.loadingfileHandle = vosfile;

            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'LoadVRMURI',param:fdata},
                "firstload_vrm",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback,objectURL:fdata,filename:mainData.states.fileloadname,
                    fileloadtype: mainData.states.fileloadtype,
                    loadingfileHandle : vosfile}
            ));
            AppQueue.start();
            mainData.elements.vroidhubSelector.show=false;
            mainData.elements.loading = true;
        });
    }
    //############################################
    // VRoidHubAuthorizer
    //############################################
    const onclick_authorize_vroidhubAuthorizer = () => {
        var a = ID("vrha_url");
        a.click();
        mainData.elements.vroidhubAuthorizer.progress_authorize = true;
    }
    const onclick_codesend_vroidhubAuthorizer = () => {
        if (mainData.elements.vroidhubAuthorizer.code_inputBox == "") {
            appAlert(t("msg_notinputcode_vrha"));
            return;
        }
        mainData.vroidhubapi.request_token(mainData.elements.vroidhubAuthorizer.code_inputBox)
        .then(res => {
            Quasar.LocalStorage.remove("callback_code");
            mainData.states.vroidhub_api = true;
            mainData.elements.vroidhubAuthorizer.show = false;
            mainData.elements.vroidhubAuthorizer.progress_authorize = false;
        });
    }
    const onclick_close_vroidhubAuthorizer = () => {
        mainData.elements.vroidhubAuthorizer.show = false;
        mainData.elements.vroidhubAuthorizer.progress_authorize = false;
    }

    return {
        vroidhubSelectorEvent : Vue.reactive({
            cmp_item_thumbnail,

            list_reloaded,
            item_onclick,
            onclick_ok_vroidhubSelector,
        }),
        wa_vroidhubSelector_show,
        wa_vroidhubAuthorizer_show,
        vroidhubAuthorizerEvent : Vue.reactive({
            onclick_authorize_vroidhubAuthorizer,
            onclick_codesend_vroidhubAuthorizer,
            onclick_close_vroidhubAuthorizer,
        })

    };
}