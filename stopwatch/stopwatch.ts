function Stopwatch(): JSX.Element {
	const [time, setTime] 		= useState<number>(0)
  	const [running, setRunning] = useState<boolean>(false)

	useEffect((): (() => void) | void => {
		if (!running) return

		const timerInterval: NodeJS.Timer = setInterval((): void => {
			setTime((prev: number): number => prev + 10)
		}, 10)
		return (): void => clearInterval(timerInterval)
	}, [running])

	const times = [
		NaN, 
		Math.floor((time / 60000) % 60), 
		Math.floor((time / 1000) % 60), 
		((time / 10) % 100)
	].map(t => !isNaN(t) ? ('0' + t).slice(-2) : null)

	return <div className='time-box'>
		<div className="time-data-container">
			{times.map((time): JSX.Element | null => time ? <div className='time-data'>{time}</div> : null)}
		</div>
		
		<div className='buttons'>
			<button 
				className={`${running ? 'stop' : 'start'}`} 
				onClick={(): void => setRunning((prev: boolean): boolean => !prev)}>
				{running ? 'Stop run' : 'Start run'}
			</button>
			<button className='reset' onClick={(): void => setTime(0)}>reset</button>
		</div>
	</div>
}
