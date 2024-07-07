export class InputManageCallback {
    constructor(useKey, useLeftSthick, useRightStick, evt) {
        this.keyName = useKey;
        this.usingLeftStick = useLeftSthick;
        this.usingRightStick = useRightStick;
        this.event = evt;
    }
    /**
     * 
     * @param {GamePad} gamepad 
     */
    hitCheck(gamepad) {
        for (var obj in gamepad.input.keys) {
            if (obj in this.keyName) {
                if (gamepad.input.keys[obj] === true) {
                    if (gamepad.input.keys[obj] == this.keyName[obj]) {
                        (this.event)();
                        break;
                    }
                }
            }
        }
        if (this.usingLeftStick === true) {
            if (gamepad.isUsingStick.left === true) {
                (this.event)(gamepad.values.leftStick);
            }
        }
        if (this.usingRightStick === true) {
            if (gamepad.isUsingStick.right === true) {
                (this.event)(gamepad.values.rightStick);
            }
        }
    }
};
export class InputManager {
    constructor() {
        this.enabled = true;
        //方向入力チェック用定数
        this.keyDirections = {
            UP: 1,
            UP_RIGHT: 3,
            RIGHT: 2,
            DOWN_RIGHT: 6,
            DOWN: 4,
            DOWN_LEFT: 12,
            LEFT: 8,
            UP_LEFT: 9,
        };
        //キーの状態管理定数
        this.keyStatus = {
            HOLD: 2,
            DOWN: 1,
            UNDOWN: 0,
            RELEASE: -1,
        };
        //キーの状態管理用変数
        this.input = {
            //入力されたキーのチェック用
            keys: {
                Up: false,
                Right: false,
                Down: false,
                Left: false,
                A: false,
                B: false,
                X: false,
                Y: false,
                L1: false,
                L2: false,
                R1: false,
                R2: false,
                Start: false,
                Select: false,
            },
            //一つ前のキーの状態管理用
            keysPrev: {
                Up: false,
                Right: false,
                Down: false,
                Left: false,
                A: false,
                B: false,
                X: false,
                Y: false,
                L1: false,
                L2: false,
                R1: false,
                R2: false,
                Start: false,
                Select: false,
            },
        };
        this.Config = {
            Keys: { //キーボード入力
                Up: "w",
                Right: "d",
                Down: "s",
                Left: "a",
                A: "n",
                B: "m",
                Start: "Enter"
            },
        };

        /**
         * @type {InputManageCallback[]}
         */
        this.callbacks = [];

        //スマホ・タブレットの時だけv-pad表示
        //if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
        //    this.vpad = new Vpad(this.input);
        //}

        //ゲームパッド
        this.gamePad = new GamePad(this.input);
        //ゲームパッド接続時のイベント
        addEventListener("gamepadconnected", (e) => {
            this.gamePad.connected();
            //バーチャルパッドがあったら(モバイルなら)非表示
            if (this.vpad) {
                this.vpad.pad.style.display = "none";
            }
        });
        //ゲームパッド切断時のイベント
        addEventListener("gamepaddisconnected", (e) => {
            this.gamePad.disconnected();
            //バーチャルパッドがあったら(モバイルなら)表示
            if (this.vpad) {
                this.vpad.pad.style.display = "block";
            }
        });

        /*
        //キーを押した時
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case this.Config.Keys.Up:
                    this.input.keys.Up = true;
                    break;
                case this.Config.Keys.Down:
                    this.input.keys.Down = true;
                    break;
                case this.Config.Keys.Right:
                    this.input.keys.Right = true;
                    break;
                case this.Config.Keys.Left:
                    this.input.keys.Left = true;
                    break;
                case this.Config.Keys.A:
                    this.input.keys.A = true;
                    break;
                case this.Config.Keys.B:
                    this.input.keys.B = true;
                    break;
                case this.Config.Keys.Start:
                    this.input.keys.Start = true;
                    break;
            }
        });

        //キーを離したとき
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case this.Config.Keys.Up:
                    this.input.keys.Up = false;
                    break;
                case this.Config.Keys.Down:
                    this.input.keys.Down = false;
                    break;
                case this.Config.Keys.Right:
                    this.input.keys.Right = false;
                    break;
                case this.Config.Keys.Left:
                    this.input.keys.Left = false;
                    break;
                case this.Config.Keys.A:
                    this.input.keys.A = false;
                    break;
                case this.Config.Keys.B:
                    this.input.keys.B = false;
                    break;
                case this.Config.Keys.Start:
                    this.input.keys.Start = false;
                    break;
            }
        });
        */
    }

    //方向キー入力チェック
    checkDirection() {
        let direction = 0;//初期化
        if (this.input.keys.Up) {
            direction += this.keyDirections.UP;
        }
        if (this.input.keys.Right) {
            direction += this.keyDirections.RIGHT;
        }
        if (this.input.keys.Down) {
            direction += this.keyDirections.DOWN;
        }
        if (this.input.keys.Left) {
            direction += this.keyDirections.LEFT;
        }
        return direction;
    }

    //ボタンの入力状態をチェックして返す
    checkButton(key) {
        if (this.input.keys[key]) {
            if (this.input.keysPrev[key] == false) {
                this.input.keysPrev[key] = true;
                return this.keyStatus.DOWN;//押されたとき
            }
            return this.keyStatus.HOLD;//押しっぱなし
        } else {
            if (this.input.keysPrev[key] == true) {
                this.input.keysPrev[key] = false;
                return this.keyStatus.RELEASE;//ボタンを離した時
            }
            return this.keyStatus.UNDOWN;//押されていない
        }
    }
    update () {
        if (this.enabled) {
            this.gamePad.update();
            for (var i = 0; i < this.callbacks.length; i++) {
                this.callbacks[i].hitCheck(this.gamePad);
            }
        }
        
    }
}


//ゲームパッドクラス
export class GamePad {
    constructor(input) {
        this.input = input;
        this.isConnected = false;
        this.isStickUsing = false;
        this.isUsingStick = {
            left : false,
            right : false,
        };

        this.stickLimit = {
            min : -0.001,
            max : 0.001
        };

        this.values = {
            leftStick : {
                x : 0,
                y : 0
            },
            rightStick : {
                x : 0,
                y : 0
            },
            dPad : {
                x : 0,
                y : 0
            }
        };
    }
    connected() {
        this.isConnected = true;
    }
    disconnected() {
        this.isConnected = false;
    }
    update() {
        if (!this.isConnected) return;
        const input = this.input;
        /**
         * @type {Gamepad}
         */
        const pads = navigator.getGamepads();

        const sticks = pads[0].axes;
        
        //---left stick
        this.values.leftStick.x = sticks[0] * 0.5;
        this.values.leftStick.y = sticks[1] * 0.5;
        if (
            ((this.stickLimit.min > sticks[0]) || (sticks[0] > this.stickLimit.max) ) 
            || 
            ((this.stickLimit.min > sticks[1]) || (sticks[1] > this.stickLimit.max)) 
        ) {
            this.isUsingStick.left = true;
        }else{
            this.isUsingStick.left = false;
        }
        //X軸
        /*
        if (sticks[0] > this.stickLimit) {
            input.keys.Right = true;
            this.isUsingStick.left = true;
            //this.values.leftStick.x = sticks[0];
        } else if (this.isUsingStick.left) {
            input.keys.Right = false;
            this.isUsingStick.left = false;
            this.values.leftStick.x = 0;
        }
        if (sticks[0] < (-1 * this.stickLimit)) {
            input.keys.Left = true;
            this.isUsingStick.left = true;
            //this.values.leftStick.x = sticks[0];
        } else if (this.isUsingStick.left) {
            input.keys.Left = false;
            this.isUsingStick.left = false;
            this.values.leftStick.x = 0;
        }
        //Y軸
        if (sticks[1] > this.stickLimit) {
            input.keys.Down = true;
            this.isUsingStick.left = true;
            //this.values.leftStick.y = sticks[1];
        } else if (this.isUsingStick.left) {
            input.keys.Down = false;
            this.isUsingStick.left = false;
            this.values.leftStick.y = 0;
        }
        if (sticks[1] < (-1 * this.stickLimit)) {
            input.keys.Up = true;
            this.isUsingStick.left = true;
            //this.values.leftStick.y = sticks[1];
        } else if (this.isUsingStick.left) {
            input.keys.Up = false;
            this.isUsingStick.left = false;
            this.values.leftStick.y = 0;
        }*/

        //---right stick
        this.values.rightStick.x = sticks[2] * 0.5;
        this.values.rightStick.y = sticks[3] * 0.5;
        if (
            ((this.stickLimit.min > sticks[2]) || (sticks[2] > this.stickLimit.max) ) 
            || 
            ((this.stickLimit.min > sticks[3]) || (sticks[3] > this.stickLimit.max)) 
        ) {
            this.isUsingStick.right = true;
        }else{
            this.isUsingStick.right = false;
        }
        //X軸
        /*
        if (sticks[2] > this.stickLimit) {
            input.keys.Right = true;
            this.isUsingStick.right = true;
            //this.values.rightStick.x = sticks[2];
        } else if (this.isUsingStick.right) {
            input.keys.Right = false;
            this.isUsingStick.right = false;
            this.values.rightStick.x = 0;
        }
        if (sticks[2] < (-1 * this.stickLimit)) {
            input.keys.Left = true;
            this.isUsingStick.right = true;
            //this.values.rightStick.x = sticks[2];
        } else if (this.isUsingStick.right) {
            input.keys.Left = false;
            this.isUsingStick.right = false;
            this.values.rightStick.x = 0;
        }
        //Y軸
        if (sticks[3] > this.stickLimit) {
            input.keys.Down = true;
            this.isUsingStick.right = true;
            //this.values.rightStick.y = sticks[3];
        } else if (this.isUsingStick.right) {
            input.keys.Down = false;
            this.isUsingStick.right = false;
            this.values.rightStick.y = 0;
        }
        if (sticks[3] < (-1 * this.stickLimit)) {
            input.keys.Up = true;
            this.isUsingStick.right = true;
            //this.values.rightStick.y = sticks[3];
        } else if (this.isUsingStick.right) {
            input.keys.Up = false;
            this.isUsingStick.right = false;
            this.values.rightStick.y = 0;
        }*/

        const buttons = pads[0].buttons;
        //上
        if (buttons[12].pressed) {
            input.keys.Up = true;
            this.isStickUsing = false;
            this.values.dPad.y = 1;
        } else if (!this.isStickUsing) {
            input.keys.Up = false;
            this.values.dPad.y = 0;
        }
        //下
        if (buttons[13].pressed) {
            input.keys.Down = true;
            this.isStickUsing = false;
            this.values.dPad.y = -1;
        } else if (!this.isStickUsing) {
            input.keys.Down = false;
            this.values.dPad.y = 0;
        }
        //左
        if (buttons[14].pressed) {
            input.keys.Left = true;
            this.isStickUsing = false;
            this.values.dPad.x = -1;
        } else if (!this.isStickUsing) {
            input.keys.Left = false;
            this.values.dPad.x = 0;
        }
        //右
        if (buttons[15].pressed) {
            input.keys.Right = true;
            this.isStickUsing = false;
            this.values.dPad.x = 1;
        } else if (!this.isStickUsing) {
            input.keys.Right = false;
            this.values.dPad.x = 0;
        }
        //スタート
        if (buttons[9].pressed) {
            input.keys.Start = true;
        } else {
            input.keys.Start = false;
        }
        //セレクト
        if (buttons[8].pressed) {
            input.keys.Select = true;
        } else {
            input.keys.Select = false;
        }
        //A
        if (buttons[0].pressed) {
            input.keys.A = true;
        } else {
            input.keys.A = false;
        }
        //B
        if (buttons[1].pressed) {
            input.keys.B = true;
        } else {
            input.keys.B = false;
        }
        //X
        if (buttons[2].pressed) {
            input.keys.X = true;
        } else {
            input.keys.X = false;
        }
        //Y
        if (buttons[3].pressed) {
            input.keys.Y = true;
        } else {
            input.keys.Y = false;
        }
        //L1
        if (buttons[4].pressed) {
            input.keys.L1 = true;
        } else {
            input.keys.L1 = false;
        }
        //L2
        if (buttons[6].pressed) {
            input.keys.L2 = true;
        } else {
            input.keys.L2 = false;
        }
        //R1
        if (buttons[5].pressed) {
            input.keys.R1 = true;
        } else {
            input.keys.R1 = false;
        }
        //R2
        if (buttons[7].pressed) {
            input.keys.R2 = true;
        } else {
            input.keys.R2 = false;
        }
        //console.log("input keys=",this.input.keys);
        //console.log("stick input=",this.values);
        //console.log("---");
    }
}