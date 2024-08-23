export class VVMTMWebCam {
    constructor(width, height, flip = false) {
        this.width = width;
        this.height = height;
        this.flip = flip;
        /**
         * @type {HTMLVideoElement}
         */
        this.camera = null;
        /**
         * @type {HTMLCanvasElement}
         * 
         */
        this.canvas = null;
    }
    destroy() {
        
    }
    getWebcam(options) {
        if (!window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) {
            return Promise.reject('Your browser does not support WebRTC. Please try another one.');
        }
    
        options.width = 640;
        const videoOptions = (options);

        var video = document.getElementById("vvmwebcam-vid");
        if (!video) {
            video = document.createElement('video');
            video.id = "vvmwebcam-vid";
        }
        
        return window.navigator.mediaDevices.getUserMedia({ video: videoOptions })
        .then((mediaStream) => {
            video.srcObject = mediaStream;

            video.addEventListener('loadedmetadata', (event) => {
                const { videoWidth: vw, videoHeight: vh } = video;
                video.width = vw;
                video.height = vh;
            });

            return video;
        }, () => {
            return Promise.reject('Could not open your camera. You may have denied access.');
        });
    }
    async setup(options = {}) {
        
        
            this.camera = await this.getWebcam(options);

            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.id = "vvmwebcam-canvas";
                this.canvas.style.width = "100%";
                this.canvas.style.height = "100%";
                this.canvas.width = this.width;
                this.canvas.height = this.height;
            }
        
    }
    play() {
        const promise = this.camera.play();
        return promise;
    }

    pause() {
        this.camera.pause();
    }

    stop() {
        this.stopStreamedVideo(this.camera);
    }

    update() {
        this.renderCameraToCanvas();
    }
    async changeCamera(id) {
        if (id != "") {
            const mediaStream = await window.navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: id
                }
            });
            this.camera.srcObject = mediaStream;
            return true;
        }
        return false;
    }

    stopStreamedVideo(videoEl) {
        const stream = videoEl.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
            track.stop();
        });

        videoEl.srcObject = null;
    }
    cropTo( image, size,
        flipped = false) {
        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        // image image, bitmap, or canvas
        let width = image.width;
        let height = image.height;

        // if video element
        if (image instanceof HTMLVideoElement) {
            width = (image).videoWidth;
            height = (image).videoHeight;
        }

        const min = Math.min(width, height);
        const scale = size / min;
        const scaledW = Math.ceil(width * scale);
        const scaledH = Math.ceil(height * scale);
        const dx = scaledW - size;
        const dy = scaledH - size;
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, ~~(dx / 2) * -1, ~~(dy / 2) * -1, scaledW, scaledH);

        // canvas is already sized and cropped to center correctly
        if (flipped) {
            ctx.scale(-1, 1);
            ctx.drawImage(canvas, size * -1, 0);
        }

        return canvas;
    }

    renderCameraToCanvas() {
        if (this.canvas && this.camera) {
            const ctx = this.canvas.getContext('2d');

            if (this.camera.videoWidth !== 0) {
                const croppedCanvas = this.cropTo(this.camera, this.width, this.flip);
                ctx.drawImage(croppedCanvas, 0, 0);
            }
        }
    }
}