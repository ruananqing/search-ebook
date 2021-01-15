var inquirer = require('inquirer');
const urlencode = require('urlencode');
const opn = require('better-opn');

console.log('电子书查找');

var questions = [{
        type: 'list',
        name: 'mode',
        message: '使用哪种方式进行查询？(按↑↓选择，按Enter确定)',
        choices: ['ISBN', '书名']
    },
    {
        type: 'input',
        name: 'ISBN',
        message: '请输入[ISBN码]：',
        when: function (answers) {
            return answers.mode == 'ISBN';
        },
    },
    {
        type: 'input',
        name: 'bookName',
        message: '请输入[书名]：',
        when: function (answers) {
            return answers.mode == '书名';
        },
    },
];

// epubee 关键字加密
function searchKeyEncrypt(str) {
    var lenStr = 0;
    var restr = "";
    lenStr = str.length;
    if (lenStr < 2) {
        restr = str;
    } else {
        var strChange = str.substr(lenStr - 1);
        restr = strChange + lenStr.toString().substr(lenStr.toString().length - 1) + '$' + str.substring(0, lenStr - 1) + '#';
    }
    return Buffer.from(encodeURIComponent(restr)).toString('base64');
}

// 全国图书馆参考咨询联盟 关键字转码
function URLEncodeWithGBK(str) {
    return urlencode(str, 'gbk');
}

// 通过ISBN码查询
function searchBookWithISBN(isbn) {
    // ePUBee
    opn(`http://cn.epubee.com/books/?s=${searchKeyEncrypt(isbn)}&input=1&action=`);
    // 全国图书馆参考咨询联盟
    opn(`http://book.ucdrs.superlib.net/search?Field=all&channel=search&sw=${isbn}`);
    // 数字图书馆
    opn(`https://zh.1lib.us/s/${isbn}`);
    // Library Genesis
    opn(`http://libgen.rs/search.php?req=${isbn}`);
    // 当当网
    opn(`http://search.dangdang.com/?key=${isbn}&act=input`);
}

// 通过书名查询
function searchBookWithBookName(bookName) {
    // ePUBee
    opn(`http://cn.epubee.com/books/?s=${searchKeyEncrypt(bookName)}&input=1&action=`);
    // 全国图书馆参考咨询联盟
    opn(`http://book.ucdrs.superlib.net/search?Field=all&channel=search&sw=${URLEncodeWithGBK(bookName)}`);
    // 数字图书馆
    opn(`https://zh.1lib.us/s/?q=${bookName}`);
    // Library Genesis
    opn(`http://libgen.rs/search.php?req=${bookName}`);
    // 当当网
    opn(`http://search.dangdang.com/?key=${bookName}& act=input`);
    // 精品下载
    opn(`http://www.j9p.com/search.asp?keyword=${URLEncodeWithGBK(bookName)}&searchType=`);
}

function run() {
    inquirer.prompt(questions).then((answers) => {
        console.log('正在打开浏览器页面……');
        if (answers.mode == "ISBN") {
            searchBookWithISBN(answers.ISBN);
        } else {
            searchBookWithBookName(answers.bookName);
        }

        run();
    });

}

run();