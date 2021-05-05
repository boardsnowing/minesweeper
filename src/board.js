
/**
 * board.js
 * Set the mines and open cells
 * Copyright (c) 2021 Yuya.Eguchi
*/

class Board
{
    constructor(difficulty) {
        this.truthBoard;
        this.gameBoard;
        //難易度よりボード情報をセット
        this.col = difficulty.col;
        this.row = difficulty.row;
        this.bombs = difficulty.bombs;

        //残りの爆弾の個数と経過時刻をセット
        this.lastBombCount = this.bombs;
        this.elapsedTime = 0;

        //ゲーム開始時刻を保持する
        this.startTime;

        //盤面の属性設定
        this.attr = {
            bomb: -1,
            flaged_bomb: -2,
            flaged_cell: -3,
            not_open: 100,
            opened: 1000
        };

        this.initialize();
    }

    //初期化
    initialize()
    {
        //configよりサイズ取得
        
        //メモリを準備する
        this.gameBoard = new Array(this.row);
        for(let y = 0; y < this.row; ++y){
            this.gameBoard[y] = new Array(this.col).fill(this.attr.not_open);
        }
        this.truthBoard = new Array(this.row);
        for(let y = 0; y < this.row; ++y){
            this.truthBoard[y] = new Array(this.col).fill(0);
        }
    }

    //正解の盤面を取得
    getTruthBoard(){
        return this.truthBoard;
    }

    //ゲーム実行中の盤面を取得
    getGameBoard(){
        return this.gameBoard;
    }

    

    //爆弾を取得
    getLastBombCount(){
        return this.lastBombCount;
    }

    //経過時間を取得
    getElapsedTime(){
        //時間の差分を取得し秒に変換
        this.elapsedTime = Date.now() - this.startTime;
        return (this.elapsedTime / 1000)|0;
    }

    //ゲーム開始
    startGame(clicked_x, clicked_y){
        //ボム設置
        this.setBomb(clicked_x, clicked_y);
        //ヒント設置
        this.setHintNumber();
        //開始時刻をセット
        this.startTime = Date.now();
    }

    //ボム設置
    setBomb(clicked_x, clicked_y){
        //ランダムに設置
        for(let bombCount = 0; bombCount < this.bombs;){
            let pos = {
                x: (Math.random() * this.col)|0,
                y: (Math.random() * this.row)|0};

            
            //すでに爆弾があったらスルー
            if(this.truthBoard[pos.y][pos.x] === this.attr.bomb){
                continue;
            }
            //クリックされた場所ならスルー
            else if(pos.x == clicked_x && pos.y == clicked_y){
                continue;
            }

            //爆弾設置
            this.truthBoard[pos.y][pos.x] = this.attr.bomb;
            ++bombCount;
        }
    }

    //ヒントを設置
    setHintNumber(){
        for(let y = 0; y < this.row; ++y){
            for(let x = 0; x < this.col; ++x){
                let hasUp = (y > 0);
                let hasDown = (y + 1 < this.row);
                let hasLeft = (x > 0);
                let hasRight = (x + 1 < this.col);
                if(this.truthBoard[y][x] == this.attr.bomb){
                    //爆弾だったら、8近傍の数値を+1する
                    if(hasUp && hasLeft     && this.truthBoard[y-1][x-1] !== this.attr.bomb) this.truthBoard[y-1][x-1] += 1;
                    if(hasUp                && this.truthBoard[y-1][x  ] !== this.attr.bomb) this.truthBoard[y-1][x  ] += 1;
                    if(hasUp && hasRight    && this.truthBoard[y-1][x+1] !== this.attr.bomb) this.truthBoard[y-1][x+1] += 1;
                    if(hasLeft              && this.truthBoard[y  ][x-1] !== this.attr.bomb) this.truthBoard[y  ][x-1] += 1;
                    if(hasRight             && this.truthBoard[y  ][x+1] !== this.attr.bomb) this.truthBoard[y  ][x+1] += 1;
                    if(hasDown && hasLeft   && this.truthBoard[y+1][x-1] !== this.attr.bomb) this.truthBoard[y+1][x-1] += 1;
                    if(hasDown              && this.truthBoard[y+1][x  ] !== this.attr.bomb) this.truthBoard[y+1][x  ] += 1;
                    if(hasDown && hasRight  && this.truthBoard[y+1][x+1] !== this.attr.bomb) this.truthBoard[y+1][x+1] += 1;
                }
            }
        }
    }

    //セルを開く
    open(clicked_x, clicked_y){
        //旗だった場合はスキップ
        if(this.gameBoard[clicked_y][clicked_x] == this.attr.flaged_cell || this.gameBoard[clicked_y][clicked_x] === this.attr.flaged_bomb){
            return true;
        }

        let cellValue = this.truthBoard[clicked_y][clicked_x];
        let blContinue = true;
        if(cellValue == this.attr.bomb){
            //爆弾をあてた場合、ゲームオーバー

            blContinue = false;
        }
        else if(0 < cellValue && cellValue <= 9){
            //数値だった場合、そのセルのみオープン
            this.gameBoard[clicked_y][clicked_x] = cellValue;
        }
        else if(cellValue == 0){
            //何もなかった場合、連鎖的にオープン
            this.open_chain(clicked_x, clicked_y);
        }

        return blContinue;
    }

    //連鎖的にセルを開く
    open_chain(clicked_x, clicked_y){
        let stack = new Array();
        stack.push([clicked_x, clicked_y]);
        while(stack.length > 0){
            //オープンする
            let pos = stack.shift();
            let x = pos[0];
            let y = pos[1];

            if(this.gameBoard[y][x] !== this.attr.not_open){
                //すでにopenしている場合はcontinue
                continue;
            }

            this.gameBoard[y][x] = this.attr.opened;

            //隣のセルが開けるかどうか確認
            let no;
            if(x > 0){
                no = this.getOpenNo(x-1, y);
                if(no == 0){
                    //0の場合継続
                    stack.push([x-1, y]);
                }
                else if(no < 0){
                    //0未満の場合何もしない
                }
                else{
                    //0以外の場合開示して終了
                    this.gameBoard[y][x-1] = no;
                }
            }
            if(x + 1 < this.col){
                no = this.getOpenNo(x+1, y);
                if(no == 0){
                    //0の場合継続
                    stack.push([x+1, y]);
                }
                else if(no < 0){
                    //0未満の場合何もしない
                }
                else{
                    //0以外の場合開示して終了
                    this.gameBoard[y][x+1] = no;
                }
            }
            if(y > 0){
                no = this.getOpenNo(x, y-1);
                if(no == 0){
                    //0の場合継続
                    stack.push([x, y-1]);
                }
                else if(no < 0){
                    //0未満の場合何もしない
                }
                else{
                    //0以外の場合開示して終了
                    this.gameBoard[y-1][x] = no;
                }
            }
            if(y + 1 < this.row){
                no = this.getOpenNo(x, y+1);
                if(no == 0){
                    //0の場合継続
                    stack.push([x, y+1]);
                }
                else if(no < 0){
                    //0未満の場合何もしない
                }
                else{
                    //0以外の場合開示して終了
                    this.gameBoard[y+1][x] = no;
                }
            }
        }
    }

    //開示できるかチェック
    getOpenNo(x, y){
        let no = -1;
        if(this.gameBoard[y][x] === this.attr.not_open){
            no = this.truthBoard[y][x];
        }
        return no;

    }

    //旗設置
    setFlag(clicked_x, clicked_y){
        //すでに旗が経っていたら旗を削除
        if(this.gameBoard[clicked_y][clicked_x] === this.attr.flaged_bomb || this.gameBoard[clicked_y][clicked_x] === this.attr.flaged_cell){
            this.gameBoard[clicked_y][clicked_x] = this.attr.not_open;
        }

        else if(this.gameBoard[clicked_y][clicked_x] === this.attr.opened){
            //開示済みの場合何もしない
        }
        else{
            //旗をセット
            this.gameBoard[clicked_y][clicked_x] = (this.truthBoard[clicked_y][clicked_x] === this.attr.bomb) ? this.attr.flaged_bomb : this.attr.flaged_cell;
        }
        this.calcLastBomb();
    }

    //ゲーム終了チェック
    isGameClear(){
        for(let y = 0; y < this.row; ++y){
            for(let x = 0; x < this.col; ++x){
                if(this.truthBoard[y][x] != this.attr.bomb && this.gameBoard[y][x] === this.attr.not_open){
                    //爆弾以外のマスで1つでも開いていないセルがある場合はゲーム継続
                    return false;
                }
            }
        }

        //ここまでくればゲームクリア
        return true;
    }

    //残りの爆弾の個数をセット
    calcLastBomb(){
        let flagNum = 0;
        for(let y = 0; y < this.row; ++y){
            for(let x = 0; x < this.col; ++x){
                if(this.gameBoard[y][x] === this.attr.flaged_bomb || this.gameBoard[y][x] === this.attr.flaged_cell){
                    ++flagNum;
                }
            }
        }
        this.lastBombCount = this.bombs - flagNum;
    }


}

