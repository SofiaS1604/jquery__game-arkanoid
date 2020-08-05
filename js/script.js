$(document).ready(function () {
    let positionBall = [45, 530];
    let leftPlatform;
    let playGame = 0;
    let score = 0;
    let time = 0;
    let hp = 100;
    let dx = 2;
    let dy = -2;

    let blockGrid = [
        [1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
        [0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
        [0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
        [0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
    ];

    let drawGrid = () => {
        blockGrid.map((row, row_index) => {
            row.map((cell, cell_index) => {
                if (cell === 1) {
                    let cellNode = $('<div class="grid__cell"></div>');
                    cellNode.addClass(`grid__cell--${row_index}-${cell_index}`);
                    $('.game__grid').append(cellNode);

                    cellNode.css({
                        left: `${cell_index * 35}px`,
                        top: `${row_index * 35}px`,
                    })
                }
            })
        })
    };

    $('body').bind('mousemove', (e) => {
        leftPlatform = e.clientX - 420 >= 0 && e.clientX - 420 <= 495 ? e.clientX - 420 : e.clientX - 420 < 0 ? 0 : 495;

        if (!playGame) {
            positionBall[0] = leftPlatform + 45;
            $('.game__ball').css({
                left: leftPlatform + 45 + 'px'
            })
        }

        $('.game__platform').css({
            left: leftPlatform + 'px'
        })
    });

    $(document).bind('keydown', (e) => {
        if (e.keyCode === 32 && !playGame) {
            playGame = 1;
            drawBall();

            if (time === 0) {
                timerStart();
            }
        }
    });

    let timerStart = () => {
        setTimeout(() => {
            time++;
            let min = Math.floor(time / 60);
            let sec = time - min * 60;

            $('.game__time').text(`Time: ${('00' + min).slice(-2)}:${('00' + sec).slice(-2)}`);
            timerStart();
        }, 1000)
    }


    let drawBall = () => {
        if (playGame === 1) {
            setTimeout(() => {
                if (positionBall[0] + dx > 585 || positionBall[0] + dx < 5) {
                    dx = -dx;
                }

                positionBall[0] += dx;
                positionBall[1] += dy;

                if (positionBall[1] === 530 && (positionBall[0] > leftPlatform && positionBall[0]+3 < leftPlatform + 100)) {
                    dy = -dy;
                } else {
                    if (positionBall[1] === 560) {
                        hp -= 10;
                        $('.game__hp').text(`HP: ${hp}`);
                        playGame = 0;
                        positionBall[1] = 530;
                        dx = 2;
                        dy = -2
                    }
                }

                $('.game__ball').css({
                    left: positionBall[0] + 'px',
                    top: positionBall[1] + 'px'
                });

                let row = Math.floor((positionBall[1] + dy + 15) / 35);
                let cell = Math.floor((positionBall[0] + dx) / 35);

                if (blockGrid[row] && blockGrid[row][cell] === 1) {
                    blockGrid[row][cell] = 0;
                    $(`.grid__cell--${row}-${cell}`).remove();
                    dy = -dy;
                    score++;
                    $('.game__score').text(`Score: ${score}`);
                }

                if(positionBall[1] === 0){
                    dy = -dy;
                }

                drawBall();
            }, 8)
        }
    }

    drawGrid();
})