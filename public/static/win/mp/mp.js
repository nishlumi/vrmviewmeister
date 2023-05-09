import { ChildReturner } from "../../js/cls_childreturner.js";


// Usage: testSupport({client?: string, os?: string}[])
// Client and os are regular expressions.
// See: https://cdn.jsdelivr.net/npm/device-detector-js@2.2.10/README.md for
// legal values for client and os


const controls = window;
const LandmarkGrid = window.LandmarkGrid;
const drawingUtils = window;
const mpPose = window;
const options = {
    locateFile: (file) => {
        //return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
};

// Our input frames will come from here.
const videoElement = document.getElementsByClassName(
    "input_video"
)[0];
const canvasElement = document.getElementsByClassName(
    "output_canvas"
)[0];
const controlsElement = document.getElementsByClassName(
    "control-panel"
)[0];
const canvasCtx = canvasElement.getContext("2d");


// Optimization: Turn off animated spinner after its hiding animation is done.
const spinner = document.querySelector(".loading");
spinner.ontransitionend = () => {
    spinner.style.display = "none";
};

const landmarkContainer = document.getElementsByClassName(
    "landmark-grid-container"
)[0];
const grid = new LandmarkGrid(landmarkContainer, {
    connectionColor: 0xcccccc,
    definedColors: [
        { name: "LEFT", value: 0xffa500 },
        { name: "RIGHT", value: 0x00ffff }
    ],
    range: 2,
    fitToGrid: true,
    labelSuffix: "m",
    landmarkSize: 2,
    numCellsPerAxis: 4,
    showHidden: true,
    centered: true
});

class PoseTracking {
    constructor() {
        this.elements = {
            controls : null,
            srcPicker : null,
        };
        this.ctx = null;
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
            is_recording : false,
        };
    }
}
const mediaapp = new PoseTracking();
let activeEffect = "mask";

function onResults(results) {
    // Hide the spinner.
    document.body.classList.add("loaded");

    mediaapp.states.result = results;

    if (mediaapp.states.is_recording === true) {
        setTimeout(() => {
            var retdata = {
                poseLandmarks: mediaapp.states.result.poseLandmarks,
                poseWorldLandmarks: mediaapp.states.result.poseWorldLandmarks
            };
            //console.log(retdata);
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "mediapipe";
            js.funcName = "autoapply_pose";
            js.data = JSON.stringify(retdata);
            
            opener.postMessage(js);
        },1000);
        
    }

    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.segmentationMask) {
        canvasCtx.drawImage(
            results.segmentationMask,
            0,
            0,
            canvasElement.width,
            canvasElement.height
        );

        // Only overwrite existing pixels.
        if (mediaapp.states.activeEffect === "mask" || mediaapp.states.activeEffect === "both") {
            canvasCtx.globalCompositeOperation = "source-in";
            // This can be a color or a texture or whatever...
            canvasCtx.fillStyle = "#00FF007F";
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        } else {
            canvasCtx.globalCompositeOperation = "source-out";
            canvasCtx.fillStyle = "#0000FF7F";
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        }

        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = "destination-atop";
        canvasCtx.drawImage(
            results.image,
            0,
            0,
            canvasElement.width,
            canvasElement.height
        );

        canvasCtx.globalCompositeOperation = "source-over";
    } else {
        canvasCtx.drawImage(
            results.image,
            0,
            0,
            canvasElement.width,
            canvasElement.height
        );
    }

    if (results.poseLandmarks) {
        drawingUtils.drawConnectors(
            canvasCtx,
            results.poseLandmarks,
            mpPose.POSE_CONNECTIONS,
            { visibilityMin: 0.65, color: "white" }
        );
        drawingUtils.drawLandmarks(
            canvasCtx,
            Object.values(mpPose.POSE_LANDMARKS_LEFT).map(
                (index) => results.poseLandmarks[index]
            ),
            { visibilityMin: 0.65, color: "white", fillColor: "rgb(255,138,0)" }
        );
        drawingUtils.drawLandmarks(
            canvasCtx,
            Object.values(mpPose.POSE_LANDMARKS_RIGHT).map(
                (index) => results.poseLandmarks[index]
            ),
            { visibilityMin: 0.65, color: "white", fillColor: "rgb(0,217,231)" }
        );
        drawingUtils.drawLandmarks(
            canvasCtx,
            Object.values(mpPose.POSE_LANDMARKS_NEUTRAL).map(
                (index) => results.poseLandmarks[index]
            ),
            { visibilityMin: 0.65, color: "white", fillColor: "white" }
        );
    }
    canvasCtx.restore();

    if (results.poseWorldLandmarks) {
        grid.updateLandmarks(results.poseWorldLandmarks, mpPose.POSE_CONNECTIONS, [
            { list: Object.values(mpPose.POSE_LANDMARKS_LEFT), color: "LEFT" },
            { list: Object.values(mpPose.POSE_LANDMARKS_RIGHT), color: "RIGHT" }
        ]);
    } else {
        grid.updateLandmarks([]);
    }
}

const pose = new mpPose.Pose(options);
pose.onResults(onResults);

// Present a control panel through which the user can manipulate the solution
// options.
new controls.ControlPanel(controlsElement, {
    selfieMode: false,
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.25,
    minTrackingConfidence: 0.25,
    effect: "background"
})
.add([
    new controls.Toggle({ title: "Selfie Mode", field: "selfieMode" }),
    new controls.SourcePicker({
        onSourceChanged: () => {
            // Resets because this model gives better results when reset between
            // source changes.
            pose.reset();
        },
        onFrame: async (input, size) => {
            const aspect = size.height / size.width;
            let width, height;
            if (window.innerWidth > window.innerHeight) {
                height = window.innerHeight;
                width = height / aspect;
            } else {
                width = window.innerWidth;
                height = width * aspect;
            }
            canvasElement.width = width;
            canvasElement.height = height;
            await pose.send({ image: input });
        }
    }),
    new controls.Toggle({
        title: "Smooth Landmarks",
        field: "smoothLandmarks"
    }),
    new controls.Slider({
        title: "Min Detection Confidence",
        field: "minDetectionConfidence",
        range: [0, 1],
        step: 0.01
    }),
    new controls.Slider({
        title: "Min Tracking Confidence",
        field: "minTrackingConfidence",
        range: [0, 1],
        step: 0.01
    }),
    new controls.Slider({
        title: "Effect",
        field: "effect",
        discrete: { background: "Background", mask: "Foreground" }
    })
])
.on((x) => {
    const options = x;
    videoElement.classList.toggle("selfie", options.selfieMode);
    activeEffect = (x)["effect"];
    pose.setOptions(options);
});

ID("btn_shot").addEventListener("click",(evt)=>{
    var poseParentWindow = () => {
        var retdata = {
            poseLandmarks: mediaapp.states.result.poseLandmarks,
            poseWorldLandmarks: mediaapp.states.result.poseWorldLandmarks
        };
        console.log(retdata);
        var js = new ChildReturner();
        js.origin = location.origin;
        js.windowName = "mediapipe";
        js.funcName = "apply_pose";
        js.data = JSON.stringify(retdata);
        opener.postMessage(js);
    }
    console.log(mediaapp.states.result);
    var timer = parseInt(ID("num_timer").value);
    if (isNaN(timer)) return;
    if (timer > 0) {
        ID("shot_loadingIcon").classList.remove("common_ui_off");
        setTimeout(() => {
            ID("aud01_capture").play();
            ID("shot_loadingIcon").classList.add("common_ui_off");
            poseParentWindow();
        }, timer * 1000);
    }else{
        ID("aud01_capture").play();
        poseParentWindow();
    } 
});
ID("btn_rec").addEventListener("click",(evt)=>{
    mediaapp.states.is_recording = !mediaapp.states.is_recording;

    if (mediaapp.states.is_recording === true) {
        ID("btn_rec").querySelector("i").innerHTML = "stop";
        ID("aud01_capture").play();
    }else{
        ID("btn_rec").querySelector("i").innerHTML = "video_camera_front";
    }
    
});

/*
ID("btn_rightmenu").addEventListener("click",(evt) => {
    ID("lm-grid").classList.toggle("common_ui_off");
})
*/