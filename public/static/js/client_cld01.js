
class VVChildObjectList {
    constructor(parent) {
        this.parentWindow = parent;
        /**
         * @type {VRMView}
         */
        this.parentApp = this.parentWindow.MYAPP;
    }
    generate_ui() {
        //---left UI----------------------================
        $("#leftObjectCondition").combobox({
            width : "100%",
            data : [
                {id:AF_TARGETTYPE.Unknown, text:"All Objects",selected:true},
                {id:AF_TARGETTYPE.VRM, text:"VRM"},
                {id:AF_TARGETTYPE.OtherObject, text:"Other Object"},
                {id:AF_TARGETTYPE.Light, text:"Light"},
                {id:AF_TARGETTYPE.Camera, text:"Camera"},
                {id:AF_TARGETTYPE.Text, text:"Text UI"},
                {id:AF_TARGETTYPE.Image, text:"Image Object"},
                {id:AF_TARGETTYPE.UImage, text:"Image UI"},
                {id:AF_TARGETTYPE.Audio, text:"Audio"},
                {id:AF_TARGETTYPE.Effect, text:"Effect"},
            ],
            textField : "text",
            valueField : "id",
            onChange : (newval,oldval) => {
                this.filter_objectList(newval);
            }
        });
    }
    generate_carditem(rowData,is_NoHitEvent) {
        var html = GEN("div");
        html.classList.add("cardview-grid-item");

        html.onclick = function (evt) {
            MYAPP.deselect_objectItem();
            if (evt.target.classList.contains("cardview-grid-item")) {
                evt.target.classList.add("cardview-grid-item-selected");
            }else{
                var parent = evt.target.parentElement;
                while (parent.tagName.toLowerCase() != "body") {
                    if (parent.classList.contains("cardview-grid-item")) {
                        parent.classList.add("cardview-grid-item-selected");
                        //MYAPP.setEventName("activateandlistface");
                        //MYAPP.continueEvent(false);
                        //MYAPP.callUnityIKParent("ActivateAvatarFromOuter", parent.getAttribute("data-id"));
                        AppQueue.add(new queueData(
                            {target:AppQueue.unity.OperateActiveVRM,method:'ActivateAvatarFromOuter',param:parent.getAttribute("data-id")},
                            "",QD_INOUT.toUNITY,
                            null
                        ));
                        AppQueue.start();


                        MYAPP.select_objectItem(parent.getAttribute("data-id"));
                        break;
                    }else{
                        parent = parent.parentElement;
                    }
                }
            }
        }
        html.oncontextmenu = function (evt) {
            evt.preventDefault();
            $("#mm_objlistmenu").menu("show",{
                left : evt.pageX,
                top : evt.pageY,
            });
        }

        //html.push(`<td colspan=${fields.length} style="height:72px;padding:10px 5px;border:0;">`);

        var div = document.createElement("div");
        div.classList.add("cardview-in-grid");

        if ("title" in rowData) {
            html.setAttribute("data-title",rowData["title"]);
            html.setAttribute("data-objtype",rowData["type"]);
            html.setAttribute("data-id",rowData["id"]);

            var img = document.createElement("img");
            //if (rowData["type"] == "VRM") {
                img.src = rowData["thumbnail"];
            //}
            img.width = "64";
            img.height = "64";
            img.classList.add("avatar");

            var stype = document.createElement("span");
            stype.classList.add("avatartype");

            for (var obj in AF_TARGETTYPE) {
                if (AF_TARGETTYPE[obj] == rowData["type"]) {
                    stype.textContent = obj;
                }
            }
            //stype.textContent = rowData["type"];

            var btitle = document.createElement("b");
            btitle.textContent = rowData["title"];
            btitle.classList.add("cardview-columns-base");

            div.appendChild(img);
            div.appendChild(stype);
            div.appendChild(btitle);

            if (rowData["type"] == "VRM") {
                var pver = document.createElement("span");
                pver.textContent = `Ver: ${rowData["version"]}`;
                pver.classList.add("cardview-columns-base");

                var pauthor = document.createElement("span");
                pauthor.textContent = `By: ${rowData["author"]}`;
                pauthor.classList.add("cardview-columns-base");

                div.appendChild(pver);
                div.append(pauthor);
            }
            
            html.appendChild(div);
        }
        return html;
    }
    load_parentCardItems() {
        var vrms = this.parentApp.data.vrms;
        for (var i = 0; i < vrms.length; i++) {
            this.generate_carditem(vrms);
        }
    }

    //---object list =================================================
    select_objectItem(name) {
        var elms = ID("leftObjectList").querySelectorAll(".cardview-grid-item");
        for (var i = 0; i < elms.length; i++) {
            var elmtitle = elms[i].getAttribute("data-id");
            if (elmtitle == name) {
                elms[i].classList.add("cardview-grid-item-selected");
                var vsel = this.getSelected_objectItem();
                this.states.selectedAvatar = vsel.avatar;


                //---setup each panel: turn on/off panel, enumerate avatar's BlendShapes, equipList
                AppQueue.add(new queueData(
                    {target:vsel.avatar.id,method:'GetPositionFromOuter'},
                    "getpositionprop",QD_INOUT.returnJS,
                    this.callbackDB.getpositionprop
                ));
                AppQueue.add(new queueData(
                    {target:vsel.avatar.id,method:'GetRotationFromOuter'},
                    "getrotationprop",QD_INOUT.returnJS,
                    this.callbackDB.getrotationprop
                ));

                if (
                    (vsel.avatar.type == AF_TARGETTYPE.Text) || 
                    (vsel.avatar.type == AF_TARGETTYPE.UImage)
                ) {
                    AppQueue.add(new queueData(
                        {target:vsel.avatar.id,method:'GetSizeFromOuter'},
                        "getscaleprop",QD_INOUT.returnJS,
                        this.callbackDB.getscaleprop
                    ));
                    AppQueue.add(new queueData(
                        {target:vsel.avatar.id,method:'GetScaleFromOuter'},
                        "get2Dscaleprop",QD_INOUT.returnJS,
                        this.callbackDB.get2Dscaleprop
                    ));
                }else if (vsel.avatar.type == AF_TARGETTYPE.SystemEffect) {

                }else{
                    AppQueue.add(new queueData(
                        {target:vsel.avatar.id,method:'GetScale'},
                        "getscaleprop",QD_INOUT.returnJS,
                        this.callbackDB.getscaleprop
                    ));

                }
                    
                if (vsel.avatar.type == AF_TARGETTYPE.VRM) {
                    this.mixins.methods.listupHandArmPanel(vsel.avatar);
                    this.mixins.methods.listupBlendShapes(vsel.avatar);
                    this.listupEquipList(vsel.avatar);
                }
                /*else if (vsel.avatar.type == AF_TARGETTYPE.OtherObject) {
                    ID("slid_other_animation_seek").max = vsel.avatar.animations.length;
                    ID("slid_other_animation_seek").value = 0;
                    //this.setEventName("isplayanima_oth");
                    //this.continueEvent(true);
                    //this.callUnitySpecify(vsel.avatar.id,"IsPlayingAnimation");
                    AppQueue.add(new queueData(
                        {target:vsel.avatar.id,method:'IsPlayingAnimation'},
                        "isplayanima_oth",QD_INOUT.returnJS,
                        this.callbackDB.isplayanima_oth
                    ));
                    AppQueue.add(new queueData(
                        {target:vsel.avatar.id,method:'GetSeekPosAnimation',param:1},
                        "getseek4oth",QD_INOUT.returnJS,
                        this.callbackDB.getseek4oth
                    ));
                    
                    this.data.vrms.forEach(item => {
                        var ret = item.isEquipping(vsel.avatar);
                        if (ret.avatar != null) {
                            ID("txt_oth_equippedAvatar").textContent = ret.avatar.title;
                            ID("txt_oth_equippedParts").textContent = _T(GetEnumName(CNS_BODYBONES,ret.parts));
                        }
                    });
                }*/
                this.getUnityData_EachObject(vsel.avatar.type);
                AppQueue.start();

                this.judge_accordion(vsel.avatar.type);
                this.toggleUIStates(vsel.avatar.type,true);
            }
        }
    }
    deselect_objectItem() {
        var elms = ID("leftObjectList").querySelectorAll(".cardview-grid-item-selected");
        for (var i = 0; i < elms.length; i++) {
            elms[i].classList.remove("cardview-grid-item-selected");
            this.states.selectedAvatar = null;
        }
    }
    add_objectItem(type,json) {
        
        var it = new VVAvatar(type,json);
        this.data.vrms.push(it);

        var html = this.generate_carditem(it);
        ID("leftObjectList").appendChild(html);

        /*
        this.elements.objectgrid.datagrid("appendRow",{
            id : it.id,
            type : it.type,
            title : it.title,
            thumbnail : it.thumbnail,
            original : it
        });
        */

        this.elements.timeline.appendTimeline(it);

        return it;
    }
    /**
     * 
     * @param {String} type 
     * @param {VVAvatar} avatar 
     * @return {VVAvatar}
     */
    add_objectItemVRM(type,avatar) {
        this.data.vrms.push(avatar);

        var html = this.generate_carditem(avatar);
        ID("leftObjectList").appendChild(html);
        /*
        this.elements.objectgrid.datagrid("appendRow",{
            id : avatar.id,
            type : avatar.type,
            title : avatar.title,
            thumbnail : avatar.thumbnail,
            original : avatar
        });
        */

        this.elements.timeline.appendTimeline(avatar);
    }
    /**
     * 
     * @returns {VVSelectedObjectItem}
     */
    getSelected_objectItem() {
        var elem = ID("leftObjectList").querySelector(".cardview-grid-item-selected");
        if (elem) {
            var id = elem.getAttribute("data-id");
            for (var i = 0; i < this.data.vrms.length; i++) {
                if (this.data.vrms[i].id == id) {
                    return new VVSelectedObjectItem(i,this.data.vrms[i],elem);
                }
            }
        }else{
            return null;
        }
        
    }
    del_objectItem(avatar) {
        var  ret = false;
        var elem = ID("leftObjectList").querySelector(".cardview-grid-item-selected");
        if (elem) {
            //var id = elem.getAttribute("data-id");
            for (var i = 0; i < this.data.vrms.length; i++) {
                if (this.data.vrms[i].id == avatar.id) {
                    this.data.vrms.splice(i,1);
                    elem.remove();
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    }
}

var cApp;
$(document).ready(function () {
    cApp = new VVChildObjectList(opener);

    
});