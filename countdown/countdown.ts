type MDate = any | Date | "any because there's no type safe option"
type TimeComponents = { days: number; hours: number; minutes: number; seconds: number; } | any
function Whew(): JSX.Element {
	const dateTarget: MDate = new Date('2022/03/11 14:36:00'), date: MDate = new Date()
	const [secondsTill, setSecondsTill] 	= useState<number>((dateTarget - date) / 1000)	

	const sortedTimes: TimeComponents = {
		days: secondsTill / 86400,
		hours: secondsTill % 86400 / 3600,
		minutes: secondsTill % 86400 % 3600 / 60,
		seconds: secondsTill % 60
	}; Object.keys(sortedTimes).forEach(key => sortedTimes[key] = Math.floor(sortedTimes[key])) // remove decimals
	
	useEffect((): void => {
		const countdown: NodeJS.Timer = setInterval((): void => setSecondsTill((sec: number): number => sec - 1), 1000)
		setTimeout((): void => clearInterval(countdown), secondsTill * 1000)
	}, [])

	return <div>
		<div className='countdown-container'>
			{
				Object.keys(sortedTimes).map(
					(key, ind) => 
					<div className='outer-time'>
						{sortedTimes[key]}{ind !== Object.keys(sortedTimes).length - 1 && ':'}
						<div className='inner-time'>{key}</div>
					</div>)
			}
		</div>
	</div>
}
