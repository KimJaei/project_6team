const fs = require('fs');
const ejs = require('ejs');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const algorithm = 'aes-192-cbc';
const key = 'gachon2022ippcomputersw9';
const IV = '2022123456789123';
const client = mysql.createConnection({
    host: 'localhost', // DB서버 IP주소
    port: 3306, // DB서버 Port주소
    user: '2022ipp', // DB접속 아이디
    password: 'gachon654321', // DB암호
    database: '6_IPP', //사용할 DB명
    multipleStatements: true
});
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.listen(62006, function () {
    console.log('웹서버 실행중...');
    console.log('외부: http://210.102.181.158:62006/');
    console.log('내부: http://192.9.20.62:62006/');
});

//로그
const logger = require('../logger');
const { deprecate } = require('util');
const { redirect } = require('express/lib/response');
const { add } = require('../logger');


//회원가입
app.get('/join', (request, response) => {
    fs.readFile('join.html', 'utf8', (error, data) => { //회원가입화면
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.end(data); // 회원가입 화면전송
    });
});

app.post('/join', function (request, response) {
    let body = request.body;
    var cipher1 = crypto.createCipheriv(algorithm, key, IV);
    var cipher2 = crypto.createCipheriv(algorithm, key, IV);
    var cipher3 = crypto.createCipheriv(algorithm, key, IV);
    //개인정보 암호화
    let pw = cipher1.update(body.pass, 'utf8', 'hex') + cipher1.final('hex');
    let names = cipher2.update(body.name, 'utf8', 'hex') + cipher2.final('hex');
    let snums = cipher3.update(body.gc_snum, 'utf8', 'hex') + cipher3.final('hex');
    //오류 처리
    if (body.name == "") {
        logger.log('error', `EGM001 이름은 필수 입력 항목입니다.`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("이름을 입력해주세요.")</script>');
        return response.write("<script>window.location=\"/join\"</script>");
    }
    if (body.uid == "") {
        logger.log('error', `EGM001 아이디는 필수 입력 항목입니다.`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("아이디를 입력해주세요.")</script>');
        return response.write("<script>window.location=\"/join\"</script>");
    }
    if (body.pw == "") {
        logger.log('error', `EGM001 패스워드는 필수 입력 항목입니다.`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("비밀번호를 입력해주세요.")</script>');
        return response.write("<script>window.location=\"/join\"</script>");
    }
    if (body.gc_snum == "") {
        logger.log('error', `EGM001 학번은 필수 입력 항목입니다.`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("학번을 입력해주세요.")</script>');
        return response.write("<script>window.location=\"/join\"</script>");
    }
    if (body.gc_univ == "") {
        logger.log('error', `EGM001 대학명은 필수 입력 항목입니다.`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("대학명을 입력해주세요.")</script>');
        return response.write("<script>window.location=\"/join\"</script>");
    }
    if (body.gc_dep == "") {
        logger.log('error', `EGM001 학과는 필수 입력 항목입니다.`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("학과를 입력해주세요.")</script>');
        return response.write("<script>window.location=\"/join\"</script>");
    }

    if (body.name.length > 20) {
        logger.log('error', `EGL001 이름은 허용 길이를 초과하였습니다.`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("이름이 허용 길이를 초과했습니다.")</script>');
        return response.write("<script>window.location=\"/join\"</script>");
    }
    if (body.uid.length > 20) {
        logger.log('error', `EGL001 아이디는 허용 길이를 초과하였습니다.`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("아이디가 허용 길이를 초과했습니다.")</script>');
        return response.write("<script>window.location=\"/join\"</script>");
    }

    if (body.gc_snum.length > 10) {
        logger.log('error', `EGL001 학번은 허용 길이를 초과하였습니다.`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("학번이 허용 길이를 초과했습니다.")</script>');
        return response.write("<script>window.location=\"/join\"</script>");
    }
    if (body.gc_univ.length > 20) {
        logger.log('error', `EGL001 대학명은 허용 길이를 초과하였습니다.`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("대학명이 허용 길이를 초과했습니다.")</script>');
        return response.write("<script>window.location=\"/join\"</script>");
    }
    if (body.gc_dep.length > 20) {
        logger.log('error', `EGL001 학과는 허용 길이를 초과하였습니다.`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("학과가 허용 길이를 초과했습니다.")</script>');
        return response.write("<script>window.location=\"/join\"</script>");
    }

    client.query('INSERT INTO GC_MEMBER (NAME, UID, PASS, GC_SNUM, GC_UNIV, GC_DEP) VALUES (?, ?, ?, ?, ?, ?)', [names, body.uid, pw, snums, body.gc_univ, body.gc_dep], () => {
        logger.log('info', '회원가입 완료');
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.write('<script>alert("회원가입 완료")</script>');
        response.write("<script>window.location=\"/\"</script>");
    });
});

//메인화면, 로그인
app.get('/', (request, response) => {
    fs.readFile('login.ejs', 'utf8', (error, data) => {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.end(data);
    });
});
app.post('/login', function (request, response) {
    let body = request.body;
    var uid = body.uid;
    var pass = body.pass;
    var sql = 'SELECT * FROM GC_MEMBER WHERE UID=?';
    client.query(sql, [uid], function (error, results) {
        if (error)
            logger.log('error', '에러처리');
        if (!results[0]) {
            logger.log('error', '존재하지 않는 ID');
            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
            response.write('<script>alert("ID를 확인해주세요")</script>');
            return response.write("<script>window.location=\"/\"</script>");
        }
        var user = results[0];
        var decipher = crypto.createDecipheriv(algorithm, key, IV);
        //비밀번호 복호화 후 사용
        let decrypted = decipher.update(user.PASS, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        //로그인 성공 시 시간표 출력
        if (decrypted == pass) {
            logger.log('info', '로그인완료');
            var name = user.NAME;
            var desname = crypto.createDecipheriv(algorithm, key, IV);
            //개인정보 복호화 후 사용
            let decname = desname.update(name, 'hex', 'utf8') + desname.final('utf8');
            var sql = 'SELECT * FROM GC_STD WHERE GC_NAME=?'
            client.query(sql, [name], function (error, gcstd) {
                var snum = gcstd[0].GC_SNUM;
                var desnum = crypto.createDecipheriv(algorithm, key, IV);
                //개인정보 복호화 후 사용
                let decsnum = desnum.update(snum, 'hex', 'utf8') + desnum.final('utf8');
                var sql = 'SELECT * FROM GC_CLASS WHERE GC_SNUM=?';
                client.query(sql, [snum], function (error, gcclass) {
                    var gc = gcclass;
                    var univ = user.GC_UNIV;
                    var dep = user.GC_DEP;
                    var day = gc.GC_CLASSD;
                    results = [univ, dep, decsnum, decname, day];
                    var mon = [];
                    var tue = [];
                    var wed = [];
                    var thu = [];
                    var fri = [];
                    gc.forEach((v) => {
                        var subc = v.GC_SUB_CODE;
                        if (v.GC_CLASSD == "mon") {
                            if (subc == "1001") {
                                bsubName = "C언어";
                            } if (subc == "1002") {
                                bsubName = "컴퓨터개론";
                            } if (subc == "1003") {
                                bsubName = "사물인터넷";
                            } if (subc == "1004") {
                                bsubName = "인공지능";
                            } if (subc == "2001") {
                                bsubName = "전자회로";
                            } if (subc == "2002") {
                                bsubName = "반도체";
                            }
                            mon.push(bsubName);
                        }
                        if (v.GC_CLASSD == "tue") {
                            if (subc == "1001") {
                                bsubName = "C언어";
                            } if (subc == "1002") {
                                bsubName = "컴퓨터개론";
                            } if (subc == "1003") {
                                bsubName = "사물인터넷";
                            } if (subc == "1004") {
                                bsubName = "인공지능";
                            } if (subc == "2001") {
                                bsubName = "전자회로";
                            } if (subc == "2002") {
                                bsubName = "반도체";
                            }
                            tue.push(bsubName);
                        }
                        if (v.GC_CLASSD == "wed") {
                            if (subc == "1001") {
                                bsubName = "C언어";
                            } if (subc == "1002") {
                                bsubName = "컴퓨터개론";
                            } if (subc == "1003") {
                                bsubName = "사물인터넷";
                            } if (subc == "1004") {
                                bsubName = "인공지능";
                            } if (subc == "2001") {
                                bsubName = "전자회로";
                            } if (subc == "2002") {
                                bsubName = "반도체";
                            }
                            wed.push(bsubName);
                        }
                        if (v.GC_CLASSD == "thu") {
                            if (subc == "1001") {
                                bsubName = "C언어";
                            } if (subc == "1002") {
                                bsubName = "컴퓨터개론";
                            } if (subc == "1003") {
                                bsubName = "사물인터넷";
                            } if (subc == "1004") {
                                bsubName = "인공지능";
                            } if (subc == "2001") {
                                bsubName = "전자회로";
                            } if (subc == "2002") {
                                bsubName = "반도체";
                            }
                            thu.push(bsubName);
                        }
                        if (v.GC_CLASSD == "fri") {
                            if (subc == "1001") {
                                bsubName = "C언어";
                            } if (subc == "1002") {
                                bsubName = "컴퓨터개론";
                            } if (subc == "1003") {
                                bsubName = "사물인터넷";
                            } if (subc == "1004") {
                                bsubName = "인공지능";
                            } if (subc == "2001") {
                                bsubName = "전자회로";
                            } if (subc == "2002") {
                                bsubName = "반도체";
                            }
                            fri.push(bsubName);
                        }
                    });
                    //시간표 출력
                    fs.readFile('time.ejs', 'utf8', (error, data) => {
                        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
                        response.end(ejs.render(data, {
                            data: results,
                            mon: mon,
                            tue: tue,
                            wed: wed,
                            thu: thu,
                            fri: fri
                        }));
                    });
                })
            })
        }
        if (decrypted != pass) {
            logger.log('error', '비밀번호 오류');
            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
            response.write('<script>alert("비밀번호를 확인해주세요")</script>');
            return response.write("<script>window.location=\"/\"</script>");
        }
    });
});

//모니터링 진입 버튼
app.get('/monitor', (request, response) => {
    fs.readFile('monitor.ejs', 'utf8', (error, data) => {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.end(data);
    });
});

//버튼눌러서 A대학 학사 DB 요청
app.post('/aunivin', (request, response) => {
    var req = require('request');
    var geturl = 'http://192.9.20.62:65016/asearch';
    req.get({
        url: geturl
    }, function (err, response) {
        if (err) {
            logger.log('error', `ESA002 A대학 연계실패`);
        } else {
            logger.log('info', `A대학 연계성공`);
        }
    })
    response.redirect('/monitoring');
});

//버튼눌러서 B대학 학사 DB 요청
app.post('/bunivin', (request, response) => {
    var req = require('request');
    var geturl = 'http://192.9.20.62:65017/bsearch';
    req.get({
        url: geturl
    }, function (err, response) {
        if (err) {
            logger.log('error', `ESA002 B대학 연계실패`);
        } else {
            logger.log('info', `B대학 연계성공`);
        }
    })
    response.redirect('/monitoring');
});

//버튼눌러서 C대학 학사 DB 요청
app.post('/cunivin', (request, response) => {
    var req = require('request');
    var geturl = 'http://192.9.20.62:65018/csearch';
    req.get({
        url: geturl
    }, function (err, response) {
        if (err) {
            logger.log('error', `ESA002 C대학 연계실패`);
        } else {
            logger.log('info', `C대학 연계성공`);
        }
    })
    response.redirect('/monitoring');
});

app.use(bodyParser.json());
var req = require('request');


//전송받은 A대학 연계데이터 가천매니아 DB에 코드매핑 후 삽입
app.post('/au', function (req, response, next) {
    var result1 = req.body.result1;
    var result2 = req.body.result2;
    var result3 = req.body.result3;
    var result4 = req.body.result4;
    var result5 = req.body.result5;
    result1.forEach((v) => {
        var insql1 = "INSERT INTO GC_STD VALUES(?,?,?,?);";
        var adepc = v.A_DEPC;
        var adep = null;
        if (adepc == "001") {
            adep = "컴공학";
        } if (adepc == "002") {
            adep = "전자공학";
        } if (adepc == "003") {
            adep = "기계공학";
        } if (adepc == "101") {
            adep = "행정학";
        } if (adepc == "102") {
            adep = "경제학";
        } if (adepc == "201") {
            adep = "미술학";
        } if (adepc == "202") {
            adep = "관현악";
        } if (adepc == "301") {
            adep = "수학";
        } if (adepc == "302") {
            adep = "화학";
        }
        let astd = [v.A_SNUM, v.A_NAME, adep, adepc];
        var insql1s = mysql.format(insql1, astd);
        client.query(insql1s, function (error, result) {
            if (error) {
                logger.log('error', `ESD001 A대학 연계데이터삽입실패`);
            } else {
                logger.log('info', `A대학 연계데이터삽입성공`);
            }
            response.send();
        });
    });

    result2.forEach((v) => {
        var insql2 = "INSERT INTO GC_CLASS VALUES(?,?,?,?,?,?,?);"
        var asub = v.A_SUBC;
        
        if (asub == "0010001") {
            asub = "1001";
            asubName = "C언어";
        } if (asub == "0010002") {
            asub = "1002";
            asubName = "컴퓨터개론";
        } if (asub == "0010003") {
            asub = "1003";
            asubName = "사물인터넷";
        } if (asub == "0010004") {
            asub = "1004";
            asubName = "인공지능";
        } if (asub == "0020001") {
            asub = "2001";
            asubName = "전자회로";
        } if (asub == "0020002") {
            asub = "2002";
            asubName = "반도체";
        }

        let aclass = [v.A_CLASSNUM, v.A_SNUM, asub, v.A_CLASSD, v.A_CLASST, v.A_ROOM, asubName]
        var insql2s = mysql.format(insql2, aclass);
        client.query(insql2s, function (error, result) {
            if (error) {
                logger.log('error', `ESD001 A대학 연계데이터삽입실패`);
            } else {
                logger.log('info', `A대학 연계데이터삽입성공`);
            }
            response.send();
        });

    });

    result3.forEach((v) => {
        var insql3 = "INSERT INTO GC_ROOM VALUES(?,?,?);";
        let aroom = [v.A_ROOM_CODE, v.A_RNUM, null];
        var insql3s = mysql.format(insql3, aroom);
        client.query(insql3s, function (error, result) {
            if (error) {
                logger.log('error', `ESD001 A대학 연계데이터삽입실패`);
            } else {
                logger.log('info', `A대학 연계데이터삽입성공`);
            }
            response.send();
        });
    });

    result4.forEach((v) => {
        var insql4 = "INSERT INTO GC_P VALUES(?,?);";
        let ap = [v.A_PNUM, v.A_PNAME];
        var insql4s = mysql.format(insql4, ap);
        client.query(insql4s, function (error, result) {
            if (error) {
                logger.log('error', `ESD001 A대학 연계데이터삽입실패`);
            } else {
                logger.log('info', `A대학 연계데이터삽입성공`);
            }
            response.send();
        });
    });


    result5.forEach((v) => {
        var insql5 = "INSERT INTO GC_SUB VALUES(?,?,?);";
        var asub = v.A_SUB_CODE;
        var asubName = v.A_SUB;
        if (asub == "0010001") {
            asub = "1001";
            asubName = "C언어";
        } if (asub == "0010002") {
            asub = "1002";
            asubName = "컴퓨터개론";
        } if (asub == "0010003") {
            asub = "1003";
            asubName = "사물인터넷";
        } if (asub == "0010004") {
            asub = "1004";
            asubName = "인공지능";
        } if (asub == "0020001") {
            asub = "2001";
            asubName = "전자회로";
        } if (asub == "0020002") {
            asub = "2002";
            asubName = "반도체";
        }
        let sub = [asub, asubName, null];
        var insql5s = mysql.format(insql5, sub);

        client.query(insql5s, function (error, result) {
            if (error) {
                logger.log('error', `ESD001 A대학 연계데이터삽입실패`);
            } else {
                logger.log('info', `A대학 연계데이터삽입성공`);
            }
            response.send();
        });
    })
})

//전송받은 B대학 연계데이터 가천매니아 DB에 코드매핑 후 삽입
app.post('/bu', function (req, response, next) {
    var result1 = req.body.result1;
    var result2 = req.body.result2;
    var result3 = req.body.result3;
    result1.forEach((v) => {
        var insql1 = "INSERT INTO GC_STD VALUES(?,?,?,?);";
        let bstd = [v.B_SNUM, v.B_NAME, v.B_DEP, null];
        var insql1s = mysql.format(insql1, bstd);
        client.query(insql1s, function (error, result) {
            if (error) {
                logger.log('error', `ESD001 B대학 연계데이터삽입실패`);
            } else {
                logger.log('info', `B대학 연계데이터삽입성공`);
            }
        });

    });

    result2.forEach((v) => {
        var insql2 = "INSERT INTO GC_CLASS VALUES(?,?,?,?,?,?,?);";
        var bsub = v.B_SUB_CODE;
        if (bsub == "0000000001") {
            bsub = "1001";
            bsubName = "C언어";
        } if (bsub == "0000000002") {
            bsub = "1002";
            bsubName = "컴퓨터개론";
        } if (bsub == "0000000003") {
            bsub = "1003";
            bsubName = "사물인터넷";
        } if (bsub == "0000000004") {
            bsub = "1004";
            bsubName = "인공지능";
        } if (bsub == "0000000005") {
            bsub = "2001";
            bsubName = "전자회로";
        } if (bsub == "0000000006") {
            bsub = "2002";
            bsubName = "반도체";
        }
        let bclass = [v.B_CLASSNUM, v.B_SNUM, bsub, v.B_CLASSD, v.B_CLASST, v.B_RRNUM, bsubName]
        var insql2s = mysql.format(insql2, bclass);
        client.query(insql2s, function (error, result) {
            if (error) {
                logger.log('error', `ESD001 B대학 연계데이터삽입실패`);
            } else {
                logger.log('info', `B대학 연계데이터삽입성공`);
            }
        });
    });

    result3.forEach((v) => {
        var insql3 = "INSERT INTO GC_SUB VALUES(?,?,?);";
        var bsub = v.B_SUB_CODE;
        var bsubName = v.B_SUB;
        if (bsub == "0000000001") {
            bsub = "1001";
            bsubName = "C언어";
        } if (bsub == "0000000002") {
            bsub = "1002";
            bsubName = "컴퓨터개론";
        } if (bsub == "0000000003") {
            bsub = "1003";
            bsubName = "사물인터넷";
        } if (bsub == "0000000004") {
            bsub = "1004";
            bsubName = "인공지능";
        } if (bsub == "0000000005") {
            bsub = "2001";
            bsubName = "전자회로";
        } if (bsub == "0000000006") {
            bsub = "2002";
            bsubName = "반도체";
        }
        let sub = [bsub, bsubName, null];
        var insql3s = mysql.format(insql3, sub);

        client.query(insql3s, function (error, result) {
            if (error) {
                logger.log('error', `ESD001 B대학 연계데이터삽입실패`);
            } else {
                logger.log('info', `B대학 연계데이터삽입성공`);
            }
        });
    })
});


//전송받은 C대학 연계데이터 가천매니아 DB에 코드매핑 후 삽입
app.post('/cu', function (req, response, next) {
    var result1 = req.body.resuC대학lt1;
    var result2 = req.body.result2;
    var result3 = req.body.result3;
    result1.forEach((v) => {
        var insql1 = "INSERT INTO GC_STD VALUES(?,?,?,?);";
        var cdepc = v.C_DEPC;

        var cdep = null;
        if (cdepc == "001") {
            cdep = "컴공학";
        } if (cdepc == "002") {
            cdep = "전자공학";
        } if (cdepc == "003") {
            cdep = "기계공학";
        } if (cdepc == "101") {
            cdep = "행정학";
        } if (cdepc == "102") {
            cdep = "경제학";
        } if (cdepc == "201") {
            cdep = "미술학";
        } if (cdepc == "202") {
            cdep = "관현악";
        } if (cdepc == "301") {
            cdep = "수학";
        } if (cdepc == "302") {
            cdep = "화학";
        }

        let cstd = [v.C_SNUM, v.C_NAME, v.C_DEP, cdepc];
        var insql1s = mysql.format(insql1, cstd);
        client.query(insql1s, function (error, result) {
            if (error) {
                logger.log('error', `ESD001 C대학 연계데이터삽입실패`);
            } else {
                logger.log('info', `C대학 연계데이터삽입성공`);
            }
            response.send();
        });

    });

    result2.forEach((v) => {
        var insql2 = "INSERT INTO GC_CLASS VALUES(?,?,?,?,?,?,?);";
        var csub = v.C_SUBC;
        if (csub == "0000000001") {
            csub = "1001";
            csubName = "C언어";
        } if (csub == "0000000002") {
            csub = "1002";
            csubName = "컴퓨터개론";
        } if (csub == "0000000003") {
            csub = "1003";
            csubName = "사물인터넷";
        } if (csub == "0000000004") {
            csub = "1004";
            csubName = "인공지능";
        } if (csub == "0000000005") {
            csub = "2001";
            csubName = "전자회로";
        } if (csub == "0000000006") {
            csub = "2002";
            csubName = "반도체";
        }
        let cclass = [v.C_CLASSNUM, v.C_SNUM, csub, v.C_CLASSD, v.C_CLASST, v.C_RRNUM, null]
        var insql2s = mysql.format(insql2, cclass);
        client.query(insql2s, function (error, result) {
            if (error) {
                logger.log('error', `ESD001 C대학 연계데이터삽입실패`);
            } else {
                logger.log('info', `C대학 연계데이터삽입성공`);
            }
            response.send();
        });

    });

    result3.forEach((v) => {
        var insql3 = "INSERT INTO GC_SUB VALUES(?,?,?);";
        var csub = v.C_SUB_CODE;
        var csubn = v.C_SUB;
        if (csub == "0000000001") {
            csub = "1001";
            csubn = "C언어";
        } if (csub == "0000000002") {
            csub = "1002";
            csubn = "컴퓨터개론";
        } if (csub == "0000000003") {
            csub = "1003";
            csubn = "사물인터넷";
        } if (csub == "0000000004") {
            csub = "1004";
            csubn = "인공지능";
        } if (csub == "0000000005") {
            csub = "2001";
            csubn = "전자회로";
        } if (csub == "0000000006") {
            csub = "2002";
            csubn = "반도체";
        }
        let sub = [csub, csubn, null];
        var insql3s = mysql.format(insql3, sub);

        client.query(insql3s, function (error, result) {
            if (error) {
                logger.log('error', `ESD001 C대학 연계데이터삽입실패`);
            } else {
                logger.log('info', `C대학 연계데이터삽입성공`);
            }
            response.send();
        });
    })
});

//연계 로그를 확인 가능한 모니터링 화면
app.get('/monitoring', (request, response) => {
    fs.readFile('monitoring.ejs', 'utf8', (error, result) => {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.end(ejs.render(result, {
            date: null,
            table: null,
            step: null,
            procot: null,
            ocot: null,
            xcot: null

        }));
    });
});

app.post('/monitoring', (request, response) => {
    let body = request.body;
    let dateStart = body.dateStart;
    let dateEnd = body.dateEnd;
    let table = body.table;

    var step = body.step;
    var data = '';

    if (!dateStart) {
        dateStart = "2022-05-23";
    }
    if (!dateEnd) {
        let today = new Date();
        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        let date = today.getDate();  // 날짜

        dateEnd = year + '-0' + month + '-0' + date;
    }
    var StartToLast = getDatesStartToLast(dateStart, dateEnd);
    fs.readFile('monitoring.ejs', 'utf8', (error, result) => {

        for (i = 0; i < StartToLast.length; i++) {
            data = data + fs.readFileSync(`logs/${StartToLast[i]}.log`, "utf8") + '\n';
        }
        a = data.split('\n');
        for (i = 0; i < a.length; i++) {
            a[i] = a[i].split(" ");
        }
        var info = 0;
        var error = 0;

        for (i = 0; i < a.length; i++) {
            if (a[i][2] == "error") {
                if (a[i][4] == table || table == "all") {
                    error++;
                }
            } else if (a[i][2] == "info") {
                if (a[i][3] == table || table == "all") {
                    info++;
                }
            }
        }

        date = dateStart + ' ~ ' + dateEnd;
        procot = info + error;
        ocot = info;
        xcot = error;
        if (table == "all") {
            table = '전체 테이블';
        }

        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.end(ejs.render(result, {
            date: date,
            table: table,
            step: step,
            procot: procot,
            ocot: ocot,
            xcot: xcot,
            data: a,
        }));
    });
});

//오류 로그를 확인 가능한 모니터링 화면
app.get('/mo', (request, response) => {
    fs.readFile('monitoringError.ejs', 'utf8', (error, result) => {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.end(ejs.render(result, {
            date: null,
            code: null,
            msg: null,
            num: null
        }));
    });
});

app.post('/mo', (request, response) => {
    let body = request.body;
    let dateStart = body.dateStart;
    let dateEnd = body.dateEnd;

    if (!dateStart) {
        dateStart = "2022-05-23";
    }
    if (!dateEnd) {
        let today = new Date();
        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        let date = today.getDate();  // 날짜

        dateEnd = year + '-0' + month + '-0' + date;
    }
    var StartToLast = getDatesStartToLast(dateStart, dateEnd)
    fs.readFile('monitoringError.ejs', 'utf8', (error, result) => {
        let code = body.code;
        let msg = '';
        var data = '';
        let num = 0;

        for (i = 0; i < StartToLast.length; i++) {
            data = data + fs.readFileSync(`logs/${StartToLast[i]}.log`, "utf8") + '\n';
        }
        a = data.split('\n');
        for (i = 0; i < a.length; i++) {
            a[i] = a[i].split(" ");
        }
        for (i = 0; i < a.length; i++) {
            if (a[i][3] == code || code == "all") {
                num++;
            }
        }
        

        if (code == "EGD001") {
            msg = '이미 등록된 데이터입니다.';
        } else if (code == "EGD002") {
            msg = '수정할 데이터가 없습니다.';
        } else if (code == "EGD003") {
            msg = "삭제할 데이터가 없습니다.";
        } else if (code == "EGM001") {
            msg = "필수 입력 정보 누락되었습니다.";
        } else if (code == "EGL001") {
            msg = "허용 길이를 초과하였습니다.";
        } else if (code == "EGC001") {
            msg = "등록 코드가 없습니다.";
        } else if (code == "EGF001") {
            msg = "데이터 형식이 잘못되었습니다.";
        } else if (code == "ESS015") {
            msg = "접근 권한이 없습니다.";
        } else if (code == "ESS016") {
            msg = "데이터 암·복호화 처리를 위한 라이브러리를 참조할 수 없습니다.";
        } else if (code == "ESS017") {
            msg = "이미 암호화 된 데이터입니다.";
        } else if (code == "ESD001") {
            msg = "연계 데이터 삽입 실패";
        } else if (code == "ESA002") {
            msg = "연계 실패";
        } else if (code == "all") {
            msg = "발생한 모든 오류";
            code = "-";
        }

        date = dateStart + ' ~ ' + dateEnd;

        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        response.end(ejs.render(result, {
            date: date,
            code: body.code,
            msg: msg,
            num: num
        }));
    });
});

//모니터링 날짜 검색 기능 구현
function getDatesStartToLast(startDate, lastDate) {
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if (!(regex.test(startDate) && regex.test(lastDate))) return "Not Date Format";
    var StartToLast = [];
    var curDate = new Date(startDate);
    while (curDate <= new Date(lastDate)) {
        StartToLast.push(curDate.toISOString().split("T")[0]);
        curDate.setDate(curDate.getDate() + 1);
    }
    return StartToLast;
}

function getToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}