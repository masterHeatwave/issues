import React, { createContext, useMemo } from 'react'
import _fetchData from 'src/context/actions/app'
import TApplicationData from 'src/structures/viewmodel/applicationData'

interface IState {
  title: string
  setTitle: (title?: string | null) => void
  fetchData: () => Promise<TApplicationData>
  data: TApplicationData
}

const AppContext = createContext<IState>({} as IState)

interface IAppProvider {
  children?: React.ReactNode
}

export const AppProvider: React.FC<IAppProvider> = ({ children }) => {
  const [data, setData] = React.useState<TApplicationData>({
    applications: [],
    users: [],
    status: []
  })
  const [title, _setTitle] = React.useState<string>('Issue Tracking')
  const setTitle = (title?: string | null) => _setTitle(title || 'Issue Tracking')
  const fetchData = React.useCallback(
    () =>
      _fetchData().then(data => {
        setData(data)
        return data
      }),
    []
  )
  const memoedValue = useMemo(
    () => ({
      data,
      title,
      setTitle,
      fetchData
    }),
    [title, data]
  )
  return <AppContext.Provider value={memoedValue}>{children}</AppContext.Provider>
}

const useApp = () => React.useContext(AppContext)

export default useApp
