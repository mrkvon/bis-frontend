import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'app/services/bis'
import {
  AnswerPayload,
  EventApplication,
  Question,
} from 'app/services/bisTypes'
import {
  BirthdayInput,
  birthdayValidation,
  Button,
  FormInputError,
  FullSizeElement,
  InlineSection,
  Label,
  StyledModal,
} from 'components'
import { FC, FormEventHandler } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { required } from 'utils/validationMessages'
import * as yup from 'yup'
import { ApplicationStates } from '../ParticipantsStep'
import styles from './NewApplicationModal.module.scss'

interface INewApplicationModalProps {
  open: boolean
  onClose: () => void
  eventId: number
}

export const NewApplicationModal: FC<INewApplicationModalProps> = ({
  open,
  onClose,
  eventId,
}) => {
  const [createEventApplication, { isLoading: isLoadingCreateApplication }] =
    api.endpoints.createEventApplication.useMutation()

  const { data: questions } = api.endpoints.readEventQuestions.useQuery({
    eventId,
  })

  const validationSchema = yup.object().shape({
    first_name: yup.string().required().trim(),
    last_name: yup.string().required().trim(),
    nickname: yup.string().trim(),
    email: yup.string().email().required(),
    phone: yup.string().required(),
    birthday: birthdayValidation.required(),
    close_person: yup.object().shape({
      first_name: yup.string(),
      last_name: yup.string(),
      email: yup.string().email(),
      phone: yup.string(),
    }),
    answers: yup.array().of(
      yup.object({
        is_required: yup.boolean(),
        answer: yup.string().when('is_required', {
          is: true,
          then: schema => schema.required(),
        }),
      }),
    ),
  })

  const methods = useForm<EventApplication>({
    resolver: yupResolver(validationSchema),
    defaultValues: { birthday: '' },
  })
  const { register, handleSubmit, reset, control } = methods

  const createEventDataWithAnswers = (data: EventApplication) => {
    let filteredAnswers: AnswerPayload[] = []
    if (data.answers) {
      filteredAnswers = data.answers
        .filter(({ answer }) => Boolean(answer))
        .map(({ answer, question }) => ({
          answer,
          question: question.id,
        }))
    }

    let closePersonData = null
    if (
      data.close_person?.first_name ||
      data.close_person?.last_name ||
      data.close_person?.email ||
      data.close_person?.phone
    ) {
      closePersonData = {
        first_name: data.close_person.first_name || '',
        last_name: data.close_person.last_name || '',
        email: data.close_person.email || '',
        phone: data.close_person.phone || '',
      }
    }

    return {
      application: {
        ...data,
        answers: filteredAnswers,
        address: null,
        close_person: closePersonData,
        state: ApplicationStates.pending,
      },
      eventId,
    }
  }

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.stopPropagation()
    handleSubmit(async data => {
      await createEventApplication(createEventDataWithAnswers(data))
      onClose()
    })(e)
  }
  if (!open) return null

  return (
    <StyledModal
      open={open}
      onClose={() => {
        onClose()
        reset()
      }}
      title="Nová přihláška"
    >
      <div
        onClick={e => {
          e.stopPropagation()
        }}
        className={styles.content}
      >
        <div className={styles.modalFormBox}>
          <FormProvider {...methods}>
            <form onSubmit={handleFormSubmit}>
              <>
                <h3>Údaje přihlášeného:</h3>

                <InlineSection>
                  <Label htmlFor="first_name" required>
                    Jméno
                  </Label>
                  <FormInputError>
                    <input
                      type="text"
                      id="first_name"
                      {...register('first_name', { required: 'jaaaaaaaaa' })}
                    />
                  </FormInputError>
                  <Label htmlFor="last_name" required>
                    Příjmení
                  </Label>
                  <FormInputError>
                    <input
                      type="text"
                      id="last_name"
                      {...register('last_name', { required })}
                    />
                  </FormInputError>
                </InlineSection>

                <InlineSection>
                  <Label htmlFor="nickname">Přezdívka</Label>
                  <FormInputError>
                    <input
                      type="text"
                      id="nickname"
                      {...register('nickname')}
                    />
                  </FormInputError>
                </InlineSection>

                <InlineSection>
                  <Label htmlFor="phone" required>
                    Telefon
                  </Label>
                  <FormInputError>
                    <input type="tel" id="phone" {...register('phone')} />
                  </FormInputError>
                  <Label htmlFor="email" required>
                    E-mail
                  </Label>
                  <FormInputError>
                    <input type="email" id="email" {...register('email')} />
                  </FormInputError>
                </InlineSection>

                <InlineSection>
                  <Label required>Datum narození</Label>
                  <FormInputError>
                    <Controller
                      control={control}
                      name="birthday"
                      render={({ field }) => {
                        // @ts-ignore
                        return <BirthdayInput {...field} />
                      }}
                    />
                  </FormInputError>
                </InlineSection>

                <InlineSection>
                  <Label htmlFor="health_issues">
                    Alergie a zdravotní omezení:
                  </Label>
                  <FormInputError>
                    <textarea
                      id="health_issues"
                      {...register('health_issues')}
                    />
                  </FormInputError>
                </InlineSection>

                <h3>Blízká osoba:</h3>

                <InlineSection>
                  <Label htmlFor="close_person_first_name">Jméno</Label>
                  <FormInputError>
                    <input
                      type="text"
                      id="close_person_first_name"
                      {...register('close_person.first_name')}
                    />
                  </FormInputError>
                  <Label htmlFor="close_person_last_name">Příjmení</Label>
                  <FormInputError>
                    <input
                      type="text"
                      id="close_person_last_name"
                      {...register('close_person.last_name')}
                    />
                  </FormInputError>
                </InlineSection>

                <InlineSection>
                  <Label htmlFor="close_person_phone">Telefon</Label>
                  <FormInputError>
                    <input
                      type="tel"
                      id="close_person_phone"
                      {...register('close_person.phone')}
                    />
                  </FormInputError>
                  <Label htmlFor="close_person_email">E-mail</Label>
                  <FormInputError>
                    <input
                      type="email"
                      id="close_person_email"
                      {...register('close_person.email')}
                    />
                  </FormInputError>
                </InlineSection>
                {questions && (
                  <>
                    <h3>Otázky:</h3>
                    {questions.results.map((question: Question, i) => {
                      return (
                        <>
                          {' '}
                          <p>
                            <Label
                              htmlFor={`answers.${i}`}
                              required={question.is_required ? true : false}
                            >
                              {question.question}
                            </Label>
                          </p>
                          <FullSizeElement>
                            <FormInputError>
                              <textarea
                                id={`answers.${i}`}
                                {...register(`answers.${i}`, {
                                  setValueAs: v => ({
                                    is_required: question?.is_required,
                                    answer: v,
                                    question: { id: question.id },
                                  }),
                                })}
                              />
                            </FormInputError>
                          </FullSizeElement>
                        </>
                      )
                    })}
                  </>
                )}
                <Button primary isLoading={isLoadingCreateApplication}>
                  <input type="submit" value="Přidej přihlášku" />
                </Button>
              </>
            </form>
          </FormProvider>
        </div>
      </div>
    </StyledModal>
  )
}
