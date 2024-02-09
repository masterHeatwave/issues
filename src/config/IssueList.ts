import { ListTarget } from 'src/components/Table/Filter/types'
import { TCellProp } from 'src/components/Table/types'

const getProps = (listType: ListTarget) =>
  [
    {
      header: '#',
      name: 'id',
      id: 'id',
      filter: {
        id: 'id',
        type: 'range'
      },
      width: '8%',
      sortingId: 'id',
      align: 'right'
    },
    {
      header: 'Title',
      name: 'title',
      filter: {
        id: 'title',
        type: 'string'
      },
      width: listType !== ListTarget.OWNED ? '56%' : '71%'
    },
    {
      header: 'Issuer',
      name: 'userId',
      filter: {
        id: 'user',
        type: 'list'
      },
      width: '15%',
      sortingId: 'user'
    },
    {
      header: 'Application',
      name: 'applicationId',
      filter: {
        id: 'application',
        type: 'list'
      },
      width: '10%',
      sortingId: 'application'
    },
    {
      header: 'Status',
      name: 'statusId',
      filter: {
        id: 'status',
        type: 'list'
      },
      width: '5%',
      sortingId: 'status'
    },
    {
      header: 'Messages',
      name: 'messages',
      width: '1%',
      align: 'right'
    },
    {
      header: 'Date',
      name: 'dateCreated',
      date: true,
      filter: {
        id: 'dateCreated',
        type: 'dateRange'
      },
      width: '5%',
      sortingId: 'date'
    }
  ]
    .map(cell => {
      if (listType === ListTarget.OWNED) {
        if (cell.name === 'userId') {
          return null
        }
      }
      return cell
    })
    .filter(cell => cell) as TCellProp[]

export default getProps
