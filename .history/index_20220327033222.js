
window.onload = function() {
    class Game {
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
            let game_page = document.getElementById('game-page')
            img.classList.add('slide-down')
            main.classList.add('fade-out')
            setTimeout(() => {
                home.style.display = 'none'
                game_page.style.display = 'block'
                home = null
                // 漣漪動畫，傳秒數進去
                new ripple(3)
            }, 500)
            img = null
            main = null
        }

    }

    let g = new Game()

    // nav點擊事件
    const nav = document.querySelector('#nav')
    nav.addEventListener('click', e => g.changeDifficulty(e))
    nav.removeEventListener('click', g.changeDifficulty)

    // 點擊開始按鈕
    const btn = document.getElementById('btn')
    btn.addEventListener('click', g.start)





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
                let game_page = document.getElementById('game-page')
                let newInterval = document.createElement('div')
                newInterval.className = 'interval center ripple'
                game_page.appendChild(newInterval)
                newInterval = null
                interval.innerHTML = self.second
                if(--self.second <= 0) {
                    game_page.classList.add('fade-out')
                    game_page = null
                    clearInterval(timer)
                    interval = null
                }
            }

            createRipple()
            let timer = setInterval(createRipple, 1000)
        }
    }
}








const light = new Map([
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

const middle = new Map([
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

const dark = new Map([
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

const midDark = new Map([
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

const deepDark = new Map([
    ['kia', 'キヤ'],
    ['kiu', 'キユ'],
    ['kio', 'キヨ'],
    ['gia', 'ギヤ'],
    ['giu', 'ギユ'],
    ['gio', 'ギヨ'],
    ['xia', 'ィヤ'],
    ['xiu', 'ィユ'],
    ['xio', 'ィヨ'],
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