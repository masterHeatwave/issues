import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  Chip,
  DialogActions,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SxProps,
  TextField
} from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ConfirmDialogResult, IConfirmDialog } from 'src/components/ConfirmDialog/ConfirmDialog'
import NameAvatar from 'src/components/NameAvatar/NameAvatar'
import useApp from 'src/context/useApp'
import useDialogs from 'src/context/useDialogs'
import SubmitException from 'src/exceptions/SubmitException'
import TIssuePayload from 'src/structures/dto/issuePayload'
import TIssue from 'src/structures/issue'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}
function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  }
}

interface IIssueFormLayout extends IConfirmDialog {
  defaultValues: Partial<TIssuePayload>
  sx?: SxProps<Theme>
  onSubmit: (issueDTO: TIssuePayload) => Promise<TIssue>
}

const IssueFormLayout: React.FC<IIssueFormLayout> = ({
  defaultValues,
  sx,
  onAction,
  onSubmit,
  setTitle
}) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [values, setValues] = React.useState<Partial<TIssuePayload>>(defaultValues)
  const {
    data: { applications, status, users }
  } = useApp()
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty }
  } = useForm<TIssuePayload>({ defaultValues: values })
  const onSubmitFormElement = async (data: TIssuePayload) => {
    try {
      setLoading(true)
      const res = await onSubmit(data)
      onAction?.(ConfirmDialogResult.Yes, res)
    } catch (error) {
      if (!(error instanceof SubmitException)) {
        return
      }
      const { data } = error as SubmitException<TIssue>
      if (!data) return
      setValues({
        id: data.id,
        title: data.title,
        description: data.description,
        applicationId: data.applicationId,
        userId: data.userId,
        statusId: data.statusId,
        assignees: data.assignees.map(assignee => assignee.userId),
        watchers: data.watchers.map(watcher => watcher.userId)
      })
      setTitle?.(data.id)
    } finally {
      setLoading(false)
    }
  }
  const theme = useTheme()
  const { ask } = useDialogs()
  React.useEffect(() => {
    reset(values)
  }, [values])
  const defaultOpen = React.useRef<boolean>(!defaultValues.id)
  const handleApply = () => undefined
  const handleReset = async () => {
    if (isDirty) {
      const confirm = await ask('Are you sure you want to reset the form?')
      if (!confirm) {
        return
      }
    }
    reset(values)
  }
  const handleCancel = async () => {
    if (isDirty) {
      const confirm = await ask('Are you sure you want to cancel your request?')
      if (!confirm) {
        return
      }
    }
    onAction?.(ConfirmDialogResult.Cancel)
  }
  return (
    <Box component="div" sx={sx}>
      <Box component="form" onSubmit={handleSubmit(onSubmitFormElement)}>
        <Grid container columnSpacing={1} rowSpacing={2}>
          <Grid
            item
            xs={12}
            md={8}
            lg={8}
            sx={{
              order: {
                xs: 2,
                md: 0
              }
            }}>
            <FormControl fullWidth>
              <Controller
                rules={{ required: 'This field is required.' }}
                name="title"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    autoFocus={defaultOpen.current}
                    error={!!errors.title}
                    onChange={onChange}
                    value={value ?? ''}
                    label="Title"
                    helperText={errors.title?.message}
                    aria-describedby="title-error-text"
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={6}
            md={2}
            lg={2}
            sx={{
              order: {
                xs: 1,
                md: 0
              }
            }}>
            <FormControl error={!!errors.applicationId} fullWidth>
              <InputLabel id="applicationId-label">Application</InputLabel>
              <Controller
                rules={{ required: 'This field is required.' }}
                control={control}
                name="applicationId"
                render={({ field: { onChange, value } }) => (
                  <Select
                    disabled={!!defaultValues.id}
                    label="Application"
                    labelId="applicationId-label"
                    aria-describedby="applicationId-error-text"
                    onChange={onChange}
                    value={value ?? ''}>
                    {applications.map(application => (
                      <MenuItem key={application.id} value={application.id}>
                        {application.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText id="applicationId-error-text">
                {errors.applicationId?.message ?? ''}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={6}
            md={2}
            lg={2}
            sx={{
              order: {
                xs: 1,
                md: 0
              }
            }}>
            <FormControl error={!!errors.statusId} fullWidth>
              <InputLabel id="statusId-label">Status</InputLabel>
              <Controller
                rules={{ required: 'This field is required.' }}
                control={control}
                name="statusId"
                render={({ field: { onChange, value } }) => (
                  <Select
                    disabled={!defaultValues.id}
                    label="Status"
                    labelId="statusId-label"
                    onChange={onChange}
                    aria-describedby="statusId-error-text"
                    value={value ?? ''}>
                    {status.map(status => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText id="statusId-error-text">
                {errors.statusId?.message ?? ''}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              my: 0.5,
              order: {
                xs: 3,
                md: 0
              }
            }}>
            <FormControl fullWidth>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    multiline
                    minRows={2}
                    onChange={onChange}
                    value={value ?? ''}
                    label="Description"
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              order: {
                xs: 4,
                md: 0
              }
            }}>
            <FormControl fullWidth>
              <InputLabel id="assignees-label">Assignees</InputLabel>
              <Controller
                control={control}
                name="assignees"
                render={({ field: { onChange, value } }) => (
                  <Select
                    aria-describedby="assignees-error-text"
                    multiple
                    input={<OutlinedInput id="select-assignees-chip" label="Assignees" />}
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map(value => {
                          const user = users.find(user => user.id === value)
                          if (!user) {
                            return null
                          }
                          const label = `${user.lastName} ${user.firstName}`
                          return <Chip key={value} label={label} />
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    labelId="assignees-label"
                    onChange={onChange}
                    value={value ?? []}>
                    {users.map(user => (
                      <MenuItem
                        key={user.id}
                        value={user.id}
                        style={getStyles(user.id, value ?? [], theme)}>
                        <NameAvatar
                          sx={{ mr: 2 }}
                          colored
                          caption={`${user.lastName} ${user.firstName}`}
                        />
                        {`${user.lastName} ${user.firstName}`}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              order: {
                xs: 5,
                md: 0
              }
            }}>
            <FormControl fullWidth>
              <InputLabel id="watchers-label">Watchers</InputLabel>
              <Controller
                control={control}
                name="watchers"
                render={({ field: { onChange, value } }) => (
                  <Select
                    aria-describedby="watchers-error-text"
                    multiple
                    input={<OutlinedInput id="select-watchers-chip" label="Watchers" />}
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map(value => {
                          const user = users.find(user => user.id === value)
                          if (!user) {
                            return null
                          }
                          const label = `${user.lastName} ${user.firstName}`
                          return <Chip key={value} label={label} />
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    labelId="watchers-label"
                    onChange={onChange}
                    value={value ?? []}>
                    {users.map(user => (
                      <MenuItem
                        key={user.id}
                        value={user.id}
                        style={getStyles(user.id, value ?? [], theme)}>
                        <NameAvatar
                          sx={{ mr: 2 }}
                          colored
                          caption={`${user.lastName} ${user.firstName}`}
                        />
                        {`${user.lastName} ${user.firstName}`}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
        <DialogActions sx={{ pb: 0, mt: 2, mb: 0, px: 0, mx: 0 }}>
          <LoadingButton
            loading={loading}
            type="submit"
            disabled={loading || !isDirty}
            onClick={handleApply}
            autoFocus>
            Submit
          </LoadingButton>
          <Button disabled={loading || !isDirty} onClick={handleReset}>
            Clear
          </Button>
          <Button disabled={loading} onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Box>
  )
}

export default IssueFormLayout
