import { ChildReturner } from "../../js/cls_childreturner.js";

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const cameraSelectList = document.getElementById('camera-select-list');
const mdcSelectElement = document.querySelector('.mdc-select');

// Button elements
const toggleCameraButton = document.getElementById('toggle-camera-button');
const shutterButton = document.getElementById('shutter-button');
const autoplayButton = document.getElementById('autoplay-button');
class PoseTracking {
    constructor() {
        this.elements = {
            controls: null,
            srcPicker: null,
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
            activeEffect: "mask",
            currentsrc: "video",
            result: null,
            is_recording: false,
        };
    }
}
const mediaapp = new PoseTracking();

let mdcSelect;
let camera = null;
let savedPose = null;
let lastResults = null;
let isCameraActive = false;

// --- Landmark Color Customization ---
const getLandmarkColor = (data) => {
    const landmarkIndex = data.index;
    // Based on MediaPipe Pose landmarks documentation
    const leftSideIndices = [1, 2, 3, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
    const rightSideIndices = [4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];

    if (leftSideIndices.includes(landmarkIndex)) {
        return '#0000FF'; // Blue for Left side
    } else if (rightSideIndices.includes(landmarkIndex)) {
        return '#00FF00'; // Green for Right side
    }
    // Default to Yellow for the center landmark (Nose, index 0)
    return '#FFFF00';
};

function onResults(results) {
    lastResults = results;
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
        }, 1000);

    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.poseLandmarks) {
        // Draw connections in Light Pink
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            { color: '#FFC0CB', lineWidth: 4 });
        // Draw landmarks with custom colors
        drawLandmarks(canvasCtx, results.poseLandmarks,
            {
                color: getLandmarkColor,
                lineWidth: 2,
                radius: 5 // Slightly larger radius to see colors better
            });
    }
    canvasCtx.restore();
}

const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});

pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

pose.onResults(onResults);

async function populateCameraList() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    cameraSelectList.innerHTML = '';
    if (videoDevices.length > 0) {
        videoDevices.forEach((device, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'mdc-list-item';
            listItem.setAttribute('data-value', device.deviceId);
            listItem.setAttribute('role', 'option');
            const listItemText = document.createElement('span');
            listItemText.className = 'mdc-list-item__text';
            listItemText.textContent = device.label || `Camera ${index + 1}`;
            listItem.appendChild(listItemText);
            cameraSelectList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement('li');
        listItem.className = 'mdc-list-item mdc-list-item--disabled';
        listItem.textContent = 'No cameras found';
        cameraSelectList.appendChild(listItem);
    }
}

async function startCamera(deviceId) {
    if (camera) {
        await camera.stop();
    }
    const cameraOptions = {
        onFrame: async () => {
            await pose.send({ image: videoElement });
        },
        width: 1280,
        height: 720,
    };
    if (deviceId) {
        cameraOptions.deviceId = deviceId;
    }
    camera = new Camera(videoElement, cameraOptions);
    await camera.start();
    isCameraActive = true;
    updateButtonStates();
}

async function stopCamera() {
    if (camera) {
        await camera.stop();
        camera = null;
    }
    isCameraActive = false;
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    updateButtonStates();
}

function updateButtonStates() {
    const label = toggleCameraButton.querySelector('.mdc-button__label');
    const icon = toggleCameraButton.querySelector('.material-icons');

    if (isCameraActive) {
        // Camera is running, so show STOP button (red)
        label.textContent = 'STOP CAMERA';
        icon.textContent = 'stop';
        toggleCameraButton.classList.remove('button-stop');
        toggleCameraButton.classList.add('button-start'); // .button-start is now red
    } else {
        // Camera is stopped, so show START button (green)
        label.textContent = 'START CAMERA';
        icon.textContent = 'play_arrow';
        toggleCameraButton.classList.remove('button-start');
        toggleCameraButton.classList.add('button-stop'); // .button-stop is now green
    }
    shutterButton.disabled = !isCameraActive;
    autoplayButton.disabled = !isCameraActive;
}

async function main() {
    new mdc.ripple.MDCRipple(toggleCameraButton);
    new mdc.ripple.MDCRipple(shutterButton);

    await populateCameraList();

    mdcSelect = new mdc.select.MDCSelect(mdcSelectElement);

    updateButtonStates();

    mdcSelect.listen('MDCSelect:change', () => {
        if (isCameraActive) {
            startCamera(mdcSelect.value);
        }
    });

    toggleCameraButton.addEventListener('click', () => {
        if (isCameraActive) {
            stopCamera();
        } else {
            if (mdcSelect.value) {
                startCamera(mdcSelect.value);
            }
        }
    });

    shutterButton.addEventListener('click', () => {
        if (lastResults && lastResults.poseLandmarks) {
            savedPose = lastResults.poseLandmarks;
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
            ID("aud01_capture").play();
            poseParentWindow();
        } else {
            console.log('No pose detected to save.');
        }
    });

    autoplayButton.addEventListener('click', () => {
        if (lastResults && lastResults.poseLandmarks) {
            savedPose = lastResults.poseLandmarks;
            mediaapp.states.is_recording = !mediaapp.states.is_recording;

            if (mediaapp.states.is_recording === true) {
                ID("btn_rec").querySelector("i").innerHTML = "stop";
                ID("aud01_capture").play();
            } else {
                ID("btn_rec").querySelector("i").innerHTML = "video_camera_front";
            }
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "mediapipe";
            js.funcName = "autoprepare_pose";
            js.data = JSON.stringify({ flag: mediaapp.states.is_recording });
            opener.postMessage(js);
        } else {
            console.log('No pose detected to save.');
        }
    });

    if (mdcSelect.items.length > 0 && !mdcSelect.items[0].disabled) {
        const firstDeviceId = mdcSelect.items[0].getAttribute('data-value');
        mdcSelect.setValue(firstDeviceId);
    }
}

main();
