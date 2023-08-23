// import {eventBus} from "./eventBus"

import { EventEnumReversed } from "./events"


const STATUS_ENUM = Object.freeze({
    COMPLETED: 'COMPLETED'
})
export const EventEnum = Object.freeze({
    TreeViewLoaded: Symbol(crypto.randomUUID()),
    TreeViewUpdated: Symbol(crypto.randomUUID()),
    BookmarkUpdated: Symbol(crypto.randomUUID()),
    TreeNodeSelected: Symbol(crypto.randomUUID()),
    Refresh: Symbol(crypto.randomUUID()),
    // helpModeBtn: Symbol(crypto.randomUUID()),
  })

const find_clone = (source, target) => {
    for (let x of target.keyMap.entries()){
        // console.log(x[1].data, source.data, Object.is(x[1].data, source.data), JSON.stringify(x[1].data) == JSON.stringify(source.data))
        if (JSON.stringify(x[1].data) == JSON.stringify(source.data)){
            return x[1]
        }
    }
}

export const eventEnumHandlers = {
    [EventEnum.TreeViewLoaded]: (event, src, dest)=>{
        console.log(`Rcvd::TreeViewLoaded - ${src}>>>${dest}`, event)
        return {
            status: STATUS_ENUM.COMPLETED
        }
    },
    [EventEnum.TreeViewUpdated]: (event, src, dest)=>{
        console.log(`Rcvd::TreeViewUpdated - ${src}>>>${dest}`, event)
    },
    [EventEnum.BookmarkUpdated]: (event, src, dest)=>{
        console.log(`Rcvd::BookmarkUpdated - ${src}>>>${dest}`, event)
    },
    [EventEnum.Refresh]: (event, src, dest)=>{
        console.log(`Rcvd::Refresh - ${src}>>>${dest}`, event)
    },
    [EventEnum.TreeNodeSelected]: async ({event, source, target, data})=>{
        console.log(`Rcvd::TreeNodeSelected - ${source}>>>${target?.key}`, event, data)
        // await target.keyMap.get(source.key).setExpanded(source.expanded)
        // await target.setExpanded(source.expanded)

        const targetNode = find_clone(source, target)
        targetNode.setExpanded(source.expanded)

        return {
            source:source,
            target:target,
            action: EventEnumReversed[EventEnum.TreeNodeSelected],
            status: STATUS_ENUM.COMPLETED,
        }
    },
  }

//   for (const event_name in EventEnum) {
//     // eventBus.subscribe(EventEnum[event_name], eventEnumHandlers[EventEnum[event_name]])
//     eventBus.subscribe(EventEnum[event_name], fnWrap(event_name, eventEnumHandlers[EventEnum[event_name]]))
//   }


let isBusy = false
  // kinda like a decorator - wrap around a fn and adds some extra juiciness to it!
export const fnWrap = function fnWrap(event_name, fn, fnargs=[], plugOpts={}) {
    return async () => {
        try {
            console.time(`${event_name} fn ${fnargs}`);

            let fn_res

            if (!isBusy){
                isBusy=true


                // dangerous stuff should be protected from mishaps ... always use protection
                try {
                    fn_res = await fn(...fnargs)
                    console.log({fn_res})
                } catch (error) {
                    fn_res = Promise.reject(error)
                }
                // TODO: You are falling asleep ma dude, go to bed and when you wake up clean this crap here

                console.log(`%c${event_name} Completed`, 'color: green;');
                isBusy=false
            } else {
                fn_res = Promise.reject(`DeBouncing... [${event_name}]`)
            }

            console.timeEnd(`${event_name} fn ${fnargs}`);
            return fn_res
        } catch (error) {
            console.error(error)
        }
    }
}
