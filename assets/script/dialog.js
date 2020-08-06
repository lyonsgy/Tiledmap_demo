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
        this.init([
            { role: 2, content: '大家好，我是魔王' },
            { role: 1, content: '大家好，我是勇者' }
        ])
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

    // update (dt) {},

    init (textDataArr) {
        this.textIndex = -1
        this.textDataArr = textDataArr
        this.node.active = true
        this.nextTextData()
    },
    nextTextData () {
        if (++this.textIndex < this.textDataArr.length) {
            // 还有对话没有显示
            this.setTextData(this.textDataArr[this.textIndex])
        } else {
            this.closeDialog()
        }
    },

    setTextData (textData) {
        this.nameLabel.string = roleMap[textData.role].name
        this.textLabel.string = textData.content
        cc.loader.loadRes(roleMap[textData.role].url, cc.SpriteFrame, (err, texture) => {
            this.picSprite.spriteFrame = texture
        })
    },

    closeDialog () {
        this.node.active = false
    }
});
