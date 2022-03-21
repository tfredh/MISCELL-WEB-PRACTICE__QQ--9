function Clock() {
	const [time, setTime] = useState<Date>(new Date())

	useEffect((): void => {
		setInterval((): void => setTime(new Date()), 1000)
	})
	
	return <div>
		{`${time.getHours()} : ${time.getMonth()} : ${time.getSeconds()}`}
	</div>
}
