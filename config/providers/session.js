const low = require('lowdb')
const db = low('sessions.json')

db.defaults({ sessions: [] })
  .write()

db.get('sessions')
  .push({email: 'mauricioskateboard@gmail.com', created_at: new Date().toISOString()})
  .write()

module.exports = {
    get(email){
        return db.get('sessions').find({ id: req.params.email }).value()
    },
    write(obj){
        return db.get('sessions').push(obj).write()
    }
}

//TODO: redis futuramente