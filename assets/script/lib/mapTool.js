const maxHCnt = 4
const maxWCnt = 4
// 偏移量
let dirArr = [
  { i: -1, j: 0 }, // 上
  { i: 1, j: 0 }, // 下
  { i: 0, j: -1 }, // 左
  { i: 0, j: 1 }  // 右
]


// 链接两块地图
function connectMap (mapNameArr, index, dirNum, dirNotNull = false) {
  let dir = dirArr[dirNum]
  let nearIndex = {
    i: dir.i + index.i,
    j: dir.j + index.j
  }

  // nearIndex 点越界判断
  if (nearIndex.i >= maxHCnt || nearIndex.j >= maxWCnt || nearIndex.i < 0 || nearIndex.j < 0) {
    return
  }
  // 相邻的地图没有连接点
  if (dirNotNull && mapNameArr[nearIndex.i][nearIndex.j] === '00000') {
    return
  }

  let nowMapName = mapNameArr[index.i][index.j].split('')
  let nearMapName = mapNameArr[nearIndex.i][nearIndex.j].split('')

  nowMapName[dirNum] = '1'
  let nearNum
  if (dirNum === 0) {
    nearNum = 1
  } else if (dirNum === 1) {
    nearNum = 0
  } else if (dirNum === 2) {
    nearNum = 3
  } else if (dirNum === 3) {
    nearNum = 2
  }

  nearMapName[nearNum] = '1'

  mapNameArr[index.i][index.j] = nowMapName.join('')
  mapNameArr[nearIndex.i][nearIndex.j] = nearMapName.join('')
}

// 随机链接地图
function randEmptyMap (mapNameArr) {
  for (let i = 0; i < maxHCnt; i++) {
    for (let j = 0; j < maxWCnt; j++) {
      let mapName = mapNameArr[i][j]
      if (mapName !== '00000') continue
      let dirNum = parseInt(Math.random() * dirArr.length)
      connectMap(mapNameArr, { i, j }, dirNum, true)
    }
  }
}

// 生成地图
function getRandNameArr () {
  let { mapArr, stIndex } = randBaseMap() // 解构
  let mapNameArr = []
  for (let i = 0; i < maxHCnt; i++) {
    mapNameArr[i] = [] // 设置初始值的时候,赋值一下
    for (let j = 0; j < maxWCnt; j++) {
      mapNameArr[i][j] = '00000'
    }
  }

  for (let i = 0; i < maxHCnt; i++) {
    for (let j = 0; j < maxWCnt; j++) {
      if (!mapArr[i][j]) continue
      for (let dirNum = 0; dirNum < dirArr.length; dirNum++) {
        connectMap(mapNameArr, { i, j }, dirNum)
      }
    }
  }

  randEmptyMap(mapNameArr)
  return mapNameArr
}

// 生成基础随机数组
function randBaseMap () {
  let mapCnt = 8 // 地图块数
  let mapArr = []

  for (let i = 0; i < maxHCnt; i++) {
    mapArr[i] = [] // 设置初始值的时候,赋值一下
    for (let j = 0; j < maxWCnt; j++) {
      mapArr[i][j] = 0
    }
  }

  // 随机一个起点
  let stIndex = {
    i: parseInt(Math.random() * maxHCnt),
    j: parseInt(Math.random() * maxWCnt)
  }

  let nextArr = setMap(mapArr, stIndex)
  mapCnt--

  // 判断块数有没有耗尽
  while (mapCnt && mapArr.length > 0) {
    let randNum = nextArr[parseInt(Math.random() * nextArr.length)]
    let nextIndex = nextArr.splice(randNum, 1)[0]

    let nearArr = setMap(mapArr, nextIndex)
    if (nearArr) {
      mapCnt--
      // 去重复
      nextArr = uniqNextArr([...nearArr, ...nextArr]) // 两个数组解构成一个数组
    }
  }

  return { mapArr, stIndex }
}

// 去重
function uniqNextArr (nextArr) {
  let tag = {}
  let arr = []
  for (let index of nextArr) {
    let num = index.i * maxHCnt + index.j * maxWCnt
    if (!tag[num]) { // 判断对应的元素没有存在的话存入数组 arr
      tag[num] = 1
      arr.push(index)
    }
  }
  return arr
}

// 设置通路
function setMap (mapArr, index) {
  // index点越界判断
  if (index.i >= maxHCnt || index.j >= maxWCnt || index.i < 0 || index.j < 0) {
    return null
  }
  // index点重复设置
  if (mapArr[index.i][index.j]) {
    return null
  }
  // 其余位置设置为1
  mapArr[index.i][index.j] = 1

  //拿到 index 相邻的位置数组
  let nearArr = []
  for (let dir of dirArr) {
    let i = dir.i + index.i
    let j = dir.j + index.j
    // 偏移位置越界判断
    if (i >= maxHCnt || j >= maxWCnt || i < 0 || j < 0) {
      continue
    }
    if (!mapArr[i][j]) { // 当对应的 mapArr 不存在该点时添加入 mapArr
      nearArr.push({ i, j })
    }
  }
  return nearArr
}

module.exports = { getRandNameArr }