Calculate the time spent

You can easily calculate how much time a function takes to run, using time() and timeEnd()

const doSomething = () => console.log('test')
const measureDoingSomething = () => {
  console.time('doSomething()')
  // do something, and measure the time it takes
  doSomething()
  console.timeEnd('doSomething()')
}

measureDoingSomething()
