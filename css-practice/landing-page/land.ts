import React, {
    useState,
    useEffect,
    useReducer,
    useRef,
    useCallback,
    useMemo,
    createContext,
    useContext,
} from "react";
import "./App.css";
import useDebugInformation from "./tink/useDebugInformation";

export default function App(): JSX.Element {
    return (
        <div>
            {/* <h1>uhhhhhhhhhhh</h1>
            <hr /> */}
            {/* <Testing /> */}
            <MyReactFC />
        </div>
    );
}

export function MyReactFC(): JSX.Element {
    // useDebugInformation("MyReactFC", {});

    return (
        <div className="page-container">
            <header>
                <div className="header-logo">Header Logo</div>

                <div className="header-items-container">
                    <div>header link one</div>
                    <div>header link two</div>
                    <div>header link three</div>
                </div>
            </header>

            <div className="section-one-container">
                <div className="section-one-text-container">
                    <div className="section-one-slogan">
                        This website is awesome
                    </div>

                    <div className="section-one-description">
                        This website has some subtext that goes here under the
                        main title. It's a smaller font and the color is lower
                        contrast
                    </div>
                    <button className="section-one-signup">Sign up</button>
                </div>

                <div className="image">Placeholder for image</div>
            </div>

            <div className="section-two-container">
                <div className="section-two-title">
                    Some random information.
                </div>

                <div className="random-information-cards">
                    <RandomInformationCard />
                    <RandomInformationCard />
                    <RandomInformationCard />
                    <RandomInformationCard />
                </div>
            </div>

            <div className="section-three-container">
                <div className="section-three-quote-container">
                    <div className="section-three-quote">
                        Ihis is an inspiring quote, or a testimonial from a
                        Customer. Maybe it's just filling up space, or maybe
                        people will actually read it. Who knows? All I know s
                        that it looks nice.
                    </div>

                    <div className="section-three-quote-by">
                        - Thor, God of Thunder
                    </div>
                </div>
            </div>

            <div className="section-four-container">
                <div className="section-four-items-container">
                    <div>
                        <div className="section-four-main">
                            Call to action! It's time!
                        </div>

                        <div>
                            Sign up for our product by clicking that button
                            right over there!
                        </div>
                    </div>

                    <div className="section-four-button-wrapper">
                        <button className="section-four-signup">Sign up</button>
                    </div>
                </div>
            </div>

            <footer>Copyright o The Odin Project 2021</footer>
        </div>
    );
}
function RandomInformationCard(): JSX.Element {
    return (
        <div className="random-information-card">
            <div className="information-card-box"></div>
            <div>this is some subtext under an illustration or image</div>
        </div>
    );
}

function Testing(): JSX.Element {
    // const [state, dispatch] = useReducer(testred, {
    //     some: "stuf",
    //     other: 1,
    // });

    const [foo, setFoo] = useState(0);

    return <div></div>;
}
function testred(state: any, { type, payload }: any) {
    switch (type) {
        case "a":
            return { ...state, some: payload.updated };
    }
}
