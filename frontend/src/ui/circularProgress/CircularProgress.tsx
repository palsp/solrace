import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { CSSProperties } from 'styled-components'

interface Props {
  value: number
  height?: string
  width?: string
  style?: CSSProperties
}

const CircularProgress: React.FC<Props> = ({
  value,
  height,
  width,
  style = {},
}) => (
  <div
    style={{
      height: height || 'auto',
      width: width || '100%',
      ...style,
    }}
  >
    <CircularProgressbar value={value} />
  </div>
)

export default CircularProgress
