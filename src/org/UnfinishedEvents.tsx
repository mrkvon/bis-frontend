import { useOutletContext } from 'react-router-dom'
import { PaginatedList } from '../app/services/bis'
import { Event } from '../app/services/testApi'
import { getEventStatus } from '../utils/helpers'
import { UnscalablePaginatedEventList } from './PaginatedEventList'

const UnfinishedEvents = () => {
  const events = useOutletContext<PaginatedList<Event>>()

  // here we want events that haven't been finished, and are not drafts
  // TODO we'll need info from api what's draft and what's done
  // for now we just show the events without record

  const inputEvents = (events.results ?? []).filter(
    event => getEventStatus(event) === 'inProgress',
  )

  return <UnscalablePaginatedEventList events={inputEvents} />
}

export default UnfinishedEvents