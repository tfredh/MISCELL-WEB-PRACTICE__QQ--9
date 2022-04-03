import React, { useState, useEffect, useReducer, useRef } from "react";
import "./App.css";

export default function App(): JSX.Element {
    return (
        <div>
            <h1>uhhhhhhhhhhh</h1>
            <hr />

            {/* <Testing /> */}
            <Ting />
        </div>
    );
}

const TING_ACTIONS = {
    BACK_PAGE: "back-page",
    NEXT_PAGE: "next-page",
};
interface TingState {
    wordsPage: number;
    visibleWords: Array<string>;
}
interface TingActions {
    type: keyof typeof TING_ACTIONS;
    payload: {
        words: Array<string>;
    };
}
function reducer(state: TingState, { type, payload }: TingActions): TingState {
    switch (type) {
        case TING_ACTIONS.BACK_PAGE:
            if (!state.wordsPage) return state;

            return {
                wordsPage: state.wordsPage - 1,
                visibleWords: payload.words.slice(
                    (state.wordsPage - 1) * 10,
                    state.wordsPage * 10
                ),
            };

        case TING_ACTIONS.NEXT_PAGE:
            if (state.wordsPage === 30) return state;
            
            return {
                wordsPage: state.wordsPage + 1,
                visibleWords: payload.words.slice(
                    (state.wordsPage + 1) * 10,
                    (state.wordsPage + 2) * 10
                ),
            };

        default:
            console.warn("inside reducer's default");
            return state;
    }
}
function Ting(): React.ReactElement {
    const rawWords =
        "about|above|add|after|again|air|all|almost|along|also|always|America|an|and|animal|another|answer|any|are|around|as|ask|at|away|back|be|because|been|before|began|begin|being|below|between|big|book|both|boy|but|by|call|came|can|car|carry|change|children|city|close|come|could|country|cut|day|did|different|do|does|don't|down|each|earth|eat|end|enough|even|every|example|eye|face|family|far|father|feet|few|find|first|follow|food|for|form|found|four|from|get|girl|give|go|good|got|great|group|grow|had|hand|hard|has|have|he|head|hear|help|her|here|high|him|his|home|house|how|idea|if|important|in|Indian|into|is|it|its|it's|just|keep|kind|know|land|large|last|later|learn|leave|left|let|letter|life|light|like|line|list|little|live|long|look|made|make|man|many|may|me|mean|men|might|mile|miss|more|most|mother|mountain|move|much|must|my|name|near|need|never|new|next|night|no|not|now|number|of|off|often|oil|old|on|once|one|only|open|or|other|our|out|over|own|page|paper|part|people|picture|place|plant|play|point|put|question|quick|quickly|quite|read|really|right|river|run|said|same|saw|say|school|sea|second|see|seem|sentence|set|she|should|show|side|small|so|some|something|sometimes|song|soon|sound|spell|start|state|still|stop|story|study|such|take|talk|tell|than|that|the|their|them|then|there|these|they|thing|think|this|those|thought|three|through|time|to|together|too|took|tree|try|turn|two|under|until|up|us|use|very|walk|want|was|watch|water|way|we|well|went|were|what|when|where|which|while|white|who|why|will|with|without|word|work|world|would|write|year|you|young|your";
    const words = rawWords.split("|");

    const [state, dispatch] = useReducer(reducer, {
        wordsPage: 0,
        visibleWords: words.slice(0, 10),
    });

    return (
        <div>
            {state.visibleWords.map((word) => (
                <div key={word} className="word">
                    {word}
                </div>
            ))}

            <button
                onClick={() =>
                    dispatch({
                        type: TING_ACTIONS.BACK_PAGE as keyof typeof TING_ACTIONS,
                        payload: { words },
                    })
                }
            >
                go backkk
            </button>
            <button
                onClick={() =>
                    dispatch({
                        type: TING_ACTIONS.NEXT_PAGE as keyof typeof TING_ACTIONS,
                        payload: { words },
                    })
                }
            >
                go forward
            </button>
        </div>
    );
}




function Testing(): JSX.Element {
    const [state, dispatch] = useReducer(testred, { some: "stuf", other: 1, new: 4 });

    return <div>
        <button onClick={() => dispatch({type:'a', payload: {updated: 'asd'}})}>jkhjkl</button>
        {state.new}
    </div>;
}
function testred(state: any, { type, payload }: any) {
    switch (type) {
        case "a":
            console.log(--state.new)
            return { ...state, some: state.new.toString(), other: state.new };
    }
}
