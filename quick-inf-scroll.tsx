import { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";

import { appConsoleLog } from "../clientDebugging";
import { RANDOM_UNIQUE_WORDS } from "../utils/constants";
import { API } from "../utils/namespaces";

interface HomeProps {}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
    // appConsoleLog(context.req.headers.cookie);

    return {
        props: {},
    };
};

export default function Home({}: HomeProps): JSX.Element {
    useEffect(() => {
        async function testReq() {
            const data = await API.appPostRequest("/a/", { stuff: 1 });
            console.log(data);
        }
        testReq();

        // API.appGetRequest("/cook", { credentials: "include" });
    }, []);

    const [sleeping, setSleeping] = useState(false);
    const [visibleWords, setVisibleWords] = useState(RANDOM_UNIQUE_WORDS.slice(0, 30));

    const fullObserver = useRef<IntersectionObserver | null>(null);

    // create observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        console.log("inting");
                    }
                });
            },
            {
                threshold: 0.9,
            }
        );

        fullObserver.current = observer;
    }, []);

    const lastWordRefCallback = (node: HTMLDivElement) => {
        if (node == null || sleeping) return;
        if (fullObserver.current) fullObserver.current.disconnect();

        console.log("add", node);

        fullObserver.current = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];

                if (firstEntry.isIntersecting) {
                    console.log("inting");

                    setSleeping(true);
                    setTimeout(() => {
                        setVisibleWords((prevRandomWords) => [
                            ...prevRandomWords,

                            // purposely don't use callback's previous state value to avoid rendering too much
                            ...RANDOM_UNIQUE_WORDS.slice(
                                visibleWords.length,
                                visibleWords.length + 10
                            ),
                        ]);

                        setSleeping(false);
                    }, 1000);
                }
            },
            {
                threshold: 0.9,
            }
        );

        fullObserver.current.observe(node);
    };

    return (
        <div className="homepage-container">
            <h1>asd</h1>
            <button onClick={() => console.log(visibleWords.length)}>check</button>
            {/* @ts-ignore */}
            {/* <button onClick={() => (lastWordRef.current = 1)}>nice</button>
            <button onClick={() => console.log(lastWordRef.current)}>nice</button> */}

            {/* <button onClick={() => console.log(fullObserver.current)}>obs</button> */}

            <div
                style={{
                    marginTop: "2rem",
                    borderLeft: "1rem solid lightgray",
                    borderRight: "1rem solid lightgray",
                    borderTop: "1rem solid lightgray",
                }}
            >
                {visibleWords.map((word, i) => (
                    <div key={word}>
                        <div style={{ fontSize: "2rem" }}>{word}</div>
                        {i === visibleWords.length - 1 &&
                            (visibleWords.length !== RANDOM_UNIQUE_WORDS.length ? (
                                <p ref={lastWordRefCallback} style={{ fontSize: "3rem" }}>
                                    ...
                                </p>
                            ) : (
                                <p>None left</p>
                            ))}
                    </div>
                ))}
            </div>

            {/* <div ref={lastWordRef}>test</div> */}
        </div>
    );
}
