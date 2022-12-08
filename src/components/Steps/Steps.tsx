import classNames from 'classnames'
import { Button } from 'components'
import { Children, FC, FunctionComponentElement, ReactNode } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { useSearchParamsState } from '../../hooks/searchParamsState'
import styles from './Steps.module.scss'

export const Steps = <T extends Record<string, any>>({
  children,
  actions,
  onSubmit,
  onCancel,
}: {
  onSubmit?: (props: T) => void
  onCancel?: () => void
  actions?: { name: ReactNode; props: T }[]
  children:
    | FunctionComponentElement<{
        name: string
        hasError?: boolean
        hidden?: boolean
      }>
    | FunctionComponentElement<{
        name: string
        hasError?: boolean
        hidden?: boolean
      }>[]
}) => {
  const [step, setStep] = useSearchParamsState('krok', 1, i => Number(i))
  const elementProps = Children.map(children, element => ({
    name: element.props.name,
    hasError: element.props.hasError ?? false,
    hidden: element.props.hidden,
  })).filter(element => !element.hidden)

  return (
    <div>
      <div className={styles.navWrapper}>
        <nav className={styles.navigation}>
          {elementProps.map(({ name, hasError }, i) => (
            <button
              type="button"
              className={classNames(
                i + 1 === step && styles.isActive,
                styles.stepButton,
                hasError && styles.isError,
              )}
              key={i}
              onClick={() => setStep(i + 1)}
            >
              {name}
            </button>
          ))}
        </nav>
        <nav className={styles.actions}>
          {onCancel && (
            <Button light type="reset" onClick={() => onCancel()}>
              Zrušit
            </Button>
          )}
          {onSubmit &&
            actions &&
            actions.map(({ props, name }, i) => (
              <Button
                key={i} // TODO we should not use index as key
                success
                type="submit"
                onClick={() => onSubmit(props)}
              >
                {name}
              </Button>
            ))}
        </nav>
      </div>
      {Children.map(children, (element, i) => (
        <div className={classNames(i !== step - 1 && styles.isHidden)}>
          {element}
        </div>
      ))}
      <nav className={styles.bottomNavigation}>
        {step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)}>
            <FaAngleLeft fontSize="5em" />
          </button>
        )}
        <span className={styles.spacer}></span>
        {step < elementProps.length && (
          <button type="button" onClick={() => setStep(step + 1)}>
            <FaAngleRight fontSize="5em" />
          </button>
        )}
      </nav>
    </div>
  )
}

export const Step: FC<{
  name: string
  hasError?: boolean
  fields?: string[]
  children?: ReactNode
  hidden?: boolean
}> = ({ children }) => <>{children}</>