/// <reference path="knight.ts" />

class GameAI {
    // let the AI choose a move, and update both the
    // knight and the gamestate

    
    public static depth: number = 0;

    // [index, pos, pos]
    public static bestKnightIndexAndMove: [number, number, number];

    public static moveKnight(king:King, knights: Knight[], gameState:GameState) {
        let t0 = performance.now();

        // TODO: remove random move, amnd replace with AI move

        // RANDOM MOVE - START ------------------

        console.log(king); // only to avoid error: 'king' is declared but its value is never read.


        // this.minimax(
        //     gameStateCopy,
        //     4,
        //     -Infinity,
        //     Infinity,
        //     false,
        //     king,
        //     knights
        //     )
        

        GameAI.depth = 5
        GameAI.bestKnightIndexAndMove = this.findBestIndexAndMove(GameAI.depth, king, knights, gameState, true)

        // // choose knight to move
        // let i:number =  Math.floor(Math.random() * Math.floor(knights.length));

        // let legalMoves: [number, number][] = knights[i].getMoves();

        // console.log(legalMoves);

        // let j:number =  Math.floor(Math.random() * Math.floor(legalMoves.length));

        // knights[i].setPosition(legalMoves[j]);
        // gameState.knightPositions[i] = legalMoves[j];

        let bestKnightIndex: number = GameAI.bestKnightIndexAndMove[0]
        let bestKnightMove: [number, number] = [GameAI.bestKnightIndexAndMove[1], GameAI.bestKnightIndexAndMove[2]]

        knights[bestKnightIndex].setPosition(bestKnightMove);
        gameState.knightPositions[bestKnightIndex] = bestKnightMove;

        // RANDOM MOVE - END   ------------------

        let t1 = performance.now();
        console.log("AI move took " + (t1 - t0) + " milliseconds.");

    }

    public static findBestIndexAndMove(
        depth: number, 
        king: King, 
        knights: Knight[],
        gameState: GameState, 
        isMaximizingPlayer: boolean) : [number, number, number] {

            let knIndex: number = 0
            let bestEval: number = -Infinity
            let originalGameState: GameState = gameState.copy()

            let bestMove: [number, number] = [0,0]
            let bestKnIndex: number = 0

            for (let knight of knights) {
                let moves: [number, number][] = knight.getMoves()

                //Knight can't stand on tiles taken by other knights
                for (let move of moves) {
                    if (!GameAI.checkIfSameKnight(move, knights)) {

                        knight.setPosition(move)
                        gameState.knightPositions[knIndex] = move

                        let moveEval = GameAI.minimax(gameState, depth-1, isMaximizingPlayer, king, knights, knight, knIndex)
                        // console.log("move Eval: " + moveEval)

                        knights[knIndex].setPosition(originalGameState.knightPositions[knIndex])
                        gameState.knightPositions[knIndex] = originalGameState.knightPositions[knIndex]

                        if (moveEval > bestEval) {
                            bestMove = move
                            bestEval = moveEval
                            bestKnIndex = knIndex
                            console.log("NEW BEST MOVE FOUND!!!!!!!!! " + bestKnIndex + " " + bestMove)
                        }

                    }
                }
                knIndex++
            }
            return [bestKnIndex, bestMove[0], bestMove[1]]
    }

    
    public static checkIfSameKnight(move: [number, number], knights: Knight[]) : boolean {
        for (let knight of knights) {
            if (Board.samePosition(move, knight.boardPosition)) {
                return true
            }
        }
        return false
    }

    public static minimax(
        gameState : GameState, 
        depth : number,
        isMaximizingPlayer : boolean,
        king: King,
        knights: Knight[],
        knight: Knight,
        knIndex: number,
        ) : number
    {

        console.log("depth: " + depth + ", max player: " + isMaximizingPlayer, ", score: " + gameState.getScore())

        let originalGameState: GameState = gameState.copy()
        let score: number = gameState.getScore()[0]

        // Terminating condition if depth is reached or game over
        if (depth == 0 || gameState.getScore()[1]) {
            return score
        }


        // If current move is maximizer, find the maximum attainable value
        if (isMaximizingPlayer) {
            let maxEval = -Infinity

            for (let move of knight.getMoves()) {

                knights[knIndex].setPosition(move)
                gameState.knightPositions[knIndex] = move
                score = gameState.getScore()[0]

                maxEval = Math.max(
                    maxEval,
                    GameAI.minimax(gameState, depth-1, !isMaximizingPlayer, king, knights, knight, knIndex)
                )

                knights[knIndex].setPosition(originalGameState.knightPositions[knIndex])
                gameState.knightPositions[knIndex] = originalGameState.knightPositions[knIndex]

            }
            return maxEval

        } else {
            let maxEval = -1000

            for (let move of king.getMoves()) {

                knights[knIndex].setPosition(move)
                gameState.knightPositions[knIndex] = move
                score = gameState.getScore()[0]

                maxEval = Math.max(
                    maxEval,
                    GameAI.minimax(gameState, depth-1, !isMaximizingPlayer, king, knights, knight, knIndex)
                )

                knights[knIndex].setPosition(originalGameState.knightPositions[knIndex])
                gameState.knightPositions[knIndex] = originalGameState.knightPositions[knIndex]
            }
            return maxEval
            
        }
    }
}