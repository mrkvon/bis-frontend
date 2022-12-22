import {
  FormInputError,
  FormSection,
  FormSubheader,
  FormSubsection,
  FullSizeElement,
  htmlRequired,
  ImagesUpload,
  ImageUpload,
  RichTextEditor,
} from 'components'
import { Controller, FormProvider } from 'react-hook-form'
import { required } from 'utils/validationMessages'
import { MethodsShapes } from '..'

export const InvitationStep = ({
  methods,
  isVolunteering,
}: {
  methods: MethodsShapes['invitation']
  isVolunteering: boolean
}) => {
  const { control } = methods

  return (
    <FormProvider {...methods}>
      <form>
        <FormSection startIndex={17}>
          <FormSubsection header="Pozvánka">
            <FullSizeElement>
              <FormSubheader
                required
                onWeb
                help="Prvních několik vět se zobrazí v přehledu akcí na webu. První věty jsou k upoutání pozornosti nejdůležitější, proto se na ně zaměř a shrň na co se účastníci mohou těšit."
              >
                Zvací text: Co nás čeká
              </FormSubheader>
              <FormInputError isBlock>
                <Controller
                  name="propagation.invitation_text_introduction"
                  control={control}
                  rules={{
                    required,
                    validate: {
                      required: htmlRequired(required),
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      placeholder="propagation.invitation_text_introduction"
                      {...field}
                    />
                  )}
                />
              </FormInputError>
            </FullSizeElement>
            <FullSizeElement>
              <FormSubheader required onWeb>
                Zvací text: Co, kde a jak
              </FormSubheader>
              <FormInputError isBlock>
                <Controller
                  name="propagation.invitation_text_practical_information"
                  control={control}
                  rules={{
                    required,
                    validate: {
                      required: htmlRequired(required),
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      placeholder="propagation.invitation_text_practical_information"
                      {...field}
                    />
                  )}
                />
              </FormInputError>
            </FullSizeElement>
            <FullSizeElement>
              <FormSubheader required={isVolunteering} onWeb>
                Zvací text: Dobrovolnická pomoc
              </FormSubheader>
              <FormInputError isBlock>
                <Controller
                  name="propagation.invitation_text_work_description"
                  control={control}
                  rules={{
                    required: isVolunteering && required,
                    validate: {
                      required: htmlRequired(isVolunteering && required),
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      placeholder="propagation.invitation_text_work_description"
                      {...field}
                    />
                  )}
                />
              </FormInputError>
            </FullSizeElement>
            <FullSizeElement>
              <FormSubheader
                onWeb
                help="Malá ochutnávka uvádí fotky, které k akci přiložíte"
              >
                Zvací text: Malá ochutnávka
              </FormSubheader>
              <FormInputError isBlock>
                <Controller
                  name="propagation.invitation_text_about_us"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <RichTextEditor
                      placeholder="propagation.invitation_text_about_us"
                      {...field}
                    />
                  )}
                />
              </FormInputError>
            </FullSizeElement>
          </FormSubsection>
          <FormSubsection
            header="Hlavní foto"
            required
            onWeb
            help="Hlavní foto se zobrazí v náhledu akce na webu"
          >
            <FormInputError>
              <ImageUpload required name="main_image.image" />
            </FormInputError>
          </FormSubsection>
          <FormSubsection
            header="Fotky k malé ochutnávce"
            onWeb
            help="Další fotky, které se zobrazí u akce."
          >
            <ImagesUpload name="images" />
          </FormSubsection>
        </FormSection>
      </form>
    </FormProvider>
  )
}