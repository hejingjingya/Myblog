// 后台数据。apq数据mysql
const mysql = require('mysql')
const express = require('express')
const moment = require('moment')
const app = express()
const conn = mysql.createConnection({

  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'blog'
})

// 声明一个变量。设置中间件
const bodyParser = require('body-parser')

// 设置 默认采用的模板引擎名称
app.set('view engine', 'ejs')
// 设置模板页面的存放路径
app.set('views', './views')
// 文件引入不成功  静态文件托管
app.use('/node_modules', express.static('node_modules'))

app.use(bodyParser.urlencoded({ extended: false }))
// 注册页面

app.get('/register', (req, res) => {
  res.render('./user/register.ejs', {})
})


// // 注册新用户页面
// app.post('/register', (req, res) => {
//   res.send({ msg:'ok', status: 200 })
// })


// 判断用户注册是否合法，名字是否重复
// 1.接收前端发送的post请求（req.body)
// 2.对前端发送的参数进行解析
// 3.
app.post('/register', (req, res) => {
     const body = req.body
     console.log(body);
     
    //  判断用户是否输入完整
    if (body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
      return res.send({ msg: "请填写完整的表单数据后在注册用户", status: 501})
    }

    // 查询用户名是否重复
    const sql1 = 'select count(*) as count from list where username=?'

    conn.query(sql1, body.username, (err, result) => {

      console.log(result)

      // 如果查询失败。告知客户端失败
      if (err) return res.send({ msg: '用户名重查失败', status: 502 })

      if (result[0].count !==0) return res.send({ msg: '请更换其他用户名后重新注册！', status: 503 })

      // 执行注册的业务逻辑
      body.ctime = moment().format('YYY-MM-DD HH:mm:ss')
      // 查询语句
      const sql2 = 'insert into list set ?'

      conn.query(sql2, body, (err, result) => {

        

        if (err) return res.send({ msg:'注册用户失败', status: 504 })

        if (result.affectedRows !==1) return res.send({ msg: '注册新用户失败', status: 505 })
        
        res.send({ msg: '注册新用户成功', status: 200 })

      })
    })
    
})



// 登录页面
app.get('/login', (req, res) => {
  res.render('./user/login.ejs', {})
})





app.listen(3000, () => {
  console.log("服务器运行成功……")
})