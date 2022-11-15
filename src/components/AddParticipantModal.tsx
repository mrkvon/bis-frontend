import { FC, useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Modal from 'react-modal'
import { api } from '../app/services/bis'

import * as yup from 'yup'
import { User } from '../app/services/testApi'
import FormInputError from './FormInputError'
interface INewApplicationModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  data: { id?: number }
}

const phoneRegExp = /^(\+|00){0,1}[0-9]{1,3}[0-9]{4,14}(?:x.+)?$/
const zipcodeRegExp = /\d{3} ?\d{2}/

const validationSchema = yup.object().shape(
  {
    first_name: yup.string().required('Required').trim(),
    last_name: yup.string().required('Required'),
    nickname: yup.string().trim(),
    email: yup
      .string()
      .email()
      .when('phone', {
        is: (phone: string) => !phone || phone.length === 0,
        then: yup.string().email().required('email or phone is required'),
        otherwise: yup.string(),
      }),
    phone: yup.string().when('email', {
      is: (email: string) => !email || email.length === 0,
      then: yup
        .string()
        .when('phone', {
          is: (phone: string) => !phone || phone.length === 0,
          then: yup.string().required('email or phone is required'),
        })
        .required()
        .matches(phoneRegExp, 'Phone number is not valid'),
      otherwise: yup.string(),
    }),
    birthday: yup
      .date()
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr)),
    close_person: yup.object().shape({
      first_name: yup.string().required(),
      last_name: yup.string().required(),
      email: yup.string().email().required('email or phone is required'),
    }),
    address: yup.object().shape({
      street: yup.string().required(),
      city: yup.string().required(),
      zip_code: yup.string().required().matches(zipcodeRegExp),
      region: yup.string().required(),
    }),
  },
  [['email', 'phone']],
)

const useYupValidationResolver = (validationSchema: any) =>
  useCallback(
    async (data: any) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        })

        return {
          values,
          errors: {},
        }
      } catch (errors: any) {
        return {
          values: {},
          errors:
            errors?.inner &&
            errors?.inner.reduce(
              (allErrors: any, currentError: any) => ({
                ...allErrors,
                [currentError.path]: {
                  type: currentError.type ?? 'validation',
                  message: currentError.message,
                },
              }),
              {},
            ),
        }
      }
    },
    [validationSchema],
  )

const AddParticipantModal: FC<INewApplicationModalProps> = ({
  open,
  onClose,
  onSubmit,
  data: parentData,
}) => {
  const resolver = useYupValidationResolver(validationSchema)

  const methods = useForm<User>({
    resolver,
    defaultValues: {
      first_name: 'Talita',
      last_name: 'Dzik',
      email: 'examplke@exaple.com',
      address: {
        street: 'Slowicza',
        zip_code: '05807',
        city: 'Podkowa Lesna',
        //TODO: region: 1, //{ id: 1, name: 'praha' },
      },
      close_person: {
        first_name: 'close',
        last_name: 'jdjdjdjdjd',
        email: 'dzik@example.com',
      },
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = methods

  const [createUser, { isLoading: isSavingOpportunity }] =
    api.endpoints.createUser.useMutation()

  const handleFormSubmit = handleSubmit(async data => {
    if (parentData?.id) {
      await createUser(data)

      onClose()
      // onSubmit()
    }
  })
  if (!open) return null

  return (
    <Modal isOpen={open} onRequestClose={onClose} contentLabel="Example Modal">
      <div
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <div>
          <div>Add new participant</div>
          <div>{/* <input type="checkbox"></input>je to dite */}</div>
        </div>
        <div>
          <FormProvider {...methods}>
            <form onSubmit={handleFormSubmit}>
              <>
                <label>
                  <p>
                    Jmeno*:
                    <FormInputError>
                      <input
                        id="first_name"
                        type="text"
                        {...register('first_name', { required: true })}
                      />
                    </FormInputError>
                  </p>
                </label>
                {errors.first_name?.message}

                <label>
                  <p>
                    Prijmeni*:
                    <FormInputError>
                      <input
                        id="last_name"
                        type="text"
                        {...register('last_name')}
                      />
                    </FormInputError>
                  </p>
                </label>
                <label>
                  <p>
                    Prezdivka:
                    <input
                      id="nickname"
                      type="text"
                      {...register('nickname')}
                    />
                  </p>
                </label>
                <label>
                  <p>
                    Rodné příjmení:
                    <input
                      id="family_name"
                      type="text"
                      {...register('birth_name')}
                    />
                  </p>
                </label>

                <label>
                  <p>
                    Telefon:
                    <FormInputError>
                      <input id="phone" type="text" {...register('phone')} />
                    </FormInputError>
                  </p>
                </label>

                <label>
                  <p>
                    E-mail:
                    <FormInputError>
                      <input id="email" type="text" {...register('email')} />
                    </FormInputError>
                  </p>
                </label>

                <label>
                  <p>
                    Datum narozeni:
                    <input
                      id="birthdate"
                      type="date"
                      {...register('birthday')}
                    />
                  </p>
                </label>

                <h3>Bliska osoba:</h3>

                <label>
                  <p>
                    Jmeno*:
                    <FormInputError>
                      <input
                        id="close_person_first_name"
                        type="text"
                        {...register('close_person.first_name')}
                      />
                    </FormInputError>
                  </p>
                </label>
                <label>
                  <p>
                    Prijmeni*:
                    <FormInputError>
                      <input
                        id="close_person_last_name"
                        type="text"
                        {...register('close_person.last_name')}
                      />
                    </FormInputError>
                  </p>
                </label>
                <label>
                  <p>
                    Telefon:
                    <input
                      id="close_person_phone"
                      type="text"
                      {...register('close_person.phone')}
                    />
                  </p>
                </label>
                <label>
                  <p>
                    E-mail:
                    <input
                      id="close_person_email"
                      type="text"
                      {...register('close_person.email')}
                    />
                  </p>
                </label>
                <label>
                  <p>
                    Alergie a zdravotni omezeni:
                    <input
                      id="health_issues"
                      type="text"
                      {...register('health_issues')}
                    />
                  </p>
                </label>
                <label>
                  <p>
                    Pohlavi*:
                    <label htmlFor="male">Male</label>
                    <input
                      id="male"
                      type="radio"
                      {...register('sex')}
                      value={1}
                    />
                    <label htmlFor="female">Female</label>
                    <input
                      id="female"
                      type="radio"
                      {...register('sex')}
                      value={2}
                    />
                    <label htmlFor="other">Other</label>
                    <input
                      id="other"
                      type="radio"
                      {...register('sex')}
                      value={0}
                    />
                  </p>
                </label>

                <label>
                  <p>
                    Odbira novinky:
                    <input
                      id="donor_subscribed_to_newsletter"
                      type="checkbox"
                      {...register('donor.subscribed_to_newsletter')}
                    ></input>
                  </p>
                </label>

                <h3>Trvala adresa:</h3>
                <label>
                  Ulice*:
                  <p>
                    <FormInputError>
                      <input
                        id="address_street"
                        type="text"
                        {...register('address.street')}
                      />
                    </FormInputError>
                  </p>
                </label>
                <label>
                  PSC*:
                  <p>
                    <FormInputError>
                      <input
                        id="address_zip_code"
                        type="text"
                        {...register('address.zip_code')}
                      />
                    </FormInputError>
                  </p>
                </label>
                <label>
                  Mesto*:
                  <p>
                    <FormInputError>
                      <input
                        id="address_city"
                        type="text"
                        {...register('address.city')}
                      />
                    </FormInputError>
                  </p>
                </label>
                <label>
                  Region*:
                  <p>
                    <FormInputError>
                      <input
                        id="address_region"
                        type="text"
                        {...register('address.region')}
                      />
                    </FormInputError>
                  </p>
                </label>

                <input type="submit" value="Add aplication" />
              </>
            </form>
          </FormProvider>
        </div>
      </div>
    </Modal>
  )
}

export default AddParticipantModal