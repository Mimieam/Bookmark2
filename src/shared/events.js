import eventBus, { EventBusTool } from "./eventBus";
import { EventEnum, eventEnumHandlers } from "./eventHandlers";

const EventEnumReversed = Object.fromEntries(Object.entries(EventEnum).map(([key, value]) => [value, key]))

export {
    eventBus,
    eventEnumHandlers,
    EventBusTool,
    EventEnum,
    EventEnumReversed
}