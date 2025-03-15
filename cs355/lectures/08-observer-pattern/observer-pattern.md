# Observer Pattern



==[Download Files](https://github.com/raymondlaw/observer-pattern/archive/main.zip)==

The observer pattern is a widely used design pattern popularized by the [Gang of Four Design Patterns book](https://en.wikipedia.org/wiki/Design_Patterns) typically used to model event driven applications where events can be intermittent in nature.  

## Learning Goals

* The observer pattern.


## Prerequisite

[ES6 Class notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) : We will be extending the Node.js EventEmitter class which is written using ES6 class notation.



## Callback Limitations

* Fire only once (singular nature)

  * Recursion can be used to get multiple fires, but the code can get messy.

* There is an expectation that the callback will eventually occur.  Does not work well for events that could possibly never occur.

* Callback APIs **require** a callback

  ```js
  // Write a file asynchronously (for caching purposes)
  const fs = require("fs");
  
  fs.writeFile("file.txt", "Data");               // Invalid
  // Error: Callback must be a function. Received undefined
  
  fs.writeFile("file.txt", "Data", () => {});     // Correct
  // We supply it a callback that does nothing
  ```

* Callbacks can notify only one particular entity that it is finished.

* Callbacks need to be at the end



## Subjects and Observers

The observer pattern defines a one-to-many dependency between observable (aka subjects) and observers.  An instance of a subject can <u>emit</u> a signal to all observers when specific conditions apply. 

Observers, upon receiving an <u>emit</u> signal will add a callback to the event queue.  If they receive multiple signals, multiple events will be added to the queue.

The Observer Pattern is implemented using the [EventEmitter class](https://nodejs.org/api/events.html) in Node.js.



There are two components in this pattern:

1. Registering an event listener.
   * Node.js: Using the EventEmitter's `on()` method
   * Browser: Using the DOM's  `addEventListener()` method
2. If necessary writing the conditions that emit the event.  Most third party API's provide this, but we will be writing out own emitters starting from the second demo.





## Built In Emitters (Readline)

Readline is a Node.js package that provides support for console I/O.

Readline's interface class is an example of a built in emitter that applications can register listeners to.  We can create a instance of this with the `createInterface()` function, where we provide data streams for input and (optionally) output.  For simplicity we will only be using input in this example.

The interface has several *events*, but most developers will only care about the [`line` event](https://nodejs.org/api/readline.html#readline_event_line), which triggers each time a new line character is entered.



<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F01%2Freadline-a.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>





Multiple event listeners fire independently.  If a listener is registered twice, it's callback executes twice.

<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F01%2Freadline-b.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>



On each new line the input message will be printed twice.  If you only want to register a one-time listener the `once()` method can be used instead of `on()`.



A common mistake is putting the event listener  (`rl.on("line")` in this example) inside the callback creating recursive code, where an exponential number of listeners is created.

<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F01%2Freadline-c.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>







## Creating Our Own Emitter:   `DayEmitter.js`

The [EventEmitter class](https://nodejs.org/api/events.html#events_events) comes with two fundamental methods [`on()`](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener) and [`emit()`](https://nodejs.org/api/events.html#events_emitter_emit_eventname_args)

In the previous example we used `rl.on("line")` to execute a callback each time a new line character is encountered.  The `line` event is emitted by Node.js's API when the user enters a newline.  But it is possible to listen to much more than built-in events by writing our own class that extends `EventEmitter`.

The `DayEmitter` class simulates a calendar by emitting a `newday` event every 240ms.  

<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F02%2Fmodules%2FDayEmitter.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>



We can then use the same class's `on()` method to attach a callback to the `newday` event.  The callback in this case erases the previous date and writes the new date on line zero.  Because a `newday` event is emitted every 240 milliseconds, this callback is executed multiple times.

<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F02%2Findex.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>





> Run this in terminal and not VS Code's integrated debugger, because we move the console cursor which is not supported.



### EventEmitter

Objects of type `EventEmitter` have a pair of methods `on()` and  `emit()`.  (This first file `DayEmitter.js` uses `emit()`, the second file `index.js` uses `on()`)

#### on(eventName, listener) 

Registers a listener for `eventName` (String).  Once registered, each time an event is emitted the `listener` (callback) is  added to the event queue.  This process is typically referred to as adding an event listener.

#### emit(eventName, ...data)

Signals to all registered listeners to execute their callback.  All arguments after this are data sent to the listener.



### Line by line breakdown

#### DayEmitter.js

Once started, code jump between `start()` and `sleep()` emitting `newday` events on each cycle.

1. `constructor()` is called when the `new` keyword is used. 
   * The call to `super()` will get us all of `EventEmitter`'s methods including `emit()` and `on()`
   * `update_time` is how many milliseconds represent a day (default `240ms`)
   * We will store the current date in `this.day` (Initialized to today)
* We will store how long each day lasts as `this.update_time` (milliseconds)
  
2. `start()`

   Updates the internal date, then signals to all listeners via `emit()` that a new day has arrived.

   `emit()` - Although multiple arguments can be used to send back data, I prefer to pass a single object via the second argument.  This is done to not lock myself into requiring arguments be in a specific order.  If I want to add more data besides `mm_dd` later on, this can be easily done without breaking existing code by extending the object returned.

   After the event is emitted the thread sleeps.

3. `sleep()`

   Uses `setTimeout()` to simulate sleeping for a specified period and then calling `start()`

5. `module.exports = DayEmitter;`

   Exports the `DayEmitter` class so that it can be invoked using a require statement.



#### index.js

1. `require("./DayEmitter")` 

   Looks for a file `DayEmitter.js` and imports `module.exports`.  Stores class into `DayEmitter`
   
   [More detail on import and require](https://www.freecodecamp.org/news/requiring-modules-in-node-js-everything-you-need-to-know-e7fbd119be8/)
   
2. `new DayEmitter()`

   Instantiates an object of class `DayEmitter`, call it `day_emitter`

3. `day_emitter.on()`

   As DayEmitter inherits from EventEmitter it inherits the method `on()` and is able to listen to emitted events.  In this scenario we are listening to the `newday` event.

4. `process.stdout.cursorTo(0, 0);`

   Changes the cursor to x and y coordinates (0,0) in the terminal.

5. `process.stdout.clearLine();`

   erases the existing content on the line.

6. `process.stdout.write(mm_dd);`

   Writes data to console.

7. `process.stdout.cursorTo(0, 1);`

   Changes the cursor to x and y coordinates (0,1) in the terminal.

8. `console.clear();`

   Clear the terminal

9. `day_emitter.start();`  

   Now that a listener is registered we can start the emitter to have those `emit()` calls caught.

   

### setTimeout(callback, ms)

Libuv provides support for spawning a timer on a separate thread that waits a specified number of milliseconds to be elapsed before adding `callback` to the event queue after a.  `setTimeout` does not make any guarantees on when `callback` gets executed, if you have a long running task occupying the stack, the callback will wait.  If you have an infinite loop on the stack, the callback is never executed.  (Because of this setTimeout only guarantees a minimum delay)

The ordering of arguments is weird (`callback`, `ms`) because JavaScript must maintain backwards compatibility and thus, must live with all the mistakes it's designers have made in the past.  (We saw this previously in the Date objects `getMonth()` method starting at 0)



[Arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) usage in the `DayEmitter` example is important as arrow functions do not have a binding to `this` and instead will bind to the lexical `this`.  

Using a function expression inside `setTimeout` will bind `this` to a different object: `Timeout` in Node.js, `Window` in a Browser.  When we are supplying a callback that reference's `this` to another function like `setTimeout`, arrow function allows us to ensure `this` is properly referenced.



<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F03%2FThisExample.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>





> #### Why does Timeout Object print?
>
> `setTimeout()` when called by Node uses `new Timeout()` to [create a Timeout object and passes the callback into it](https://github.com/nodejs/node/blob/e028ea0291b845e4bec3c7cff7319a027b8c815e/lib/timers.js#L146).
>
> This new `Timeout` object becomes what `this` is referring to.



For the assessment, students should use `DayEmitter` when they need a clock.  You shouldn't need to directly use `setTimeout()` in any question, so I'm keeping it banned.

More details on how `this` is resolved
**Reference:** https://stackoverflow.com/a/12371105/992856



## Birthday Emitter

`BirthdayEmitter.js` accepts a list of `birthdays` and a clock (`day_emitter`).  

It listens for the clocks `newday` events and will cross reference the emitted `mm_dd` with it's list of `birthdays`. each time someone's birthday arrives a birthday event is emitted.  If multiple people share the same birthday multiple events are emitted.

Birthday data is initially seeded from `data/birthdays.json`

<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F04%2Fmodules%2FBirthdayEmitter.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>



* On each `newday` event emitted by `DayEmitter` a `mm_dd` value is supplied representing the current day.

* Parse that value and find all of today's birthdays.

  ​	(I use functional style here, but you can just as easily use a loop)

* For each birthday that remains emit a birthday event.



<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F04%2Findex.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>



Notice we feed in `day_emitter` to `BirthdayEmitter's` constructor, this is so they use the same clock.  This technique will be used again in most of the demos and assignments.

You can remove the commented code to add in code that prints the calendar.  This is why we initially seed `current_line = 1`, to reserve space for calendar.



## Pausing

`DayEmitter` will cycle between `start()` and `sleep()` methods.  To pause execution, we need to stop this this cycle. 

**Example 05A - DayEmitter.js (changes only)**

<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2F4c721ed3d0360ba5999ef5687dc2821a4c91351d%2F05%2Fmodules%2FDayEmitter.js%23L16-L21&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>



`setTimeout()` returns a `timeout_id` which is just a unique integer for each call to `setTimeout()`.
`timeout_id` is used by the function `clearTimeout()` to cancel a timer.  Once cancelled the `start`/`sleep` loop is no longer in effect and the calendar stops.  To resume it, we can just call start again.



```javascript
/* BirthdayEmitter.js (no changes) */
```

Birthday Emitter must first receive a `newday` event before it has any chance to emit.  Pausing does not change this.



**Example 05B - index.js (changes only)**

<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2F4c721ed3d0360ba5999ef5687dc2821a4c91351d%2F05%2Findex.js%23L25-L43&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>



If we want to listen to every keypress instead of waiting for a return key we need to switch to raw mode.  

Notice this also uses the Observer pattern, listening for `keypress` events.

Once in raw, it is possible to listen to specific keypresses with the listener callback having two arguments:

* `character`: The character data received

* `keypress`: Information related to the actual keys on the keyboard hit.  In the the final `else if` notice we switch to `keypress.name` to detect `CTRL+C`, as the character sent back is a `\u0003` (End of text) and not the character `c`  It also contains modifier key information for example if `SHIFT` ,`CTRL`, or `ALT` were being held down during the event.

> You can use console.log(keypress) to view the structure and all additional properties of the keypress object.



## Stock Portfolio Simulator

Simulates end of trading day price of a given portfolio using `DayEmitter.js`

Each day the stocks will generate a new price and emit a `newday` event to all listeners.

Stock prices will move a random percentage up or down bounded by `volatility` each day.  If a stock has 10% volatility, it can increase or decrease 10% each day.  (`projected_growth` changes this bound slightly as it is added after, but because each daily amount is small, it's effect is minimal)

A second parameter `growth` represents the annual projected growth of the company, which will affect the overall direction the fund will trend towards.  The simulation takes this value divides it by 365 and adds it to the random percentage generated.

As an example, a company with `{volatility:0.1, growth:0.365}` will have it's next day price calculated by generating a random value between `-0.1` and `0.1`, then adding `0.365/365` to the generated value.  This percentage is then multiplied with the current stock price to get the daily change.

This model is in no way meant to be accurate.  It is suppose to be a simple demo to demonstrate real world uses of the observable pattern.  I apologize to all finance majors who I have offended with my simplistic view of your industry.



<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F06%2Fmodules%2FStock.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>





This file is similar to `BirthdayEmitter.js` in that it takes a `day_emitter` object and listens for `newday` events, and then emits it's own events.

It has two helper static methods `tommorrow_price()` and `round()` used in the calculations of a Stock's  future price, but for the most part we can treat these as backboxes and ignore the internal details.



`round()` is a helper function that rounds to two decimal places.  `Number.EPSILON` is used to ensure `1.005` round's properly.

> https://stackoverflow.com/a/11832950/992856



<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F06%2Findex.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>







---

There is a third file `pretty.js` which acts as a drop in replacement for `index.js`.  It has additional code that adds padding and color to the output to make it look more tabular, but is otherwise the same as `index.js`





## Publisher Subscriber Pattern (pubsub)

Publisher Subscriber pattern is an advanced application of the observer pattern where we have a third entity that facilitates delivery of messages.  This third entity can take on many forms for example a messaging server or a **queue**.  This third entity grants us a decoupling of the publisher from subscribers.

The publisher (observable) does not need to know of the existence of the subscriber (observer) and the subscribers do not need to know the existence of publishers.  Instead subscribers will subscribe to messaging servers for an event.  Publisher emit signals to the MessagingServer which will then catch and re-emit messages to all subscribers.

This decoupling allows for subscribers to exist without any publisher and vice versa.  New subscribers and publishers can be dynamically added and removed and the workflow continues as normal.



<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F07%2Fmodules%2FMessageServer.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>



`MessageServer` act as intermediaries, forwarding messages from publishers to subscribers.  



<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F07%2Fmodules%2FPublisher.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>



`Publishers` can register with a MessageServer using `register()`  
Once registered, the `message_server` will be notified of a given publisher's `publish` event.  



<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F07%2Fmodules%2FSubscriber.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>



`Subscribers` can subscribe to MessageServers using `subscribe()`.  
Once subscribed, each `subscriber` will be notified of a MessageServer's `publish` event.

When a message is received, `this.onReceive` is executed.  The default is to print to console, but we will change the behavior in order to more better visualize each event.



<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fraymondlaw%2Fobserver-pattern%2Fblob%2Fmain%2F07%2Findex.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>





This demo may require you resize your console, publications are truncated to fit in the three columns.  Each column represents a subscribers mailbox.

This demo has 3 publishers, 3 messaging servers, and 3 subscribers.

Press keys `1,2,3` to fire publish events from each of the three publishers `Cat Chronicles`, `Cat Facts`, and `Daily Dog` respectively.



### this.method.bind(this)

This function appears in both `MessagingServer.js` and `Subscriber.js`

The `forward` and `receive` functions is called from  a different context (`Publisher` and `MessagingServer` respectively) 

Without the binding of this in the constructor calls to `this.forward` and `this.receive` will cause errors because `this` will refer to the event emitting class and not the subscriber.  

It will try to execute `Publisher.forward()` and `MessagingServer.receive()` respectively.

The `bind()` method returns back a duplicate function where `this` has been hard bound to a specific object.  We then replace the existing methods with this bound version.



## Push / Pull

When using the observer pattern you can choose how to structure your data flow.  There are two widely used models:

### Push Model

This is what we've seen until now.  The observer is sent the data wrapped in an object and needs to process it.  It always receives the data which creates efficiency problems if the emitted object is large or the observer does not need the data on every event. There is also a tight coupling in this model, as observable typically require knowledge of the observer.

### Pull Model

In the pull model, the observer is notified that an event was emitted and if it wants the data, must do so in a separate request.  This keeps your API's decoupled and allows both the observer and the observable to be swapped out with another API as long as they follow the same event syntax.



## Messaging Brokers

What are the benefits to using the PubSub model?



<iframe width="800" height="450" src="https://www.youtube.com/embed/7rkeORD4jSw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>















