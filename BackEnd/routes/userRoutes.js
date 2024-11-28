// const express = require('express');
// const router = express.Router();
// const db = require('../server');

// // 用户登录
// router.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: '用户名和密码是必填项' });
//   }

//   // 查询数据库中是否存在匹配的用户
//   const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
//   db.query(query, [username, password], (err, results) => {
//     if (err) {
//       console.error('数据库查询错误:', err);
//       return res.status(500).json({ message: '服务器错误' });
//     }

//     if (results.length > 0) {
//       res.status(200).json({ message: '登录成功' });
//     } else {
//       res.status(401).json({ message: '用户名或密码错误' });
//     }
//   });
// });

// module.exports = router;
