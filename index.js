const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
// var corsOptions = {
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200 
// }
app.use(cors())
morgan.token('postData', (req) => {
    if (req.method==='POST') {
      return JSON.stringify(req.body);
     } else {
      return 'posted data doesnt exist'
     }
})
app.use(morgan(':method :url :status - :response-time ms :postData'))
let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.post('/api/persons', (request, response) => {
  
  const info = request.body;
  const sameName = persons.filter(p => info.name===p.name)
  if (info.name.length===0 ) {
      response.status(400).send({ error: 'Name must be provided' })
  }
  if (info.number.length===0) {
    response.status(400).send({ error: 'Number must be provided' })
  }
  if (sameName.length > 0) {
    response.status(400).send({ error: 'Name must be unique' })
  }
  const randomID = Math.random() * Number.MAX_SAFE_INTEGER;
  const person = {...info, "id":randomID};
  const prevPersonsLen = persons.length
  persons = persons.concat(person);
  if (prevPersonsLen === persons.length) {
    response.status(400).end()
  } else {
    response.status(200).end()
  }
})
app.get('/api/persons', (request, response) => {
  response.json(persons)
  
})
app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(note => note.id===id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const prevPersonsLen = persons.length
  persons = persons.filter(note => note.id !== id)
  if (prevPersonsLen === persons.length) {
    response.status(400).end()
  } else {
    response.status(204).end()
  }
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

