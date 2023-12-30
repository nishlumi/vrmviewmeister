const QD_INOUT = {
    toUNITY : 0,
    returnJS : 1,
};
class queueData {
    /**
     * 
     * @param {Object} unityobject 
     * @param {String} key 
     * @param {QD_INOUT} io 
     * @param {Function} callback 
     * @param {Object} param
     */
    constructor(unityobject, key, io, callback, param) {
        if (unityobject == null) {
            this.unity = null;
        }else{
            this.unity = {
                target : "target" in unityobject ? unityobject["target"] : "",
                method : "method" in unityobject ? unityobject["method"] : "",
            };
            if ("param" in unityobject) this.unity["param"] = unityobject["param"];
        }

        this.inout = io;    //in, out, inout
        this.key = key;
        this.callback = callback;
        this.paramater = param;
    }
}
const AppQueue = {
    /**
     * @type {Array<queueData>}
     */
    list : [],
    fixedList : {},
    _current : null,
    canvas : null,
    subcanvas : null,
    isSub : false,
    isExecuting : false,
    unity : {
        Canvas : "Canvas",
        DLight : "Directional Light",
        Windzone : "WindZone",
        Camera : "Main Camera",
        XR : "WebXRCameraSet",
        Stage : "Stage",
        FileMenuCommands : "AnimateArea",
        OperateAvatarIK : "IKHandleParent",
        OperateActiveVRM : "IKHandleParent",
        ManageSystemEffect : "AnimateArea",
        ManageAnimation : "AnimateArea",
        AudioBGM : "BGM",
        AudioSE : "SE"
    },
    /**
     * 
     * @param {queueData} queue 
     */
    add : function (queue) {
        this.list.push(queue);
    },
    remove : function (index) {
        this.list.splice(index, 1);
    },
    current : function () {
        //if (this.list.length == 0) return null;
        //console.log(this.list[0]);
        return this.list[0];
    },
    /**
     * Start point of Queue
     * @returns 
     */
    subStart : function () {
        if (this.list.length == 0) return;
        if (!this.u2Instance) return;

        var first = this.list[0];
        if ("param" in first.unity) {
            this.subcanvas.SendMessage(first.unity.target,first.unity.method,first.unity.param);
        }else{
            this.subcanvas.SendMessage(first.unity.target,first.unity.method);
        }
        if (first.inout == QD_INOUT.toUNITY) {
            this.list.shift();
        }
    },
    performBody : function (first) {
        //console.log("--------------");
        //console.log("current target:",first.unity.target,"current function:",first.unity.method);
        if ("param" in first.unity) {
            if (this.isSub) {
                this.subcanvas.SendMessage(first.unity.target,first.unity.method,first.unity.param);
            }else{
                this.canvas.SendMessage(first.unity.target,first.unity.method,first.unity.param);
            }
        }else{
            if (this.isSub) {
                this.subcanvas.SendMessage(first.unity.target,first.unity.method);
            }else{
                this.canvas.SendMessage(first.unity.target,first.unity.method);
            }
        }
    },
    /**
     * Start point of Queue
     * @param {Boolean} isContinue 
     * @returns 
     */
    start : function (isContinue = false) {
        //if (this.list.length == 0) return;
        if (!this.canvas) return;
        if (this.isExecuting) return;
        this.isExecuting = true;

        var logmes = [];
        this.list.forEach(item  => {
            logmes.push(item.unity.target + "-" + item.unity.method);
        });
        AppDB.writeLog("cls_appque","info",logmes);


        //if (!isContinue) this._current = this.list.shift();

        try {
            var first = (this.list.length == 0) ? null : this.list[0];
            if (first) {
                this.performBody(first);
                if (first.inout == QD_INOUT.toUNITY) {
                    this.list.shift();
                    //---set next "current"
                    //first = this.list.shift();
                    this.next();
                }
            }else{
                this.isExecuting = false;
            }
        }catch(e) {
            console.error("appqueue start error:",e);
            AppDB.writeLog("appqueue.start","error",{err:e, data:first});
            this.isExecuting = false;
            //---remove 1st element 
            this.list.splice(0,1);
        }
    },
    next : function () {
        if (!this.canvas) return;

        try {
            var first = (this.list.length == 0) ? null : this.list[0];
            if (first) {
                this.performBody(first);
                if (first.inout == QD_INOUT.toUNITY) {
                    //---remove current queue
                    this.list.shift();
                    this.next();
                }
            }else{
                this.isExecuting = false;
            }
        }
        catch (e) {
            console.error("appqueue next error:",e,first);
            AppDB.writeLog("appqueue.next","error",{err:e, data:first});
            this.isExecuting = false;
            this.list.splice(0,1);
        }
        
    },
    /**
     * Continuous executing for Queue
     * @param {String} curkey current DB key
     * @param {queueData} queue
     * @param {*} value
     */
    execute : async function (curkey,queue,value) {
        var current = queue; //this.list[0];
        try {
            if (current) {
                //AppDB.temp.getItem(current.key)
                //.then(async item => {
                    if (curkey != current.key) return false;

                    //---call callback with item of IndexedDB
                    if (current && current.callback) {
                        if (current.paramater) {
                            await (current.callback)(value,current.paramater);
                        }else{
                            await (current.callback)(value);
                        }
                    }
                    //can add an AppQueue in callback
                    //---if queue has still data, consume this.
                    //------remove current queue.
                    if (this.list.length > 0) this._current = this.list.shift();
                    this.next();
                    //if (this.list.length == 0) this._current = null;
                    return true;
                //});
            }
            return false;
        }catch(e) {
            //---if found error in callback, clear all event and callback(rollback)
            console.log("appqueue execute error:",e,current);
            AppQueue.list.splice(0,AppQueue.list.length);
            this.isExecuting = false;
            AppDB.writeLog("appqueue.execute","error",{err:e, data:current});
        }

    },
    /**
     * Execute function called from Unity
     * @param {String} key 
     * @param {*} value
     */
    fixedExecute : async function (key,value) {
        var current = this.fixedList[key];
        try {
            if (current) {
                //---call callback with item of IndexedDB
                if (current.callback) {
                    if (current.paramater) {
                        (current.callback)(value,current.paramater);
                    }else{
                        (current.callback)(value);
                    }
                }
                /*
                AppDB.temp.getItem(key)
                .then(item => {
                    //---call callback with item of IndexedDB
                    if (current.callback) {
                        if (current.paramater) {
                            (current.callback)(item,current.paramater);
                        }else{
                            (current.callback)(item);
                        }
                    }
                });
                */
            }
        }catch(e) {
            AppDB.writeLog("appqueue.fixedExecute","error",{err:e, data:current});
        }

    },
    destroy : function () {

    },
    initialize : function(unity) {
        this.canvas = unity;
    }
};