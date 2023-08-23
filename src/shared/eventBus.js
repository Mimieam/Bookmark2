import { EventEnum } from "./eventHandlers";

export class EventBus {
    constructor() {
      this.events = {};
      this.eventLog = [];
      this.subscribers = {};
    }

    _subscribe(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
    }

    // note - symbols are private and wont show up in Object.keys/entries or even in JSON.stringify
    // Object.getOwnPropertySymbols(this.subscribers[listener])
    // sym.map(s=> reversed[s])
    // this.subscribers[listener][sym[0]]
    // this.subscribers[listener][sym[0]]

    subscribe(topic, listener, cb){
      // console.log(topic, listener)
      this.subscribers[listener] = {...(this.subscribers[listener] || []), ...{[topic]: cb}};
      let reversed = Object.fromEntries(Object.entries(EventEnum).map(([key, value]) => [value, key]))
      console.log(`listener (${listener}) is subscribed to topics:`,this.subscribers[listener])
      console.log(`listener (${listener}) is subscribed to topics:`,Object.getOwnPropertySymbols(this.subscribers[listener]).map(s=> reversed[s]))
      if (!this.events[topic]) {
        this.events[topic] = [];
      }
      this.events[topic] = {...(this.events[topic] || []), ...{[listener]: cb}};
    }

    subscribeToAll(callback) {
      for (const eventName in this.events) {
        this.subscribe(eventName, callback);
      }
    }

    _publish(eventName, data, src) {
      if (!this.events[eventName]) return;

      this.eventLog.push({ eventName, data });
      this.events[eventName].filter().forEach((callback) => callback(data));
    }

    publish(eventName, data, srcName, srcOjb) {
      if (!this.events[eventName]) return;

      this.eventLog.push({ eventName, data, srcName});
      Object.entries(this.events[eventName]).map(([listener, callback]) => {
        console.log(listener, srcName, listener == srcName)
        if (listener!= srcName){
          callback(srcOjb, data)
        }
      });
    }

    _emit(eventName, data,  srcName, srcOjb){
      console.log(`EVENT::${String(eventName)}`, data)
      return this.publish(eventName, data, srcName, srcOjb)
    }

    emit({ event, source }){
      this._emit(event, {}, source?.tree?.id, source)
    }

    replayEvents(componentName) {
      const componentEvents = this.eventLog.filter((event) => event.component === componentName);
      componentEvents.forEach(({ eventName, data }) => {
        this.events[eventName].forEach((callback) => callback(data));
      });
    }

    squashEventsToState(componentName) {
        const componentEvents = this.eventLog.filter((event) => event.component === componentName);

        // Initialize an empty state
        let currentState = {};

        // Process each event and apply its effect on the current state
        componentEvents.forEach(({ eventName, data }) => {
          switch (eventName) {
            case 'updateData':
              currentState = { ...currentState, ...data }; // Merge the data with the current state
              break;
            case 'removeData':
              const newData = { ...currentState };
              delete newData[data]; // Remove data from the current state
              currentState = newData;
              break;
            // Add more cases for other event types as needed
          }
        });

        return currentState;
      }
  }

export class EventBusTool {
    static _eventBus = null;

    constructor() { }

    static getEventBus() {
      // first initialization
      if (this._eventBus == null) {
        console.log("event but init")
        this._eventBus = new EventBus();
      }
      return this._eventBus;
    }
  }

export const eventBus = EventBusTool.getEventBus();
console.log({eventBus })

export default eventBus
