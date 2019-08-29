var myCanvas = document.querySelector('#myCanvas')
var undo = document.querySelector('#undo')
var eraser = document.querySelector('#eraser')
var brushWidth = document.querySelector('#range')
var brush = document.querySelector('#brush')
var clearWin = document.querySelector('#clearWin')
var saveImage = document.querySelector('#saveImage')

var $imgW = document.getElementById('imgW')
var $imgH = document.getElementById('imgH')
var $sel = document.getElementById('sel');
var ctx = myCanvas.getContext('2d')
var historyData = [] //存储undo的历史纪录
var beginPoint = null
var lWidth = 5

let using = false
let clear = false
let points = [] //存储贝塞尔曲线绘制点


autoSetSize() //初始时先设置一次画布宽高

ctx.fillStyle = 'white'
ctx.fillRect(0, 0, myCanvas.width, myCanvas.height)

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
        x: e.clientX - myCanvas.offsetLeft + (window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft),
        y: e.clientY - myCanvas.offsetTop + (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop)
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
    removeActive()
    undo.classList.add('active')
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
    removeActive()
    eraser.classList.add('active')   
}
/*----------------------- */

brush.onclick = function () {
    clear = false
    removeActive()
    brush.classList.add('active')
}

/*----------------------- */

clearWin.onclick = function () {
    clear = false
    removeActive()
    clearWin.classList.add('active')
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
    removeActive()
    saveImage.classList.add('active')
    Canvas2Image.saveAsImage(myCanvas);   
}

/**-----------保存为png------- */



/*-------颜色切换，事件委托------- */
function changeColor2() {
    const colorUl = document.getElementById('color-item')
    const colorItem = colorUl.children
    colorUl.addEventListener('click', (e) => {
        for(item of colorItem){
           item.classList.remove('active')
        }
        e.target.classList.add('active')
        activeColor = e.target.style.background
        ctx.fillStyle = activeColor
        ctx.strokeStyle = activeColor
    }, false)

}
changeColor2()


function removeActive(){
    const actions = document.querySelector('.actions')
    const actionsList = actions.children
    for(item of actionsList){
        item.classList.remove('active')
    }
}

function circleChangeSize(){
    const circleSize = document.querySelector('.sizes')
    const circleList = circleSize.children
    circleSize.addEventListener('click',(e)=>{
        console.log(e.target.value)
        lWidth = e.target.value
    },false)
}
circleChangeSize()