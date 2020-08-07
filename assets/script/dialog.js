// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let roleMap = {
    1: { name: '勇者', url: 'role/hero' },
    2: { name: '骷髅王', url: 'role/npc' }
}

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
        picSprite: cc.Sprite,
        nameLabel: cc.Label,
        textLabel: cc.Label,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.dialog = this.node
        // 键盘控制对话
        cc.systemEvent.on('keydown', this.onKeyDown, this)
    },
    onDestroy () {
        cc.systemEvent.off('keydown', this.onKeyDown, this)
    },
    onKeyDown (e) {
        switch (e.keyCode) {
            case cc.macro.KEY.space: {
                this.nextTextData()
                break
            }
            default:
                break
        }
    },
    start () {

    },

    update (dt) {
        if (!this.nowText) return
        this.tt += dt
        if (this.tt >= 0.1) {
            if (this.textLabel.string.length < this.nowText.length) { // 逐行播放
                this.textLabel.string = this.nowText.slice(0, this.textLabel.string.length + 1)
            } else { // 播放完毕
                this.textEnd = true
                this.nowText = null
            }
            this.tt = 0
        }
    },

    init (textDataArr) {
        this.nowText = null  // 当前播放文字
        this.textEnd = true  // 是否播放完毕
        this.tt = 0   //播放总时长

        this.textIndex = -1
        this.textDataArr = textDataArr
        this.node.active = true
        this.nextTextData()
    },
    nextTextData () {
        if (!this.textEnd) return // 上一段对话没结束时不能进入下一段对话
        if (++this.textIndex < this.textDataArr.length) {
            // 还有对话没有显示
            this.setTextData(this.textDataArr[this.textIndex])
        } else {
            this.closeDialog()
        }
    },

    setTextData (textData) {
        if (!this.textEnd) return
        this.textEnd = false

        this.nameLabel.string = roleMap[textData.role].name
        this.textLabel.string = ''
        this.nowText = textData.content

        cc.loader.loadRes(roleMap[textData.role].url, cc.SpriteFrame, (err, texture) => {
            this.picSprite.spriteFrame = texture
        })
    },

    closeDialog () {
        this.node.active = false
    }
});
