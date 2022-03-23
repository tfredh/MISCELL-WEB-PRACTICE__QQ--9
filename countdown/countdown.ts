type MDate = number;
type TimeComponents = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

function Whew(): JSX.Element {
    const dateTarget: MDate = new Date("2022/03/22 20:55:10").getTime();
    const date: MDate = new Date().getTime();

    const [secondsTill, setSecondsTill] = useState<number>(
        (dateTarget - date) / 1000
    );
    const [ended, setEnded] = useState<boolean>(false);

    const sortedTimes: TimeComponents = {
        days: secondsTill / 86400,
        hours: (secondsTill % 86400) / 3600,
        minutes: ((secondsTill % 86400) % 3600) / 60,
        seconds: secondsTill % 60,
    };
    Object.keys(sortedTimes).forEach(
        (key) =>
            (sortedTimes[key as keyof typeof sortedTimes] = Math.floor(
                sortedTimes[key as keyof typeof sortedTimes]
            ))
    ); // remove decimals

    useEffect((): void => {
        const countdown: NodeJS.Timer = setInterval((): void => {
            setSecondsTill((sec: number): number => sec - 1);
        }, 1000);
        
        // on timeout change state of 'completed' to true and add text
        setTimeout((): void => clearInterval(countdown), secondsTill * 1000);
    }, []);
    useEffect(() => {
        if (!Math.floor(secondsTill)) {
            setEnded((prevStatus) => !prevStatus);
        }
    }, [secondsTill]);

    return (
        <div>
            <Times times={sortedTimes} />
            <div>k</div>
            <div>{ended && "AAAAAAAAAAAAAAAAAA"}</div>
        </div>
    );
}

function Times({ times }: any): JSX.Element {
    const [days, hours, minutes, seconds] = Object.values(times);

    return (
        <div className="countdown-container">
            <div className="outer-time">{days}</div>
            <div className="outer-time">:</div>
            <div className="outer-time">{hours}</div>
            <div className="outer-time">:</div>
            <div className="outer-time">{minutes}</div>
            <div className="outer-time">:</div>
            <div className="outer-time">{seconds}</div>

            <div className="inner-time">days</div>
            <div className="inner-time"></div>
            <div className="inner-time">hours</div>
            <div className="inner-time"></div>
            <div className="inner-time">minutes</div>
            <div className="inner-time"></div>
            <div className="inner-time">seconds</div>
        </div>
    );
}
