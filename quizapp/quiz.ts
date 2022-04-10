import React, {
    useState,
    useEffect,
    useReducer,
    useRef,
    useCallback,
} from "react";
import "./App.css";

export default function App(): JSX.Element {
    // see if dispatch updates are instant, use async
    return (
        <div>
            <h1>uhhhhhhhhhhh</h1>
            <hr />
            {/* <Testing /> */}
            <Asked />
        </div>
    );
}

// should use enum
const ASKED_ACTIONS = {
    START_GAME: "start-game",
    MAKE_CHOICE: "make-choice",
    NEXT_QUESTION: "next-question",
};
const NUM_QUESTIONS = 10;

interface AskedState {
    gameOn: boolean;

    questions: Array<UtilQuestion>;
    currentQuestion: number; // this will be the index of the current question
    answerHistory: Array<PastQuestion>;

    score: number;
    userAnswer: string; // current problem's answer
}
interface AskedAction {
    type: keyof typeof ASKED_ACTIONS;
    payload: {
        utilQuestions?: Array<UtilQuestion>;
        userAnswer?: string;
        correct_answer?: string;
    };
}

type Question = {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
};
interface UtilQuestion extends Question {
    shuffledAnswers: Array<
        Question["correct_answer"] | Question["incorrect_answers"][number]
    >;
}
// to be stored in history in case it's needed later
interface PastQuestion {
    question: string;
    shuffledAnswers: Array<
        Question["correct_answer"] | Question["incorrect_answers"][number]
    >;
    correct_answer: Question["correct_answer"];

    userAnswer: string;
}

function shuffleArr(arr: any[]) {
    // guys trolling here
    return [...arr].sort(() => Math.random() - 0.5);
}
function reducer(
    state: AskedState,
    { type, payload }: AskedAction
): AskedState {
    switch (type) {
        case ASKED_ACTIONS.START_GAME:
            // this is used for starting game and restarting game after user finishes one
            // not checking if game has already started bc the startHandler below already does

            return {
                ...state,
                gameOn: true,
                questions: payload.utilQuestions as Array<UtilQuestion>,
                currentQuestion: 0,
                answerHistory: [],
                score: 0,
                userAnswer: "",
            };

        case ASKED_ACTIONS.MAKE_CHOICE:
            const current: UtilQuestion =
                state.questions[state.currentQuestion];

            return {
                ...state,

                answerHistory: [
                    ...state.answerHistory,
                    {
                        question: current.question,
                        shuffledAnswers: current.shuffledAnswers,
                        correct_answer: current.correct_answer,
                        userAnswer: payload.userAnswer as string,
                    },
                ],

                score:
                    state.score +
                    +(payload.userAnswer === current.correct_answer),
                userAnswer: payload.userAnswer as string,
            };

        case ASKED_ACTIONS.NEXT_QUESTION:
            // increment number by one, current state therefore also changes

            // answerHistory and score already changed after the user clicked on their answer
            return {
                ...state,
                currentQuestion: state.currentQuestion + 1,
                userAnswer: "",
            };

        default:
            throw new Error("askedReducer not given {type}");
    }
}
const endpoint = "https://opentdb.com/api.php?amount=10&type=multiple";
function Asked(): JSX.Element {
    const [gameStarting, setGameStarting] = useState<boolean>(false);
    const [state, dispatch] = useReducer(reducer, {
        gameOn: false,

        questions: [],
        currentQuestion: 0,
        answerHistory: [],

        score: 0,
        userAnswer: "",
    });

    const startHandler = () => {
        if (gameStarting) return;
        setGameStarting(true);

        fetch(endpoint)
            .then((res) => res.json())
            .then((data) => {
                dispatch({
                    type: ASKED_ACTIONS.START_GAME as keyof typeof ASKED_ACTIONS,
                    payload: {
                        utilQuestions: data.results.map(
                            (question: Question): UtilQuestion => ({
                                ...question,
                                shuffledAnswers: shuffleArr([
                                    question.correct_answer,
                                    ...question.incorrect_answers,
                                ]),
                            })
                        ),
                    },
                });
                console.log(data.results);
                setGameStarting(false);
            });
    };

    return (
        <div>
            <div className="debugging">
                <button onClick={() => console.log(state.questions)}>
                    questions
                </button>
                <button onClick={() => console.log(state)}>state</button>
            </div>

            <h1>React Quiz</h1>
            {!gameStarting && !state.gameOn && (
                <button className="start" onClick={startHandler}>
                    Start
                </button>
            )}
            {gameStarting && <div>Loading game...</div>}

            {state.gameOn && !gameStarting && (
                <div>
                    Score: {state.score} / {state.questions.length}
                </div>
            )}

            {state.gameOn && !gameStarting && (
                <div className="card-container">
                    <QuestionCard
                        state={state}
                        dispatch={dispatch}
                        question={state.questions[state.currentQuestion]}
                    />
                    {state.userAnswer &&
                        state.currentQuestion !== NUM_QUESTIONS - 1 && (
                            <button
                                onClick={() =>
                                    dispatch({
                                        type: ASKED_ACTIONS.NEXT_QUESTION as keyof typeof ASKED_ACTIONS,
                                        payload: {},
                                    })
                                }
                            >
                                Next question
                            </button>
                        )}

                    {state.currentQuestion === NUM_QUESTIONS - 1 &&
                        state.userAnswer && (
                            <button onClick={startHandler}>Restart</button>
                        )}
                </div>
            )}
        </div>
    );
}

interface QuestionCardProps {
    state: AskedState;
    dispatch: React.Dispatch<AskedAction>;
    question: UtilQuestion;
}
function QuestionCard({
    state,
    dispatch,
    question,
}: QuestionCardProps): JSX.Element {
    const buttonClass = ({
        universalClass = "",

        userAnswer,
        correct_answer,
        shuffledAnswer,
    }: any): string | never => {
        const pairs = [
            { condition: !userAnswer, addonClass: "" },

            {
                condition: [correct_answer, userAnswer, shuffledAnswer].every(
                    (ans, _i, arr) => ans === arr[0]
                ),
                addonClass: "correct",
            },

            {
                condition:
                    userAnswer !== correct_answer &&
                    userAnswer === shuffledAnswer,
                addonClass: "wrong",
            },

            /*
            this wont be ran if the user picked the correct answer because the correct 
            class would be called above already this is for the case where the user 
            picks the wrong answer, their click is highlighted during the checks in the
            above conditions, then the right answer is turned green
            */
            {
                condition:
                    userAnswer !== correct_answer &&
                    correct_answer === shuffledAnswer,
                addonClass: "correct",
            },
        ];

        for (const pair of pairs) {
            if (pair.condition) return universalClass + pair.addonClass;
        }

        if (userAnswer !== shuffledAnswer) return "";
        throw new Error(
            `something unexpected is happening in buttonClass, the arguments are not a valid 
            combination to warrent an applying of a class`
        );
    };
    return (
        <div>
            <div>
                Question {state.currentQuestion + 1} / {NUM_QUESTIONS}
            </div>
            <div dangerouslySetInnerHTML={{ __html: question.question }}></div>

            {question.shuffledAnswers.map(
                (
                    shuffledAnswer: typeof question.shuffledAnswers[number]
                ): JSX.Element => {
                    return (
                        <div key={shuffledAnswer}>
                            <button
                                dangerouslySetInnerHTML={{
                                    __html: shuffledAnswer,
                                }}
                                className={buttonClass({
                                    universalClass: "",
                                    userAnswer: state.userAnswer,
                                    correct_answer: question.correct_answer,
                                    shuffledAnswer,
                                })}
                                disabled={!!state.userAnswer}
                                onClick={(
                                    ev: React.MouseEvent<HTMLButtonElement>
                                ) =>
                                    dispatch({
                                        type: ASKED_ACTIONS.MAKE_CHOICE as keyof typeof ASKED_ACTIONS,
                                        payload: {
                                            userAnswer: (
                                                ev.target as HTMLElement
                                            ).innerText,
                                        },
                                    })
                                }
                            ></button>
                        </div>
                    );
                }
            )}
        </div>
    );
}

function Testing(): JSX.Element {
    const [state, dispatch] = useReducer(testred, {
        some: "stuf",
        other: 1,
    });

    const [p, setP] = useState(false);

    const x = [<div>asd</div>, <button>asldkj</button>];
    return <div></div>;
}
function testred(state: any, { type, payload }: any) {
    switch (type) {
        case "a":
            console.log(typeof payload.updated);
            return { ...state, other: payload.updated };
    }
}
