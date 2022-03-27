window.onload = function() {
    class Home {
        constructor() {
            this.difficulty = 0 // 三個等級 0 1 2 3 4
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
            let body = document.getElementsByTagName('body')[0]
            body.className = this.getUI()
            nav.className = this.getUI()
            body = null
        }
        // 獲取目前的主題
        getUI() {
            return this.difficulty === 0 ? 'light' : (
                this.difficulty === 1 ? 'middle' : (
                    this.difficulty === 2 ? 'dark' : (
                        this.difficulty === 3 ? 'mdark' : 'ddark'
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
            this.bank = new Map() // 題庫
            this.wrong = new Map() // 收集打錯的以便最後展示復習
            this.class = 'light' // 主題
            this.init()
            // this.start()
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
            for(let i = 0;i <= this.difficulty;i++) {
                this.bank = [...this.bank, ...mapList[i]]
            }
        }

        // 游戲開始
        start() {
            let area = document.getElementById('area')
            // 當前頁面的寬度
            const clientWidth = document.documentElement.clientWidth
            let timer = setInterval(() => {
                let node = document.createElement('div')
                node.id = 'item'
                node.className = this.class
                // 為node安排一個隨機的掉落地點，距離左邊0 ~ 頁面寬度-自己的寬度
                const left = this.getRandom(0, clientWidth-50)
                // 為node安排一個掉落速度？也就是動畫的時間
                const speed = this.getRandom(5, 10)
                const style = {
                    left: left + 'px',
                    
                }
            }, this.getRandom(1, 3) * 1000)

            // 假如已經沒命了
            if(this.live < 0) {
                clearInterval(timer)
                // 這裏還要取消敲擊注冊事件！
                // ……………………………………………………………………………………
                this.end()
            }
        }

        // 游戲結束
        end() {

        }

        getRandom(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }
    }

    new Game()
}





const light = new Map([
    ['あ', 'a'],
    ['い', 'i'],
    ['う', 'u'],
    ['え', 'e'],
    ['お', 'o'],
    ['か', 'ka'],
    ['き', 'ki'],
    ['く', 'ku'],
    ['け', 'ke'],
    ['こ', 'ko'],
    ['さ', 'sa'],
    [ 'し', 'shi'],
    ['す', 'su'],
    ['せ', 'se'],
    ['そ', 'so'],
    ['た', 'ta'],
    [ 'ち', 'chi'],
    ['つ', 'tu'],
    ['て', 'te'],
    ['と', 'to'],
    ['な', 'na'],
    ['に', 'ni'],
    ['ぬ', 'nu'],
    ['ね', 'ne'],
    ['の', 'no'],
    ['は', 'ha'],
    ['ひ', 'hi'],
    ['ふ', 'fu'],
    ['へ', 'he'],
    ['ほ', 'ho'],
    ['ま', 'ma'],
    ['み', 'mi'],
    ['む', 'mu'],
    ['め', 'me'],
    ['も', 'mo'],
    ['や', 'ya'],
    ['ゆ', 'yu'],
    ['よ', 'yo'],
    ['ら', 'ra'],
    ['り', 'ri'],
    ['る', 'ru'],
    ['れ', 're'],
    ['ろ', 'ro'],
    ['わ', 'wa'],
    ['を', 'wo'],
    ['ん', 'nn'],
])

const middle = new Map([
    ['ア', 'a'],
    ['イ', 'i'],
    ['ウ', 'u'],
    ['エ', 'e'],
    ['オ', 'o'],
    ['カ', 'ka'],
    ['キ', 'ki'],
    ['ク', 'ku'],
    ['ケ', 'ke'],
    ['コ', 'ko'],
    ['サ', 'sa'],
    ['シ', 'shi'],
    ['ス', 'su'],
    ['セ', 'se'],
    ['ソ', 'so'],
    ['タ', 'ta'],
    ['チ', 'chi'],
    ['ツ', 'tu'],
    ['テ', 'te'],
    ['ト', 'to'],
    ['ナ', 'na'],
    ['ニ', 'ni'],
    ['ヌ', 'nu'],
    ['ネ', 'ne'],
    ['ノ', 'no'],
    ['ハ', 'ha'],
    ['ヒ', 'hi'],
    ['フ', 'fu'],
    ['ヘ', 'he'],
    ['ホ', 'ho'],
    ['マ', 'ma'],
    ['ミ', 'mi'],
    ['ム', 'mu'],
    ['メ', 'me'],
    ['モ', 'mo'],
    ['ヤ', 'ya'],
    ['ユ', 'yu'],
    ['ヨ', 'yo'],
    ['ラ', 'ra'],
    ['リ', 'ri'],
    ['ル', 'ru'],
    ['レ', 're'],
    ['ロ', 'ro'],
    ['ワ', 'wa'],
    ['ヲ', 'wo'],
    ['ン', 'nn'],
])

const dark = new Map([
    ['だ', 'da'],
    ['ぢ', 'di'],
    ['づ', 'du'],
    ['で', 'de'],
    ['ど', 'do'],
    ['ば', 'ba'],
    ['び', 'bi'],
    ['ぶ', 'bu'],
    ['べ', 'be'],
    ['ぼ', 'bo'],
    ['が', 'ga'],
    ['ぎ', 'gi'],
    ['ぐ', 'gu'],
    ['げ', 'ge'],
    ['ご', 'go'],
    ['ざ', 'za'],
    ['じ', 'zi'],
    ['ず', 'zu'],
    ['ぜ', 'ze'],
    ['ぞ', 'zo'],
    ['ぱ', 'pa'],
    ['ぴ', 'pi'],
    ['ぷ', 'pu'],
    ['ぺ', 'pe'],
    ['ぽ', 'po'],
])

const mdark = new Map([
    ['ダ', 'da'],
    ['ヂ', 'di'],
    ['ヅ', 'du'],
    ['デ', 'de'],
    ['ド', 'do'],
    ['バ', 'ba'],
    ['ビ', 'bi'],
    ['ブ', 'bu'],
    ['ベ', 'be'],
    ['ボ', 'bo'],
    ['ガ', 'ga'],
    ['ギ', 'gi'],
    ['グ', 'gu'],
    ['ゲ', 'ge'],
    ['ゴ', 'go'],
    ['ザ', 'za'],
    ['ジ', 'zi'],
    ['ズ', 'zu'],
    ['ゼ', 'ze'],
    ['ゾ', 'zo'],
    ['パ', 'pa'],
    ['ピ', 'pi'],
    ['プ', 'pu'],
    ['ペ', 'pe'],
    ['ポ', 'po'],
])

const ddark = new Map([
    ['キヤ', 'kia'],
    ['キユ', 'kiu'],
    ['キヨ', 'kio'],
    ['ギヤ', 'gia'],
    ['ギユ', 'giu'],
    ['ギヨ', 'gio'],
    ['ィヤ', 'shia'],
    ['ィユ', 'shiu'],
    ['ィヨ', 'shio'],
    ['ジヤ', 'jia'],
    ['ジユ', 'jiu'],
    ['ジヨ', 'jio'],
    // 發音和打字不相符合，要記得做提醒！⏰
    ['ヂヤ', 'dia'],
    ['ヂユ', 'diu'],
    ['ヂヨ', 'dio'],
    ['チャ', 'chia'],
    ['チュ', 'chiu'],
    ['チョ', 'chio'],
    ['ニヤ', 'nia'],
    ['ニユ', 'niu'],
    ['ニヨ', 'nio'],
    ['ヒヤ', 'hia'],
    ['ヒユ', 'hiu'],
    ['ヒヨ', 'hio'],
    ['ビヤ', 'bia'],
    ['ビユ', 'biu'],
    ['ビヨ', 'bio'],
    ['ピヤ', 'pia'],
    ['ピユ', 'piu'],
    ['ピヨ', 'pio'],
    ['ミヤ', 'mia'],
    ['ミユ', 'miu'],
    ['ミヨ', 'mio'],
    ['リヤ', 'ria'],
    ['リユ', 'riu'],
    ['リヨ', 'rio'],
    // 
    ['きゃ', 'kia'],
    ['きゆ', 'kiu'],
    ['きよ', 'kio'],
    ['ぎゃ', 'gia'],
    ['ぎゆ', 'giu'],
    ['ぎよ', 'gio'],
    ['しゃ', 'shia'],
    ['しゆ', 'shiu'],
    ['しよ', 'shio'],
    ['じゃ', 'jia'],
    ['じゆ', 'jiu'],
    ['じよ', 'jio'],
    // 發音和打字不相符合，要記得做提醒！⏰
    ['ぢゃ', 'dia'],
    ['ぢゆ', 'diu'],
    ['ぢよ', 'dio'],
    ['ちゃ', 'chia'],
    ['ちゆ', 'chiu'],
    ['ちよ', 'chio'],
    ['にゃ', 'nia'],
    ['にゆ', 'niu'],
    ['によ', 'nio'],
    ['ひゃ', 'hia'],
    ['ひゆ', 'hiu'],
    ['ひよ', 'hio'],
    ['びゃ', 'bia'],
    ['びゆ', 'biu'],
    ['びよ', 'bio'],
    ['ぴゃ', 'pia'],
    ['ぴゆ', 'piu'],
    ['ぴよ', 'pio'],
    ['みゃ', 'mia'],
    ['みゆ', 'miu'],
    ['みよ', 'mio'],
    ['りゃ', 'ria'],
    ['りゆ', 'riu'],
    ['りよ', 'rio'],
])


const mapList = [light, middle, dark, mdark, ddark]