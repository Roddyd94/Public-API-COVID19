var express = require('express');
var request = require('request');
var xml2js = require('xml2js');
var router = express.Router();

if (!Date.prototype.toISODateString) {
  (function() {

    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }
    
    Date.prototype.toISODateString = function() {
      return this.getUTCFullYear() +
      '-' + pad(this.getUTCMonth() + 1) +
      '-' + pad(this.getUTCDate());
    };
    
  }());
}

if (!Date.prototype.toURIString) {
  (function() {

    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }
    
    Date.prototype.toURIString = function() {
      return this.getFullYear() + ''
      + pad(this.getMonth() + 1) + ''
      + pad(this.getDate());
    };
    
  }());
}

const TYPE_DICT = {
	'확진자': 'defCnt',
	'사망자': 'deathCnt',
	'격리중 환자': 'isolIngCnt',
	'격리해제': 'isolClearCnt',
	'해외유입': 'overFlowCnt',
	'지역발생': 'localOccCnt',
	'전일대비 증감': 'incDec',
}

var removeWrapping = (json) => {
  if (json instanceof Object && !(json instanceof Array)) {
    var properties = Object.getOwnPropertyNames(json);
    properties.forEach((v, i) => {
      if (json[v] instanceof Array && json[v].length == 1) {
        json[v] = json[v][0];
        removeWrapping(json[v]);
      }
      else if (json[v] instanceof Array) {
        json[v].forEach((element, index) => {
          removeWrapping(element);
        });
      }
      else removeWrapping(json[v]);
    });
  }
};

var getData = (gubuns, cntTypes, dayStart, dayEnd) => {
  var dayStartString = dayStart.toURIString();
  var dayEndString = dayEnd.toURIString();
  const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
  var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' 
  + 'hQHtzArZhOZxfKBWc3wZDNkuMZ4BLdC7No%2FkCXkERhhvQjZUg7JjJ6cDJIScNxIQUVCJa4TJCrl9fOeXGVgufA%3D%3D'; /* Service Key*/
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(`${19 * (dayEnd.valueOf() - dayStart.valueOf()) / (1000 * 60 * 60 * 24)}`); /* */
  queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent(dayStartString); /* */
  queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(dayEndString); /* */
  var dates = getDateList(dayStart, dayEnd);
  return new Promise((resolve, reject) => {
    request({
      url: url + queryParams,
      method: 'GET'
    }, async (error, response, body) => {
      if (error) reject(error);
      if (response.statusCode != 200) {
        reject(`API Status Code: ${response.statusCode}`);
      }
        console.log(`API Status Code: ${response.statusCode}`);
        xml2js.parseString(body, (err, json) => {
          if (err) reject(`XML Parsing Error: ${err}`);
          removeWrapping(json);
          var result = { dates: dates.length };
          
          dates.forEach((vDate, iDate) => {
            result[iDate] = {'stdDay': vDate};

            gubuns.forEach((vGubun, iGubun) => {
              result[iDate][vGubun] = {};

              cntTypes.forEach((vType, iType) => {
                result[iDate][vGubun][TYPE_DICT[vType]] = null;
              });
            });
          });
          try {
            json['response']['body']['items']['item'].forEach((vItem, iItem) => {
              var tmpStr = vItem['stdDay'];
              var stdDay = tmpStr.substring(0, 4) + '-' + tmpStr.substring(6, 8) + '-' + tmpStr.substring(10, 12);
  
              for (var iDate = 0; iDate < result['dates']; iDate++) {
                if (gubuns.includes(vItem['gubun']) && stdDay == result[iDate]['stdDay']) {
                  var sGubun = vItem['gubun'];
  
                  cntTypes.forEach((tmpType, iTmpType) => {
                    var vType = TYPE_DICT[tmpType];
                    result[iDate][sGubun][vType] = vItem[vType];
                  });
                }
              }
            });
            resolve(result);
          } catch (error) {
            console.log(error);
            result = {dates: 0};
            resolve(result);
          }
        });
      });
  });
};

var getDateList = (dayStart, dayEnd) => {
  var result = [];
  while (dayStart <= dayEnd) {
    result.push(dayStart.toISODateString());
    dayStart.setDate(dayStart.getDate() + 1);
  }
  return result;
};

/* GET home page. */
router.get('/', async (req, res, next) => {
  var gubuns = req.query['gubun'];
  var cntTypes = req.query['cnt-type'];
  var dayStart = new Date(req.query['std-day-start']);
  var dayEnd = new Date(req.query['std-day-end']);
  if (gubuns == null || cntTypes == null || dayStart == null|| dayEnd == null) results = {};
  else var results = await getData(gubuns, cntTypes, dayStart, dayEnd);
  
  res.set('Access-Control-Allow-Origin', '*')
  res.json(results);
});

module.exports = router;
