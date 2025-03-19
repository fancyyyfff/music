/**
 * 解析歌词字符串数组
 * 得到一个歌词对象数组
 * 每个歌词对象：
 * {time:开始时间,words:歌词内容}
 */
function parseLrc() {
    // 按换行符分割成数组：
    let lines = lrc.split('\n');
    let result = []
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let parts = line.split(']');
        let timeStr = parts[0].substring(1);
        let words = parts[1];
        let obj = {
            time:parseTime(timeStr),
            words:words
        }
        result.push(obj);
    }
    return result;
}

/**
 * 将一个时间字符串转化为数字（秒）
 * @param {String} timeStr 时间字符串
 * @returns 
 */
function parseTime(timeStr) {
    let parts = timeStr.split(':');
    return +parts[0]*60 + +parts[1];
}

let lrcData = parseLrc();

let doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('ul'),
    container: document.querySelector('.container'),

}

/**
 * 根据当前的播放时间，
 * 计算出lrc数组应该高亮显示的歌词下标
 */
function findIndex() {
    let curTime = doms.audio.currentTime;
    for (let i = 0; i < lrcData.length; i++) {
        if(curTime < lrcData[i].time) {
            return i-1;
        }
    }
    // 还有一些秒数没有对应到歌词的，统一对应最后一句
    return lrcData.length-1;
}

/**
 * 创建歌词元素
 */
function createLrcElements() {
    let frag = document.createDocumentFragment();
    for (let i = 0; i < lrcData.length; i++) {
        let words = lrcData[i].words;
        let li = document.createElement('li');
        li.textContent = words;
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}
createLrcElements()

let containerHeight = doms.container.clientHeight;
let liHeight = doms.ul.children[0].clientHeight;
let maxOffset = doms.ul.clientHeight - containerHeight;
/**
 * 设置li的偏移量
 */
function setOffset() {
    let index = findIndex();
    let offset = liHeight * index + liHeight / 2 - containerHeight / 2;
    if(offset < 0) {
        offset = 0;
    }
    if(offset > maxOffset) {
        offset = maxOffset;
    }
    // ul向上偏移
    doms.ul.style.transform = `translateY(-${offset}px)`;
    let li = document.querySelector('.active');
    if(li) {
        li.classList.remove('active')
    }   
    li = doms.ul.children[index];
    if(li) {
        li.classList.add('active');
    }
}

doms.audio.addEventListener('timeupdate',setOffset)