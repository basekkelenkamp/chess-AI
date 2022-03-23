class GameState {
    public kingPos: [number, number];               // position of the king in the game in board coordinates
    public knightPositions: [number, number][];     // position of the knights in the game in board coordinates

    constructor(kingPos: [number, number], knightPositions: [number, number][]) {
        this.kingPos = kingPos;
        this.knightPositions = knightPositions;
    }

    // return the value of the state and if the state is terminal (game over)
    // higher value is better gamestate for the king (100 is win, -100 is lose)
    public getScore() : [number, boolean] {
        // game over
        for (let knPos of this.knightPositions) {
            if (Board.samePosition(knPos, this.kingPos)) {
                return [-100, true];
            }
        }

        // win
        if (this.kingPos[1] == 0) {
            return[100, true];
        } 

        // Score based on how close the king is to the finish
        // tile 0: 0,  tile 2: 28,57,  tile 6: 85.71, etc
        // let kingFinishDistance : number = (7 - this.kingPos[1]) * 100 / 7



        // //Calculate knights position
        // let knightScore: number[] = [0]
        // for (let knPos of this.knightPositions) {
        //     if (Board.betterThanKingPos(knPos, this.kingPos)) {
        //         knightScore.push(15)
        //         // return[60, false]
        //     }
        //     if (Board.closeToKing(knPos, this.kingPos)) {
        //         knightScore.push(30)
        //     }
        // }

        // let sumScore: number = 0 
        // if (knightScore.length != 1) {
        //     // add up all numbers in knightScore.
        //     sumScore = knightScore.reduce((a, b) => a + b, 0)
        // }

        

        // // not over yet, return an evaluation of the gamestate
        // // higher number is better for king, lower better for the knights


        // // Hint: use the position of the king stored in this.kingPos
        // return [sumScore, false]
        let kingFinishDistance : number = (7 - this.kingPos[1]) * 100 / 7

        return [kingFinishDistance, false]
    }

    // create a copy of the gamestate (needed by AI to look into the future)
    public copy() : GameState {
        const knightPosCopy  = Object.assign([], this.knightPositions);

        return new GameState(this.kingPos, knightPosCopy)
    }
}