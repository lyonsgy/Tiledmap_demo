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
        speed: 200
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.speed = 400
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
        if (window.dialog && window.dialog.active) return

        // 左右移动
        if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
            this.sp.x = -1
        } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
            this.sp.x = 1
        } else {
            this.sp.x = 0
        }
        // 上下移动
        if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up]) {
            this.sp.y = 1
        } else if (Input[cc.macro.KEY.s] || Input[cc.macro.KEY.down]) {
            this.sp.y = -1
        } else {
            this.sp.y = 0
        }

        // 利用物理引擎控制移动
        // 拿到 hero 当前的速度
        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity

        if (this.sp.x) {
            this.lv.y = 0
            this.lv.x = this.sp.x * this.speed
        } else if (this.sp.y) {
            this.lv.x = 0
            this.lv.y = this.sp.y * this.speed
        } else {
            this.lv.x = this.lv.y = 0
        }

        this.node.getComponent(cc.RigidBody).linearVelocity = this.lv

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

        if (e.keyCode === cc.macro.KEY.space) {
            let w_pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0)) // 玩家当前位置的偏移量(自己坐标系)
            console.log(w_pos.x, w_pos.y)
        }
    },
    onKeyup (e) {
        Input[e.keyCode] = 0
    },
    // 碰撞回调试信息
    onCollisionEnter (other, self) {
        if (other.node.group === 'smog') { // 如果英雄视野的碰撞组件碰到的物体是 smog，才消除该物体
            other.node.active = false
            other.node.getComponent(cc.TiledTile).gid = 0
        }
    }
});
