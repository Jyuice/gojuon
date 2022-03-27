window.onload = function() {
    let body = document.getElementsByTagName('body')[0]
    
    class Home {
        constructor() {
            this.difficulty = 0 // 等級 0 1 2 3 4 5
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
            body = null
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
            let img = document.getElementById('home-img')
            let main = document.getElementById('main')
            let home = document.getElementById('home')
            let ready_page = document.getElementById('ready-page')
            img.classList.add('slide-down')
            main.classList.add('fade-out')

            setTimeout(() => {
                home.style.display = 'none'
                ready_page.style.display = 'block'
                home = null
                // 漣漪動畫
                new ripple(3)
            }, 500)
            img = null
            main = null
        }

    }

    // let h = new Home()

    // // nav點擊事件
    // const nav = document.querySelector('#nav')
    // nav.addEventListener('click', e => h.changeDifficulty(e))
    // nav.removeEventListener('click', h.changeDifficulty)

    // // 點擊開始按鈕
    // const btn = document.getElementById('btn')
    // btn.addEventListener('click', h.start)





    // 漣漪動畫
    class ripple {
        constructor(second = 3) {
            this.second = second // 倒計時的開端
            this.init()
        }

        init() {
            let interval = document.getElementById('interval')
            // const width = interval.getBoundingClientRect().width
            const self = this
            function createRipple() {
                let ready_page = document.getElementById('ready-page')
                let newInterval = document.createElement('div')
                newInterval.className = 'interval center ripple'
                ready_page.appendChild(newInterval)
                newInterval = null
                interval.innerHTML = self.second
                if(--self.second <= 0) {
                    setTimeout(() => {
                        // ready_page.classList.add('fade-out')
                        interval.innerHTML = ''
                        interval.classList.add('shrink')
                        interval = null
                        setTimeout(() => {
                            ready_page.style.display = 'none'
                            ready_page = null
                            self.swithPage()
                        }, 1000)
                    }, 1000)
                    clearInterval(timer)
                }
            }

            createRipple()
            let timer = setInterval(createRipple, 1000)
        }

        // 展示 gamePage 并且讓波浪出現
        swithPage() {
            let game_page = document.getElementById('game-page')
            let ground = document.getElementById('ground')
            game_page.style.display = 'block'
            ground.classList.add('slide-into')
            game_page = null
            ground = null
            new Game()
        }
    }


    // 游戲的邏輯
    class Game extends Home {
        constructor() {
            super() // 繼承了difficulty，可以訪問到this.difficulty了
            this.score = 0 // 一共正確了多少個
            this.live = 10 // 剩餘可錯誤的次數
            this.bank = null // 題庫
            this.keys = null // bank's keys
            this.curVals = new Set() // 當前頁面上存在的元素的答案合集
            this.wrong = null // 收集打錯的以便最後展示復習
            this.class = 'light' // 主題
            this.init()
            this.start()
        }

        // 初始化頁面上的分數和生命值 以及目前的UI樣式和題庫
        init() {
            let score = document.getElementById('score')
            let live = document.getElementById('live')
            score.innerHTML = this.score
            live.innerHTML = this.live
            score = null
            live = null
            this.class = this.getUI()
            this.bank = culculate(this.difficulty)
            this.keys = [...this.bank.keys()]
            console.log(this.keys)
        }

        // 游戲開始
        start() {
            let area = document.getElementById('area')
            let input = document.getElementById('input')
            input.focus()
            // 當前頁面的寬度
            const clientWidth = document.documentElement.clientWidth
            let timer = setInterval(() => {
                let node = document.createElement('div')
                node.id = 'item'
                node.className = this.class
                // 為node安排一個隨機的掉落地點，距離左邊0 ~ 頁面寬度-自己的寬度
                const left = this.getRandom(0, clientWidth-80)
                // 為node安排一個掉落速度？也就是動畫的時間
                const speed = this.getRandom(5, 10)
                // 為node安排一個隨機的字符
                const index = this.getRandom(0, this.keys.length)
                const key = this.keys[index]
                const value = this.bank.get(key)
                // 將該字符加入答案集合中
                this.curVals.add(value)
                // 已經安排過的字符在bank中刪除，keys中也要刪除
                this.bank.delete(key)
                this.keys.splice(index, 1)
                node.style.cssText += `
                    left: ${left}px;
                    animation: drop ${speed}s linear forwards`
                node.innerHTML = value
                area.appendChild(node)
                // 元素消失後就應該移除
                setTimeout(() => {
                    area.removeChild(node)
                }, speed * 1000)
            }, this.getRandom(1, 3) * 1000)

            // 假如已經沒命了
            if(this.live < 0) {
                clearInterval(timer)
                input = null
                // 這裏還要取消敲擊注冊事件！
                // ……………………………………………………………………………………
                // body.removeEventListener('click')
                this.end()
            }
        }

        // 處理鍵盤輸入事件
        handle() {

        }

        // 游戲結束
        end() {

        }

        // 自動聚焦輸入框，並防止意外的點擊事件
        // prevent() {
        //     let input = document.getElementById('input')
        //     function focus() {
        //         input.focus()
        //     }
        //     // body.addEventListener('click', focus)
        // }

        getRandom(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }
    }

    new Game()
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