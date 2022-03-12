/// <reference path="knight.ts" />

class GameAI {
    // let the AI choose a move, and update both the
    // knight and the gamestate
    
    public static moveKnight(king:King, knights: Knight[], gameState:GameState) {
        let t0 = performance.now();

         // TODO: remove random move, amnd replace with AI move

        // RANDOM MOVE - START ------------------

        console.log(king); // only to avoid error: 'king' is declared but its value is never read.

        // choose knight to move
        let i:number =  Math.floor(Math.random() * Math.floor(knights.length));

        let legalMoves: [number, number][] = knights[i].getMoves();

        console.log(legalMoves);

        let j:number =  Math.floor(Math.random() * Math.floor(legalMoves.length));

        knights[i].setPosition(legalMoves[j]);
        gameState.knightPositions[i] = legalMoves[j];

        // RANDOM MOVE - END   ------------------

        let t1 = performance.now();
        console.log("AI move took " + (t1 - t0) + " milliseconds.");

    }

    public static minimax(
        gameState : GameState, 
        depth : number,
        alpha : number,
        beta : number,
        isMaximizingPlayer : boolean,
        ) : number
    {
        // Terminating condition. i.e leaf node is reached
        if (depth == 0 || gameState.getScore()[1]) {
            return gameState.getScore()[0]
        }

        // to check possible moves
        let king : King = new King()
        let knight : Knight = new Knight()
        let currentEval = 0


        // If current move is maximizer, find the maximum attainable value
        if (isMaximizingPlayer) {
            let maxEval = -Infinity
            for(let possibleMove of king.getMoves(gameState.kingPos)) {
                gameState.kingPos = possibleMove

                currentEval = this.minimax(gameState, depth - 1, alpha, beta, false)
                maxEval = Math.max(maxEval, currentEval)

                alpha = Math.max(alpha, currentEval)
                if (beta <= alpha) {
                    break
                }
            }
            return maxEval
        }

        // Else (If current move is Minimizer), find the minimum attainable value
        else {
            let minEval = Infinity

            for (let knIndex = 0; knIndex < gameState.knightPositions.length; knIndex++) {
                for(let possibleMove of knight.getMoves(gameState.knightPositions[knIndex])) {
                    gameState.knightPositions[knIndex] = possibleMove
    
                    currentEval = this.minimax(gameState, depth - 1, alpha, beta, true)
                    minEval = Math.max(minEval, currentEval)
    
                    beta = Math.max(beta, currentEval)
                    if (beta <= alpha) {
                        break
                    }
                }
            }
            return minEval
        }
    }            

}