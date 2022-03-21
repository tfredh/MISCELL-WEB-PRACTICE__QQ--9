const FROG_A: string 	= 'Fa'
const FROG_B: string 	= 'Fb'
const EMPTY_PAD: string = '_'

const START_POS: string[] = [Array(3).fill(FROG_A), EMPTY_PAD, Array(3).fill(FROG_B)].flat()
let MAP: string[] = [...START_POS]
const WIN_POSITION: string[] = [START_POS.slice(4), EMPTY_PAD, START_POS.slice(0, 3)].flat()
let movesRecord: string[] = [START_POS.join(' ')]

// utility
function allEqual<T>(arr: T[], equalTo: T): boolean {
	return arr.every((val: T) => val == equalTo)
}

for (let runs = 0; !(MAP === WIN_POSITION); ) {
	let failed: boolean = false
	MAP.forEach((frog: string, index: number): void => {
		// check if two of same frogs going in wanted direction consecutively - results in fail
		if (failed) return
		switch (frog) {
			case FROG_A:
				// start checking at index two since impossible for cases to happen before
				
				break
			case FROG_B:
				// start going back from index 4 for same reason as last
				
				break // BRUHHHHHH

			case EMPTY_PAD:
				
		}
	});


	if (failed) {
		console.log(`Run ${++runs} failed: ${MAP.join(' ')}`)
		MAP = [...START_POS]
		movesRecord = [START_POS.join(' ')]
	}

	// in case the randomly picked move isn't a valid move, infinite loop allows repick
	while (true) {
		let pick: number = Math.floor(Math.random() * MAP.length)
		if (MAP[pick] == EMPTY_PAD) continue

		// make random movement if valid
		switch (MAP[pick]) {
			case FROG_A: 
				if ((MAP[pick + 1] == FROG_B) && (MAP[pick + 2] == EMPTY_PAD)) {
					[MAP[pick], MAP[pick + 2]] = [MAP[pick + 2], MAP[pick]]
				}
				else if (MAP[pick + 1] == EMPTY_PAD) {
					[MAP[pick], MAP[pick + 1]] = [MAP[pick + 1], MAP[pick]]
				}
				break;

			case FROG_B:
				if ((MAP[pick - 1] == FROG_A) && MAP[pick - 2] == EMPTY_PAD) {
					[MAP[pick], MAP[pick - 2]] = [MAP[pick - 2], MAP[pick]]
				}
				else if (MAP[pick - 1] == EMPTY_PAD) {
					[MAP[pick], MAP[pick - 1]] = [MAP[pick - 1], MAP[pick]]
				}
		}

		// movesRecord.push(MAP.join(' '))
		break // successful move found at this point, iteration is complete
	}

	// const equalArrays = (arr1, arr2) => ...

	// fix this, this doesnt check if arrays are equal
	// if (MAP === WIN_POSITION) {
	// 	console.log(`Win - Winning set\n${'-'.repeat(40)}`)
	// 	for (const move of movesRecord) {
	// 		console.log(move)
	// 	}
	// }
}

console.timeEnd('The frog jump was finished in')
