import { defineSetupLang } from "./setuplang.js";
import { VFileHelper, VFileOperator, VFileOptions, VFileType } from "./filehelper.js";

var loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

/*
Example kicking off the UI. Obviously, adapt this to your specific needs.
Assumes you have a <div id="q-app"></div> in your <body> above
*/

const formatTimeString = (curtime) => {
    var mm = Math.floor(curtime / 60).toString().padStart(2,"0");
    var ss = Math.floor(curtime > 60 ? curtime - 60 : curtime).toString().padStart(2,"0");
    var arr = curtime.toString().split(".");
    var ms = "000";
    if (arr.length > 1) {
        ms = arr[1].toString().substr(0,3);
    }
    ms = ms.padStart(3, "0");
    return `${mm}:${ss}.${ms}`;
}

class TrackCueItem {
    constructor() {
        this.id = "";
        this.startTime = 0;
        this.endTime = 0;
        this.text = "";
        this.color = "secondary";
        this.classes = {
            "bg-primary" : false,
        };
        this.classname = {label:"----",value:null};
        this.isactive = false;
        //this.verticalPosition = "auto";
        this.horizonalPosition = "auto";
        this.cue = null;
    }
    timestring () {
        return `${formatTimeString(this.startTime)} --> ${formatTimeString(this.endTime)}`
    }
}
class TrackCSS {
    constructor() {
        this.isactive = false;
        this.classname = "";
        this.selector = "";
        this.csstext = "";
    }
}
const app = Vue.createApp({
    setup () {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });

        const myapp = Vue.ref({
            loadedVideoName : _T("No video"),
            files : null,
            videourl : "",
            videoratio : 1,
            recording : {
                stsream : null,
                machine : null,
            },
            rightpanel : {
                show : false,
                tab : "track",
                editTrack : {
                    trackoptions : [],
                    seltrack : null,
                    track_options : [
                        "disabled","hidden","showing"
                    ],
                    track_mode : "hidden",
                    addlabel : "",
                    addlang : "",
                    selkind : "subtitles",
                    kindoptions : [
                        "subtitles","captions","descriptions","chapters","metadata"
                    ],
                    csstext : "",
                },
                editTimeline : {
                    /**
                     * @type {TrackCueItem[]}
                     */
                    items : [],
                    selitem : null,
                    newcueItem : null,
                    activeCues : [],
                    selactiveCue : null,
                    currentTime : "",
                    cuestarttime : "00:00.000",
                    cuestartimef : 0.0,
                    cueendtime : "00:00.000",
                    cueendtimef : 0.0,
                    cueText : "",
                    cueHorizontalNumber : 90,
                    cueHorizontalAuto : true,
                    cueVerticalNumber : 10,
                    cueVerticalAuto : true,
                    cueCSSClass : {label:"----",value:null},
                    lineVerticalAlign : {
                        options: ["start","center","end","left","right"],
                        sel : "center",
                    },
                    /*positionHorizontalAlign : {
                        options: ["line-left","center","line-right","auto"],
                        sel : "center",
                    },*/
                    cueSize : 100,
                },
                editCSS : {
                    /**
                     * @type {TrackCSS []}
                     */
                    items : [],
                    /**
                     * @type {TrackCSS}
                     */
                    selitem : null,
                    selIndex : -1,
                    cssClassName : "",
                    cssContent : "",
                }
            },
            bottompanel : {
                show : false,
                disabled : true,
                icon_playbtn : "play_circle",
                vttfile : null
            },
            showmsg : false,
            msgcontent : "",
            appconf : {
                set_name : "_vvie_aco",
                confs : {},
            },
        });
        const loadSetting = () => {
            var textdata = localStorage.getItem(capapp.value.appconf.set_name);
            if (textdata) {
                var tmp = JSON.parse(textdata);
                capapp.value.appconf.confs = tmp;
            }
        }

        const hidfile = Vue.ref(null);
        const hidfile_onchange = (evt) => {
            myapp.value.files = evt.target.files[0];
            myapp.value.loadedVideoName = myapp.value.files.name;
            upload_body();
        };

        const vplayer = Vue.ref(null);
        const reccanvas = Vue.ref(null);
        const lnk_download = Vue.ref(null);
        var ctx = null;
        var camctx = null;
        var is_rec = false;
        /**
         * @type {HTMLStyleElement}
         */
        var vstyle = null;
        /**
         * @type {CSSStyleSheet}
         */
        var vsheet = new CSSStyleSheet();

        const cmp_canUpload = Vue.computed(() => myapp.value.files !== null);
        const cleanUp = () => {
            window.URL.revokeObjectURL(myapp.value.videourl);
        }
        const cancelFile = () => {
            myapp.value.files = null;
            cleanUp();
        }
        const updateFiles = (targetfiles) => {
            myapp.value.files = targetfiles;
           
        }
        const upload_body = () => {
            cleanUp();

            myapp.value.videourl = window.URL.createObjectURL(myapp.value.files);
            Vue.nextTick(()=> {
                //if (myapp.value.videourl != "")
                //vplayer.value.play();
            });
        }
        /**
         * 
         * @param {String} tracklabel 
         * @returns {HTMLTrackElement}
         */
        const getTrackHTML = (tracklabel) => {
            var ret = null;
            for (var i =  0; i < vplayer.value.childNodes.length; i++) {
                var child = vplayer.value.childNodes[i];
                if (child.track) {
                    if (child.track.label == tracklabel) {
                        ret = child;
                        break;
                    }
                }
            }
            return ret;
        }
        const getInternalTrack = (label) => {
            var ret = null;
            for (var i = 0; i < myapp.value.rightpanel.editTrack.trackoptions.length; i++) {
                if (label == myapp.value.rightpanel.editTrack.trackoptions[i].label) {
                    ret = myapp.value.rightpanel.editTrack.trackoptions[i];
                    break;
                }
            }
            return ret;
        }
        const getInternalTrackIndex = (label) => {
            var ret = -1;
            for (var i = 0; i < myapp.value.rightpanel.editTrack.trackoptions.length; i++) {
                if (label == myapp.value.rightpanel.editTrack.trackoptions[i].label) {
                    ret = i;
                    break;
                }
            }
            return ret;
        }
        /**
         * 
         * @param {TextTrack} tt 
         */
        const enumEditTimeline = (tt) => {
            if (tt.cues) {
                myapp.value.rightpanel.editTimeline.items.splice(0, myapp.value.rightpanel.editTimeline.items.length);
                for (var t = 0; t < tt.cues.length; t++) {
                    var cue = tt.cues[t];
                    var tcitem = new TrackCueItem();
                    tcitem.startTime = cue.startTime;
                    tcitem.endTime =  cue.endTime;
                    tcitem.text = cue.text;
                    tcitem.cue = cue;
                    myapp.value.rightpanel.editTimeline.items.push(tcitem);
                }
            }
        }
        
        //---header toolbar=============================================
        const open_fromapp = () => {
            cleanUp();
            let url = sessionStorage.getItem("tempvideo");
            if (url) {
                myapp.value.videourl = url;
                myapp.value.loadedVideoName = _T("Recorded video by VRMViewMeister");
            }else{
                myapp.value.msgcontent = _T("msg_error_allfile");
                myapp.value.showmsg = true;
            }
        }
        const open_fromlocal = () => {
            cleanUp();
            hidfile.value.click();
        }
        const panel_clicked = () => {
            myapp.value.rightpanel.show = !myapp.value.rightpanel.show;
            myapp.value.bottompanel.show = !myapp.value.bottompanel.show;
        }
        //---video control========================================
        const video_loadeddata = (evt) => {
            console.log("load video!",evt);
            var track = document.createElement("track");
            track.kind = "subtitles";
            track.label = "track1";
            track.id = "trk" + new Date().valueOf();
            track.srclang = navigator.languages[0];
            //track.track.mode = "showing";
            //var track = vplayer.value.addTextTrack("captions","track1",navigator.languages[0]);
            vplayer.value.appendChild(track);

            myapp.value.rightpanel.editTrack.trackoptions.splice(0, myapp.value.rightpanel.editTrack.trackoptions.length);
            myapp.value.rightpanel.editTrack.trackoptions.push({
                label : `${track.label} (${track.kind})`,
                value : track.label,
            });
            myapp.value.rightpanel.editTrack.seltrack = myapp.value.rightpanel.editTrack.trackoptions[0];

            myapp.value.bottompanel.disabled = false;
            
            //---user can play the media to full time.
            myapp.value.recording.stream = new MediaStream();
            myapp.value.recording.stream.addTrack(reccanvas.value.captureStream().getTracks()[0]);
            myapp.value.recording.machine = new MediaRecorder(myapp.value.recording.stream);
            myapp.value.recording.machine.ondataavailable = recording_datachange;

            reccanvas.value.width = evt.target.videoWidth;
            reccanvas.value.height = evt.target.videoHeight;

            ctx = reccanvas.value.getContext("2d");
            camctx = vplayer.value.captureStream();


        }
        const video_canplaythrough = (evt) => {
            //---user can play the media to full time.
        }
        const video_seeking = (evt) => {
            //console.log(evt);
            var curtime = evt.target.currentTime;
            
            myapp.value.rightpanel.editTimeline.currentTime = curtime; //formatTimeString(curtime);

            
            //---find active cue
            //for (var i = 0; i < evt.target.textTracks.length; i++) {
                /**
                 * @type {TextTrack}
                 */
                //var tt = evt.target.textTracks[0];

                /*
                console.log(tt.activeCues);
                if (tt.activeCues) {
                    myapp.value.rightpanel.editTimeline.items.splice(0, myapp.value.rightpanel.editTimeline.items.length);
                    for (var t = 0; t < tt.activeCues.length; t++) {
                        var cue = tt.activeCues[t];
                        var tcitem = new TrackCueItem();
                        tcitem.startTime = cue.startTime;
                        tcitem.endTime =  cue.endTime;
                        tcitem.text = cue.text;
                        tcitem.cue = cue;
                        myapp.value.rightpanel.editTimeline.items.push(tcitem);
                    }
                }
                */
            //}
        }
        const video_played = (evt) => {
            myapp.value.bottompanel.icon_playbtn = "pause";
        }
        const video_paused = (evt) => {
            myapp.value.bottompanel.icon_playbtn = "play_circle";
        }
        const video_timeupdate = (evt) => {
            /*
            if (is_rec) {
                console.log(evt.target.currentTime);
                console.log(myapp.value.recording.machine.state);
                ctx.clearRect(0, 0, reccanvas.value.width, reccanvas.value.height);
                ctx.drawImage(
                    vplayer.value,
                    0, 0, reccanvas.value.width, reccanvas.value.height
                );
            }
            */
        }

        //---Canvas stream and MediaRecorder======================
        const recording_datachange = (evt) => {
            var bb = new Blob([evt.data], { type: evt.data.type});
            var burl = URL.createObjectURL(bb);

            lnk_download.value.href = burl;
        }
        //---text track controls==================================
        const wa_seltrack = Vue.watch(() => myapp.value.rightpanel.editTrack.seltrack,(newval) => {
            const trk = myapp.value.rightpanel.editTrack;
            if (newval.value) {
                var seltrack = getTrackHTML(newval.value);
                if (seltrack) {
                    trk.track_mode = seltrack.track.mode;
                    enumEditTimeline(seltrack.track);
                }
            }
        });
        const wa_track_mode = Vue.watch(() => myapp.value.rightpanel.editTrack.track_mode,(newval) => {
            const trk = myapp.value.rightpanel.editTrack;
            if (trk.seltrack) {
                var seltrack = getTrackHTML(trk.seltrack.value);
                seltrack.track.mode = trk.track_mode;
            }
        });
        const tlb_track_add = () => {
            var label = myapp.value.rightpanel.editTrack.addlabel;
            var lang = myapp.value.rightpanel.editTrack.addlang;
            var kind = myapp.value.rightpanel.editTrack.selkind;

            var chk = getTrackHTML(label);
            if (chk) {
                appAlert(_T("msg_err_addtrack"));
                return;
            }

            var track = document.createElement("track");

            track.kind = kind;
            track.label = label;
            track.srclang = lang;
            track.id = "trk" + new Date().valueOf();
            track.track.mode = "disabled";
            //var track = vplayer.value.addTextTrack("captions","track1",navigator.languages[0]);
            vplayer.value.appendChild(track);

            //var tt = vplayer.value.addTextTrack("captions",label,lang);
            myapp.value.rightpanel.editTrack.trackoptions.push({
                label : `${track.label} (${track.kind})`,
                value : track.label,
            });
        }
        const tlb_track_openvtt = () => {
            document.getElementById("fil_vttfile").click();
        }
        const tlb_track_del = () => {
            if (myapp.value.rightpanel.editTrack.trackoptions.length == 1) {
                appAlert("one error");
                return;
            }
            const trk = myapp.value.rightpanel.editTrack;
            if (trk.seltrack) {
                var seltrack = getTrackHTML(trk.seltrack.value);
                var selinternal = getInternalTrackIndex(trk.seltrack.value);
                
                if (selinternal > -1) {
                    seltrack.remove();

                    myapp.rightpanel.editTrack.trackoptions.splice(selinternal,1);
                }
            }
        }
        const tlb_track_save = () => {
            const trk = myapp.value.rightpanel.editTrack;
            const css = myapp.value.rightpanel.editCSS;

            var html = getTrackHTML(trk.seltrack.value);

            var arrfile = [
                "WEBVTT",
                ""
            ];

            if (css.items.length > 0) {
                arrfile.push("STYLE");
            }
            for (var i = 0; i < css.items.length; i++) {
                /**
                 * @type {TrackCSS}
                 */
                var sty = css.items[i];
                arrfile.push(sty.selector + " {");
                arrfile.push(sty.csstext);
                arrfile.push("}");
            }
            arrfile.push("");
            for (var i = 0; i < html.track.cues.length; i++) {
                var cue = html.track.cues[i];
                var line = "";
                line = formatTimeString(cue.startTime) + " --> " + formatTimeString(cue.endTime);

                //---line
                if (cue.line != "auto") {
                    line += ` line:${cue.line}% `;
                }
                if (cue.position != "auto") {
                    line += ` position:${cue.position}% `;
                }
                line += ` size:${cue.size}% `;
                line += ` align:${cue.align}`;
                arrfile.push(line);
                arrfile.push(cue.text);
                arrfile.push("");
            }
            //console.log(arrfile);

            var vopt = new VFileType();
            vopt.accept = {
                "text/vtt" : [".srt",".vtt"]
            };
            var vf = new VFileOptions();
            vf.suggestedName = trk.seltrack.value + ".srt";
            
            vf.types.push(vopt);
            if (VFileHelper.flags.isElectron) {
                VFileHelper.saveUsingDialog(arrfile.join("\r\n"),vf,true);
            }else{
                var content = new Blob([arrfile.join("\r\n")], {type: "text/vtt"});
                var burl = URL.createObjectURL(content);
                VFileHelper.saveUsingDialog(burl,vf, true)
                .then(ret => {
                    URL.revokeObjectURL(burl);
                });
            }
        }
        const track_list_onchange = (evt) => {
            /*const trk = myapp.value.rightpanel.editTrack;
            const tl = myapp.value.rightpanel.editTimeline;

            if (trk.seltrack) {
                tl.items.splice(0, tl.items.length);

                var seltrack = getTrackHTML(trk.seltrack.value);
                if (seltrack) {
                    for (var i = 0; i < seltrack.track.cues.length; i++) {
                        const cue = seltrack.track.cues[i];

                        var tcitem = new TrackCueItem();
                        tcitem.startTime = cue.startTime;
                        tcitem.endTime = cue.endTime;
                        tcitem.text = cue.text;
                        tcitem.cue = cue;
                        myapp.value.rightpanel.editTimeline.items.push(tcitem);
                    }
                    trk.seltrack.mode = seltrack.track.mode;
                }
                
            }*/
        }
        //---css===================================================
        const cmp_css_classlist = Vue.computed(() => {
            const css = myapp.value.rightpanel.editCSS;
            /**
             * @type {TrackCSS []}
             */
            const classlist = css.items;
            var arr = [
                {label: "----",value: null}
            ];
            for (var i = 0; i < classlist.length; i++){
                arr.push({
                    label : classlist[i].classname,
                    value : classlist[i].classname
                });
            }
            return arr;
        });
        /**
         * 
         * @param {TrackCSS} item 
         * @param {Number} index
         */
        const select_active_css = (item,index) => {
            const css = myapp.value.rightpanel.editCSS;

            for (var i = 0; i < css.items.length; i++) {
                css.items[i].isactive = false;
            }
            item.isactive = true;
            css.selitem = item;
            css.selIndex = index;

            //---apply to UI
            css.cssClassName = item.classname;
            css.cssContent = item.csstext;
        }
        const css_add_clicked = (isedit) => {
            const css = myapp.value.rightpanel.editCSS;
         
            if (myapp.value.rightpanel.editCSS.cssClassName.trim() == "") {
                appAlert(_T("msg_err_addcss"));
                return;
            }
            
            if (!isedit) {
                //---add new css
                var cls = new TrackCSS();
                cls.classname = myapp.value.rightpanel.editCSS.cssClassName;
                cls.selector = `::cue(c.${cls.classname})`;
                cls.csstext = myapp.value.rightpanel.editCSS.cssContent;
                css.items.push(cls);
                vsheet.insertRule(`${cls.selector} {${cls.csstext}}`,vsheet.cssRules.length);
            }else{
                //---edit existed css
                var ishit = -1;
                for (var i = 0; i < css.items.length; i++) {
                    if (css.items[i].classname == myapp.value.rightpanel.editCSS.cssClassName) {
                        ishit = i;
                        break;
                    }
                }
                if (ishit > -1) {
                    var cls = css.items[ishit];
                    if (cls) {
                        cls.csstext = myapp.value.rightpanel.editCSS.cssContent;
                        vsheet.deleteRule(ishit);
                        vsheet.insertRule(`${cls.selector} {${cls.csstext}}`, ishit);
                        //vsheet.replace(`${cls.selector} {${cls.csstext}}`);
                    }
                }else{
                    appAlert(_T("msg_war_editcss"));
                }
            }
        }
        const css_del_clicked = () => {
            const css = myapp.value.rightpanel.editCSS;
            if (css.selIndex < vsheet.cssRules.length) {
                vsheet.deleteRule(css.selIndex);

                css.items.splice(css.selIndex, 1);
            }
        }
        const css_upload_clicked = (evt) => {
            document.getElementById("fil_cssfile").click();
        }
        /**
         * 
         * @param {Event} evt 
         */
        const css_file_onchange = async (evt) => {
            const css = myapp.value.rightpanel.editCSS;

            /**
             * @type {FileList}
             */
            var files = evt.target.files;
            if (files.length > 0) {
                var csscontents = await files[0].text();
                var farr = csscontents.split("\n");
                
                var ishitCUE = false;
                var ishitKKO = false;
                var rawcssclass = "";
                var rawcsstext = [];
                try {
                    for (var i = 0; i < farr.length; i++) {
                        var line = farr[i].trim();

                        //---search the selector 
                        var posCUE = line.indexOf("::cue(");
                        if (posCUE == 0) {
                            if (ishitCUE) {
                                throw new Error("err:duplicate_selector");
                            }else{
                                ishitCUE = true;
                                var posKKOEND = line.indexOf(")");
                                if (posKKOEND > -1) {
                                    rawcssclass = line.substring(6, posKKOEND);
                                }else{
                                    throw new Error("err:selector_target_braces");
                                }
                            }
                            
                        }

                        //---search the css content
                        var posWAVKKO = line.indexOf("{");
                        if (posWAVKKO > -1) {
                            if (ishitKKO) {
                                //---find "{" directly after "{" 
                                throw new Error("err:opening_braces");
                            }else{
                                if (ishitCUE) {
                                    //---only hit selector "::cue"
                                    ishitKKO = true;
                                    rawcsstext.push(line.substring(posWAVKKO+1, line.length));
                                }
                            }
                        }else{
                            if (ishitKKO) {
                                //---after "{"
                                var posWAVKKOEND = line.indexOf("}");
                                if (posWAVKKOEND > -1) {
                                    //--- find "}"
                                    ishitKKO = false;
                                    rawcsstext.push(line.substring(0, posWAVKKOEND));
    
                                    //---css class finalize
                                    var trackcss = new TrackCSS();
                                    trackcss.classname = rawcssclass.replace(/^c\./,"");
                                    trackcss.selector = `::cue(${rawcssclass})`;
                                    trackcss.csstext = rawcsstext.join("\n");
                                    css.items.push(trackcss);
                                    vsheet.insertRule(`${trackcss.selector} {${trackcss.csstext}}`,vsheet.cssRules.length);
                                    //---clear for next
                                    ishitCUE = false;
                                    ishitKKO = false;
                                    rawcssclass = "";
                                    rawcsstext.splice(0, rawcsstext.length);
                                }else{
                                    //---not "}"
                                    rawcsstext.push(line);
                                }
                            }
                        }
                    }

                }catch(e) {
                    if (e == "err:opening_braces") {
                        appAlert("msg_err_opening_braces");
                    }else if (e == "err:selector_target_braces") {
                        appAlert("msg_err_selector_target_braces");
                    }else if (e == "err:duplicate_selector") {
                        appAlert("msg_err_duplicate_selector");
                    }
                }
            }
        }
        const css_download_onclick = () => {
            const css = myapp.value.rightpanel.editCSS;
            var arrfile = [];

            for (var i = 0; i < css.items.length; i++) {
                /**
                 * @type {TrackCSS}
                 */
                var sty = css.items[i];
                arrfile.push(sty.selector + " {");
                arrfile.push(sty.csstext);
                arrfile.push("}");
            }
            arrfile.push("");
            var vopt = new VFileType();
            vopt.accept = {
                "text/css" : [".css"]
            };
            var vf = new VFileOptions();
            vf.suggestedName = `style_${new Date().valueOf()}.css`;
            
            vf.types.push(vopt);
            if (VFileHelper.flags.isElectron) {
                VFileHelper.saveUsingDialog(arrfile.join("\r\n"),vf,true);
            }else{
                var content = new Blob([arrfile.join("\r\n")], {type: "text/css"});
                var burl = URL.createObjectURL(content);
                VFileHelper.saveUsingDialog(burl,vf, true)
                .then(ret => {
                    URL.revokeObjectURL(burl);
                });
            }
        }

        //---cue==================================================
        const new_cue = () => {
            myapp.value.rightpanel.editTimeline.newcueItem = new VTTCue(0,0,"");
            myapp.value.rightpanel.editTimeline.newcueItem.snapToLines = false;
            myapp.value.rightpanel.editTimeline.selactiveCue = null;

            for (var i = 0; i < myapp.value.rightpanel.editTimeline.items.length; i++) {
                myapp.value.rightpanel.editTimeline.items[i].isactive = false;
            }
        }
        const remove_cue  = () => {
            const tl = myapp.value.rightpanel.editTimeline;
            const trk = myapp.value.rightpanel.editTrack;
            var ishit = -1;
            for (var i = 0; i < tl.items.length; i++) {
                if (tl.items[i].isactive) {
                    ishit = i;
                    break;
                }
            }
            if (ishit > -1) {
                var seltrack = getTrackHTML(trk.seltrack.value);
                if (seltrack) {
                    seltrack.track.removeCue(tl.items[ishit].cue);
                    tl.items.splice(ishit,1);
                }
                
            }
        }
        /**
         * select target cue in cue list UI
         * @param {TrackCueItem} item 
         */
        const select_active_cue = (item) => {
            const tl = myapp.value.rightpanel.editTimeline;

            for (var i = 0; i < tl.items.length; i++) {
                tl.items[i].isactive = false;
            }
            item.isactive = true;
            tl.selactiveCue = item;
            tl.newcueItem = null;

            //---apply to UI
            const cue = tl.selactiveCue.cue;
            tl.cuestarttime = formatTimeString(cue.startTime);
            tl.cuestarttimef = cue.startTime;
            tl.cueendtime = formatTimeString(cue.endTime);
            tl.cueendtimef = cue.endTime;
            tl.cueText = tl.selactiveCue.text;
            tl.cueVerticalAuto = cue.line == "auto" ? true : false;
            if (cue.line != "auto") tl.cueVerticalNumber = parseInt(cue.line);
            tl.lineVerticalAlign.sel  = cue.align;

            tl.cueHorizontalAuto = cue.position == "auto" ? true : false;
            if (cue.position != "auto") tl.cueHorizontalNumber = parseInt(cue.position);
            //tl.positionHorizontalAlign.sel = cue.positionAlign;

            tl.cueSize = cue.size;
            if (tl.selactiveCue.classname.value != null) {
                tl.cueCSSClass = tl.selactiveCue.classname;
            }else{
                var dmy = new TrackCueItem();
                tl.cueCSSClass = dmy.classname;
            }
        }
        const cue_add_clicked = (isnew) => {
            const tl = myapp.value.rightpanel.editTimeline;
            const trk = myapp.value.rightpanel.editTrack;
            var text = tl.cueText;
            var cue = null;

            //---newly add mode
            if (isnew) {
                tl.newcueItem = new VTTCue(0,0,"");
                tl.newcueItem.snapToLines = false;
                tl.selactiveCue = null;
                for (var i = 0; i < tl.items.length; i++) {
                    tl.items[i].isactive = false;
                }

                //---edit properties
                tl.newcueItem.id = new Date().valueOf();
                tl.newcueItem.startTime = tl.cuestarttimef;
                tl.newcueItem.endTime = tl.cueendtimef;
                if ((tl.cueCSSClass) && (tl.cueCSSClass.value != null)) {
                    tl.newcueItem.text = `<c.${tl.cueCSSClass.value}>${text}</c>`;
                }else{
                    tl.newcueItem.text = text;
                }
                
                tl.newcueItem.line = tl.cueVerticalAuto ?
                    "auto" : tl.cueVerticalNumber;
                tl.newcueItem.align = tl.lineVerticalAlign.sel;

                tl.newcueItem.position = tl.cueHorizontalAuto ?
                    "auto" : tl.cueHorizontalNumber;
                //tl.newcueItem.positionAlign = tl.positionHorizontalAlign.sel;
                tl.newcueItem.size = tl.cueSize;
                cue = tl.newcueItem;
                if (trk.seltrack) {
                    var seltrack = getTrackHTML(trk.seltrack.value);
                    if (seltrack) seltrack.track.addCue(cue);
                    var tcitem = new TrackCueItem();
                    tcitem.startTime = cue.startTime;
                    tcitem.endTime = cue.endTime;
                    tcitem.text = text;
                    tcitem.classname = tl.cueCSSClass;
                    tcitem.cue = cue;
                    tl.items.push(tcitem);

                    tl.newcueItem = null;
                }
            }else if (tl.selactiveCue) {
                //---edit existed cue mode
                cue = tl.selactiveCue.cue;
                cue.startTime = tl.cuestarttimef;
                cue.endTime = tl.cueendtimef;
                
                if ((tl.cueCSSClass) && (tl.cueCSSClass.value != null)) {
                    cue.text = `<c.${tl.cueCSSClass.value}>${text}</c>`;
                }else{
                    cue.text = text;
                }
                cue.line = tl.cueVerticalAuto ?
                    "auto" : tl.cueVerticalNumber;
                cue.align = tl.lineVerticalAlign.sel;
                cue.position = tl.cueHorizontalAuto ?
                    "auto" : tl.cueHorizontalNumber;
                //cue.positionAlign = tl.positionHorizontalAlign.sel;
                cue.size = tl.cueSize;
                
                if (trk.seltrack) {
                    var seltrack = getTrackHTML(trk.seltrack.value);
                    var acs = null;
                    if (seltrack) acs = seltrack.track.cues;
                    var ishit = null;
                    for (var i = 0; i < acs.length; i++) {
                        var item = acs[i];
                        if (item.id == cue.id) {
                            ishit = item;
                            break;
                        }
                    }
                    if (ishit) {
                        ishit = cue;
                        var ishit_tlitem = tl.items.find(tlitem => {
                            if (tlitem.cue.id == cue.id) return true;
                            return false;
                        });
                        if (ishit_tlitem) {
                            ishit_tlitem.startTime = cue.startTime;
                            ishit_tlitem.endTime = cue.endTime;
                            ishit_tlitem.text = text;
                            ishit_tlitem.classname = tl.cueCSSClass;
                            ishit_tlitem.cue = cue;
                        }
                    }
                }
            }
            
            
        }
        const cue_time_start_clicked = () => {
            var timestr = formatTimeString(vplayer.value.currentTime);
            myapp.value.rightpanel.editTimeline.cuestarttimef = vplayer.value.currentTime;
            myapp.value.rightpanel.editTimeline.cuestarttime = timestr;
        }
        const cue_time_end_clicked = () => {
            var timestr = formatTimeString(vplayer.value.currentTime);
            myapp.value.rightpanel.editTimeline.cueendtimef = vplayer.value.currentTime;
            myapp.value.rightpanel.editTimeline.cueendtime = timestr;
        }
        const teleport_active_cue = (item) => {
            const tl = myapp.value.rightpanel.editTimeline;

            vplayer.value.currentTime = item.cue.startTime;
        }

        //---footer===============================================
        const chk_videoloaded = Vue.computed(() => {
            if (vplayer.value == null) return true;
            return vplayer.value.currentSrc == "";
        });
        const ft_play = () => {
            if (vplayer.value.paused) {
                vplayer.value.play();
                myapp.value.bottompanel.icon_playbtn = "pause";
            }else {
                vplayer.value.pause();
                myapp.value.bottompanel.icon_playbtn = "play_circle";
            }
            
        }
        const ft_stop = () => {
            vplayer.value.pause();
            vplayer.value.currentTime = 0;
            myapp.value.bottompanel.icon_playbtn = "play_circle";
        }
        /*
        const ft_record = () => {
            //---reset position and stop
            vplayer.value.pause();
            vplayer.value.currentTime = 0;
            //---start record and play
            myapp.value.recording.machine.start();
            vplayer.value.play();
            is_rec = true;
            window.requestAnimationFrame(video_animation_step);
        }
        const ft_record_stop = () => {
            //---stop record and play
            //vplayer.value.pause();
            myapp.value.recording.machine.stop();
            is_rec = false;
        }
        const ft_record_download = () => {
            lnk_download.value.click();
        }
        */
        const vttfile_onchange = (evt) => {
            const tl = myapp.value.rightpanel.editTimeline;

            //console.log(evt);
            var fl = evt.target.files;
            if(fl.length == 0) return;

            var url = URL.createObjectURL(fl[0]);
            var html = getTrackHTML(myapp.value.rightpanel.editTrack.seltrack.value);
            if (html) {
                if (html.src != "") {
                    URL.revokeObjectURL(html.src);
                }
                if (html.track.cues) {
                    for (var i = html.track.cues.length-1; i >= 0; i--) {
                        html.track.removeCue(html.track.cues[i]);
                    }
                }
                tl.items.splice(0, tl.items.length);
                
                html.src = url;
                html.onload = (evt) => {
                    
                    for (var i = 0; i < evt.target.track.cues.length; i++) {
                        const cue = evt.target.track.cues[i];

                        var tcitem = new TrackCueItem();
                        cue.id = `${new Date().valueOf()}${i.toString()}`;
                        tcitem.startTime = cue.startTime;
                        tcitem.endTime = cue.endTime;
                        tcitem.text = cue.text;
                        tcitem.cue = cue;
                        tl.items.push(tcitem);
                    }
                    evt.target.track.mode = myapp.value.rightpanel.editTrack.track_mode;
                }
            }
        }
        //========================================================
        Vue.onBeforeMount(() => {
            var darktheme = sessionStorage.getItem("UseDarkTheme");
            if (darktheme) {
                if (darktheme == "1") {
                    Quasar.Dark.set(true);
                }else{
                    Quasar.Dark.set(false);
                }
            }
            var qloc = [
                loc.replace("-",""),    //en-US -> enUS
                loc.split("-")[0]       //en-US -> en
            ];
            var qlang = Quasar.lang[qloc[0]] || Quasar.lang[qloc[1]];
            if (qlang) {
                Quasar.lang.set(qlang);
            }else{
                Quasar.lang.set(Quasar.lang.enUS);
            }
        });
        Vue.onMounted(() => {
           vstyle = document.createElement("style");
           vstyle.id = "usercssmap";
           document.head.appendChild(vstyle); 
           //var shadow = document.body.attachShadow({"mode": "open"});
           //shadow.adoptedStyleSheets = [vsheet];
           vsheet = vstyle.sheet;
        });
        Vue.onBeforeUnmount(() => {
            
        });
        return {
            myapp,
            hidfile,vplayer,reccanvas,lnk_download,
            cmp_canUpload,
            
            //---header
            hidfile_onchange,
            updateFiles,
            open_fromapp,
            open_fromlocal,
            panel_clicked,

            //---video
            video_loadeddata,video_canplaythrough,
            video_seeking,video_played,video_paused,video_timeupdate,

            //---track
            tlb_track_add, tlb_track_del, track_list_onchange,
            tlb_track_save,

            //---cue
            new_cue,remove_cue,
            select_active_cue,
            teleport_active_cue,
            cue_add_clicked,cue_time_start_clicked,cue_time_end_clicked,

            //---css
            select_active_css,
            css_add_clicked,css_del_clicked,
            css_upload_clicked,css_file_onchange,css_download_onclick,

            //---footer
            chk_videoloaded,
            ft_play,ft_stop,tlb_track_openvtt,vttfile_onchange,
            //ft_record,ft_record_stop,ft_record_download,

            //---other
            cleanUp, upload_body, cancelFile,
            loadSetting,
            
            //---watch
            wa_seltrack, wa_track_mode,

            //---computed
            cmp_css_classlist,
        }
    }
});

const i18n = VueI18n.createI18n({
    locale : loc,
    //messages
});

app.use(Quasar, {
config: {
    /*
    brand: {
    // primary: '#e46262',
    // ... or all other brand colors
    },
    notify: {...}, // default set of options for Notify Quasar plugin
    loading: {...}, // default set of options for Loading Quasar plugin
    loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
    */
}
});
defineSetupLang(Quasar);

app.use(i18n);
//---Start app
app.mount('#q-app');
