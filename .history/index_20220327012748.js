window.onload = function() {
    const bgcolor = 'f40'
    class Game {
        constructor() {
            this.difficulty = 0 // 三個等級 0 1 2
        }
        // 點擊 nav 的難度時添加下劃綫
        changeDifficulty(e) {
            const el = e.target
            if(el.id === 'nav') return
            this.clearUnactive()
            el.className += 'active'
            this.changeUi()
        }
        // 清楚上一個 active 的下劃綫
        clearUnactive() {
            let unactive = document.getElementsByClassName('active')[0]
            unactive.className = ''
            unactive = null
        }
        // 改變難度的時候改變背景色
        changeUi() {
            let body = document.getElementsByTagName('body')[0]
            body.style.background = 'red'
        }
    }

    let g = new Game()

    // nav點擊事件
    const nav = document.querySelector('#nav')
    nav.addEventListener('click', e => g.changeDifficulty(e))
    nav.removeEventListener('click', g.changeDifficulty)
}