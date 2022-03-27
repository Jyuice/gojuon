window.onload = function() {
    class game {
        constructor() {
            this.difficulty = 0 // 三個等級 0 1 2
            this.changeDifficulty()
        }

        // 點擊nav改變難度
        changeDifficulty() {
            const nav = document.querySelector('#nav')
            console.log(nav)
        }
    }

    let g = new game()
}