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

function Ting(): React.ReactElement {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitFailed, setSubmitFailed] = useState(false);

    const submitHandler = () => {
        if (![name, email, message].every((val) => val)) {
            setSubmitFailed(true);
            return;
        }

        [setName, setEmail, setMessage].forEach((stateManager) =>
            stateManager("")
        );
        setSubmitted(true);
        setSubmitFailed(false);
    };
    return (
        <div className="contact-form">
            <div>
                <div className="contact-form-header">🏹 Contact us</div>
            </div>

            <div>
                {submitted && (
                    <div className="contact-notification">
                        Thanks someone will be in touch shortly
                    </div>
                )}
            </div>

            <div>
                <label className="">Name</label>
                <FormItemInput formItem={name} itemHandler={setName} />
            </div>

            <div>
                <label className="">Email</label>
                <FormItemInput formItem={email} itemHandler={setEmail} />
            </div>

            <div>
                <label className="">Message</label>
                <textarea
                    className="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            {submitFailed && (
                <div>
                    <div>You have failed</div>
                </div>
            )}

            <div>
                <button className="" onClick={submitHandler}>
                    Submit
                </button>
            </div>
        </div>
    );
}

interface FormItemInput {
    formItem: string;
    itemHandler: (item: string) => void;
}
function FormItemInput({ formItem, itemHandler }: FormItemInput): JSX.Element {
    return (
        <input
            type="text"
            value={formItem}
            onChange={(e) => itemHandler(e.target.value)}
        />
    );
}

function Testing(): JSX.Element {
    const [noth, setNoth] = useState(0);
    const [inp, setinp] = useState("");
    const [state, dispatch] = useReducer(reducer, { some: "stuf" });

    useEffect(() => console.log(inp), [inp]);

    return (
        <div>
            <input
                type="text"
                value={inp}
                onChange={(e) => setinp(e.target.value)}
            />
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
