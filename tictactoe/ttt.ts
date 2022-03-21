/* what i learned
// any call of dispatch causes RERENDER
*/

const TTT_ACTIONS = {
    CHECK_WIN: "check-win",
    PLAYER_MOVE: "player-move",
    COMPUTER_MOVE: "computer-move",
    RESTART: "restart",
    SEE_HISTORY: "see-history",
};
const WINNER_MESSAGES = {
    X: "You have won",
    O: "Computer has won",
    T: "Tie",
};

type TTTMove = number; // 0 to 8 inclusive (every block on the board)
type Play = "X" | "O";
type BOARD_FILLER = "";
type Board = (Play | BOARD_FILLER)[]; // the X's and O's

interface TTTState {
    gameOver: boolean;
    winnerMessage: string | null;
    computerMoving: boolean;
    movesMade: number;
    board: Board;
    playHistory: Board[];
    onCurrent: boolean;
}
interface TTTAction {
    type: string;
    payload: {
        move?: TTTMove;
    };
}

function* infinte(): Generator<number, void, unknown> {
    let x = 0;
    while (true) {
        yield x++;
    }
}
const inf = infinte();

const gameOver = (movesMade: number, board: Board): string | false => {
    // returns winner messaGe (either X or O for player or computer respective) of theres a winner or false for game still ongoing

    const lineMaps = [
        // column
        ...Array.from({ length: 3 }, (_, i) => i).map((i) =>
            Array.from({ length: 3 }, (_, j) => board[3 * j + i])
        ),

        // rows
        ...Array.from({ length: 3 }, (_, i) => i * 3).map((i) =>
            Array.from({ length: 3 }, (_, j) => board[i + j])
        ),

        // diagonals

        // up left to down right diag
        Array.from({ length: 3 }, (_, i) => board[i * 4]),
        // top right to bot left diag
        Array.from({ length: 3 }, (_, i) => board[2 * i + 2]),
    ];

    for (const line of lineMaps) {
        if (line.every((move) => line[0] !== "" && move === line[0]))
            return WINNER_MESSAGES[line[0] as Play];
    }

    if (movesMade === 9) return WINNER_MESSAGES["T"]; // board is full
    return false;
};

function tttReducer(state: TTTState, { type, payload }: TTTAction): TTTState {
    // switch cases dont have guards bc
    // they are stopped in the onclick handler in the fc
    switch (type) {
        case TTT_ACTIONS.CHECK_WIN:
            if (state.movesMade < 5) return state; // impossible win here

            const status = gameOver(state.movesMade, state.board);
            return status
                ? { ...state, gameOver: true, winnerMessage: status }
                : state;

        case TTT_ACTIONS.PLAYER_MOVE:
            const playBoard = state.board.map((val, i) =>
                i === payload.move ? "X" : val
            );

            return {
                ...state,
                computerMoving: true,
                movesMade: state.movesMade + 1,
                board: playBoard,
                playHistory: [...state.playHistory, playBoard],
            };

        case TTT_ACTIONS.COMPUTER_MOVE:
            if (state.gameOver) return state;

            const compOptions = state.board
                .map((val: string, i: number) => (!val ? i : false))
                .filter((val: number | boolean) => val !== false);
            const compMove =
                compOptions[Math.floor(Math.random() * compOptions.length)];
            const compBoard = state.board.map((val, i) =>
                i === compMove ? "O" : val
            );

            return {
                ...state,
                computerMoving: false,
                movesMade: state.movesMade + 1,
                board: compBoard,
                playHistory: [...state.playHistory, compBoard],
            };

        case TTT_ACTIONS.RESTART:
            return {
                ...state,
                gameOver: false,
                winnerMessage: null,
                computerMoving: false,
                movesMade: 0,
                board: Array.from({ length: 9 }, () => ""),
                playHistory: [],
            };

        case TTT_ACTIONS.SEE_HISTORY:
            return {
                ...state,
                board: state.playHistory[payload.move as number],
                onCurrent: payload.move === state.movesMade - 1 && true,
            };

        default:
            console.warn("invalid type arg to tttreducer");
            return state;
    }
}

function TTT(): JSX.Element {
    const [state, dispatch] = useReducer(tttReducer, {
        gameOver: false,
        winnerMessage: null,
        computerMoving: false,
        movesMade: 0,
        board: Array.from({ length: 9 }, () => "") as Board,
        playHistory: [],
        onCurrent: true,
    });

    const sleep = (seconds: number): Promise<void> =>
        new Promise((r) => {
            setTimeout(r, seconds * 1000);
        });
    const moveHandler = async (position: TTTMove): Promise<void> => {
        // async handler to restrict movement of the user during the flow while the computer "thinks"

        if (
            state.board[position] ||
            !state.onCurrent ||
            ["computerMoving", "gameOver"].some((val) => (state as any)[val])
        )
            return;

        dispatch({
            type: TTT_ACTIONS.PLAYER_MOVE,
            payload: { move: position },
        });
        dispatch({ type: TTT_ACTIONS.CHECK_WIN, payload: {} });
        await sleep(0.3); // computer 'thinking'
        dispatch({ type: TTT_ACTIONS.COMPUTER_MOVE, payload: {} });
        dispatch({ type: TTT_ACTIONS.CHECK_WIN, payload: {} });
    };

    return (
        <div className="ttt">
            <div className="ttt-grid">
                {state.board.map((spotText, i) => (
                    <button
                        key={inf.next().value as number}
                        onClick={() => moveHandler(i)}
                    >
                        {spotText}
                    </button>
                ))}
            </div>

            <div className="move-history">
                {Array.from({ length: 9 }, (_, i) => i).map(
                    (val, i) =>
                        i < state.movesMade && (
                            <button
                                key={inf.next().value as number}
                                onClick={() =>
                                    dispatch({
                                        type: TTT_ACTIONS.SEE_HISTORY,
                                        payload: { move: i },
                                    })
                                }
                            >
                                Move #{val + 1}
                                {i + 1 === state.movesMade && " (current)"}
                            </button>
                        )
                )}
            </div>

            <p>{state.gameOver && state.winnerMessage}</p>
            {state.gameOver && (
                <button
                    onClick={() =>
                        dispatch({ type: TTT_ACTIONS.RESTART, payload: {} })
                    }
                >
                    restart
                </button>
            )}
        </div>
    );
}
