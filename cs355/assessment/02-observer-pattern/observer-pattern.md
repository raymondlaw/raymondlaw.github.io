# Observer Pattern Assessment

From here on out the solution requirements are not as easy to define as input/output as the scale in which they operate has increased.  I will try my best to describe what I want, but if something is unclear please reach out to me.



## Prerequisites

1. [Download and run all the demo's and familiarize yourself with the observer pattern.](../../lectures/08-observer-pattern/observer-pattern.html)
2. Read / Watch the supplementary content
3. ==[Download](resources/02-observer-pattern.zip) the exercise files==



## Exercises

1. **Synchronize the Stocks**   (Callbacks Review)

   ![q1](images\q1.gif)

   

   Starting with the Stock Portfolio Simulator example:

   Edit `index.html` replacing the **multiple** calls to `console.log()` with a **single** call to `console.table()`  As `console.table` requires a single tabular dataset, the data must be condensed into a single array.  Use synchronization techniques covered in assignment one, to only print the table after all `newday` events have come in.

   What columns you choose to print out do not matter.  In my example I choose the simplest choice of printing out the entire emitted object.  Do not worry about the formatting of individual data types.

   

   Helper functions used in my solution.  Your solution might find these useful:

   	`console.clear()`, `process.stdout.cursorTo(0, 1)`

   

   

2. **Quote of the Day ** 

   ![q2](images\q2.gif)

   

   Using DayEmitter create two files: 

   1. `modules/QuoteEmitter.js` 

      * The constructor accepts a `DayEmitter` object.  It listens for a `newday` event and emits a `qotd` event that includes a random quote as it's second argument.  

      * A list of quotes can be found in `data/quotes.json`

   2. `index.js` that will print a calendar on each `newday` event and a quote on each `qotd` event.

      Use `console.clear()` to clear the console between days.

      Ignore issues with long lines wrapping in the console.

      



3. **Price Notifications** 

   ![q3](images\q3.gif)

   

   Starting with the Stock Portfolio Simulator (with a smaller portfolio) create two files:
   
   1. `modules/PriceEmitter.js`
   
      * The constructor accepts a Stock (emitter) object, a target_price, and direction (`above` or `below`)
   
        `data/stock-alerts.json` contains price alert data, but ensure Stock emitters are created first.
   
      * PriceEmitter emits a `price-alert` when a certain price threshold is passed.  The second argument on the emitter should be an object containing date, ticker, target_price, direction, and price.
   
   2. `index.js` will listens for `price-alert` events and prints out a message to console.
   
      



4. **Bad Word Detection** 

   ![q4](images\q4.gif)
   
   
   
   This question has you writing a program to keep track of how many bad words a user has used in a fictional chat application.
   
   Create two files:
   
   1. `modules/BadWordEmitter.js`
   
      * The constructor accepts an array of `badwords` and a readline interface `rl`
   
        It will listens to [`line` events](https://nodejs.org/api/readline.html#readline_event_line) from `rl`.  For each word found that has a match inside `badwords`, emit a signal `badword`.  Each `badword` signal does not have any additional data.  If a user types in multiple Bad Words, multiple signals should be emitted.
   
      * A list of Bad Words can be found in `data/badwords.json`
   
      * Matches should be case insensitive.
   
   2. `index.js` listens for `badword` events and will keep a counter on top of the program.  The counter should appears after the user has said their first bad word.
   
   



5. **Morse Decoder** 

   ![q5](images\q5.gif)

   
   
   Morse code is a method used in telecommunication to encode text characters as standardized sequences of two different signals, dots (`.`) and dashes (`-`).  We add a third signal `break` to denote the end of a character, which is traditionally done by having a short pause.
   
   
   
   1. Create a file `index.js` that decodes the secret message emitted by `MorseEmitterEncypted.js`
      
      * Listen for events  `.`,`-`, and `break` emitted by `MorseEmitter`
      * When a `.` or `-` event is heard add the respective symbol to a variable `morse_character`
      * When a `break` event is heard convert `morse_character` into an ascii character and print it using `process.stdout.write()`
      * Repeat until there are no more signals being emitted.
      
      
      
      Hints: 
      
      * `data/morse-code.json` contains a table to assist in converting from morse. 
      * Ignore spaces, they won't appear in my tests.
   
   
   
   
   
   2. The previous step must be completed first
   
      Create a file `modules/MorseEmitter.js` that acts as a replacement for `MorseEmitterEncrypted.js`.  Your version will be improved, because it won't have a built in delay unlike mine. 
   
      * The constructor accepts a string `message` representing the text to encode.
      * The MorseEmitter class should have a `start()` method, that when called will convert `message` into Morse code and then emit a combination of three signals (`.`, `-`, and `break`) representing `message`. 
      * These signals can then be picked up by `index.js` which from the previous step should be able to decode the the Morse code.
   
      Hints:
   
      * `data/morse-code.json` contains a table to assist in converting to morse. 
   
      * Remove any spaces from the input before the conversion process starts.
   
      * Test your code by changing `index.js` to point to `modules/MorseEmitter` instead
   
        

