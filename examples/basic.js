
async function main () {

    // =========================================
    //       EXAMPLE
    // --------------------------------------

    const totalrecall = require('../')

    const sleep = (seconds = 0) => {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000)
        })
    }

    // ---------------------------------------------------
    //   EXAMPLE: runtime step profiler
    // ------------------------------------------------

    let profiler = totalrecall.timer('profile something - using timer', {
        begin: false,
    })

    profiler.begin('task 1')

    await sleep(0.1)

    profiler.begin('task 2')

    await sleep(0.2)

    profiler.begin('task 3')

    await sleep(0.3)

    profiler.end()

    console.log('[profiler.time / basic]: TIME:', profiler.time)
    console.log('[profiler.time / basic]: STEPS:', profiler.steps)

    // ---------------------------------------------------
    //   EXAMPLE: runtime step profiler (detailed)
    // ------------------------------------------------

    profiler = totalrecall.timer('profile something - using timer', {
        begin: false,
        enabled: true,
        verbose: true,
        colors: true,
    })

    profiler.begin('task 1')

    await sleep(0.1)

    profiler.begin('task 2')

    await sleep(0.2)

    profiler.begin('task 3')

    await sleep(0.3)

    profiler.end()

    console.log('[profiler.time / detailed]: TIME:', profiler.time)
    console.log('[profiler.time / detailed]: STEPS:', profiler.steps)


    // ---------------------------------------------------
    //   EXAMPLE: runtime function profiler
    // ------------------------------------------------

    // TODO: not yet implemented (tricky to port from Python to JavaScript)
    // profiler = totalrecall.decorator('profile something 2 - using context')

    // // @profiler (future ECMAScript decorator)
    // async function foo () {
    //     await sleep(1)
    // }

    // // decorated
    // profiler(foo)()

    // console.log('[profiler.function / basic]: TIME:', profiler.time)
    // console.log('[profiler.function / basic]: STEPS:', profiler.steps)

}

main()
