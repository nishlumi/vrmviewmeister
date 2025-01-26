class UnityVector3 {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor (x, y, z) {
        if (typeof(x) == "number") {
            this.x = x ? x : 0;
            this.y = y ? y : 0;
            this.z = z ? z : 0;
        }else{
            var vec = x;
            this.x = "x" in vec ? vec.x : 0;
            this.y = "y" in vec ? vec.y : 0;
            this.z = "z" in vec ? vec.z : 0;    
        }
    }
}

class EasySelectRow {
    constructor(posIndex) {
        /**
         * @type {Number}
         */
        this.posture = posIndex;
        /**
         * @type {String}
         */
        this.name = "";
        /**
         * @type {String}
         */
        this.lang = "";

        /**
         * @type {Boolean}
         */
        this.useTPose = false;
        /**
         * @type { {parts: String, transform: String, axis: String, expression : String}[]}
         */
        this.calclist = [];

    }
}
class EasySelectList {
    constructor() {
        this.arealist = [
        ];
    }
}