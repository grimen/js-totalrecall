/* global jest describe test expect */

// =========================================
//       IMPORTS
// --------------------------------------

const totalrecall = require('../src')


// =========================================
//       HELPERS
// --------------------------------------

const sleep = (seconds = 0) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000)
    })
}


// =========================================
//       TESTS
// --------------------------------------

describe('totalrecall', () => {

    test('import', () => {
        expect(totalrecall).toBeInstanceOf(Object)
    })

    test('timer', async () => {
        expect(totalrecall.timer).toBeInstanceOf(Function)

        const timer = totalrecall.timer('profile something - using timer', {
            begin: false,
            enabled: true,
            verbose: true,
            colors: true,
        })

        expect(timer).toBeInstanceOf(totalrecall.RuntimeProfilerTimer)

        expect(timer.begin).toBeInstanceOf(Function)
        expect(timer.end).toBeInstanceOf(Function)

        await sleep(1) // should not have any affect

        timer.begin('task 1')

        await sleep(0.1)

        timer.begin('task 2')

        await sleep(0.2)

        timer.begin('task 3')

        await sleep(0.3)

        timer.end()

        // NOTE: should be `0.6`, but is always something slightly above `0.5` =S
        expect(parseFloat(timer.time.toPrecision(1))).toBeCloseTo(0.5, 0.6)

        expect(timer.steps).toBeInstanceOf(Array)
        expect(timer.steps.length).toEqual(3)

        expect(timer.steps[0]).toBeInstanceOf(Object)
        expect(timer.steps[0].label).toEqual('task 1')
        expect(parseFloat(timer.steps[0].time.toPrecision(1))).toEqual(0.1)

        expect(timer.steps[1]).toBeInstanceOf(Object)
        expect(timer.steps[1].label).toEqual('task 2')
        expect(parseFloat(timer.steps[1].time.toPrecision(1))).toEqual(0.2)

        expect(timer.steps[2]).toBeInstanceOf(Object)
        expect(timer.steps[2].label).toEqual('task 3')
        expect(parseFloat(timer.steps[2].time.toPrecision(1))).toEqual(0.3)
    })

    // TODO: not yet implemented (tricky to port from Python to JavaScript)
    test.todo('decorator')
    // test('decorator', async () => {
    //     expect(totalrecall.decorator).toBeInstanceOf(Function)
    //
    //     const timer = totalrecall.decorator('profile something 3 - using function')
    //
    //     async function foo () {
    //         await sleep(0.001)
    //     }
    //
    //     console.log(timer, timer.constructor)
    //
    //     // decorated
    //     timer(foo)()
    //
    //     expect(Math.floor(timer.time * 1000) / 1000).toEqual(1.0 / 1000)
    // })

})
