declare module 'react-big-calendar' {
  import { ComponentType } from 'react'
  
  export interface Event {
    title?: string
    start?: Date
    end?: Date
    resource?: unknown
    [key: string]: unknown
  }
  
  interface Localizer {
    format: (date: Date, format: string, culture?: string) => string
    startOfWeek: (culture?: string) => Date
    firstVisibleDay: (date: Date, culture?: string) => Date
    lastVisibleDay: (date: Date, culture?: string) => Date
    [key: string]: unknown
  }
  
  interface View {
    [key: string]: unknown
  }
  
  export interface CalendarProps {
    localizer: Localizer
    events: Event[]
    startAccessor: string | ((event: Event) => Date)
    endAccessor: string | ((event: Event) => Date)
    style?: React.CSSProperties
    className?: string
    onSelectEvent?: (event: Event) => void
    onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void
    selectable?: boolean
    defaultView?: string
    views?: View
    eventPropGetter?: (event: Event, start: Date, end: Date, isSelected: boolean) => React.CSSProperties
    [key: string]: unknown
  }
  
  export const Calendar: ComponentType<CalendarProps>
  export function momentLocalizer(moment: unknown): Localizer
}
