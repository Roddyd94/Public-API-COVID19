var express = require('express');
var router = express.Router();

const OPTION_TAG_OPEN = ['<option value="', '">'];
const OPTION_TAG_CLOSE = '</option>';

const GUBUN_LIST = [
	'합계', '검역',
	'서울', '경기', '인천', '강원',
	'충남', '대전', '충북', '세종',
	'부산', '울산', '대구', '경북',	'경남',
	'전남', '광주', '전북', '제주',
]

const TYPE_LIST = [
	'확진자',
	'사망자',
	'격리중 환자',
	'격리해제',
	'해외유입',
	'지역발생',
	'전일대비 증감',
]

var gubunString = '';
var typeString = '';

GUBUN_LIST.forEach((v, i) => {
  gubunString += OPTION_TAG_OPEN[0] + v + OPTION_TAG_OPEN[1] + v + OPTION_TAG_CLOSE;
});

TYPE_LIST.forEach((v, i) => {
  typeString += OPTION_TAG_OPEN[0] + v + OPTION_TAG_OPEN[1] + v + OPTION_TAG_CLOSE;
});

/* GET users listing. */
router.get('/', (req, res, next) => {
  console.log(req.query);
  res.render('search', { title: '코로나 검색', gubunList: gubunString, cntTypeList: typeString });
});

module.exports = router;
