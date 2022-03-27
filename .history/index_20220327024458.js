window.bgcolor = 'f40'

window.onload = function() {
    class Game {
        constructor() {
            this.difficulty = 0 // 三個等級 0 1 2
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
                this.difficulty === 1 ? 'middle' : 'dark'
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
                new ripple(3)
            }, 500)
            img = null
            main = null
        }

        // 漣漪動畫
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
            this.timer = null
            this.init()
        }

        init() {
            // let interval = document.getElementById('interval')
            // const width = interval.getBoundingClientRect().width
            // interval = null
            this.createRipple()
            this.timer = setInterval(this.createRipple, 1000)
        }

        createRipple() {
            let game_page = document.getElementById('game-page')
            let newInterval = document.createElement('div')
            newInterval.className = 'interval center ripple'
            game_page.appendChild(newInterval)
            newInterval = null
            if(this.second && --this.second <= 0) {
                game_page = null
                // clearInterval(this.timer)
                this.timer = null
            }
            console.log(this.second)
        }
    }
}