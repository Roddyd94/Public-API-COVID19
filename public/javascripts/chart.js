const TYPE_DICT_REV = {
	'defCnt': '확진자',
	'deathCnt': '사망자',
	'isolIngCnt': '격리중 환자',
	'isolClearCnt': '격리해제',
	'overFlowCnt': '해외유입',
	'localOccCnt': '지역발생',
	'incDec': '전일대비 증감',
}

var chartTypeBar;
var keyArray;
var typeArray;
var dates = [];
var datas = [];

function setHighchart(result) {
    document.getElementById('charts').innerHTML = '';
    var charts = document.getElementsByClassName('highcharts-figure');

    keyArray = Object.getOwnPropertyNames(result[0]); // ["stdDay", "합계", "검역", "서울", "경기"]
    typeArray = Object.getOwnPropertyNames(result[0][keyArray[1]]);   // ["deathCnt", "isolIngCnt"]
    
    var dateLength = result["dates"];
    dates = [];
    datas = [];

    for (let i = 0; i < dateLength; i++) {
        dates[i] = result[i]["stdDay"];
    }

    result[0][keyArray[1]];   // result[0]["합계"]
    for (let i = 0; i < typeArray.length; i++) {
        document.getElementById('charts').innerHTML += `<figure class="highcharts-figure"><div class="chart" id="chart-${i}" role="region" style="overflow: hidden;"></div></figure>`;
        datas[i] = [];
        for (let j = 1; j < keyArray.length; j++) {
            datas[i][j-1] = {};
            datas[i][j-1]['name'] = keyArray[j];
            datas[i][j-1]['data'] = [];
            for (let k = 0; k < dateLength; k++) {
                datas[i][j-1]['data'][k] = Number(result[k][keyArray[j]][typeArray[i]]);
            }
        }
    }

    document.getElementById('charts').innerHTML += '<div id="chart-option"><input type="range" id="chart-type" name="chart-type" min="0" max="1" value="0" step="1"/><label for="chart-type" id="chart-type-label"></label></div>'
    
    chartTypeBar = document.getElementById('chart-type');

    chartTypeBar.max = typeArray.length - 1;
    document.getElementById('chart-type-label').innerHTML = TYPE_DICT_REV[typeArray[0]];

    for (let i = 0; i < typeArray.length; i++) {
        var element = charts.item(i);
        element.classList.add('hidden');
    }
    charts.item(0).classList.remove('hidden');

    chartTypeBar.oninput = () => {
        for (let i = 0; i < typeArray.length; i++) {
            var element = charts.item(i);
            element.classList.add('hidden');
        }
        charts.item(chartTypeBar.value).classList.remove('hidden');
        document.getElementById('chart-type-label').innerHTML = TYPE_DICT_REV[typeArray[chartTypeBar.value]];
    };
}

async function drawHighchart() {
    for (let i = 0; i < typeArray.length; i++) {
        await Highcharts.chart(`chart-${i}`, {
            chart: {
                type: 'line',
                width: 800,
                height: 600,
            },
            title: {
                text: TYPE_DICT_REV[typeArray[i]]
            },
            xAxis: {
                categories: dates
            },
            yAxis: {
                title: {
                    text: '사람 수 (명)'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            series: datas[i]
        });
    }
}