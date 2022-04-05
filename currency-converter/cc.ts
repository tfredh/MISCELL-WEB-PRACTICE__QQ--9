import { stat } from "fs/promises";
import React, { useState, useEffect, useReducer, useRef } from "react";
import "./App.css";

export default function App(): JSX.Element {
    return (
        <div>
            <h1>uhhhhhhhhhhh</h1>
            <hr />

            {/* <Testing /> */}
            <Bing />
        </div>
    );
}

const BING_ACTIONS = {
    SETUP_STATE: "setup-state",
    EDIT_STATE: "edit-state",

    CHANGE_QUANTITY: "change-quality",
};
// hard declared bc will be using these later
const FROM_CURRENCY_INPUT = "fromCurrencyInput";
const TO_CURRENCY_INPUT = "toCurrencyInput";
const FROM_CURRENCY_TYPE = "fromCurrencyType";
const TO_CURRENCY_TYPE = "toCurrencyType";
interface BingState {
    currencies: Array<string> | null;
    conversion: number | null;

    [FROM_CURRENCY_INPUT]: number | null;
    [TO_CURRENCY_INPUT]: number | null;

    [FROM_CURRENCY_TYPE]: string | null;
    [TO_CURRENCY_TYPE]: string | null;
}
interface BingActions {
    type: string;
    payload: {
        initialData?: BingState;
        change?: { toChange: keyof BingState; changeTo: string | number }; // can be arry<str too>

        eurChanged?: boolean;
    };
}
const BASE_URL =
    "http://api.exchangeratesapi.io/v1/latest?access_key=71c2319a3b5892096ef12102eb3e02ea";
function reducer(state: BingState, { type, payload }: BingActions): BingState {
    switch (type) {
        case BING_ACTIONS.SETUP_STATE:
            // the api call will call this method to update the entire

            return payload.initialData as BingState;

        case BING_ACTIONS.CHANGE_QUANTITY:
            return payload.eurChanged
                ? {
                      ...state,
                      [FROM_CURRENCY_INPUT]: +(payload.change
                          ?.changeTo as number),
                      [TO_CURRENCY_INPUT]:
                          +(payload.change?.changeTo as number) *
                          (state.conversion as number),
                  }
                : {
                      ...state,
                      [FROM_CURRENCY_INPUT]:
                          +(payload.change?.changeTo as number) /
                          (state.conversion as number),
                      [TO_CURRENCY_INPUT]: payload.change?.changeTo as number,
                  };

        case BING_ACTIONS.EDIT_STATE:
            if (
                (payload.change?.toChange as keyof BingState) in
                Object.keys(state)
            ) {
                console.error(
                    "attempting to edit state item that does not exist (in bingreducer)"
                );
                return state;
            }

            if (
                typeof payload.change?.changeTo !==
                typeof state[payload.change?.toChange as keyof BingState]
            ) {
                console.warn(
                    "attemping to change state item to value with wrong corresponding type"
                );
                return state;
            }
            return {
                ...state,
                [payload.change?.toChange as string]: payload.change?.changeTo,
            };

        default:
            console.error("in reducer defualt");
            return state;
    }
}
function Bing() {
    const [state, dispatch] = useReducer(reducer, {
        [FROM_CURRENCY_INPUT]: null,
        [TO_CURRENCY_INPUT]: null,
        [FROM_CURRENCY_TYPE]: null,
        [TO_CURRENCY_TYPE]: null,

        currencies: null,
        conversion: null,
    });

    useEffect(() => {
        fetch(BASE_URL)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);

                const rates = Object.keys(data.rates);
                dispatch({
                    type: BING_ACTIONS.SETUP_STATE,
                    payload: {
                        initialData: {
                            currencies: [data.base, ...rates],
                            conversion: data.rates[rates[0]],

                            fromCurrencyInput: 1,
                            toCurrencyInput: data.rates[rates[0]],

                            fromCurrencyType: data.base,
                            toCurrencyType: rates[0],
                        },
                    },
                });
            });
    }, []);

    return (
        <div>
            <h1>Currency idk</h1>
            <CurrencyRow
                isEur={true}
                dispatch={dispatch}
                state={state}
                inputKey={FROM_CURRENCY_INPUT}
                selectKey={FROM_CURRENCY_TYPE}
            />
            <p>=</p>
            <CurrencyRow
                isEur={false}
                dispatch={dispatch}
                state={state}
                inputKey={TO_CURRENCY_INPUT}
                selectKey={TO_CURRENCY_TYPE}
            />
        </div>
    );
}

interface CurrencyRow {
    isEur: boolean;
    dispatch: React.Dispatch<BingActions>;
    state: BingState;
    inputKey: string;
    selectKey: string;
}
function CurrencyRow({
    isEur,
    dispatch,
    state,
    inputKey,
    selectKey,
}: CurrencyRow): JSX.Element {
    return (
        <div>
            <input
                type="text"
                value={state[inputKey as keyof BingState] || ""}
                onChange={(ev) =>
                    dispatch({
                        type: BING_ACTIONS.CHANGE_QUANTITY,
                        payload: {
                            change: {
                                toChange: inputKey as keyof BingState,
                                changeTo: ev.target.value,
                            },
                            eurChanged: isEur,
                        },
                    })
                }
            />
            <select
                value={state[selectKey as keyof BingState] || ""}
                onChange={(ev) =>
                    dispatch({
                        type: BING_ACTIONS.EDIT_STATE,
                        payload: {
                            change: {
                                toChange: selectKey as keyof BingState,
                                changeTo: ev.target.value,
                            },
                        },
                    })
                }
            >
                {state.currencies?.map((currency) => (
                    // isn't the 'value' prop below useless?
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
        </div>
    );
}

function Testing(): JSX.Element {
    const [state, dispatch] = useReducer(testred, {
        some: "stuf",
        other: 1,
    });

    return (
        <div>
            <input
                onChange={(e: any) =>
                    dispatch({
                        type: "a",
                        payload: { updated: e.target.value },
                    })
                }
            />
            <div>{JSON.stringify(state)}</div>
        </div>
    );
}
function testred(state: any, { type, payload }: any) {
    switch (type) {
        case "a":
            console.log(typeof payload.updated);
            return { ...state, other: payload.updated };
    }
}
