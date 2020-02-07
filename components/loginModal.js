import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { login } from '~/utils/auth'
import {
  withStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  IconButton,
  Slide,
  Typography,
  TextField,
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

const cssModal = makeStyles(theme => ({
  modal: {
    maxWidth: '520px',
    margin: 'auto',
  },
  text: {
    margin: '10px 0 0 0',
  },
  button: {
    margin: '2rem 0 1rem 0',
    padding: theme.spacing(2, 2),
    fontSize: '1.1rem',
    fontWeight: 'normal',
  },
}))

// Add slideUp transition to the modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const cssDialogTitle = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  title: {
    padding: '6px 6px',
    fontWeight: 600,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
})

// Customize the DialogTitle component to add an 'x'(close) to the element
const DialogTitle = withStyles(cssDialogTitle)(props => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography className={classes.title} variant="h5">
        {children}
      </Typography>
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  )
})

const StyledButton = withStyles({
  root: {
    height: 54,
    fontSize: 17,
    lineHeight: '1.47059',
    fontWeight: 400,
    letterSpacing: '-.022em',
    backgroundColor: '#0070c9',
    background: 'linear-gradient(#42a1ec, #0070c9)',
    border: '1px solid #07c',
    borderRadius: 4,
    color: 'white',
    minWidth: 30,
    padding: '4px 15px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    boxShadow: 'none',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button)

const LoginModal = props => {
  const css = cssModal()

  const [username, setUsername] = useState('')
  const [isEmpty, setIsEmpty] = useState(false)

  async function handleOnChange(event) {
    setUsername(event.target.value.trim())
    setIsEmpty(event.target.value.trim() === '')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    let error = ''

    const url = '/api/login'

    try {
      const response = await fetch(url, {
        method: 'POST',

        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
      if (response.status === 200) {
        const { token } = await response.json()
        // Set cookie
        await login({ token })
      } else {
        console.log('Login failed.')
        // https://github.com/developit/unfetch#caveats
        error = new Error(response.statusText)
        error.response = response
        throw error
      }
    } catch (error) {
      console.error(
        'You have an error in your code or there are Network issues.',
        error
      )
    }
  }

  return (
    <div>
      <Dialog
        className={css.modal}
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.handleClose}
        aria-labelledby="Log in"
      >
        <DialogTitle id="form-dialog-title" onClose={props.handleClose}>
          Please sign in.
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              required
              helperText={isEmpty ? 'Please enter a valid username' : ' '}
              error={isEmpty}
              InputLabelProps={{ required: false }}
              id="outlined-required"
              label="GitHub username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={handleOnChange}
            />

            <DialogContentText className={css.text}>
              Enter any public Github username.
            </DialogContentText>

            <StyledButton
              type="submit"
              color="primary"
              variant="contained"
              className={css.button}
              fullWidth
            >
              Sign In
            </StyledButton>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  )
}

export default LoginModal
