import Cors from 'micro-cors'
import Knex from '~/db/knex'

const cors = Cors({
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Origin, Accept, Content-Type, Authorization'],
  origin: process.env.API_HOST,
  maxAge: 86400,
})

function wordlistAPI(req, res) {
  return new Promise(resolve => {
    // Is the user logged in?
    const token = req.headers.authorization

    if (token) {
      // If this were a userID, we would also verify
      // that the user exists in the database
    } else {
      return res.json({ statusCode: 401, error: 'Unauthorized' })
    }

    const path = req.query.params.join('/')
    const paramsArray = req.query.params.slice(1)

    if (RegExp(/^readAny\/([0-9]+)\/([0-9]+)$/).test(path)) {
      readAny(...paramsArray)
    } else if (RegExp(/^readOne\/([0-9]+)$/).test(path)) {
      readOne(...paramsArray)
    } else {
      res.status(404).json({ error: 'Invalid route' })
      return resolve()
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
      res.status(200).json({
        rows,
        pageCount,
        page,
        rowsPerPage,
        totalRows,
      })
      return resolve()
    }

    /**
     * Read one record
     *
     * @param {number} id
     * @returns {Object}
     */
    async function readOne(id) {
      // TODO: Create detail page
      res.status(200).json({ id })
      return resolve()
    }
  })
}

export default cors(wordlistAPI)
