import { TFilter } from 'src/components/Table/Filter/types'
import { TPagging, TSorting } from 'src/components/Table/types'

type TFetchProps = {
  pagging: TPagging
  sorting?: TSorting
  filters: TFilter[]
}

export default TFetchProps
