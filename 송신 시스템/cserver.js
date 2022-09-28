const fs = require('fs');
const ejs = require('ejs');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const algorithm = 'aes-192-cbc';
const key = 'gachon2022ippcomputersw9'
const IV = '2022123456789123'
const client = mysql.createConnection({
    host: 'localhost', // DB서버 IP주소
    port: 3306, // DB   서버 Port주소
    user: '2022ipp', // DB접속 아이디
    password: 'gachon654321', // DB암호
    database: '6_IPP', //사용할 DB명
    multipleStatements: true
});
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));

//로그
const logger = require('../logger');

app.listen(65018, function () {
    console.log('웹서버 실행중...');
    console.log('외부: http://210.102.181.158:65018/');
    console.log('내부: http://192.9.20.62:65018/');
});

//메인화면 암호화 화면
app.get('/', (request, response) => {
    fs.readFile('c.ejs', 'utf8', (error, data) => {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.end(data);
    });
});

//버튼 클릭 시 개인정보 데이터 암호화 여부 확인 후 암호화되지 않은 데이터만 암호화 실행
app.post('/ccipher', (request, response) => {
    //암호화가 필요한 개인정보
    var sql1 = 'SELECT C_SNUM FROM C_UNIV_CLASS;';
    var sql2 = 'SELECT C_SNUM FROM C_UNIV_STD;';
    var sql3 = 'SELECT C_NAME FROM C_UNIV_STD;';
    var sql4 = 'SELECT C_RRN FROM C_UNIV_STD;';
    client.query(sql1 + sql2 + sql3 + sql4, function (error, result) {
        const result1 = result[0];
        const result2 = result[1];
        const result3 = result[2];
        const result4 = result[3];
        //개인정보가 암호화 되어있는지 확인
        result1.forEach(v => {
            var cipher = crypto.createCipheriv(algorithm, key, IV);
            if (v.C_SNUM.length > 30) {
                logger.log('error', `ESS017 이미 암호화 된 데이터입니다.`);
            } else {
                let C_SNUM = cipher.update(v.C_SNUM, 'utf8', 'hex');
                C_SNUM += cipher.final('hex');
                logger.log('info', `암호화 성공.`);
                client.query('UPDATE C_UNIV_CLASS SET C_SNUM=? WHERE C_SNUM =?', [C_SNUM, v.C_SNUM], () => {
                    response.send();
                })
            }

        });

        result2.forEach(v => {
            var cipher = crypto.createCipheriv(algorithm, key, IV);
            if (v.C_SNUM.length > 30) {
                logger.log('error', `ESS017 이미 암호화 된 데이터입니다.`);
            } else {
                let C_SNUM = cipher.update(v.C_SNUM, 'utf8', 'hex');
                C_SNUM += cipher.final('hex');
                logger.log('info', `암호화 성공.`);
                client.query('UPDATE C_UNIV_STD SET C_SNUM=? WHERE C_SNUM =?', [C_SNUM, v.C_SNUM], () => {
                    response.send();
                })
            }
        });

        result3.forEach(v => {
            var cipher = crypto.createCipheriv(algorithm, key, IV);
            if (v.C_NAME.length > 30) {
                logger.log('error', `ESS017 이미 암호화 된 데이터입니다.`);
            } else {
                let C_NAME = cipher.update(v.C_NAME, 'utf8', 'hex');
                C_NAME += cipher.final('hex');
                logger.log('info', `암호화 성공.`);
                client.query('UPDATE C_UNIV_STD SET C_NAME=? WHERE C_NAME =?', [C_NAME, v.C_NAME], () => {
                    response.send();
                })
            }
        });

        result4.forEach(v => {
            var cipher = crypto.createCipheriv(algorithm, key, IV);
            if (v.C_RRN.length > 30) {
                logger.log('error', `ESS017 이미 암호화 된 데이터입니다.`);
            } else {
                let C_RRN = cipher.update(v.C_RRN, 'utf8', 'hex');
                C_RRN += cipher.final('hex');
                logger.log('info', `암호화 성공.`);
                client.query('UPDATE C_UNIV_STD SET C_RRN=? WHERE C_RRN =?', [C_RRN, v.C_RRN], () => {
                    response.send();
                })
            }

        });
    })
    response.redirect('/');

})

//가천매니아에서 받은 요청 처리-> C대학 학사 DB 정보를 json포맷으로 전송
app.get('/csearch', (request, response) => {
    var req = require('request');
    //시간표에 필요한 A대학 학사 DB 데이터
    var sql1 = "SELECT * FROM C_UNIV_STD;";
    var sql2 = "SELECT * FROM C_UNIV_CLASS;";
    var sql3 = "SELECT * FROM C_UNIV_SUB";
    
    client.query(sql1 + sql2 + sql3, function (error, cuniv) {
        const result1 = Object.values(JSON.parse(JSON.stringify(cuniv[0])));
        const result2 = Object.values(JSON.parse(JSON.stringify(cuniv[1])));
        const result3 = Object.values(JSON.parse(JSON.stringify(cuniv[2])));

        var geturl = 'http://192.9.20.62:62006/cu';
        data = {
            result1,
            result2,
            result3,
        }
        const options = {
            url: geturl,
            method: 'POST',
            body: data,
            json: true
        }
        //정보전송
        req.post(options, function (error, response, body) {
        });
    })
});