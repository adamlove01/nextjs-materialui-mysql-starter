import Knex from '~/db/knex'
import Cors from 'micro-cors'
import { decryptTokenData } from '~/utils/auth'

const cors = Cors({
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Origin, Accept, Content-Type, Authorization'],
  origin: process.env.API_HOST,
  maxAge: 86400,
})

function wordlistAPI(req, res) {
  // Is the user logged in?
  const token = req.headers.authorization
  if (token) {
    // If this were a userID, we would also verify
    // that the user exists in the database
    // const githubId = decryptTokenData(token)
  } else {
    // Unauthorized
    return res.json({ statusCode: 401, error: 'Unauthorized' })
  }

  const path = req.query.params.join('/')
  const paramsArray = req.query.params.slice(1)

  // Routing for /wordlist
  switch (true) {
    case RegExp(/^readAny\/([0-9]+)\/([0-9]+)$/).test(path):
      readAny(...paramsArray)
      break

    case RegExp(/^readOne\/([0-9]+)$/).test(path):
      readOne(...paramsArray)
      break

    default:
      return res.json({ statusCode: 404, error: 'Invalid route' })
  }

  /**
   * Read any number of rows with pagination
   *
   * @param {number} page
   * @param {number} rowsPerPage
   * @returns {Object}
   */
  async function readAny(page, rowsPerPage) {
    if (page < 1) page = 1
    if (!rowsPerPage) rowsPerPage = 5
    // Get all rows for page up to limit
    const rows = await Knex.from('words')
      .select(['words.id as id', 'words.word as word', 'types.name as type'])
      .leftJoin('types', 'words.type_id', 'types.id')
      .orderBy('words.id')
      .offset((page - 1) * rowsPerPage)
      .limit(rowsPerPage)
    // Get total number of rows for paging
    const count = await Knex.from('words').count('*', { as: 'totalRows' })
    const { totalRows } = count[0]
    // Calculate total pages based on limit
    const pageCount = Math.ceil(totalRows / rowsPerPage)
    return res
      .status(200)
      .json({ rows, pageCount, page, rowsPerPage, totalRows })
  }

  /**
   * Read one record
   *
   * @param {number} id
   * @returns {Object}
   */
  async function readOne(id) {
    // TODO: Create detail page
    const data = ''
    return res.status(200).json({ data })
  }
}

export default cors(wordlistAPI)
