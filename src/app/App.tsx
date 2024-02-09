import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import IssueContainer from 'src/components/IssueContainer'
import LoginContainer from 'src/components/LoginContainer'
import MainContainer from 'src/components/MainContainer'
import { AppProvider } from 'src/context/useApp'
import { AuthProvider } from 'src/context/useAuth'
import { DialogProvider } from 'src/context/useDialogs'
import { FormProvider } from 'src/context/useForm'
import { IssueProvider } from 'src/context/useIssues'
import { SnackbarProvider } from 'src/context/useSnackbar'
import { ThemeProvider } from 'src/context/useTheme'
import ProtectedRoute from 'src/router/ProtectedRoute'

const App: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <AppProvider>
            <SnackbarProvider>
              <DialogProvider>
                <AuthProvider>
                  <MainContainer ref={containerRef}>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <IssueProvider>
                              <FormProvider>
                                <IssueContainer />
                              </FormProvider>
                            </IssueProvider>
                          </ProtectedRoute>
                        }
                      />
                      <Route path="Login" element={<LoginContainer />} />
                    </Routes>
                  </MainContainer>
                </AuthProvider>
              </DialogProvider>
            </SnackbarProvider>
          </AppProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
