﻿﻿var tsjson;
var ftype;
var clusterChart;
var option;
var types;
var selday;
var pointId;
var cur;
var ObserverCopy;
var first;
//detail用甘特图比单纯罗列时间更好，所以detail放那里就好
function Cluster(Observer) {
	var cluster = {};
	cluster.onMessage = function(message, day, from){
		if(message == "selectDay"){
			if(from == Map){
				selday=day;
				getData(selday);
				showType();
				clusterChart.setOption({dataset:{source: tsjson},visualMap:[{categories:types}],series: [
					{	
						symbolSize:2,
						large:true,
						largeThreshold:10000,
						type: 'scatter',
						encode: {
							x: 'x',
							y: 'y',
							tooltip: [0, 1, 2, 3]
						}
					}
				]});
			}
		}
		if(message == "selectedSingleId"){
			pointId=parseInt(day);
			cur = tsjson.filter(p=> p[3]==pointId);
			if(cur.length!=0)
			clusterChart.setOption({
				series: [
				{	
					symbolSize:2,
					large:true,
					largeThreshold:10000,
					type: 'scatter',
					encode: {
						x: 'x',
						y: 'y',
						tooltip: [0, 1, 2, 3]
					}
				},
				{
				type: 'effectScatter',
				symbolSize: 20,
				data: [
					[cur[0][0], cur[0][1],cur[0][2],day],
				],
				zlevel:0,
				dimensions: [
					null,               
					null,   
					'Type',
					'ID',       
				],
				encode:{
					tooltip:[2,3]
				}
			}
				]
			});
		}
	}
	ObserverCopy=Observer;
	//default
	selday="day1";
	ftype="ts";
	first=0;
	if(document.getElementById("fse")){
		var f_box = document.getElementById("fse");  
		f_box.parentNode.removeChild(f_box);  
	}
	var parent = document.getElementById("cluster-overview");
	var div = document.createElement("div");
	div.setAttribute("id","fse");

	var mySelect = document.createElement("select");  
	mySelect.setAttribute("id", "fsel");
	mySelect.setAttribute("onchange", "switchCl()");
	div.appendChild(mySelect);  
	parent.appendChild(div);
	
	var id = [1, 2];
	var value = ["Trace Feature", "Time Feature"];
	for(var x = 0; x < id.length; x++){
		var opt = document.createElement("option");
		opt.setAttribute("value", id[x]);
		opt.appendChild(document.createTextNode(value[x]));
		mySelect.appendChild(opt);
	}
	mySelect.options[0].selected=true; 
	showType();

	ShowCluster("day1",Observer);
    Observer.addView(cluster);
    return cluster;
}
function showType(){
	var parent = document.getElementById("cluster-overview");
	if(first!=0){
		parent.removeChild(document.getElementById("tse"));
	}else{ 
		first=1;
	}
	var div = document.createElement("div");
	div.setAttribute("id","tse");
	
	var mySelect2 = document.createElement("select");  
	mySelect2.setAttribute("id", "tsel");
	mySelect2.setAttribute("onchange", "switchTp()");
	div.appendChild(mySelect2);  
	parent.appendChild(div);
	var id;
	var value;
	if(ftype=="km" || selday=="day1"){
	var id = [1,2,3,4,5,6,7,8];
	var value = ["type1","type2","type3","type4","type5","type6","type7","type8"];
	}
	else {
		var id = [1,2,3,4,5,6,7];
		var value = ["type1","type2","type3","type4","type5","type6","type7"];
	}for(var x = 0; x < id.length; x++){
		var opt = document.createElement("option");
		opt.setAttribute("value", id[x]);
		opt.appendChild(document.createTextNode(value[x]));
		mySelect2.appendChild(opt);
	}
	mySelect2.options[0].selected=true; 
}
function switchTp() {
	var index = document.getElementById("tsel").selectedIndex;//获取当前选择项的索引.
	var type = document.getElementById("tsel").options[index].text;
	type=parseInt(type.substr(-1));
	ObserverCopy.fireEvent("selectCluster",type, Cluster);
	ObserverCopy.fireEvent("selectClusterid",tsjson.filter(t=>t[2]==type).map(t=>t[3]),Cluster);
}

function switchCl() {
	var index = document.getElementById("fsel").selectedIndex;//获取当前选择项的索引.
	var type = document.getElementById("fsel").options[index].text;
	if(type=="Trace Feature")
		ftype="ts";
	else
		ftype="km";
	getData(selday);
	if(ftype=="ts")
		ObserverCopy.fireEvent("switchCluster","trace", Cluster);
	else
		ObserverCopy.fireEvent("switchCluster","time", Cluster);
	clusterChart.setOption({dataset:{source: tsjson},visualMap:[{categories:types}],series: [
		{	
			symbolSize:2,
			large:true,
			largeThreshold:10000,
			type: 'scatter',
			encode: {
				x: 'x',
				y: 'y',
				tooltip: [0, 1, 2, 3]
			}
		}
	]});
	showType();

}

function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

function getData(day) {
	var url = "data/"+ day + ftype +".json";
	$.ajaxSettings.async = false;
	$.getJSON(url, function(jsondata){
	tsjson = jsondata;
	types = unique(tsjson.map(i=>i[2])).sort(function (m, n) {
		if (m < n) return -1
		else if (m > n) return 1
		else return 0
	   });
	});   
	$.ajaxSettings.async = true;
}

function ShowCluster(day,Observer) {
	var $bmDiv = $("#cluster");
	var width = $bmDiv.width();
	var height = $bmDiv.height();	
	getData(day);
	clusterChart = echarts.init(document.getElementById("clusterChart"));
	option = {
		toolbox: {
			dataZoom:{

			},
			brush: {
				outOfBrush: {
					color: '#abc'
				},
				brushStyle: {
					borderWidth: 2,
					color: 'rgba(0,0,0,0.2)',
					borderColor: 'rgba(0,0,0,0.5)',
				},
				seriesIndex: [0, 1],
				throttleType: 'debounce',
				throttleDelay: 300,
				geoIndex: 0
			},
		feature: {
			dataZoom: {}
		}
	},
	brush: {
	outOfBrush: {
		color: '#abc'
	},
	brushStyle: {
		borderWidth: 2,
		color: 'rgba(0,0,0,0.2)',
		borderColor: 'rgba(0,0,0,0.5)',
	},
	seriesIndex: [0, 1],
	throttleType: 'debounce',
	throttleDelay: 300,
	geoIndex: 'all'
	},
		tooltip:{},
		xAxis: {
		name: 'x',
		type: 'value'
		},
		yAxis: {
			name: 'y',
			type: 'value'
		},
		visualMap: [
			{
				inRange:{
				color:    ["#ed8a79",
				"#68c3dd",
				"#6284d1",
				"#324a94",
				"#587e71",
				"#1f5620",
				"#4f9b50",
				"#49bc4b",
				"#7ee780",
				"#aafaab",
				"#ccfccc",
				"#666666",
				"#fefaf9",
				"#eeeedd",
				"#f6c9d5",
				"#f6c9a4",
				"#e0b7d0",
				"#c8b7d0",]
				},
				dimension: 2 ,
				categories: types,
				right: '0%',
				itemHeight:5,
				itemWidth:12,
				itemGap:1
			}
		],
		dataset: {
			dimensions: [
				'x',
				'y',
				'type',
				'ID'
			],
			source: tsjson  },
		series: [
			{	
				symbolSize:2,
				large:true,
				largeThreshold:10000,
				type: 'scatter',
				encode: {
					x: 'x',
					y: 'y',
					tooltip: [0, 1, 2, 3]
				}
			}
		]
	};
	clusterChart.setOption(option);
	clusterChart.on('brushselected', (params) => {
		var id = [];
		var mainSeries = params.batch[0].selected[0];
		for (var i = 0; i < mainSeries.dataIndex.length; i++) {
				var dataIndex = mainSeries.dataIndex[i];
				id.push(tsjson[dataIndex][3]);
		}
		Observer.fireEvent("selectid",id, Cluster);
	});
}

function DirectMap(id_list){
	ObserverCopy.fireEvent('directID',id_list,Cluster)
}