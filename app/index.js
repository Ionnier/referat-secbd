const oracledb = require('oracledb');
const express = require('express')
const { Sequelize, DataTypes, where } = require('sequelize');

const app = express()

app.use(express.json());

const port = 3000

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
let connection

async function run() {
    connection = await oracledb.getConnection({
        user: "dbahrim",
        password: "Password1234",
        connectString: "localhost:1521/FREEPDB1"
    });
}

run();

app.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    try {
        const result = await connection.execute(
            `SELECT *
             FROM dbahrim.app_users
             WHERE username = :username and userpassword = :password`,
            { username, password }
        );

        if (result.rows.length > 0) {
            res.end("Success");
        } else {
            res.end("Failure");
        }
    } catch (e) {
        res.json(e).end()
    }
})

app.get('/users/:id', async (req, res) => {
    const id = req.params.id
    console.log(id) // 1' UNION select banner from v$version --
    try {
        const query = `SELECT username
             FROM dbahrim.app_users
             WHERE id_user = '${id}'`
        const result = await connection.execute(
            query,
        );
        res.json(result.rows).end()
    } catch (e) {
        res.json(e).end()
    }
})

app.get('/users2/:id', require('sanitize').middleware, async (req, res) => {
    const id = req.paramInt("id")
    console.log(id) // - 1
    try {
        const query = `SELECT username
             FROM dbahrim.app_users
             WHERE id_user = '${id}'`
        const result = await connection.execute(
            query,
        );
        res.json(result.rows).end()
    } catch (e) {
        res.json(e).end()
    }
})

app.get('/users3/:id', require('sanitize').middleware, async (req, res) => {
    const id = req.paramString("id")
    console.log(id) // - 1' UNION select banner from v$version --
    try {
        const query = `SELECT username
             FROM dbahrim.app_users
             WHERE id_user = :id`
        const result = await connection.execute(
            query, { id }
        );
        res.json(result.rows).end()
    } catch (e) {
        res.json(e).end()
    }
})


const sequelize = new Sequelize('FREEPDB1', 'dbahrim', 'Password1234', {
    host: 'localhost',
    dialect: 'oracle',
    define: {
        timestamps: false,
        freezeTableName: true
    },
});

const AppUsers = sequelize.define(
    'APP_USERS',
    {
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
        },
        userpassword: {
            type: DataTypes.STRING,
        },
    }
);

app.get('/users4/:id', require('sanitize').middleware, async (req, res) => {
    const id = req.paramString("id")
    console.log(id) // - 1' UNION select banner from v$version --

    console.log(await AppUsers.findAll({where: {
        id_user: id
    }}));
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

process.on('SIGINT', async function () {
    await connection.close();
    process.exit(0);
});