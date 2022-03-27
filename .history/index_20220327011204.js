window.onload = function() {
    class Game {
        constructor() {
            this.difficulty = 0 // 三個等級 0 1 2
        }

        changeDifficulty(e) {
            const el = e.target
            el.className += 'active'
        }
    }

    let g = new Game()
    const nav = document.querySelector('#nav')
    nav.addEventListener('click', g.changeDifficulty())
    // nav.removeEventListener('click', g.changeDifficulty)
}