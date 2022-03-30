import React, { useState, useEffect, useReducer } from "react";
import "./App.css";

export default function App(): JSX.Element {
    return (
        <div>
            <h1>uhhhhhhhhhhh</h1>
            <hr />

            {/* <Testing /> */}
            <Kamp />
        </div>
    );
}

function Kamp(): JSX.Element {
    const [t, setT] = useState('')

    return (
        <div>
            <div className="code-back">
                <div className="code-space">
                    <div className="code-space-header">HTML<button>min</button></div>
                    <input type="text" value={t} onChange={e => setT(e.target.value)}/>
                </div>
                <div className="code-space">
                    <div className="code-space-header">CSS<button>min</button></div>
                    <input type="text" />
                </div>
                <div className="code-space">
                    <div className="code-space-header">JS<button>min</button></div>
                    <input type="text" />
                </div>
            </div>

            <div className="code-display">
                {JSON.parse('<div>k</div>')}
            </div>
        </div>
    );
}

function Testing(): JSX.Element {
    const [noth, setNoth] = useState(0);
    const [inp, setinp] = useState("");
    const [state, dispatch] = useReducer(reducer, { some: "stuf" });

    useEffect(() => console.log(inp), [inp]);

    return (
        <div>
            <input type="text" value={inp} onChange={e => setinp(e.target.value)}/>
            {inp}
        </div>
    );
}

function reducer(state: any, { type, payload }: any) {
    switch (type) {
        case "getdata":
            console.log("in the state: " + JSON.stringify(state));
            return state;
        case "a":
            return { ...state, some: payload.updated };
        case "b":
            return { ...state, place: "new" };
    }
}
