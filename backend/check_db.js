const mongoose = require('mongoose');

async function scan() {
  await mongoose.connect('mongodb+srv://soubarman62_db_user:DRfDmSH4H1emqhHR@cluster0.qo6fyqe.mongodb.net/?appName=Cluster0');
  
  const dbs = await mongoose.connection.db.admin().listDatabases();
  for (const dbInfo of dbs.databases) {
    if (dbInfo.name === 'admin' || dbInfo.name === 'local') continue;
    
    console.log('\nScanning DB:', dbInfo.name);
    const db = mongoose.connection.client.db(dbInfo.name);
    const collections = await db.listCollections().toArray();
    
    for (const coll of collections) {
      if (coll.name === 'users') {
        const users = await db.collection(coll.name).find({ name: { $in: ['Hirok', 'Sourav Barman'] } }).toArray();
        if (users.length > 0) {
          console.log('FOUND USERS in', dbInfo.name, coll.name);
          users.forEach(u => console.log(JSON.stringify(u)));
        }
      }
    }
  }
  process.exit(0);
}
scan();
