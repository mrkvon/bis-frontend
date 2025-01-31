import { api } from 'app/services/bis'
import { Event } from 'app/services/bisTypes'
import styles from 'components/Table.module.scss'
import { useQueries } from 'hooks/queries'
import { FC, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatDateRange } from 'utils/helpers'

export const UserEventTable: FC<{
  data: Event[]
}> = ({ data: events }) => {
  const locationRequests = useQueries(
    api.endpoints.readLocation,
    useMemo(
      () =>
        events
          .filter(event => event.location)
          .map(event => ({ id: event.location as number })),
      [events],
    ),
  )

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Název</th>
          <th>Termín</th>
          <th>Lokalita</th>
        </tr>
      </thead>
      <tbody>
        {events.map(event => (
          <tr key={event.id}>
            <td>
              <Link to={`/user/akce/${event.id}`}>{event.name}</Link>
            </td>
            <td>{formatDateRange(event.start, event.end)}</td>
            <td>
              {
                locationRequests.find(
                  request => request.data?.id === event?.location,
                )?.data?.name
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
