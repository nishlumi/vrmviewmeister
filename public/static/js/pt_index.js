
const controls = window;
const LandmarkGrid = window.LandmarkGrid;
const drawingUtils = window;
const mpPose = window;
var CAPP;

class PoseTracking {
    constructor() {
        this.elements = {
            video : ID("ivid"),
            canvas : ID("ocan"),
            controls : null,
            srcPicker : null,
            spinner : document.querySelector('.loading')
        }
        this.elements.spinner.ontransitionend = () => {
            this.elements.spinner.style.display = 'none';
        };
        this.ctx = this.elements.canvas.getContext("2d");
        this.pose = null;
        this.poseOptions = {
            selfieMode: true,
            modelComplexity: 0,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            effect: 'background',
        };
        this.states = {
            activeEffect : "mask",
            currentsrc : "video",
            result : null,
        }

        this.generate_ui();
    }
    generate_ui() {
        this.pose = new Pose({
            localteFile : (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
                //return `/static/lib/mediapipe/pose/${file}`;
            }
        });
        this.pose.onResults((results) => {
            document.body.classList.add('loaded');
            this.states.result = results;

            this.ctx.save();
            this.ctx.clearRect(0, 0, this.elements.canvas.window, this.elements.canvas.height);
            if (results.segmentationMask) {
                this.ctx.drawImage(results.segmentationMask, 0, 0, this.elements.canvas.width, this.elements.canvas.height);
                // Only overwrite existing pixels.
                if (this.states.activeEffect === 'mask' || this.states.activeEffect === 'both') {
                    this.ctx.globalCompositeOperation = 'source-in';
                    // This can be a color or a texture or whatever...
                    this.ctx.fillStyle = '#00FF007F';
                    this.ctx.fillRect(0, 0, this.elements.canvas.width, this.elements.canvas.height);
                }
                else {
                    this.ctx.globalCompositeOperation = 'source-out';
                    this.ctx.fillStyle = '#0000FF7F';
                    this.ctx.fillRect(0, 0, this.elements.canvas.width, this.elements.canvas.height);
                }
                // Only overwrite missing pixels.
                this.ctx.globalCompositeOperation = 'destination-atop';
                this.ctx.drawImage(results.image, 0, 0, this.elements.canvas.width, this.elements.canvas.height);
                this.ctx.globalCompositeOperation = 'source-over';
            }
            else {
                this.ctx.drawImage(results.image, 0, 0, this.elements.canvas.width, this.elements.canvas.height);
            }
            if (results.poseLandmarks) {
                drawingUtils.drawConnectors(this.ctx, results.poseLandmarks, mpPose.POSE_CONNECTIONS, { visibilityMin: 0.65, color: 'white' });
                drawingUtils.drawLandmarks(this.ctx, Object.values(mpPose.POSE_LANDMARKS_LEFT)
                    .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(255,138,0)' });
                drawingUtils.drawLandmarks(this.ctx, Object.values(mpPose.POSE_LANDMARKS_RIGHT)
                    .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)' });
                drawingUtils.drawLandmarks(this.ctx, Object.values(mpPose.POSE_LANDMARKS_NEUTRAL)
                    .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'white' });
            }
            this.ctx.restore();
            if (results.poseWorldLandmarks) {
                /*
                grid.updateLandmarks(results.poseWorldLandmarks, mpPose.POSE_CONNECTIONS, [
                  {list: Object.values(mpPose.POSE_LANDMARKS_LEFT), color: 'LEFT'},
                  {list: Object.values(mpPose.POSE_LANDMARKS_RIGHT), color: 'RIGHT'},
                ]);
                */
            }
            else {
                //grid.updateLandmarks([]);
            }
        });

        //---set up controls--------------------------------------------
        this.elements.srcPicker = new controls.SourcePicker({
            onSourceChanged: (name, type) => {
                // Resets because this model gives better results when reset between
                // source changes.
                this.states.currentsrc = type;
                this.pose.reset();
            },
            onFrame: async (input, size) => {
                const aspect = size.height / size.width;
                if (size.width > size.height) {
                    this.elements.canvas.classList.add("output_canvas");
                    this.elements.canvas.classList.remove("output_canvas_h");
        
                }else{
                    this.elements.canvas.classList.remove("output_canvas");
                    this.elements.canvas.classList.add("output_canvas_h");
        
                }
                let width, height;
                if (window.innerWidth > window.innerHeight) {
                    height = window.innerHeight;
                    width = height / aspect;
                }
                else {
                    width = window.innerWidth;
                    height = width * aspect;
                }
                this.elements.canvas.width = width;
                this.elements.canvas.height = height;
                await this.pose.send({ image: input });
            },
        });
        this.elements.controls = new controls
            .ControlPanel(ID("control-panel-area"), this.poseOptions)
        .add([
            this.elements.srcPicker,
            new controls.Toggle({ title: _T("selfie_mode"), field: 'selfieMode' }),
            new controls.Slider({
                title: _T("minDetectionConfidence"),
                field: 'minDetectionConfidence',
                range: [0, 1],
                step: 0.01
            }),
            new controls.Slider({
                title: _T("minTrackingConfidence"),
                field: 'minTrackingConfidence',
                range: [0, 1],
                step: 0.01
            }),
        ])
        .on(x => {
            this.poseOptions = x;
            this.elements.video.classList.toggle('selfie', this.poseOptions.selfieMode);
            this.states.activeEffect = x['effect'];
            this.pose.setOptions(this.poseOptions);
        });

        
        $("#sw_camera").switchbutton({
            label : "Camera",
            checked: true,
            onChange: (checked) => {
                //console.log(checked);
                if (this.states.currentsrc == "video") {
                    this.elements.srcPicker.m.getVideoTracks()[0].enabled = checked;
                }
            }
        });
        $("#btn_save_pose").on("click",(evt)=>{
            opener._REFMYAPP.returnPoseResult(this.states.result);
        });
        $("#btn_save_timer").on("click",(evt)=>{
            
            ID("shot_loadingIcon").classList.remove("common_ui_off");
            setTimeout(()=>{
                ID("aud01_capture").play();
                ID("shot_loadingIcon").classList.add("common_ui_off");
                opener._REFMYAPP.returnPoseResult(this.states.result);
            },parseInt(ID("num_timer").value)*1000);
        });
        /*
        $("#sw_selfiemode").switchbutton({
            checked: this.poseOptions.selfieMode,
            onChange: (checked) => {
                console.log(checked);
                this.poseOptions.selfieMode = checked;
                console.log(this.poseOptions);
                this.pose.setOptions(this.poseOptions);
                this.pose.reset();
            }
        });

        $("#slid_minDetecter").slider({
            min : 0.0,
            max : 1.0,
            step : 0.1,
            showTip : true,
            value : this.poseOptions.minDetectionConfidence,
            width : 150,
            onComplete : (newval, oldval) => {
                this.poseOptions.minDetectionConfidence = parseFloat(newval);
                console.log(this.poseOptions);
                this.pose.setOptions(this.poseOptions);
                this.pose.reset();
            }
        });
        $("#slid_minTracking").slider({
            min : 0.0,
            max : 1.0,
            step : 0.1,
            showTip : true,
            value : this.poseOptions.minTrackingConfidence,
            width : 150,
            onComplete : (newval, oldval) => {
                this.poseOptions.minTrackingConfidence = parseFloat(newval);
                console.log(this.poseOptions);
                this.pose.setOptions(this.poseOptions);
                this.pose.reset();
            }
        });
        */

        $("#tooldialog").dialog({
            width : "480",
            height : "320",
            top : 200,
            left : 500,
            title : "Tool",
            modal : false,
            collapsible : true,
            closable : false,
            closed : false
        });
    }
}

window.addEventListener('load', function () {
    setupLocale({})
    .then(res => {
        translate_UI();
        CAPP = new PoseTracking();
    });

});
window.addEventListener("beforeunload",function(e){

    return true;
});