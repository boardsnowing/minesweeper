/**
 * draw.js
 * Create and show the cells
 * Copyright (c) 2021 Yuya.Eguchi
*/

class Draw{
    constructor(difficulty){
        //各種制御のためのクラス生成
        this.config = new Config();
        this.config.setDifficulty(difficulty);
        this.boardCtrl = new Board(this.config.getDifficulty());


        //configより取得
        this.width = this.config.getButtonSize()[0];
        this.height = this.config.getButtonSize()[1];
        this.backgroundColor = this.config.getBackgroundColor();
        this.col = this.config.getDifficulty().col;
        this.row = this.config.getDifficulty().row;

        //HTMLからステージの元となる要素を取得
        //盤面のデータ
        this.boardElement = document.getElementById("minesweeper_content");

        //初回実施かどうか
        this.startFlag = true;
        this.gameContinue = true;
        //時間
        this.frame = 0;
        this.timer;


    }

    initialize(){

        //盤面リセット
        this.resetBoard();

        //リセットボタンをリセット
        this.drawResetButton("🤔", this.config.getBackgroundColor());
        this.drawLastBomb(0);



        //盤面の生成
        this.createBoard();
        // //debug用にsetBomb
        // this.boardCtrl.setBomb(0, 0);
        // this.boardCtrl.setHintNumber();
        // this.drawBoard(this.boardCtrl.getTruthBoard());
    }

    //ボタン配置のリセット
    resetBoard(){
        while(this.boardElement.firstChild){
            this.boardElement.removeChild(this.boardElement.firstChild);
        }
    }

    //盤面の描画
    createBoard(){
        let board = this.boardCtrl.getGameBoard();
        for(let y = 0; y < this.row; ++y){
            for(let x = 0; x < this.col; ++x){
                //ボタンを配置
                this.setButton(x, y, board[y][x]);
            }

            //改行を追加
            this.boardElement.appendChild(document.createElement("br"));
        }
    }

    //盤面の更新
    drawBoard(board){
        //盤面を取得
        for(let y = 0; y < this.row; ++y){
            for(let x = 0; x < this.col; ++x){
                //ボタンテキストを取得
                let buttonText = this.getButtonText(board[y][x]);
                //更新するボタンを取得
                let targetButtonElement = document.getElementById(`${x}_${y}`);
                if(buttonText != "□" && buttonText != "🚩"){
                    //開示済みの場合はdisabledに
                    targetButtonElement.setAttribute("disabled", true);
                }
                targetButtonElement.textContent = buttonText;

            }
        }
    }

    //タイマーの更新
    drawTimer(elapsedTime){
        let timer = document.getElementById("time");
        timer.textContent = ('000' + elapsedTime).slice(-3);

    }

    //爆弾の残り個数を更新
    drawLastBomb(last_mine){
        let lastMine = document.getElementById("last_mine");
        lastMine.textContent = ('000' + last_mine).slice(-3);
    }

    //リセットボタンの色と文字を変更
    drawResetButton(text, backgroundColor){
        let resetButton = document.getElementById("reset");
        resetButton.style.backgroundColor = backgroundColor;
        resetButton.textContent = text;

    }

    //Boardに配置されているオブジェクトから描画するものを選択する
    setButton(x, y, number){
        let word = this.getButtonText(number);

        //ボタンを追加して当てはめていく
        let cell = document.createElement("button");
        cell.id = `${x}_${y}`;
        cell.textContent = word;
        cell.style.width = this.width + "px";
        cell.style.height = this.height + "px";

        //左クリックの開示処理
        cell.addEventListener("click", () =>{
            //IDからxとyを取得
            let idSplit = cell.id.split('_');
            let x = Number(idSplit[0]);
            let y = Number(idSplit[1])

            if(this.startFlag){
                this.boardCtrl.startGame(x, y);
                this.drawLastBomb(this.boardCtrl.getLastBombCount());
                this.timer = setInterval(() => {
                    this.drawTimer(this.frame);
                    ++this.frame;
                    //限界突破した場合999に
                    if(this.frame >= 1000){
                        this.frame = 999;
                    }
                }, (1000));

                this.startFlag = false;
            }


            if(!this.boardCtrl.open(x, y)){
                //爆弾を当てたなら終了
                this.stopTimer();
                console.log("gameover");

                //リセットボタンを黄色くして敗北演出
                this.drawResetButton("😵", this.config.getLoseColor());

                this.drawBoard(this.boardCtrl.getTruthBoard());

            }
            //クリアチェック
            else if(this.boardCtrl.isGameClear()){
                //クリアしたらタイマーストップ
                console.log("clear");
                this.stopTimer();

                //リセットボタンを黄色くして勝利演出
                this.drawResetButton("😄", this.config.getWinColor());
            }
            else {
                this.drawBoard(this.boardCtrl.getGameBoard());
            }
        });

        //右クリックの旗設置処理
        cell.addEventListener("contextmenu", () =>{
            let idSplit = cell.id.split('_');
            let x = Number(idSplit[0]);
            let y = Number(idSplit[1])
            this.boardCtrl.setFlag(x, y);
            this.drawBoard(this.boardCtrl.getGameBoard());

            //表示する爆弾の個数を更新
            this.drawLastBomb(this.boardCtrl.getLastBombCount());
        });

        this.boardElement.appendChild(cell);
        return word;

    }

    //ボタンに入れるテキストを取得
    getButtonText(number){
        let word = "□"
        //爆弾
        if(number === -1){
            word = "💣";
        }
        //Flag
        else if(number === -2 || number === -3){
            word = "🚩";
        }
        //未開示
        else if(number === 100){
            word = "□";
        }
        //開示済
        else if(number === 1000){
            word = "／";
        }
        //正解
        else if(number === 0){
            word = "."
        }
        //それ以外の数値
        else if(number < 10){
            word = number;
        }
        //それ以外はそのまま白Block

        return word;
    }

    //タイマーをクリア
    clearTimer(){
        //タイマーをリセット
        clearInterval(this.timer);
        this.frame = 0;
        this.drawTimer(this.frame);
    }

    //タイマーを停止
    stopTimer(){
        clearInterval(this.timer);
    }
};