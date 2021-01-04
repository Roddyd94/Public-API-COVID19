const url = '/api';
var queryParams = '?';

var searchButton;
var gubunNodes;
var typeNodes;
var dayStart;
var dayEnd;

var result;

searchButton = document.getElementById('search');
gubunNodes = document.getElementById('gubun').childNodes;
typeNodes = document.getElementById('cnt-type').childNodes;
dayStart = document.getElementById('std-day-start');
dayEnd = document.getElementById('std-day-end');

gubunNodes[0].selected = true;
typeNodes[0].selected = true;
dayEnd.valueAsDate = new Date();
var tempDate = new Date();
dayStart.valueAsDate = new Date(tempDate.setDate(tempDate.getDate()-7));

searchButton.onclick = async () => {
	queryParams = '?';

	gubunNodes.forEach((v, i) => {
		if (v.selected) queryParams += `gubun[]=${v.value}&`;
	});

	typeNodes.forEach((v, i) => {
		if (v.selected) queryParams += `cnt-type[]=${v.value}&`;
	});

	queryParams += `std-day-start=${dayStart.value}&std-day-end=${dayEnd.value}`;

	var jsonRequest = new Request(url + queryParams);

	await fetch(jsonRequest).then(async (res) => {
		result = await res.json();

		if (result.dates == 0) {
			alert('잘못된 범위입니다.');
			return;
		}

		drawOnMap(await result);
		setHighchart(await result);
		await drawHighchart();
	});
};

