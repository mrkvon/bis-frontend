import { api } from 'app/services/bis'
import { EventApplication } from 'app/services/testApi'
import { FC, useState } from 'react'
import styles from './ParticipantsStep.module.scss'
import { Applications } from './registration/Applications'
import { Participants } from './registration/Participants'

export const ParticipantsStep: FC<{
  eventId: number
  onlyApplications?: boolean
  eventName: string
}> = ({ eventId, onlyApplications, eventName }) => {
  const [highlightedApplication, setHighlightedApplication] =
    useState<string[]>()
  const [highlightedParticipant, setHighlightedParticipant] = useState<string>()

  const { data: applicationsData } =
    api.endpoints.readEventApplications.useQuery({
      eventId,
      pageSize: 10000,
    })
  const savedApplications: { [s: string]: string } | undefined =
    applicationsData &&
    applicationsData.results
      .filter(app => app.state === ('approved' as const))
      .reduce<{ [s: string]: string }>(
        (savedApps: { [s: string]: string }, app: EventApplication) => {
          if (app.user) savedApps[app.id.toString() as string] = app.user
          return savedApps
        },
        {} as { [s: string]: string },
      )
  const savedParticipants: { [s: string]: string[] } | undefined = {}
  if (savedApplications)
    for (const [key, value] of Object.entries(savedApplications)) {
      if (value) {
        if (savedParticipants[value]) {
          savedParticipants[value] = savedParticipants[value].concat(key)
        } else {
          savedParticipants[value] = [key]
        }
      }
    }

  return (
    <div className={styles.participantsContainer}>
      <Applications
        eventId={eventId}
        eventName={eventName}
        highlightedApplications={highlightedApplication}
        chooseHighlightedApplication={id =>
          setHighlightedParticipant(
            savedApplications && id && savedApplications[id],
          )
        }
        withParticipants={!onlyApplications}
      />
      {!onlyApplications && (
        <Participants
          eventId={eventId}
          highlightedParticipant={highlightedParticipant}
          chooseHighlightedParticipant={id => {
            if (id && savedParticipants)
              setHighlightedApplication(savedParticipants[id])
            else {
              setHighlightedApplication(undefined)
            }
          }}
          eventName={eventName}
          savedParticipants={savedParticipants}
        />
      )}
    </div>
  )
}
