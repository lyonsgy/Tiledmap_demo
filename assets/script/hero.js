// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const Input = {}
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._speed = 200
        this.sp = cc.v2(0, 0)

        this.state = ''
        this.heroAni = this.node.getComponent(cc.Animation)

        cc.systemEvent.on('keydown', this.onKeyDown, this)
        cc.systemEvent.on('keyup', this.onKeyup, this)
    },

    setState (state) {
        if (this.state == state) return
        this.state = state
        this.heroAni.play(this.state)
    },

    start () {

    },

    update (dt) {
        if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
            console.log('向左')
            this.sp.x = -1
            // this.node.x -= this._speed * dt
        } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
            console.log('向右')
            this.sp.x = 1
            // this.node.x += this._speed * dt
        } else {
            this.sp.x = 0
        }
        if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up]) {
            console.log('向上')
            this.sp.y = 1
            // this.node.y += this._speed * dt
        } else if (Input[cc.macro.KEY.s] || Input[cc.macro.KEY.down]) {
            console.log('向下')
            this.sp.y = -1
            // this.node.y -= this._speed * dt
        } else {
            this.sp.y = 0
        }

        if (this.sp.x) {
            this.node.x += this.sp.x * this._speed * dt
        }
        if (this.sp.y) {
            this.node.y += this.sp.y * this._speed * dt
        } else {
            //
        }
        let state = ''
        if (this.sp.x == 1) {
            state = 'hero_right'
        } else if (this.sp.x == -1) {
            state = 'hero_left'
        } else if (this.sp.y == 1) {
            state = 'hero_up'
        } else if (this.sp.y == -1) {
            state = 'hero_down'
        }
        if (state) {
            this.setState(state)
        }
    },

    onKeyDown (e) {
        Input[e.keyCode] = 1
    },
    onKeyup (e) {
        Input[e.keyCode] = 0
    }
});
