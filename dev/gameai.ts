/// <reference path="knight.ts" />

class GameAI {
    // let the AI choose a move, and update both the
    // knight and the gamestate

    
    public static depth: number = 5;


    public static moveKnight(king:King, knights: Knight[], gameState:GameState) {
        let t0 = performance.now();


        let bestEval: number = +Infinity
        let bestKnightIndex: number = 0
        let bestMove: [number, number] = [-1, -1]
        let isMaximizingPlayer: boolean = true
    
        for (let kn: number = 0; kn < knights.length; kn++) {
            let legalMoves: [number, number][] = knights[kn].getMoves()

            for (let moveIndex: number = 0; moveIndex < legalMoves.length; moveIndex++) {
                if (!GameAI.checkIfSameKnight(legalMoves[moveIndex], knights)) {
                    let currentMove = legalMoves[moveIndex]
                    let gameStateCopy = gameState.copy()
                    gameStateCopy.knightPositions[kn] = currentMove
                    let currentEval = GameAI.minimax(gameStateCopy, GameAI.depth, isMaximizingPlayer, king, knights)
                    
                    if (currentEval === -100) {
                        console.log("checkmate found!")
                        bestEval = currentEval
                        bestMove = currentMove
                        bestKnightIndex = kn
                        break
                    }
                    if ( 
                    (currentEval < bestEval) && 
                    (Board.isKnightUnderKing(gameState.kingPos, currentMove)) 
                        ) {
                        bestEval = currentEval
                        bestMove = currentMove
                        bestKnightIndex = kn
                    }
                }
            }
        }
        
        // GameAI.depth = 5
        // GameAI.bestKnightIndexAndMove = this.findBestIndexAndMove(GameAI.depth, king, knights, gameState, true)

        // // choose knight to move
        // let i:number =  Math.floor(Math.random() * Math.floor(knights.length));

        // let legalMoves: [number, number][] = knights[i].getMoves();

        // console.log(legalMoves);

        // let j:number =  Math.floor(Math.random() * Math.floor(legalMoves.length));

        // knights[i].setPosition(legalMoves[j]);
        // gameState.knightPositions[i] = legalMoves[j];
        

        knights[bestKnightIndex].setPosition(bestMove)
        gameState.knightPositions[bestKnightIndex] = bestMove

        // RANDOM MOVE - END   ------------------

        let t1 = performance.now();
        console.log("AI move took " + (t1 - t0) + " milliseconds.");

    }

    // public static findBestIndexAndMove(
    //     depth: number, 
    //     king: King, 
    //     knights: Knight[],
    //     gameState: GameState, 
    //     isMaximizingPlayer: boolean) : [number, number, number] {

    //         let knIndex: number = 0
    //         let bestEval: number = -Infinity
    //         let originalGameState: GameState = gameState.copy()

    //         let bestMove: [number, number] = [0,0]
    //         let bestKnIndex: number = 0

    //         for (let knight of knights) {
    //             let moves: [number, number][] = knight.getMoves()

    //             //Knight can't stand on tiles taken by other knights
    //             for (let move of moves) {
    //                 if (!GameAI.checkIfSameKnight(move, knights)) {

    //                     knight.setPosition(move)
    //                     gameState.knightPositions[knIndex] = move

    //                     let moveEval = GameAI.minimax(gameState, depth-1, isMaximizingPlayer, king, knights, knight, knIndex)
    //                     // console.log("move Eval: " + moveEval)

    //                     knights[knIndex].setPosition(originalGameState.knightPositions[knIndex])
    //                     gameState.knightPositions[knIndex] = originalGameState.knightPositions[knIndex]

    //                     if (moveEval > bestEval) {
    //                         bestMove = move
    //                         bestEval = moveEval
    //                         bestKnIndex = knIndex
    //                         console.log("NEW BEST MOVE FOUND!!!!!!!!! " + bestKnIndex + " " + bestMove)
    //                     }

    //                 }
    //             }
    //             knIndex++
    //         }
    //         return [bestKnIndex, bestMove[0], bestMove[1]]
    // }

    
    public static checkIfSameKnight(move: [number, number], knights: Knight[]) : boolean {
        for (let knight of knights) {
            if (Board.samePosition(move, knight.boardPosition)) {
                return true
            }
        }
        return false
    }

    //minimax function
    public static minimax(
        gameState: GameState,
        depth: number,
        isMaximizingPlayer: boolean,
        king: King,
        knights: Knight[]
        ): number {

            // if win/lose or depth reached, return score
            if (gameState.getScore()[1] || depth === 0) {
                return gameState.getScore()[0]
                }

            if (isMaximizingPlayer) {
            let bestEval: number = +Infinity

            for (let k: number = 0; k < knights.length; k++) {
                let position = gameState.knightPositions[k];
                
                let legalMoves: [number, number][] = knights[k].getMoves(position);
                    for (let m: number = 0; m < legalMoves.length; m++) {
                    let gameCopy = gameState.copy();
                    gameCopy.knightPositions[k] = legalMoves[m];
                    let currentEval = GameAI.minimax(gameCopy, depth - 1, false, king, knights);
                    if (currentEval + depth < bestEval) {
                        bestEval = currentEval + depth;
                    }
                }
            }
            return bestEval;

            } else {
            let bestEval: number = -Infinity;
            let position = gameState.kingPos;

            let legalMoves: [number, number][] = king.getMoves(position);
            for (let m: number = 0; m < legalMoves.length; m++) {
                let gameCopy = gameState.copy();
                gameCopy.kingPos = legalMoves[m];
                let currentEval = GameAI.minimax(gameCopy, depth - 1, true, king, knights);
                if (currentEval - depth > bestEval) {
                    bestEval = currentEval - depth;
                }
            }
            return bestEval;
            }
        }
  
}