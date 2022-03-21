import { ChromePicker, ColorResult } from 'react-color'

type ColourHash = string
function Okthen(): JSX.Element {
	const [showing, setShowing] = useState<boolean>(false)
	const [colour, setColour] 	= useState<ColourHash>('#fff')
	
	return <div style={{backgroundColor: colour}}>
		<button onClick={(): void => setShowing((stat: boolean): boolean => !stat)}>{showing ? 'show it' : 'no show'}</button>
		{showing && <ChromePicker color={colour} onChange={(selected: ColorResult): void => setColour(selected.hex)} />}
		<h1>{colour}</h1>
	</div>
}
