// code is copied from https://www.youtube.com/watch?v=DgRrrOt0Vr8
// followthrough just 4 learning
// not posting my personal attempt cuz no point
const CALC_ACTIONS = {
	ADD_DIGIT: 'add-digit',
	CHOOSE_OPERATION: 'choose-operation',
	CLEAR: 'clear-action',
	DELETE_DIGIT: 'delete-digit',
	EVALUATE: 'evaluate'
}
interface CalculatorState {
	overwrite: boolean
	currOper: string
	prevOper: string
	operation: '+' | '-' | '*' | '/' | ''
}
interface CalculatorActions {
	type: string
	payload: {
		digit?: string
		operation?: '+' | '-' | '*' | '/' | ''
	}
}
interface DigButProps {
	dispatch: React.Dispatch<CalculatorActions>
	digit: string
}
interface OperButProps {
	dispatch: React.Dispatch<CalculatorActions>
	operation: '+' | '-' | '*' | '/' | ''
}

function reducer(state: CalculatorState, { type, payload }: CalculatorActions): CalculatorState {
	const calculator = ({ prevOper, operation, currOper }: CalculatorState): string => {
		const prev = +prevOper
		const curr = +currOper

		if (![prev, curr].every(val => !isNaN(val)))	return ''

		return {
			'+': (val1: number, val2: number): number => val1 + val2,
			'-': (val1: number, val2: number): number => val1 - val2,
			'*': (val1: number, val2: number): number => val1 * val2,
			'/': (val1: number, val2: number): number => val1 / val2,
			'': () => "this will never happen, this is an escape for ts typing"
		}[operation](prev, curr).toString()
	}
	
	switch (type) {
		case CALC_ACTIONS.ADD_DIGIT:
			if (state.overwrite) return { ...state, overwrite: false, currOper: payload.digit || '' }
			if (
				(payload.digit === '0' && state.currOper === '0') 
				|| (payload.digit === '.' && state.currOper.includes('.'))
			) return state
			return { ...state, currOper: state.currOper + payload.digit }

		case CALC_ACTIONS.CHOOSE_OPERATION:
			if (!state.prevOper && !state.currOper)
				return state
			if (!state.prevOper)
				return { ...state, prevOper: state.currOper, operation: payload.operation || '', currOper: '' }
			if (!state.currOper) 
				return { ...state, operation: payload.operation || '' }
			return { ...state, prevOper: calculator(state), operation: payload.operation || '', currOper: '' }

		case CALC_ACTIONS.CLEAR:
			return { overwrite: false, prevOper: '', operation: '', currOper: '' }

		case CALC_ACTIONS.DELETE_DIGIT: // r
			if (state.overwrite) return reducer(state, { type: CALC_ACTIONS.CLEAR, payload: {} })
			if (!state.currOper) return state
			return { ...state, currOper: state.currOper.slice(0, -1) }
		
		case CALC_ACTIONS.EVALUATE:
			if ([state.prevOper, state.operation, state.currOper].some(ele => !ele)) 
				return state
			return { overwrite: true, prevOper: '', operation: '', currOper: calculator(state) }

		default:
			console.warn('what')
			return state
	}
}

function formatOper(oper: string): string | undefined {
	if (!oper) return
	
	const [int, dec] = oper.split('.')
	const INT_FORMAT = new Intl.NumberFormat('en-us', {
		maximumFractionDigits: 0
	})
	
	if (dec == null) return INT_FORMAT.format(+int)

	return `${INT_FORMAT.format(+int)}.${dec}`
}
function Calculator(): JSX.Element {
	const [{currOper, prevOper, operation}, dispatch] = 
		useReducer(
			reducer, 
			{ overwrite: false, prevOper: '', operation: '', currOper: '' }
		)

	return <div>
		<div className='calc-grid'>
			<div className='output'>
				<div className='pre-output'>{formatOper(prevOper)} {operation}</div>
				<div className='curr-output'>{formatOper(currOper)}</div>
			</div>

			<button className='span-two' onClick={() => dispatch({ type: CALC_ACTIONS.CLEAR, payload: {} })}>AC</button>
			<button onClick={() => dispatch({ type: CALC_ACTIONS.DELETE_DIGIT, payload: {} })}>DEL</button>
			<OperationBut operation='/' dispatch={dispatch} />

			<DigitBut digit='1' dispatch={dispatch} />
			<DigitBut digit='2' dispatch={dispatch} />
			<DigitBut digit='3' dispatch={dispatch} />
			<OperationBut operation='*' dispatch={dispatch} />

			<DigitBut digit='4' dispatch={dispatch} />
			<DigitBut digit='5' dispatch={dispatch} />
			<DigitBut digit='6' dispatch={dispatch} />
			<OperationBut operation='+' dispatch={dispatch} />

			<DigitBut digit='7' dispatch={dispatch} />
			<DigitBut digit='8' dispatch={dispatch} />
			<DigitBut digit='9' dispatch={dispatch} />
			<OperationBut operation='-' dispatch={dispatch} />

			<DigitBut digit='.' dispatch={dispatch} />
			<DigitBut digit='0' dispatch={dispatch} />
			<button className='span-two' onClick={() => dispatch({ type: CALC_ACTIONS.EVALUATE, payload: {} })}>=</button>
		</div>
	</div>
}

function DigitBut({ dispatch, digit }: DigButProps): JSX.Element {
	// payload: { digit } is just payload: {digit (key): digit (inputted arg val)}
	return <button onClick={() => dispatch({ type: CALC_ACTIONS.ADD_DIGIT, payload: { digit } })}>{digit}</button>
}
function OperationBut({ dispatch, operation }: OperButProps): JSX.Element {
	// payld: {oper} is pyld: {oper (keyname): oper (value)}
	return <button onClick={() => dispatch({ type: CALC_ACTIONS.CHOOSE_OPERATION, payload: { operation } })}>{operation}</button>
}
