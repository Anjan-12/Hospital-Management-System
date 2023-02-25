const { connectDb, client } = require("../models/db");

const createAssignmentTable = async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        aid varchar(100)  PRIMARY KEY,
        date VARCHAR(100) NOT NULL,
        remarks VARCHAR(100) NOT NULL,
        pid VARCHAR(100) NOT NULL,
        did VARCHAR(100) NOT NULL,
        FOREIGN KEY (pid) REFERENCES patients(pid),
        FOREIGN KEY (did) REFERENCES doctors(did)
    );`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = createAssignmentTable;
