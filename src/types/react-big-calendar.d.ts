declare module 'react-big-calendar' {
  import { ComponentType } from 'react'
  
  export interface Event {
    title?: string
    start?: Date
    end?: Date
    resource?: any
    [key: string]: any
  }
  
  export interface CalendarProps {
    localizer: any
    events: any[]
    startAccessor: string | ((event: any) => Date)
    endAccessor: string | ((event: any) => Date)
    style?: React.CSSProperties
    className?: string
    onSelectEvent?: (event: any) => void
    onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void
    selectable?: boolean
    defaultView?: string
    views?: any
    eventPropGetter?: (event: any, start: Date, end: Date, isSelected: boolean) => any
    [key: string]: any
  }
  
  export const Calendar: ComponentType<CalendarProps>
  export function momentLocalizer(moment: any): any
}
