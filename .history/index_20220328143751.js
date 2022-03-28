window.onload = function() {

    const body = document.getElementsByTagName('body')[0]
    // Home
    const home = getDomById('home')
    const nav = getDomById('nav')
    const main = getDomById('main')
    const btn = getDomById('btn')
    const img = getDomById('home-img')
    // ready-page
    const ready_page = getDomById('ready-page')
    const interval = getDomById('interval')
    // game-page
    const game_page = getDomById('game-page')
    const input = getDomById('input')
    const ground = getDomById('ground')
    // 分数计数器 
    const score_contain = getDomById('score-contain')
    const score = getDomById('score')
    const live = getDomById('live')
    // 分数展示器 
    const score_show = getDomById('score-show')
    const score_text = getDomById('score-text')
    const score_btn = getDomById('score-btn')

    class Home {
        constructor() {
            this.difficulty = 0 // 等級 0 1 2 3 4 5
            this.signUp()
        }

        signUp() {
            // nav點擊事件
            nav.addEventListener('click', e => this.changeDifficulty(e))
            nav.removeEventListener('click', this.changeDifficulty)

            // 點擊開始按鈕
            btn.addEventListener('click', this.start)
        }

        // 點擊 nav 的難度時添加下劃綫
        changeDifficulty(e) {
            const el = e.target
            if(el.id === 'nav') return
            this.difficulty = Number(el.dataset.no)
            this.clearUnactive()
            el.className += 'active'
            this.changeUI()
        }
        // 清楚上一個 active 的下劃綫
        clearUnactive() {
            let unactive = document.getElementsByClassName('active')[0]
            unactive.className = ''
            unactive = null
        }
        // 改變難度的時候改變背景色
        changeUI() {
            body.className = this.getUI()
            nav.className = this.getUI()
        }
        // 獲取目前的主題
        getUI() {
            return this.difficulty === 0 ? 'light' : (
                this.difficulty === 1 ? 'middle' : (
                    this.difficulty === 2 ? 'dark' : (
                        this.difficulty === 3 ? 'mdark' : (
                            this.difficulty === 4 ? 'ddark' : 'modark'
                        )
                    )
                )
            )
        }

        // 游戲部分邏輯
        // 點擊開始按鈕，游戲開始
        start() {
            nav.classList.add('slide-up')
            img.classList.add('slide-down')
            main.classList.add('fade-out')

            setTimeout(() => {
                home.style.display = 'none'
                ready_page.style.display = 'block'
                // 漣漪動畫
                new ripple(3)
                setTimeout(() => {
                    // 去除動畫的class
                    nav.classList.remove('slide-up')
                    img.classList.remove('slide-down')
                    main.classList.remove('fade-out')
                }, 1000)
            }, 500)
        }
    }

    let h = new Home()

    // h.showWrong()

    // 漣漪動畫
    class ripple {
        constructor(second = 3) {
            this.second = second // 倒計時的開端
            this.init()
        }

        init() {
            // const width = interval.getBoundingClientRect().width
            const self = this
            function createRipple() {
                let newInterval = document.createElement('div')
                newInterval.className = 'interval center ripple'
                ready_page.appendChild(newInterval)
                // newInterval = null
                interval.innerHTML = self.second
                setTimeout(() => {
                    newInterval.remove()
                }, 1000)
                if(--self.second <= 0) {
                    setTimeout(() => {
                        // ready_page.classList.add('fade-out')
                        interval.innerHTML = ''
                        interval.classList.add('shrink')
                        // interval = null
                        setTimeout(() => {
                            interval.classList.remove('shrink')
                            ready_page.style.display = 'none'
                            self.switchPage()
                        }, 1000)
                    }, 1000)
                    clearInterval(timer)
                }
            }

            createRipple()
            let timer = setInterval(createRipple, 1000)
        }

        // 展示 gamePage 并且讓波浪出現
        switchPage() {
            let game_page = document.getElementById('game-page')
            let ground = document.getElementById('ground')
            game_page.style.display = 'block'
            ground.classList.add('slide-into')

            // 插入area區域
            const area = document.createElement('div')
            area.id = 'area'
            game_page.appendChild(area)

            setTimeout(() => {
                ground.classList.remove('slide-into')
            }, 1000)
            new Game()
        }
    }


    // 游戲的邏輯
    class Game extends Home {
        constructor() {
            super() // 繼承了difficulty
            this.score = 0 // 一共正確了多少個
            this.live = 2 // 剩餘可錯誤的次數
            this.bank = null // 剩餘的題庫
            this.keys = null // bank's keys
            this.allVals = new Map() // 保存所有的題庫
            this.curVals = new Map() // 當前頁面上存在的元素的答案合集
            this.wrong = new Map() // 收集打錯的以便最後展示復習
            this.class = 'light' // 主題
            this.int = 6 // 掉落的時間間隔
            this.speed = 5 // 最短的掉落速度
            this.timeout = null
            this.timer = null

            this.signUp()
            this.init()
            this.start()

        }

        signUp() {
            // 打字事件
            window.addEventListener('keydown', e => this.handle(e))
            area.addEventListener('click', this.focus)
        }

        // 初始化頁面上的分數和生命值 以及目前的UI樣式和題庫
        init() {
            this.difficulty = h.difficulty
            score.innerHTML = this.score
            live.innerHTML = this.live
            this.class = this.getUI()
            // this.bank = culculate(this.difficulty)
            this.bank = new Map([
                ['a', 'あ'],
                ['i', 'い'],
                ['u', 'う'],
                ['e', 'え'],
            ])
            this.allVals = new Map([...this.bank])
            this.keys = [...this.bank.keys()]
        }

        focus() {
            input.style.display = 'block'
            input.focus()
        }

        // 游戲開始
        start() {
            this.focus()
            this.firstSecond()
            // 隨機時間產生元素
            this.timer = setInterval(() => {
                this.firstSecond()
            }, this.getRandom(1, this.int) * 1000)
        }

        // 游戲開始的時候馬上就要執行掉落一個，防止間隔太長導致的頁面空白
        firstSecond() {
            // 全部回答完畢了 就不要再創建元素了
            if(this.bank.size <= 0) {
                this.stopInterval()
                return
            }
            // 創建元素
            const { node, key, speed } = this.createNode()
            // 未回答成功的元素消失後就應該移除
            this.timeout = setTimeout(() => {
                try {
                    if(this.isParent(node, area)) {
                        // 還要減去生命值
                        live.innerHTML = --this.live
                        // 放進錯題本
                        this.wrong.set(key, this.curVals.get(key))
                        this.removeNode(node, key)

                        // 假如已經沒命了
                        if(this.live <= 0) {
                            this.stopInterval()
                        }
                    }
                } catch(err) {
                    return
                }
            }, speed * 1000)
        }

        stopInterval() {
            clearInterval(this.timer)
            clearTimeout(this.timeout)
            this.timer = null
            this.timeout = null
            area.remove()
            window.removeEventListener('keydown', e => this.handle(e))
            this.end()
        }

        createNode() {
            const node = document.createElement('div')
            node.id = 'item'
            node.className = this.class
            const { left, speed, key, value } = this.culculate()
            node.style.cssText += `
                left: ${left}px;
                animation: drop ${speed}s linear forwards`
            node.innerHTML = value
            area.appendChild(node)

            return { node, key, speed }
        }

        // 為新增的node計算一些屬性，同時獲得node的問題和答案
        culculate() {
            // 當前頁面的寬度
            const clientWidth = document.documentElement.clientWidth
            // 為node安排一個隨機的掉落地點，距離左邊0 ~ 頁面寬度-自己的寬度
            const left = this.getRandom(0, clientWidth-80)
            // 為node安排一個掉落速度？也就是動畫的時間
            const speed = this.getRandom(this.speed, this.speed+10)
            // 為node安排一個隨機的字符
            const index = this.getRandom(0, this.keys.length)
            const key = this.keys[index]
            const value = this.bank.get(key)
            // 將該字符的答案加入答案集合中
            this.curVals.set(key, value)
            // 已經安排過的字符在bank中刪除，keys中也要刪除
            this.bank.delete(key)
            this.keys.splice(index, 1)

            return { left, speed, key, value }
        }

        // 移除元素
        removeNode(node, key) {
            try {
                area.removeChild(node)
                // 同時要移除答案列表
                this.curVals.delete(key)
            } catch(err) {
                console.log(node, err)
            }
        }

        // 判斷 parentObj是否是obj的父元素
        isParent (obj,parentObj){
            while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY'){
                if (obj == parentObj){
                    return true;
                }
                obj = obj.parentNode;
            }
            return false;
        }

        // 處理鍵盤輸入事件
        handle(e) {
            console.log(e)
            if(e.key === 'Enter') {
                const val = input.value
                if(val === '') return
                input.value = ''
                // 答對了！
                if(this.curVals.has(val)) {
                    score.innerHTML = ++this.score
                    const children = area.children
                    for(let i = 0;i < children.length;i++) {
                        if(children[i].innerHTML === this.curVals.get(val)) {
                            this.removeNode(children[i], val)
                            break
                        }
                    }
                } else {
                    // 答錯了放進錯題本裏，前提是打的發音是合法的
                    if(this.allVals.has(val)) {
                        this.wrong.set(val, this.allVals.get(val))
                    }
                }
            }
        }

        // 游戲結束
        end() {
            input.style.display = 'none'
            score_contain.style.display = 'none'
            ground.classList.add('flow-up')
            // flow 结束后 计分页面出现，提前設置背景色和内容
            score_text.innerHTML = `${this.score}点おめでとうございます!`
            score_show.classList.add(this.class)
            setTimeout(() => {
                // score_show.style.display = 'block'
                score_show.classList.add('fade-in')

                score_btn.addEventListener('click', this.exitAnimation)

                // 顯示錯題本
                const book = document.createElement('div')
                book.id = 'book'
                for(let [key, val] of this.wrong.entries()) {
                    const p = document.createElement('p')
                    p.innerHTML = `${key} - ${val}`
                    book.appendChild(p)
                }
                score_show.appendChild(book)

            }, 3000)
        }

        getRandom(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }

        // 从游戏界面回到 Home
        exitAnimation() {
            // game_page消失之前就要去除ground的副作用
            ground.classList.remove('flow-up')
            game_page.style.display = 'none'

            score_show.classList.remove(this.class)
            // score_show.style.display = 'none'
            score_show.removeChild(book)
            score_show.classList.remove('fade-in')
            home.style.display = 'block'

            nav.classList.add('slide-down-back')
            img.classList.add('slide-up-back')
            main.classList.add('fade-in')

            setTimeout(this.cancel, 1000)
        }

        // 消除退出到Home時 Home中組件的動畫
        cancel() {
            nav.classList.remove('slide-down-back')
            img.classList.remove('slide-up-back')
            main.classList.remove('fade-in')

            score_btn.removeEventListener('click', this.exitAnimation)
        }
        
    }

    // 释放内存，暂时不用用到
    function release() {
        body = null
        nav = null
        score = null
        live = null
        input = null
        score = null
        ground = null
        home = null
        game_page = null
        img = null
        main = null
        btn = null
        ready_page = null
        interval = null
    }

    // g = new Game()

}





const level1 = new Map([
    ['a', 'あ'],
    ['i', 'い'],
    ['u', 'う'],
    ['e', 'え'],
    ['o', 'お'],
    ['ka', 'か'],
    ['ki', 'き'],
    ['ku', 'く'],
    ['ke', 'け'],
    ['ko', 'こ'],
    ['sa', 'さ'],
    ['shi', 'し'],
    ['su', 'す'],
    ['se', 'せ'],
    ['so', 'そ'],
    ['ta', 'た'],
    ['chi', 'ち'],
    ['tu', 'つ'],
    ['te', 'て'],
    ['to', 'と'],
    ['na', 'な'],
    ['ni', 'に'],
    ['nu', 'ぬ'],
    ['ne', 'ね'],
    ['no', 'の'],
    ['ha', 'は'],
    ['hi', 'ひ'],
    ['fu', 'ふ'],
    ['he', 'へ'],
    ['ho', 'ほ'],
    ['ma', 'ま'],
    ['mi', 'み'],
    ['mu', 'む'],
    ['me', 'め'],
    ['mo', 'も'],
    ['ya', 'や'],
    ['yu', 'ゆ'],
    ['yo', 'よ'],
    ['ra', 'ら'],
    ['ri', 'り'],
    ['ru', 'る'],
    ['re', 'れ'],
    ['ro', 'ろ'],
    ['wa', 'わ'],
    ['wo', 'を'],
    ['nn', 'ん'],
])

const level2 = new Map([
    ['a', 'ア'],
    ['i', 'イ'],
    ['u', 'ウ'],
    ['e', 'エ'],
    ['o', 'オ'],
    ['ka', 'カ'],
    ['ki', 'キ'],
    ['ku', 'ク'],
    ['ke', 'ケ'],
    ['ko', 'コ'],
    ['sa', 'サ'],
    ['shi', 'シ'],
    ['su', 'ス'],
    ['se', 'セ'],
    ['so', 'ソ'],
    ['ta', 'タ'],
    ['chi', 'チ'],
    ['tu', 'ツ'],
    ['te', 'テ'],
    ['to', 'ト'],
    ['na', 'ナ'],
    ['ni', 'ニ'],
    ['nu', 'ヌ'],
    ['ne', 'ネ'],
    ['no', 'ノ'],
    ['ha', 'ハ'],
    ['hi', 'ヒ'],
    ['fu', 'フ'],
    ['he', 'ヘ'],
    ['ho', 'ホ'],
    ['ma', 'マ'],
    ['mi', 'ミ'],
    ['mu', 'ム'],
    ['me', 'メ'],
    ['mo', 'モ'],
    ['ya', 'ヤ'],
    ['yu', 'ユ'],
    ['yo', 'ヨ'],
    ['ra', 'ラ'],
    ['ri', 'リ'],
    ['ru', 'ル'],
    ['re', 'レ'],
    ['ro', 'ロ'],
    ['wa', 'ワ'],
    ['wo', 'ヲ'],
    ['nn', 'ン'],
])

const level3 = new Map([
    ['da', 'だ'],
    ['di', 'ぢ'],
    ['du', 'づ'],
    ['de', 'で'],
    ['do', 'ど'],
    ['ba', 'ば'],
    ['bi', 'び'],
    ['bu', 'ぶ'],
    ['be', 'べ'],
    ['bo', 'ぼ'],
    ['ga', 'が'],
    ['gi', 'ぎ'],
    ['gu', 'ぐ'],
    ['ge', 'げ'],
    ['go', 'ご'],
    ['za', 'ざ'],
    ['zi', 'じ'],
    ['zu', 'ず'],
    ['ze', 'ぜ'],
    ['zo', 'ぞ'],
    ['pa', 'ぱ'],
    ['pi', 'ぴ'],
    ['pu', 'ぷ'],
    ['pe', 'ぺ'],
    ['po', 'ぽ'],
])

const level4 = new Map([
    ['da', 'ダ'],
    ['di', 'ヂ'],
    ['du', 'ヅ'],
    ['de', 'デ'],
    ['do', 'ド'],
    ['ba', 'バ'],
    ['bi', 'ビ'],
    ['bu', 'ブ'],
    ['be', 'ベ'],
    ['bo', 'ボ'],
    ['ga', 'ガ'],
    ['gi', 'ギ'],
    ['gu', 'グ'],
    ['ge', 'ゲ'],
    ['go', 'ゴ'],
    ['za', 'ザ'],
    ['zi', 'ジ'],
    ['zu', 'ズ'],
    ['ze', 'ゼ'],
    ['zo', 'ゾ'],
    ['pa', 'パ'],
    ['pi', 'ピ'],
    ['pu', 'プ'],
    ['pe', 'ペ'],
    ['po', 'ポ'],
])

const level5 = new Map([
    ['kia', 'きゃ'],
    ['kiu', 'きゆ'],
    ['kio', 'きよ'],
    ['gia', 'ぎゃ'],
    ['giu', 'ぎゆ'],
    ['gio', 'ぎよ'],
    ['shia', 'しゃ'],
    ['shiu', 'しゆ'],
    ['shio', 'しよ'],
    ['jia', 'じゃ'],
    ['jiu', 'じゆ'],
    ['jio', 'じよ'],
    // 發音和打字不相符合，要記得做提醒！⏰
    ['dia', 'ぢゃ'],
    ['diu', 'ぢゆ'],
    ['dio', 'ぢよ'],
    ['chia', 'ちゃ'],
    ['chiu', 'ちゆ'],
    ['chio', 'ちよ'],
    ['nia', 'にゃ'],
    ['niu', 'にゆ'],
    ['nio', 'によ'],
    ['hia', 'ひゃ'],
    ['hiu', 'ひゆ'],
    ['hio', 'ひよ'],
    ['bia', 'びゃ'],
    ['biu', 'びゆ'],
    ['bio', 'びよ'],
    ['pia', 'ぴゃ'],
    ['piu', 'ぴゆ'],
    ['pio', 'ぴよ'],
    ['mia', 'みゃ'],
    ['miu', 'みゆ'],
    ['mio', 'みよ'],
    ['ria', 'りゃ'],
    ['riu', 'りゆ'],
    ['rio', 'りよ'],
])

const level6 = new Map([
    ['kia', 'キヤ'],
    ['kiu', 'キユ'],
    ['kio', 'キヨ'],
    ['gia', 'ギヤ'],
    ['giu', 'ギユ'],
    ['gio', 'ギヨ'],
    ['shia', 'ィヤ'],
    ['shiu', 'ィユ'],
    ['shio', 'ィヨ'],
    ['jia', 'ジヤ'],
    ['jiu', 'ジユ'],
    ['jio', 'ジヨ'],
    // 發音和打字不相符合，要記得做提醒！⏰
    ['dia', 'ヂヤ'],
    ['diu', 'ヂユ'],
    ['dio', 'ヂヨ'],
    ['chia', 'チャ'],
    ['chiu', 'チュ'],
    ['chio', 'チョ'],
    ['nia', 'ニヤ'],
    ['niu', 'ニユ'],
    ['nio', 'ニヨ'],
    ['hia', 'ヒヤ'],
    ['hiu', 'ヒユ'],
    ['hio', 'ヒヨ'],
    ['bia', 'ビヤ'],
    ['biu', 'ビユ'],
    ['bio', 'ビヨ'],
    ['pia', 'ピヤ'],
    ['piu', 'ピユ'],
    ['pio', 'ピヨ'],
    ['mia', 'ミヤ'],
    ['miu', 'ミユ'],
    ['mio', 'ミヨ'],
    ['ria', 'リヤ'],
    ['riu', 'リユ'],
    ['rio', 'リヨ'],
])


const mapList = [[level1, level2], [level3, level4], [level5, level6]]

/**
 *  difficulty   bank
 *      0        level1                      culculate(0) = mapList[0][0]
 *      1        level2                      culculate(1) = mapList[0][1]
 *      2        level3 + level1            +culculate(2) = mapList[1][0] + culculate(0)
 *      3        level4 + level2             culculate(3) = mapList[1][1] + culculate(1)
 *      4        level5 + level3 + level1   +culculate(4) = mapList[2][0] + culculate(2)
 *      5        level6 + level4 + level2    culculate(5) = mapList[2][1] + culculate(3)
 **/

// 返回當前難度下的bank
function culculate(difficulty) {
    if(difficulty === 0) return new Map([...mapList[0][0]])
    if(difficulty === 1) return new Map([...mapList[0][1]])
    if(!difficulty%2) {
        return new Map([...mapList[difficulty/2][0], ...culculate(difficulty-2)])
    } else {
        return new Map([...mapList[Math.floor(difficulty/2)][1], ...culculate(difficulty-2)])
    }
}

function getDomById(id) {
    return document.getElementById(id)
}