import classNames from 'classnames'
import { Help } from 'components'
import { ForwardedRef, forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import styles from './IconSelect.module.scss'

interface IconSelectProps extends InputHTMLAttributes<HTMLInputElement> {
  text: ReactNode
  detail?: ReactNode
  help?: ReactNode
  icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined
    }
  >
  id: string
}

export const IconSelect = forwardRef(
  (
    { text, detail, help, icon, id, ...rest }: IconSelectProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const Icon = icon
    return (
      <>
        <input
          type="radio"
          id={id}
          ref={ref}
          {...rest}
          className={styles.input}
        />
        <label htmlFor={id} className={styles.label}>
          <div>
            <div className={styles.icon}>
              <Icon height={60} width={60} />
            </div>
          </div>
          <span className={styles.title}>
            {help && (
              <>
                <Help>{help}</Help>{' '}
              </>
            )}
            {text}
          </span>
          {detail && <span className={styles.detail}>{detail}</span>}
        </label>
      </>
    )
  },
)

export const IconSelectGroup = ({
  children,
  className,
  color = 'green',
}: {
  children: ReactNode
  className?: string
  color?: 'green' | 'blue'
}) => {
  return (
    <div
      className={classNames(
        styles.group,
        className,
        color === 'blue' ? styles.blue : styles.green,
      )}
    >
      {children}
    </div>
  )
}