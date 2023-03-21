var express = require("express");
var cors = require("cors");
var path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const { responseFormat } = require("./model");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crudmytest",
});
const saltRounds = 10;

var app = express();
app.use(cors());
app.use(express.json());

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 5 * 1024 * 1024 * 1024, //5MB max file(s) size
    },
  })
);

// for parsing application/json
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

// for parsing application/xwww-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// app.get("/member", function (req, res, next) {
//   db.query("SELECT * FROM `member`", function (err, results, fields) {
//     res.json(results);
//   });
// });

app.post("/login", function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  const query = `SELECT * FROM member WHERE username = '${username}' LIMIT 1;`;
  //   console.log(`username = ${username}`);
  //   console.log(`password = ${password}`);
  //   console.log(query);

  db.query(query, function (err, results, fields) {
    if (err)
      return res
        .status(200)
        .send(responseFormat(false, 405, [], err.sqlMessage));
    if (results.length === 1) {
      bcrypt
        .compare(password, results[0].password)
        .then((resdata) => {
          console.log(resdata); // return true
          if (resdata) {
            console.log("สำเร็จ");
            return res
              .status(200)
              .send(responseFormat(true, 200, results[0], "เข้าสู่ระบบสำเร็จ"));
          } else {
            return res
              .status(200)
              .send(responseFormat(false, 400, [], "รหัสผ่านไม่ถูกต้อง"));
          }
        })
        .catch((err) => console.error(err.message));
    } else {
      return res
        .status(200)
        .send(responseFormat(false, 400, [], "ไม่พบข้อมูลผู้ใช้"));
    }
  });

  //   bcrypt
  //     .genSalt(saltRounds)
  //     .then((salt) => {
  //       console.log("Salt: ", salt);
  //       return bcrypt.hash(password, salt);
  //     })
  //     .then((hash) => {
  //       console.log("Hash: ", hash);
  //       res.send({ hash: hash });
  //     })
  //     .catch((err) => console.error(err.message));

  // db.query("SELECT * FROM `member`", function (err, results, fields) {
  //   res.json(results);
  // });
});

app.post("/register", async function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

  if (!username || !password || !firstname) {
    return res
      .status(200)
      .send(
        responseFormat(
          false,
          405,
          [],
          "{ username, password, firstname } is required "
        )
      );
  }

  if (username.length < 4 || username.length > 12) {
    return res
      .status(200)
      .send(
        responseFormat(
          false,
          405,
          [],
          "username ต้องมีความยาว 4-12 ตัวอักษรเท่านั้น"
        )
      );
  }
  console.log(req.files);
  if (!req.files) {
    return res
      .status(200)
      .send(responseFormat(false, 405, [], "{ file } is required "));
  }
  var hash2 = "";
  await bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      console.log("Salt: ", salt);
      return bcrypt.hash(password, salt);
    })
    .then((hash) => {
      console.log("Hash: ", hash);
      hash2 = hash;
      // return res.send({ hash: hash });
      // return res.status(200).send(responseFormat(false, 500, { hash: hash }, "ok"));
    })
    .catch((err) => console.error(err.message));
  var query = "";
  if (!lastname) {
    query = `INSERT INTO member(username, password, firstname) VALUES ('${username}', '${hash2}', '${firstname}')`;
  } else {
    query = `INSERT INTO member(username, password, firstname, lastname) VALUES ('${username}', '${hash2}', '${firstname}', '${lastname}')`;
  }

  db.query(query, function (err, results, fields) {
    if (err)
      return res
        .status(200)
        .send(responseFormat(false, 405, [], "username นี้มีอยู่ในระบบเเล้ว"));

    const filename = `${results.insertId}.png`;
    db.query(
      `UPDATE member SET profileImage = '${filename}' WHERE id = ${results.insertId}`,
      function (err2, results2, fields2) {
        if (err2)
          return res
            .status(200)
            .send(responseFormat(false, 405, [], err2.sqlMessage));
        let file = req.files.file;
        if (typeof file.length === "undefined") {
          if (file.mimetype.indexOf("image/") === -1) {
            return res
              .status(200)
              .send(responseFormat(false, 405, [], "file is not image"));
          }
          file.mv(`uploads/${results.insertId}.png`);
          return res.status(200).send(
            responseFormat(
              true,
              200,
              {
                ...req.body,
                id: results.insertId,
                password: hash2,
                profileImage: `${results.insertId}.png`,
              },
              "สมัครสมาชิกสำเร็จ"
            )
          );
        }
      }
    );
  });
});

app.put("/editprofile", async function (req, res, next) {
  const id = req.body.id;
  const password = req.body.password;
  const oldpassword = req.body.oldpassword;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

  if (!id) {
    return res
      .status(200)
      .send(responseFormat(false, 405, [], "{ body(id) } is required "));
  }

  if (!firstname) {
    return res
      .status(200)
      .send(
        responseFormat(false, 405, [], "{ password, firstname } is required ")
      );
  }

  if (password) {
    if (!oldpassword)
      return res
        .status(200)
        .send(
          responseFormat(
            false,
            405,
            [],
            "{ password, oldpassword } is required "
          )
        );
  }
  // if (!req.files) {
  //   return res
  //     .status(200)
  //     .send(responseFormat(false, 405, [], "{ file } is required "));
  // }
  var query = "";
  if (!password) {
    !lastname
      ? (query = `UPDATE member SET firstname='${firstname}' WHERE id='${id}'`)
      : (query = `UPDATE member SET firstname='${firstname}',lastname='${lastname}' WHERE id='${id}'`);
  } else {
    var passwordcheck = false;
    await bcrypt
      .compare(password, oldpassword)
      .then((resdata) => {
        passwordcheck = resdata;
      })
      .catch((err) => console.error(err.message));
    console.log(passwordcheck);
    if (passwordcheck) {
      return res
        .status(200)
        .send(responseFormat(false, 405, [], "รหัสผ่านซ้ำกับรหัสเดิม"));
    }

    var hash2 = "";
    await bcrypt
      .genSalt(saltRounds)
      .then((salt) => {
        console.log("Salt: ", salt);
        return bcrypt.hash(password, salt);
      })
      .then((hash) => {
        console.log("Hash: ", hash);
        hash2 = hash;
        // return res.send({ hash: hash });
        // return res.status(200).send(responseFormat(false, 500, { hash: hash }, "ok"));
      })
      .catch((err) => console.error(err.message));

    !lastname
      ? (query = `UPDATE member SET firstname='${firstname}',password='${hash2}' WHERE id='${id}'`)
      : (query = `UPDATE member SET firstname='${firstname}',lastname='${lastname}',password='${hash2}' WHERE id='${id}'`);
    // query = ``;
  }

  if (req.files) {
    // File Manager

    let file = req.files.file;
    if (typeof file.length === "undefined") {
      if (file.mimetype.indexOf("image/") === -1) {
        return res
          .status(200)
          .send(responseFormat(false, 405, [], "file is not image"));
      }
      file.mv(`uploads/${id}.png`);
    }
  }
  db.query(query, function (err, results, fields) {
    if (err)
      return res.status(200).send(responseFormat(false, 405, [], "ผิดพลาด"));

    db.query(
      `SELECT * FROM member where id = ${id}`,
      function (err2, results2, fields2) {
        if (err)
          return res
            .status(200)
            .send(responseFormat(false, 405, [], "ผิดพลาด"));
        return res
          .status(200)
          .send(responseFormat(true, 200, results2[0], "สำเร็จ"));
      }
    );
    // return res.status(200).send(responseFormat(true, 200, [], "สำเร็จ"));
  });
});

app.listen(5000, function () {
  console.log("CORS-enabled web server listening on port 5000");
});
