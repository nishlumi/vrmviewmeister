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
        }

        this.states = {
            enable_token : false
        }

    }
    setHeaders() {
        this.headers["Authorization"] = `Bearer ${this.savedata.token.access_token}`;
    }
    save() {
        AppDB.app.setItem("vrh_save",Vue.toRaw(this.savedata));
    }
    load() {
        return AppDB.app.getItem("vrh_save")
        .then(result => {
            if (result) {
                this.savedata = result;
                this.states.enable_token = true;
            }
            return this.states.enable_token;
        });
    }
    delete_data() {
        AppDB.app.remove("vrh_save");
    }
    generateAuthLink() {
        if (window.elecAPI) {
            elecAPI.vroidhubAuthorize({
                "redirect_uri" : location.origin + "/redirect"
            })
            .then(res => {

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
    async request_token(code) {
        var def = new Promise(async (resolve,reject) => {
            if (window.elecAPI) {
                elecAPI.vroidhubRequestToken({
                    "redirect_uri" : location.origin + "/redirect",
                    "grant_type" : "authorization_code",
                    "code" : code
                })
                .then(resjs => {
                    if (resjs.cd == 0) {
                        this.savedata.appid = resjs.appid;
                        
                        this.savedata.token = resjs.data;
                        this.states.enable_token = true;
                        this.save();
                        resolve(resjs.data);
                    }else{
                        reject({cd:9, err:result.msg});
                    }
                });
            }else{
                var csrf = await fetch("/csrf-token");
                var jscsrf = await csrf.json();

                var uparams = new URLSearchParams();
                uparams.append("redirect_uri",location.origin + "/redirect");
                uparams.append("grant_type","authorization_code");
                uparams.append("code",code);
    
                var finalheaders = {};
                for (var obj in this.headers) {
                    finalheaders[obj] = this.headers[obj];
                }
                finalheaders["Content-Type"] = "application/json";
                finalheaders["x-csrf-token"] = jscsrf.token;
    
                var finalurl = `/vroidhub/request-token?${uparams.toString()}`;
                //---generate real url with invisible parameter
                fetch(finalurl,{
                    method: "POST"
                })
                .then(async result => {
                    if (result.ok) {
                        var resjs = await result.json();
                        if (resjs.cd == 0) {
                            this.savedata.appid = resjs.appid;
                            
                            this.savedata.token = resjs.data;
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
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        var result = await fetch(finalurl,{
            method: "GET",
            headers: this.headers,
        })
        if (result.ok) {
            return await result.json();
        }else{
            return null;
        }
    }
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

        var url = `${this.urls.base}/hearts`;
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        var result = await fetch(finalurl,{
            method:"GET",
            headers: this.headers,
        });
        if (result.ok) {
            ret = await result.json();
        }else{
            ret = null;
        }
        return ret;
    }
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

        var url = `${this.urls.base}/staff_picks`;
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        var result = await fetch(finalurl,{
            method:"GET",
            headers: this.headers,
        });
        if (result.ok) {
            ret = await result.json();
        }else{
            ret = null;
        }
        return ret;
    }
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

        var url = `${this.urls.base}/download_licenses`;
        var finalurl = `${url}?${uparams.toString()}`;
        var result = await fetch(finalurl,{
            method:"POST",
            headers: finalheaders,
            body: JSON.stringify({
                character_model_id: options.character_model_id,
            }),
        });
        if (result.ok) {
            ret = await result.json();
        }else{
            ret = null;
        }
        return ret;
    }
    async get_download_licenses(id) {
        var ret = {
        }

        this.setHeaders();

        var url = `${this.urls.base}/download_licenses/${id}`;
        var finalurl = `${url}`;
        var result = await fetch(finalurl,{
            method:"GET",
            headers: this.headers,
        });
        if (result.ok) {
            ret = await result.json();
        }else{
            ret = null;
        }
        return ret;
    }
    async delete_download_licenses(id) {
        var ret = {
        }

        this.setHeaders();

        var url = `${this.urls.base}/download_licenses/${id}`;
        var finalurl = `${url}`;
        var result = await fetch(finalurl,{
            method:"DELETE",
            headers: this.headers,
        });
        if (result.ok) {
            ret = await result.json();
        }else{
            ret = null;
        }
        return ret;
    }
    async download_model(id) {
        var ret = {
        }

        this.setHeaders();
        var finalheaders = {};
        for (var obj in this.headers) {
            finalheaders[obj] = this.headers[obj];
        }
        finalheaders["Accept-Encoding"] = "gzip";

        var url = `${this.urls.base}/download_licenses/${id}/download`;
        var finalurl = `${url}`;
        var result = await fetch(finalurl,{
            method:"GET",
            redirect: "manual",
            headers: finalheaders,
        });
        if (result.ok) {
            ret = {
                url : result.headers.get("location")
            };
        }else{
            ret = null;
        }
        return ret;
    }
    async realdownload(url) {
        var ret = {
            data : null
        };
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
                const modelbb = new Blob(chunks);
                //const vrmurl = URL.createObjectURL(modelbb);
                ret.data = modelbb;
            }
        }
        return ret;
    }
}