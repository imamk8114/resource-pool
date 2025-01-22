// Manual Release
class ResourcePoolMember{
  constructor(data){
    this.data = data;
    this.available = true;
  }
}

class ResourcePool {
  poolArray = null;
  
  // this two will be provided externally
  // this is default delcaration:
  creatorFunc = () => {};
  resetFunction = () => {};
  
  constructor(creatorFunc, resetFunction = (any) => any, size = 1000) {
    this.resetFunction = resetFunction;
    this.creatorFunc = creatorFunc;
    this.poolArray = new Array(size)
      .fill(0)
      .map(() => this.createElement());
  }
  
  // this will create a fresh instance
  // reset for safer side
  createElement() {
    const data = this.resetFunction(this.creatorFunc());
    return new ResourcePoolMember(data);
  };
  
  // returns the free resource from the pool
  getElement() {
    for (let i = 0; i < this.poolArray.length; i++) {
      if (this.poolArray[i].available) {
        this.poolArray[i].available = false;
        return this.poolArray[i];
      }
    }
  };
  
  // releases an element
  releaseElement(element) {
    element.available = true;
    this.resetFunction(element.data);
  }
}

// Test
const creatorFunc = () => {return {counter: 0};};
const resetFunc = (coolThing) => {
  coolThing.counter = 0;
  delete coolThing.name;
  return coolThing;
};
const myPool = new ResourcePool(creatorFunc, resetFunc, 1);
const objectThatIsReadyToUse = myPool.getElement();

console.log(objectThatIsReadyToUse);
// {
//   "free": false,
//   "data": {
//     "counter": 0
//   }
// }

// ... doing stuff with objectThatIsReadyToUse.data
objectThatIsReadyToUse.data.counter++;
objectThatIsReadyToUse.data.name = "Prashant";
console.log(objectThatIsReadyToUse);
// {
//   "free": false,
//   "data": {
//     "counter": 1,
//     "name": "Prashant"
//   }
// }

myPool.releaseElement(objectThatIsReadyToUse);
console.log(objectThatIsReadyToUse);
// {
//   "free": true,
//   "data": {
//     "counter": 0
//   }
// }


// Duration based
// class ResourcePoolMember{
//   constructor(data){
//     this.data = data;
//     this.time = 0;
//   }
// }

// const DURATION = 3000;

// class ResourcePool {
//   poolArray = null;
  
//   creatorFunc = () => {};
//   resetFunc = () => {};
  
//   constructor(creatorFunc, resetFunction = (any) => any, size = 1000){
//     this.resetFunction = resetFunction;
//     this.creatorFunc = creatorFunc;
//     this.poolArray = new Array(size).fill(0).map(() => this.createElement());
//   }
  
//   createElement() {
//     const data = this.resetFunction(this.creatorFunc());
//     return new ResourcePoolMember(data);
//   }
  
//   getElement(){
//     for(let i = 0; i < this.poolArray.length; i++){
//       if((Date.now() - this.poolArray[i].time) > DURATION) {
//         this.releaseElement(this.poolArray[i]);
        
//         this.poolArray[i].time = Date.now();
        
//         return this.poolArray[i];
//       }
//     }
    
//     return null;
//   }
  
//   releaseElement(element){
//     element.time = 0;
//     this.resetFunction(element.data);
//   }
// }

// const creatorFunc = () => {
//   return {
//     counter: 0
//   }
// };

// const resetFunc = (obj) => {
//   obj.counter = 0;
//   delete obj.name;
//   return obj;
// }

// // singleton design pattern on resource pool
// const myPool = new ResourcePool(creatorFunc, resetFunc, 1);

// const objToUse = myPool.getElement();
// console.log(objToUse);

// setTimeout(() => {
//   const objToUse2 = myPool.getElement();
//   console.log(objToUse2);
// }, 4000);
