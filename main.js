var myCanvas = document.querySelector('#myCanvas')
var undo = document.querySelector('#undo')
var eraser = document.querySelector('#eraser')
var brushWidth = document.querySelector('#range')
var brush = document.querySelector('#brush')
var clearWin = document.querySelector('#clearWin')
var saveImage = document.querySelector('#saveImage')
var colorBu = document.getElementsByClassName('color')
var ctx = myCanvas.getContext('2d')
var historyData = [] //存储undo的历史纪录
var beginPoint = null
var lWidth = 5

let using = false
let clear = false
let points = [] //存储贝塞尔曲线绘制点


autoSetSize() //初始时先设置一次画布宽高

function autoSetSize(canvas) {
    let pageWidth = document.documentElement.clientWidth
    let pageHight = document.documentElement.clientHeight
    myCanvas.width = pageWidth
    myCanvas.height = pageHight
}

window.onresize = function () {
    autoSetSize()
}
/*屏幕大小改变自动设置canvas的画布大小 */

myCanvas.addEventListener('mousedown', down)
myCanvas.addEventListener('mousemove', move)
myCanvas.addEventListener('mouseup', up)
myCanvas.addEventListener('mouseout', up)

/* 监听鼠标事件 */

function getPos(e) {
    return {
        x: e.clientX - myCanvas.offsetLeft,
        y: e.clientY - myCanvas.offsetTop
    }
}

/* 获取当前点坐标函数 */

function drawLine(beginPoint, controlPoint, lastPoint) {
    if (clear) {
        ctx.save()
        ctx.globalCompositeOperation = "destination-out"
        drawBezier(beginPoint, controlPoint, lastPoint)
        ctx.restore()
    } else {
        drawBezier(beginPoint, controlPoint, lastPoint)
    }

}

function drawBezier(beginPoint, controlPoint, lastPoint) {
    ctx.beginPath()
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.moveTo(beginPoint.x, beginPoint.y)
    ctx.quadraticCurveTo(
        controlPoint.x, controlPoint.y, lastPoint.x, lastPoint.y
    )
    ctx.stroke()
    ctx.closePath()
}

/* 贝塞尔曲线画线函数 */


range.onchange = function () {
    lWidth = this.value
}
/* 滚动条设置画笔粗细 */

function down(e) {
    this.firstData = ctx.getImageData(0, 0, myCanvas.width, myCanvas.height)
    saveData(this.firstData)
    using = true
    var { x, y } = getPos(e)
    points.push({ x, y })
    beginPoint = { x, y }
    ctx.save()
}
/* 鼠标点击函数 */

function move(e) {
    if (!using) return
    var { x, y } = getPos(e)
    points.push({ x, y })

    if (points.length > 3) {
        let lastTwoPoints = points.slice(-2)
        let controlPoint = lastTwoPoints[0]
        var lastPoint = {
            x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
            y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
        }
        ctx.lineWidth = lWidth
        drawLine(beginPoint, controlPoint, lastPoint)
        beginPoint = lastPoint
    }
}

/* 鼠标移动函数 */

function up(e) {
    if (!using) return
    var { x, y } = getPos(e)
    points.push({ x, y })
    if (points.length > 3) {
        var lastTwoPoints = points.slice(-2)
        var controlPoint = lastTwoPoints[0]
        var lastPoint = lastTwoPoints[1]
        drawLine(beginPoint, controlPoint, lastPoint)
    }
    beginPoint = null
    using = false
    points = []
}

/* 鼠标抬起函数 */

undo.onclick = function () {
    if (historyData.length < 1) return false
    ctx.putImageData(historyData[historyData.length - 1], 0, 0)
    historyData.pop()
    console.log(historyData)
}

/* 撤销点击事件 */
function saveData(data) {
    historyData.push(data)
}

/* 存储当前画布的image信息的函数 */

eraser.onclick = function () {
    clear = true
}
/*----------------------- */

brush.onclick = function () {
    clear = false
}

/*----------------------- */

clearWin.onclick = function () {
    clear = false
    historyData = []
    points = []
    using = false
    beginPoint = null
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
    ctx.fillStyle = 'white'
    ctx.fill()
}

/*清屏功能----------- */

saveImage.onclick = function () {
    var url = myCanvas.toDataURL('image/png')
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.href = url
    a.download = 'Eskimo' + (new Date).getTime()
    a.target = '_blank'
    a.click()
}

/**-----------保存为png------- */

function changeColor() {
    for (let i = 0; i < colorBu.length; i++) {
        colorBu[i].onclick = function () {
            for (let i = 0; i < colorBu.length; i++) {
                colorBu[i].classList.remove('active')
                this.classList.add('active')
                activeColor = this.style.background
                ctx.fillStyle = activeColor
                ctx.strokeStyle = activeColor
            }
        }
    }
}
changeColor()