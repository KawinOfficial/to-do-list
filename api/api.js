const express = require('express')
const cors = require('cors')
const { Client } = require('pg')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const connectionString =
  'postgres://mexaqkqfravlkg:5c103e3722d5967c0b0b82cb23e5bfcef6cf25c0441265a58e857b1ef83be786@ec2-34-201-95-176.compute-1.amazonaws.com:5432/deua78euhr4uav'

const app = express()

app.use(cors())
app.use(express.json())

//! PG QUERY FUNCTION
const pqQuery = async (queryString) => {
  return new Promise(async (resolve, reject) => {
    try {
      const conn = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
      })

      conn.connect()
      const result = await conn.query(queryString)
      conn.end()
      resolve(result.rows)
    } catch (e) {
      reject(e)
    }
  })
}

// * SIGN IN
app.post('/signin', (req, res) => {
  const { username, password } = req.body
  const query = {
    text: 'SELECT * FROM account WHERE username=$1',
    values: [username],
  }

  if (!username || !password) {
    res.send({ state: false, msg: 'Username and Password require.' })
  } else {
    pqQuery(query)
      .then((resolve) => {
        const { password: passHash, id } = resolve[0]

        bcrypt.compare(password, passHash).then((isMatch) => {
          if (isMatch) {
            const payload = {
              'https://hasura.io/jwt/claims': {
                'x-hasura-default-role': 'user',
                'x-hasura-allowed-roles': ['user'],
                'x-hasura-user-id': id,
              },
            }

            const token = jwt.sign(
              payload,
              '7$IzrUv%2QA2s*V63iHygy8BeEsEypw#$v&&89Ci',
              {
                expiresIn: '1h',
              }
            )

            res.send({ state: isMatch, token, id })
          } else {
            res.send({ state: false, msg: 'Password incorrect.' })
          }
        })
      })
      .catch(() => {
        res.send({
          state: false,
          msg: "Sorry, account doesn't found or incorrect.",
        })
      })
  }
})

// * REGISTER
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  const passwordHash = await bcrypt.hash(password, 10)

  const query = {
    text: 'INSERT INTO account(username,password) VALUES($1,$2) RETURNING *',
    values: [username, passwordHash],
  }

  pqQuery(query)
    .then((resolve) => {
      res.send({ state: true, resolve })
    })
    .catch(() => {
      res.send({ state: false, msg: 'This account has been registered.' })
    })
})

module.exports = {
  path: '/api',
  handler: app,
}
