function FakeReducer() {
	const [fake, setFake] = useState( {count: 1, clicks: 1} )

	function editFake(type: string, action?: any) {
		switch (type) {
			case 'countup':
				setFake(pr => ({ ...pr, count: pr.count + 1 }))
				break;
			case 'countdown':
				setFake(pr => ({ ...pr, count: pr.count - 1 }))
				break
			}
		setFake(pr => ({ ...pr, clicks: pr.clicks + 1 }))
	}

	return <div>
		<button onClick={() => editFake('countup')}>add</button>
		<button onClick={() => editFake('countdown')}>sub</button>
		<div>{fake.count}</div>
		<div>{fake.clicks}</div>
	</div>
}
