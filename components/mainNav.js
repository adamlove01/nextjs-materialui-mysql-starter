import React from 'react'
import Link from 'next/link'
import LoginModal from '~/components/loginModal'
import { logout } from '~/utils/auth'

// Material UI Elements
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
} from '@material-ui/core'

// Additional Icons
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MoreIcon from '@material-ui/icons/MoreVert'

const MainNavCSS = makeStyles(theme => ({
  appBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
  },
  toolBar: {
    display: 'flex',
    width: '100%',
    maxWidth: '65rem',
    margin: 'auto',
  },
  toolBarAnchorText: {
    color: '#fff',
    textDecoration: 'none',
    '&:hover': {
      color: '#fff',
    },
  },
  menuAnchorText: {
    color: '#333',
    textDecoration: 'none',
    '&:hover': {
      color: '#333',
    },
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}))

const MainNav = props => {
  const css = MainNavCSS()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null)
  const [loginDialogIsOpen, setLoginDialogIsOpen] = React.useState(false)

  const menuId = 'primary-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorEl)}
      onClose={() => {
        setAnchorEl(null)
        setMobileAnchorEl(null)
      }}
    >
      {props.token && (
        <MenuItem onClick={e => setAnchorEl(e.currentTarget)}>
          <IconButton
            aria-label="Open Profile Menu"
            aria-controls="primary-account-menu"
            edge="start"
            color="primary"
          >
            <AccountCircle />
          </IconButton>
          <Link href="/profile">
            <a className={css.menuAnchorText}>Profile</a>
          </Link>
        </MenuItem>
      )}
      {props.token && (
        <MenuItem onClick={logout}>
          <IconButton
            aria-label="Log out"
            color="inherit"
            edge="start"
            color="primary"
          >
            <LockOpenIcon />
          </IconButton>
          <span>Log out</span>
        </MenuItem>
      )}
    </Menu>
  )

  const mobileMenuId = 'primary-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(mobileAnchorEl)}
      onClose={() => setMobileAnchorEl(null)}
    >
      {props.token && (
        <MenuItem>
          <IconButton
            aria-label="Link to Word List page"
            edge="start"
            color="primary"
          >
            <MenuBookIcon />
          </IconButton>
          <Link href="/wordlist/1">
            <a className={css.menuAnchorText}>Word List</a>
          </Link>
        </MenuItem>
      )}
      {props.token && (
        <MenuItem>
          <IconButton
            aria-label="Link to profile page"
            edge="start"
            color="primary"
          >
            <AccountCircle />
          </IconButton>
          <Link href="/profile">
            <a className={css.menuAnchorText}>Profile</a>
          </Link>
        </MenuItem>
      )}
      {props.token && (
        <MenuItem onClick={logout}>
          <IconButton aria-label="Log out" edge="start" color="primary">
            <LockOpenIcon />
          </IconButton>
          <span>Log out</span>
        </MenuItem>
      )}
      {!props.token && (
        <MenuItem onClick={() => setLoginDialogIsOpen(true)}>
          <IconButton aria-label="Open Login modal">
            <LockIcon />
          </IconButton>
          <span>Log in</span>
        </MenuItem>
      )}
    </Menu>
  )

  return (
    <div className={css.grow}>
      <AppBar className={css.appBar}>
        <Toolbar className={css.toolBar} position="fixed">
          <Typography className={css.title} variant="h6" noWrap>
            {props.onPage === 'home' ? (
              <span>Your Website</span>
            ) : (
              <Link href="/">
                <a className={css.toolBarAnchorText}>Your Website</a>
              </Link>
            )}
          </Typography>
          <div className={css.grow} />
          <div className={css.sectionDesktop}>
            {props.token && (
              <MenuItem>
                <Link href="/wordlist/1">
                  <a className={css.toolBarAnchorText}>Word List</a>
                </Link>
              </MenuItem>
            )}
            {props.token && (
              <IconButton
                edge="end"
                aria-label="Open profile menu"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={e => setAnchorEl(e.currentTarget)}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            )}
            {!props.token && (
              <MenuItem onClick={() => setLoginDialogIsOpen(true)}>
                <Typography className={css.title} variant="h6" noWrap>
                  <span>Log in</span>
                </Typography>
              </MenuItem>
            )}
          </div>
          <div className={css.sectionMobile}>
            <IconButton
              aria-label="Show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={e => setMobileAnchorEl(e.currentTarget)}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}

      <LoginModal
        open={loginDialogIsOpen}
        handleOpen={() => setLoginDialogIsOpen(true)}
        handleClose={() => setLoginDialogIsOpen(false)}
      ></LoginModal>
    </div>
  )
}

MainNav.getInitialProps = async ctx => {
  const { token } = nextCookie(ctx)
  return { token }
}

export default MainNav
