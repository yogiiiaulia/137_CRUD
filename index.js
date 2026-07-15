const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host:'localhost',
  database: 'Mahasiswa',   // nama database
  password: 'Razy1234',  // pw postgresql
  port: 5432,
});

app.use(express.json());

app.get('/biodata', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM biodata');

    res.status(200).json({
      message: "Berhasil mengambil data biodata",
      data: result.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server atau database" });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

app.post('/biodata', async (req, res) => {

    const { id, nama, nim, kelas } = req.body;

    try {

        const result = await pool.query(
            `INSERT INTO biodata (Id, Nama, NIM, Kelas)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [id, nama, nim, kelas]
        );

        res.status(201).json({
            message: "Data berhasil ditambahkan",
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err.message);

        res.status(500).json({
            error: err.message
        });
    }

});

app.put('/biodata/:id', async (req, res) => {

    const { id } = req.params;
    const { nama, nim, kelas } = req.body;

    try {

        const result = await pool.query(
            `UPDATE biodata
             SET Nama = $1,
                 NIM = $2,
                 Kelas = $3
             WHERE Id = $4
             RETURNING *`,
            [nama, nim, kelas, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Data tidak ditemukan"
            });
        }

        

//delete