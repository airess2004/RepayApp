/*

Queue.js

A function to represent a queue

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue(){

  // initialise the queue and offset
  var queue  = [];
  var offset = 0;

  // Returns the offset of the queue, which might be needed to check for duplicated element when elements need to be unique
  this.getOffset = function(){
    return (offset);
  };
  
  // Returns the internal array of the queue, which might be needed to check for duplicated element when elements need to be unique
  this.getList = function(){
    return (queue);
  };
  
  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  };

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length == 0);
  };
  
  // Clear queue.
  this.clear = function(){
  	offset = 0;
    queue.length = 0;
  };

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item){
    queue.push(item);
  };

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function(){

    // if the queue is empty, return immediately
    if (queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;

  };

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   * Edit: When specified idx parameter can be used to peek at specific location
   */
  this.peek = function(idx){
  	var len = queue.length;
    return (len > 0 ? idx ? (idx >= 0) && (idx < len - offset) ? queue[idx + offset] : undefined : queue[offset] : undefined); //(queue.length > 0 ? queue[offset] : undefined);
  };
  
  // Replace the element at specific index, might me needed to update an element when elements need to be unique
  this.replaceAt = function(idx, element){
  	var len = queue.length;
  	if (idx && (len > 0) && (idx >= 0) && (idx < len - offset)) {
  		var obj = queue[idx + offset];
  		queue[idx + offset] = element;
  		return obj; //true
  	}
    return undefined; //false
  };

}
