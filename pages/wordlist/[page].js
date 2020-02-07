import React from 'react'
import fetch from 'isomorphic-unfetch'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import Layout from '~/components/layout'
import cookie from 'js-cookie'
import PropTypes from 'prop-types'
import { DocumentContext } from 'next/document'
import { withAuthSync } from '~/utils/auth'

import Pagination from 'material-ui-flat-pagination'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

import { lighten, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

/**
 * Object: WordListData
 *
 * @typedef {Object} WordListData
 * @property {Array<{id: Number, word: String, type_id: number }>} rows  All rows for this page only
 * @property {Number} page  Current page - Integer
 * @property {Number} pageCount  Total pages - Integer
 * @property {Number} rowsPerPage  Rows per page - Integer
 * @property {Number} totalRows  Total rows - Integer
 */

/**
 * Fetch WordListData and pagination
 *
 * @param {DocumentContext} ctx
 * @return {WordListData|Number}  WordListData | statusCode
 */
EnhancedTable.getInitialProps = async ctx => {
  // Get 'paginationLimit' from session cookie
  let { paginationLimit } = nextCookie(ctx)
  if (!paginationLimit) {
    // No limit set; Create new session cookie
    cookie.set('paginationLimit', 9, { expires: 1 })
    paginationLimit = 5
  }

  const { token } = nextCookie(ctx)
  const apiUrl = `${process.env.API_HOST}/api/wordlist/readAny/${ctx.query.page}/${paginationLimit}`

  const data = await fetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: token,
    },
  })
  const result = await data.json()

  // If the API returns an error statusCode, pass it along
  // to the withError() High-order component in _app.js,
  // which will load an error page
  if (result.statusCode) {
    return { statusCode: result.statusCode }
  }

  // Return a json object of component props
  return result
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function sortTable(array, cmp) {
  const arrayAndIndexes = array.map((el, index) => [el, index])
  arrayAndIndexes.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return arrayAndIndexes.map(el => el[0])
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy)
}

const headCells = [
  { id: 'word', string: false, disablePadding: true, label: 'Word' },
  { id: 'type', string: false, disablePadding: false, label: 'Part of Speech' },
  { id: 'rank', numeric: true, disablePadding: false, label: 'Rank' },
]

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all words' }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

const EnhancedTableToolbarCSS = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}))

const EnhancedTableToolbar = props => {
  const css = EnhancedTableToolbarCSS()
  const { numSelected } = props

  return (
    <Toolbar className={`css.root ${numSelected > 0 ? 'css.highlight' : ''}`}>
      {numSelected > 0 ? (
        <Typography className={css.title} color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={css.title} variant="h6" id="tableTitle">
          100 Most Common Words
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
}

const EnhancedTableCSS = makeStyles(theme => ({
  root: {
    maxWidth: 1200,
    margin: 'auto',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  rootEllipsis: {
    padding: 0,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  rootCurrent: {
    cursor: 'default',
    color: '#fff',
    fontWeight: 'bold',
    border: '1px solid rgba(0, 0, 0, 0.26)',
    borderRadius: 0,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      color: '#fff',
      border: '1px solid rgba(0, 0, 0, 0.26)',
      borderRadius: 0,
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
    },
  },
  rootStandard: {
    color: 'rgba(0, 0, 0, 0.87)',
  },
  paginationBar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '1rem 0',
  },
  paginationSelect: {
    fontSize: '14px',
    marginRight: '1rem',
    '&:before': {
      content: '',
      transition: 'none',
      borderBottom: 'none',
    },
    '&:hover:not(.Mui-disabled):before': {
      content: '',
      transition: 'none',
      borderBottom: 'none',
    },
  },
  paginationText: {
    marginRight: '1rem',
  },
}))

function EnhancedTable({
  rows,
  page,
  pageCount,
  rowsPerPage,
  totalRows,
  token,
}) {
  const css = EnhancedTableCSS()
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('id')
  const [selected, setSelected] = React.useState([])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.word)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleChangeRowsPerPage = event => {
    cookie.set('paginationLimit', event.target.value, { expires: 1 })
    Router.push(`/wordlist/1`)
  }

  const isSelected = name => selected.indexOf(name) !== -1

  // Paging Variables
  const pageFrom = (page - 1) * rowsPerPage + 1
  const pageTo = Math.min(page * rowsPerPage, totalRows)

  return (
    <Layout token={token} onPage="profile">
      <div className={css.root}>
        <Paper className={css.paper}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              className={css.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
              size={'medium'}
            >
              <EnhancedTableHead
                classes={css}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={pageCount}
              />
              <TableBody>
                {sortTable(rows, getSorting(order, orderBy)).map(
                  (row, index) => {
                    const isItemSelected = isSelected(row.word)
                    const labelId = `enhanced-table-checkbox-${index}`

                    return (
                      <TableRow
                        hover
                        onClick={event => handleClick(event, row.word)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.word}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.word}
                        </TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell align="right">{row.id}</TableCell>
                      </TableRow>
                    )
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div className={css.paginationBar}>
            <p className={css.paginationText}>Rows per page:</p>
            <Select
              className={css.paginationSelect}
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>

            <p className={css.paginationText}>
              {pageFrom}-{pageTo} of {totalRows}
            </p>

            <Pagination
              classes={{
                rootEllipsis: css.rootEllipsis,
                rootCurrent: css.rootCurrent,
                rootStandard: css.rootStandard,
                rootEnd: css.rootStandard,
              }}
              limit={rowsPerPage}
              offset={(page - 1) * rowsPerPage}
              total={totalRows}
              renderButton={({ page, children }) =>
                React.cloneElement(children, { href: `/wordlist/${page}` })
              }
              previousPageLabel={<NavigateBeforeIcon />}
              nextPageLabel={<NavigateNextIcon />}
              size={'medium'}
              reduced={true}
            />
          </div>
        </Paper>
      </div>
    </Layout>
  )
}

export default withAuthSync(EnhancedTable)
