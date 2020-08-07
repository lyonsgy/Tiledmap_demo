// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        is_debug: false,
        gravity: cc.v2(0, 0), // 系统默认
        mapNode: cc.Node,
        dialogNode: cc.Node,
        loadNode: cc.Node,
        smog_enabled: true
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let p = cc.director.getPhysicsManager()
        p.enabled = true
        // 独立的形状，打开一个调试区域，游戏图像的逻辑区域
        // 开始调试
        if (this.is_debug) { // 开启调试信息
            let Bits = cc.PhysicsManager.DrawBits // 这个是我们要显示的类型
            p.debugDrawFlags = Bits.e_jointBit | Bits.e_shapeBit
        } else { // 关闭调试信息
            p.debugDrawFlags = 0
        }
        // 重力加速度配置
        p.gravity = this.gravity

        // 打开碰撞设置
        cc.director.getCollisionManager().enabled = true
        cc.director.getCollisionManager().enabledDebugDraw = this.is_debug

        // 显示 loading 层
        this.loadNode.active = true

        // 地图名称数组
        let mapNameArr = [
            ['00000', '01000', '00000'],
            ['00010', '11110', '00100'],
            ['00000', '10000', '00000']
        ]
        this.initMap(mapNameArr)
    },
    // 根据地图名字数组生成地图
    initMap (mapNameArr) {
        let mapSt = null
        let loadCnt = 0

        for (let i = 0; i < mapNameArr.length; i++) {
            for (let j = 0; j < mapNameArr[i].length; j++) {
                let mapName = mapNameArr[i][j]
                if (!mapName || mapName === '00000') { continue }

                if (!mapSt) {
                    mapSt = { i, j }
                }

                loadCnt++

                cc.loader.loadRes(`map/${mapName}`, cc.TiledMapAsset, (err, assets) => {
                    let node = new cc.Node()
                    let map = node.addComponent(cc.TiledMap)
                    node.anchorX = node.anchorY = 0  // 设置地图锚点为（0，0）
                    node.x = (j - mapSt.j) * 384
                    node.y = -(i - mapSt.i) * 384

                    map.tmxAsset = assets
                    node.parent = this.mapNode
                    this.initMapNode(node)

                    if (--loadCnt == 0) {
                        // 隐藏 loading 层
                        this.loadNode.active = false
                    }
                })
            }
        }
    },

    initMapNode (mapNode) {
        let tiledMap = mapNode.getComponent(cc.TiledMap)
        let tiledSize = tiledMap.getTileSize()
        let layer = tiledMap.getLayer('wall')
        let layerSize = layer.getLayerSize()
        let smogLayer = tiledMap.getLayer('smog')
        smogLayer.node.active = this.smog_enabled  // 打开战争迷雾

        for (let i = 0; i < layerSize.width; i++) {
            // 水平方向的块数
            for (let j = 0; j < layerSize.height; j++) {
                // 垂直方向的块数
                let tiled = layer.getTiledTileAt(i, j, true)
                if (tiled.gid != 0) {
                    tiled.node.group = 'wall'
                    let body = tiled.node.addComponent(cc.RigidBody)
                    body.type = cc.RigidBodyType.Static
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider)
                    collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2)
                    collider.size = tiledSize
                    collider.apply()
                }

                // 给迷雾增加碰撞刚体
                tiled = smogLayer.getTiledTileAt(i, j, true)
                if (tiled.gid != 0) {
                    tiled.node.group = 'smog'
                    let collider = tiled.addComponent(cc.BoxCollider)
                    collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2)
                    collider.size = tiledSize
                }
            }
        }
    },
    start () {
        for (let mapNode of this.mapNode.children) { // 遍历所有地图节点，绘制碰撞墙体
            this.initMapNode(mapNode)
        }

        // 在对话框上层初始化对话
        // this.dialog = this.dialogNode.getComponent('dialog')
        // this.dialog.init([
        //     { role: 2, content: '大家好，我是魔王' },
        //     { role: 1, content: '大家好，我是勇者' },
        //     { role: 2, content: '大家好，我是魔王。。' },
        //     { role: 1, content: '大家好，我是勇者' },
        //     { role: 2, content: '大家好，我是魔王。。。' },
        //     { role: 1, content: '大家好，我是勇者' },
        //     { role: 2, content: '大家好，我是魔王复读机' },
        //     { role: 1, content: '大家好，我是勇者复读机' },
        //     { role: 2, content: '。。。。。。' }
        // ])
    },

    // update (dt) {},
});
