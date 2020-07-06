var day_data, sensors;
var allSquare;
var ObserverCopy;
var timedata;
var alldata;
var timelineData;
var clusterClass = "trace";
var colorList = ["#ed8a79","#68c3dd","#6284d1","#324a94","#587e71","#1f5620","#4f9b50","#49bc4b","#7ee780",
	"#aafaab","#ccfccc","#666666","#fefaf9","#eeeedd","#f6c9d5","#f6c9a4","#e0b7d0","#c8b7d0"];
var colorDic = {
	'MAIN': '#ed8a79',
		// # // BLUE
		'PSA': '#68c3dd',
		'PSB': '#6284d1',
		'PSC': '#324a94',
		'PSD': '#587e71',
		// # // Green
		'ROOM1': '#1f5620',
		'ROOM2': '#4f9b50',
		'ROOM3': '#49bc4b',
		'ROOM4': '#7ee780',
		'ROOM5': '#aafaab',
		'ROOM6': '#ccfccc',
		// # // GRAY
		'WC1': '#666666',
		'WC2': '#666666',
		'WC3': '#666666',
		// # // LIGHT
		'POSTER': '#DB7093',
        'SERVE': '#DDA0DD',
		'CANTEEN': '#f6c9d5',
		'CI': '#f6c9a4',
		'ENTERTAIN': '#e0b7d0',
		'EXHIBITION': '#c8b7d0',
		// # // ONYX
		'TOPLD1': '#353a38',
		'TOPLD2': '#353a38',
		'BOTLD1': '#353a38',
		'BOTLD2': '#353a38',
		// # // OTHERS
		'CIENTRY1': '#221423',
		'CIENTRY2': '#221423',
		'CIENTRY3': '#221423',
		'CIENTRY4': '#221423',
		'MAINEXIT': '#221423',
		'EXHEXIT1': '#221423',
		'EXHEXIT2': '#221423',
		'CIEXIT1': '#221423',
		// # // AISLE
		'AISLE1': '#d3eedd',
		'AISLE2': '#d3eedd',
	'None': '#000',
};

function ls(count) {
    var a = [], b = 1;
    for (; b <= count; b++)
        a.push(b);
    return a;
}

function lsMinute(low, up) {
    var a = [], b = low;
    for (; b <= up; b++)
        a.push(b);
    return a;
}

function getJsonObjLength(jsonObj) {
    var Length = 0;
    for (var item in jsonObj) {
        Length++;
    }
    return Length;
}

function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
        default: 
            return 0; 
        break; 
    } 
}

//删除数组中的重复元素
Array.prototype.delDup = function(){  
	//将数组进行排序  
	this.sort();  
	//定义结果数组  
	var arr = [];  
	for(var i = 1; i < this.length; i++){    //从数组第二项开始循环遍历数组  
		//判断相邻两个元素是否相等，如果相等说明数据重复，否则将元素写入结果数组  
		if(this[i] !== arr[arr.length - 1]){  
			arr.push(this[i]);  
		}              
	}  
	return arr;  
}  

//去除连续的元素中重复的
Array.prototype.delConDup = function(){  
	//定义结果数组  
	var arr = []; 
	arr.push(this[0]);
	for(var i = 1; i < this.length; i++){    //从数组第二项开始循环遍历数组  
		//判断相邻两个元素是否相等，如果相等说明数据重复，否则将元素写入结果数组  
		if(this[i] !== arr[arr.length - 1]){  
			arr.push(this[i]);  
		}              
	}  
	return arr;  
}  

//将数组中的元素归一化处理
Array.prototype.Normalize = function(){  
	var max = Math.max.apply(null, this);
	var min = Math.min.apply(null, this);
	var up = 15;
	var low = 5;

	//定义结果数组  
	var arr = [];  
	for(var i = 0; i < this.length; i++){
		if(this[i] < 1){
			arr.push(0);
		}  
		else{
			arr.push(((this[i] * (up - low) + low * max - up * min)/(max - min)).toFixed(2));
		}
	}  
	return arr;  
}  


function getangle(point1, point2){
	if(point2[0] == point1[0]){
		if(point2[1] < point1[1]){
			angle = 180;
		}
		else{
			angle = 0;
		}
	}
	else if(point2[1] == point1[1]){
		if(point2[0] < point1[0]){
			angle = 270;
		}
		else{
			angle = 90;
		}
	}
	else{
		var tana;
		if(point2[0] > point1[0] && point2[1] > point1[1]){
			tana = (point2[1] - point1[1])/(point2[0] - point1[0]);
			angle = Math.atan(tana)*180/Math.PI;
		}
		else if(point2[0] < point1[0] && point2[1] < point1[1]){
			tana = (point1[0] - point2[0])/(point1[1] - point2[1]);
			angle = 180 + Math.atan(tana)*180/Math.PI;
		}
		else if(point2[0] < point1[0] && point2[1] > point1[1]){
			tana = (point1[0] - point2[0])/(point2[1] - point1[1]);
			angle = 360 - Math.atan(tana)*180/Math.PI;
		}
		else{
			tana = (point1[1] - point2[1])/(point2[0] - point1[0]);
			angle = 90 + Math.atan(tana)*180/Math.PI;
		}
	}

	return (360 - angle);
}

function getTimeData(time){
	var floor = new Array();
	for(var i = 0; i < allSquare.length; i++){
		var sid = allSquare[i];
		var num = day_data[sid][time];
		if(sensors[sid]['floor'] == 1){
			floor.push([15 - sensors[sid]['x'], sensors[sid]['y'], num]);
		}
		else if(sensors[sid]['floor'] == 2){
			floor.push([15 - sensors[sid]['x'], sensors[sid]['y'] + 32, num]);
		}
	}
	floor = floor.map(function (item) {
		return [item[1] + 0.5, item[0] + 0.5, item[2] || '-'];
	});

	return floor;
}

//判断一个数组是否在数组中
function ArrayIsin(base, arr){
	for(var i = 0; i < base.length; i++){
		if(arr.toString() == base[i].toString()){
			return i;
		}
	}
	return -1;
}

var hotChart;
var MapOption;
function Map(Observer) {
	ObserverCopy = Observer;
	var map = {};

	var hotmapCheck = document.getElementById("hotmap");
	hotmapCheck.checked = true;
	var clusterCheck = document.getElementById("cluster");
	clusterCheck.checked = false;
	var singleCheck = document.getElementById("single");
	singleCheck.checked = false;

	$.ajaxSettings.async = false;
	$.getJSON("data/sensors.json", function(data){
		sensors = data;
	});   
	$.ajaxSettings.async = true;
	timedata = lsMinute(420, 1080);

	//----------------------------------天数的选择框-----------------------------------
	if(document.getElementById("day_b")){
		var day_box = document.getElementById("day_b");  
		day_box.parentNode.removeChild(day_box);  
	}
	var parent = document.getElementById("cluster-overview");

	var div = document.createElement("div");
	div.setAttribute("class","day_box");
	div.setAttribute("id","day_b");

	var mySelect = document.createElement("select");  
	mySelect.setAttribute("id", "daysel");
	mySelect.setAttribute("onchange", "change()");
	div.appendChild(mySelect);  
	parent.appendChild(div);
	
	var id = [1, 2, 3];
	var value = ["day1", "day2", "day3"];
	for(var x = 0; x < id.length; x++){
		var opt = document.createElement("option");
		opt.setAttribute("value", id[x]);
		opt.appendChild(document.createTextNode(value[x]));
		mySelect.appendChild(opt);
	}
	mySelect.options[0].selected=true; 

	//---------------------------------------------------------------------------
	var dataroot = "data/day1sensors.json";
	alldata = getHotmapData("all", dataroot);
	//----------------------------------------------------------------------------
	var $bmDiv = $("#map");
	var width = $bmDiv.width();
	var height = $bmDiv.height();

    timelineData = new Array();
    for(var i = 0; i < timedata.length; i++){
        var key = timedata[i];
        var hour = parseInt(key / 60);
        var minute = key % 60;
        var time = hour.toString() + ":";
        if(minute < 10){
            time += "0";
        }
        time += minute.toString();
        timelineData.push(time);
	}
	
	var len = parseInt((height * 0.85) / 16);
	if (hotChart != null && hotChart != "" && hotChart != undefined) {
		hotChart.dispose();
	}
	hotChart = echarts.init(document.getElementById('mapChart'));

	var ylabels = ls(16);
	var xlabels = ls(30).concat(['', '']).concat(ls(13));

	MapOption = {
		baseOption: {
            timeline: {
				right: 10,
				left: 5,
				bottom: 0,
				height: 25,
				playInterval: 1000,
				symbol: 'none',
				orient: 'horizontal',
				axisType: 'category',
				autoPlay: true,
				currentIndex: 0,
				label: {
					normal: {
						show: false
					}
				},
				data: timelineData,
				symbol: "none",
				label: {
					position: "bottom",	
					verticalAlign: "bottom",
					padding: 0,
					fontFamily: "Brush Script MT",
					normal: {
						textStyle: {
							color: '#000'
						}
					}
				},
				lineStyle: {
					color: '#000'
				},
				controlStyle: {
					showNextBtn: false,
					showPrevBtn: false,
					itemSize: 20,
					normal: {
						color: '#000',
						borderColor: '#000'
					},
					emphasis: {
						color: '#aaa',
						borderColor: '#aaa'
					}
				},
			},
            tooltip: {
				show: false,
			},
			animation: false,
			grid: {
				height: len * 16,
				width: len * 45,
				y: '6%',
				x: '2%',
				containLabel: false
			},
			xAxis: {
				type: 'value',
				min: 0,
				max: 45,
				splitNumber: 45,
				splitArea: {
					show: true,
					areaStyle: {
						color: ['rgba(250,250,250,0.3)','rgba(220,220,220,0.3)'],
					}
				},
				axisLabel: {
					show: true,
					align: "left",
					formatter: function(value){
						var texts = [];
						if(value == 30 || value == 31 || value == 45){
							texts.push("");
						}
						else if(value >= 32 && value <= 44){
							texts.push(value - 31);
						}
						else{
							texts.push(value + 1);
						}
						return texts;
					},
					margin: 0,
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show: true,
				}
			},
			yAxis: [{
				type: 'value',
				//name: "一楼",
				min: 0,
				max: 16,
				interval: 1,
				splitArea: {
					show: true,
					areaStyle: {
						color: ['rgba(250,250,250,0.3)','rgba(220,220,220,0.3)'],
					}
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show: true
				},
				// axisLabel: {
				// 	verticalAlign: 'bottom',
				// 	formatter: function(value){
				// 		var texts = [];
				// 		texts.push(value + 1);
				// 		return texts;
				// 	},
				// },
				position : 'left',
			},
			{
				type: 'value',
				//name: "二楼",
				min: 0,
				max: 16,
				interval: 1,
				position : 'left',
				offset : -(32*len),
				splitLine: {
					show: false,
				},
				// axisLabel: {
				// 	verticalAlign: 'bottom',
				// 	formatter: function(value){
				// 		var texts = [];
				// 		texts.push(value + 1);
				// 		return texts;
				// 	},
				// },
			}],
			graphic: [],
			visualMap: {
				min: 0,
				max: 100,
				show: false,
				calculable: true,
				orient: 'vertical',
				right: 10,
				bottom: 'middle'
			},
            series: [{
				type: 'heatmap',
				name: "hotmap",
				label: {
					normal: {
						show: false
					}
				},
			}]
        },
		options: []
	};

	var areas = [[32, 0, 13, 16, ""], [0, 0, 30, 16, ''], [1, 2, 5, 2, "分会场A(PSA)"], [1, 4, 5, 2, "分会场B(PSB)"], [1, 6, 5, 2, "分会场C(PSC)"], [1, 8, 5, 2, "分会场D(PSD)"], 
	[2, 12, 4, 2, "签到处(CI)"], [10, 1, 2, 1, "扶梯"], [10, 14, 2, 1, "扶梯"], [10, 4, 2, 2, "厕所1"], 
	[10, 6, 2, 4, "room1"], [10, 10, 2, 2, "room2"], [15, 2, 4, 10, "       展厅\n(EXHIBITION)"], [19, 2, 10, 10, "主会场(MAIN)"], 
	[19, 14, 2, 2, "服务台"], [21, 14, 4, 2, "room3"], [25, 14, 2, 2, "room4"], [27, 14, 2, 2, "厕所2"],
	 [33, 2, 5, 8, "餐厅(CANTEEN)"], [33, 10, 5, 2, "room5"], [32, 13, 6, 3, "休闲区(ENTERTAIN)"], 
	[42, 4, 2, 2, "厕所3"], [42, 6, 2, 2, "room6"], [42, 1, 2, 1, "扶梯"], [42, 14, 2, 1, "扶梯"]];
	var post = [7, 3, 2, 7, "海报区(POSTER)"];

	var stringAreas = ["None", "None", "PSA", "PSB", "PSC", "PSD", "CI", "TOPLD1", "BOTLD1", "WC1", "ROOM1", "ROOM2",
					"EXHIBITION", "MAIN", "SERVE", "ROOM3", "ROOM4", "WC2", "CANTEEN", "ROOM5", "ENTERTAIN", 
					"WC3", "ROOM6", "TOPLD2", "BOTLD2", "POSTER"]
	
	var zvalue = 100;
	for(var i = 0; i < areas.length; i++){
		if(i < 2){
			zvalue = 99;
		}
		else{
			zvalue = 100;
		}
        MapOption.baseOption.graphic.push({
			type: 'group',
			left: width * 0.02 + areas[i][0] * len,
			top: height * 0.06 + len * areas[i][1],
			children: [
				{
					type: 'rect',
					z: zvalue,
					left: 'center',
					top: 'middle',
					info: stringAreas[i],
					shape: {
						width: areas[i][2] * len,
						height: areas[i][3] * len
					},
					style: {
						fill: 'rgba(0, 0, 0, 0)',
						stroke: '#555',
						lineWidth: 1,
					},
					onclick: function (params) {
						//console.log(params.target.info);
						Observer.fireEvent("selectArea", params.target.info, Map);
					}
				},
				{
					type: 'text',
					z: zvalue,
					left: 'center',
					top: 'middle',
					info: stringAreas[i],
					style: {
						fill: colorDic[stringAreas[i]],
						text: areas[i][4],
						font: '9px Microsoft YaHei'
					},
					onclick: function (params) {
						Observer.fireEvent("selectArea", params.target.info, Map);
					}
				}
			]
		});
	}

	MapOption.baseOption.graphic.push({
		type: 'group',
		left: width * 0.02 + post[0] * len,
		top: height * 0.06 + len * post[1],
		children: [
			{
				type: 'rect',
				z: 100,
				left: 'center',
				top: 'middle',
				info: stringAreas[25],
				shape: {
					width: post[2] * len,
					height: post[3] * len
				},
				style: {
					fill: 'rgba(0, 0, 0, 0)',
					stroke: '#555',
					lineWidth: 1,
				},
				onclick: function (params) {
					Observer.fireEvent("selectArea", params.target.info, Map);
				}
			},
			{
				type: 'text',
				rotation: Math.PI / 2,
				z: 100,
				left: 'center',
				top: 'middle',
				info: stringAreas[25],
				style: {
					fill: colorDic[stringAreas[25]],
					text: post[4],
					font: '9px Microsoft YaHei'
				},
				onclick: function (params) {
					Observer.fireEvent("selectArea", params.target.info, Map);
				}
			}
		]
	});
	
	for(var i = 0; i < timelineData.length; i++){
        MapOption.options.push({
            title: {
                text: timelineData[i],
				left: 'middle',
				top: 20,
                textStyle:{
                    color: "#000",
                    fontFamily: "Brush Script MT",
                    fontSize: 15,
                }
            },
            series: {
                data: alldata[i],
            }
        });
	}

	//在地图中标出出入口
	var entrance = [[0, 13], [2, 15], [4, 15], [7, 15]];
	var exit = [[5, 15], [15, 15], [17, 15], [19, 0]];
	for(var i = 0; i < entrance.length; i++){
		MapOption.baseOption.graphic.push({
			type: 'rect',
			//z: 100,
			left: width * 0.02 + entrance[i][0] * len,
			top: height * 0.06 + len * entrance[i][1],
			shape: {
				width: 1 * len,
				height: 1 * len
			},
			style: {
				fill: 'rgba(135,206,250, 0.3)',
				stroke: '#555',
				lineWidth: 0,
			}
		});
	}
	for(var i = 0; i < exit.length; i++){
		MapOption.baseOption.graphic.push({
			type: 'rect',
			//z: 100,
			left: width * 0.02 + exit[i][0] * len,
			top: height * 0.06 + len * exit[i][1],
			shape: {
				width: 1 * len,
				height: 1 * len
			},
			style: {
				fill: 'rgba(60,179,113, 0.3)',
				stroke: '#555',
				lineWidth: 0,
			}
		});
	}
	//---------------------------------------------------

	//在地图中标出没有传感器的位置
	var NoneSensors = [[0, 0, 10, 2], [10, 0, 9, 1], [20, 0, 10, 2], [25, 2, 5, 1],
	[28, 3, 2, 9], [0, 2, 1, 11], [1, 10, 5, 2], [0, 14, 1, 2], [1, 15, 1, 1],
	[3, 15, 1, 1], [6, 15, 1, 1], [8, 15, 7, 1], [16, 15, 1, 1], [18, 15, 1, 1],
	[12, 2, 3, 10], [29, 12, 1, 4], [32, 0, 10, 2], [32, 2, 2, 8], [32, 10, 1, 2],
	[32, 12, 6, 1], [38, 15, 7, 1], [42, 0, 3, 1], [44, 1, 1, 7], [42, 8, 3, 4],
	[44, 12, 1, 3]];
	for(var i = 0; i < NoneSensors.length; i++){
		MapOption.baseOption.graphic.push({
			type: 'rect',
			z: 100,
			left: width * 0.02 + NoneSensors[i][0] * len,
			top: height * 0.06 + len * NoneSensors[i][1],
			shape: {
				width: NoneSensors[i][2] * len,
				height: NoneSensors[i][3] * len
			},
			style: {
				fill: 'rgba(169,169,169, 0.6)',
				stroke: '#555',
				lineWidth: 0,
			}
		});	
	}

	hotChart.setOption(MapOption);
	window.onresize = function () {
		hotChart.resize();
	};
	//----------------------------------------------------------------------

	//------------------------------------------------------------------------
	map.onMessage = function(message, data, from){
		if(message == "selectid" || message == "directID"){
			if(from == Cluster){
				var index = document.getElementById("daysel").selectedIndex;//获取当前选择项的索引.
				var day = document.getElementById("daysel").options[index].text;	
				if(data.length == 0){
					// if(document.getElementById("hotmap").checked){
					// 	alldata = getHotmapData("all", "data/" + day + "sensors.json");
					// 	//MapOption.baseOption.timeline.currentIndex = 0;
					// 	MapOption.options = updateOption(alldata);
					// 	//只显示热力图
					// 	MapOption.baseOption.series = [{
					// 		type: 'heatmap',
					// 		name: "hotmap",
					// 		label: {
					// 			normal: {
					// 				show: false
					// 			}
					// 		},
					// 	}];
					// 	hotChart.setOption(MapOption, true);
					// }
					console.log("no data");
				}
				else{
					if(document.getElementById("hotmap").checked){
						alldata = getHotmapData("group", data);
						MapOption.baseOption.timeline.currentIndex = 0;
						MapOption.options = updateOption(alldata);
						hotChart.setOption(MapOption, true);
					}
					if(document.getElementById("cluster").checked){
						var peopleIds = data;
						var tmp = getClusterTrajectory(peopleIds);
						var results = tmp[0];
						var allpoints = tmp[1];
						var weights = tmp[2];
						//停留点数据
						var scatterData = new Array();
						for(var i = 0; i < allpoints.length; i++){
							var Tarea = pointToArea(allpoints[i]);
							if(Tarea != 'No'){
								scatterData.push({
									value: allpoints[i],
									symbolSize: weights[i],
									visualMap: false, //设置后颜色才能起作用
									itemStyle: {
										color: colorDic[Tarea],
									}
								});
							}
						}

						var newSeries = new Array();
						for(var i = 0;  i < MapOption.baseOption.series.length; i++){
							if(MapOption.baseOption.series[i].name != "cluster"){
								newSeries.push(MapOption.baseOption.series[i]);
							}
						}
						MapOption.baseOption.series = newSeries;

						MapOption.baseOption.series.push({
							type: 'scatter',
							name: "cluster",
							data: scatterData,
						});

						for(var i = 0; i < results.length; i++){
							var Oline = new Array();
							for(var j = 0; j < results[i].length; j++){
								Oline.push([results[i][j].x, results[i][j].y]);
							}
							MapOption.baseOption.series.push({
								type: 'line',
								name: "cluster",
								symbol: "none",
								itemStyle: {
									normal: {
										lineStyle: {
											color: colorDic[pointToArea(Oline[0])],
											opacity: 1,
											width: 1
										},
									}
								},
								data: Oline,
							});
						}

						hotChart.setOption(MapOption, true);
					}
				}
			}
		}
		if(message == "selectedSingleId"){
			if(from == Gantt){	
				if(document.getElementById("single").checked){
					var index = document.getElementById("daysel").selectedIndex;//获取当前选择项的索引.
					var day = document.getElementById("daysel").options[index].text;
					var singleId = Number(data);

					//判断singleid是否合法
					var dayids;
					$.ajaxSettings.async = false;
					$.getJSON("data/" + day + "ids.json", function(data){  
						dayids = data;   
					}); 
					$.ajaxSettings.async = true;
					if(dayids.indexOf(singleId.toString()) < 0){
						alert("人员id错误");
					}
					else{
						var singleIdData;
						$.ajaxSettings.async = false;
						$.getJSON("data/" + day + "Dic.json", function(data){  
							singleIdData = data[singleId];   
						}); 
						$.ajaxSettings.async = true;

						var allPos = new Array();
						for(var i = 0; i < singleIdData.length; i++){
							allPos.push(singleIdData[i][1]);
						}
						allPos = allPos.delConDup();

						//计算折线图的坐标
						var polyLineData = new Array();
						for(var i = 0; i < allPos.length; i++){
							var sid = allPos[i];
							if(sensors[sid]['floor'] == 1){
								polyLineData.push([15 - sensors[sid]['x'] + 0.5, sensors[sid]['y'] + 0.5]);
								if((i + 1) < allPos.length && (sensors[allPos[i + 1]]['floor'] == 2)){
									polyLineData.push(['-', '-']);
								}
							}
							else if(sensors[sid]['floor'] == 2){
								polyLineData.push([15 - sensors[sid]['x'] + 0.5, sensors[sid]['y'] + 32 + 0.5]);
								if((i + 1) < allPos.length && (sensors[allPos[i + 1]]['floor'] == 1)){
									polyLineData.push(['-', '-']);
								}	
							}
						}
						polyLineData = polyLineData.map(function (item) {
							return [item[1], item[0]];
						});

						//计算出每个箭头要旋转的距离
						var angles = new Array();
						var initangle = getangle(polyLineData[0], polyLineData[1]);
						angles.push(initangle);
						angles.push(initangle);

						for(var i = 1; i < polyLineData.length; i++){
							var angle;
							var point1 = polyLineData[i];
							if(point1[0] == '-'){
								if(i + 1 < polyLineData.length && i + 2 < polyLineData.length){
									angle = getangle(polyLineData[i + 1], polyLineData[i + 2]);
									angles.push(angle);
								}
							}
							else{
								if(i + 1 < polyLineData.length){
									var point2 = polyLineData[i + 1];
									if(point2[0] == '-'){
										angle = 0;
									}
									else{
										angle = getangle(polyLineData[i], polyLineData[i + 1]);
									}
									angles.push(angle);
								}
							}
						}

						var finalData = new Array();
						for(var i = 0; i < polyLineData.length; i++){
							if(polyLineData[i][0] != '-'){
								if(i == 0 || i == polyLineData.length - 1 || i % 5 == 0){
									var Sitem = {
										symbol: "arrow",
										coord: polyLineData[i],
										symbolRotate: angles[i],	
									};
									finalData.push(Sitem);
								}
								else{
									var Sitem = {
										coord: polyLineData[i],
										symbol: "none"
									};
									finalData.push(Sitem);
								}
							}
						}

						var newSeries = new Array();
						for(var i = 0; i < MapOption.baseOption.series.length; i++){
							if(MapOption.baseOption.series[i].name != "single"){
								newSeries.push(MapOption.baseOption.series[i]);
							}
						}
						MapOption.baseOption.series = newSeries;

						MapOption.baseOption.series.push({
							type: 'line',
							name: "single",
							data: polyLineData,
							symbol: "none",
							itemStyle: {
								normal: {
									lineStyle: {
										color: "#1E90FF",
									},
								}
							},
							animation: false,
							markPoint: {
								symbolSize: 8,
								itemStyle: {
									color: "red"
								},
								data: finalData
							}
						});
						hotChart.setOption(MapOption, true);
					}
				}
			}
		}
		if(message == "selectCluster"){
			if(from == Cluster){
				if(document.getElementById("cluster").checked){
					var clusterType = data;
					// var typedatas;
					var alld;
					var index = document.getElementById("daysel").selectedIndex;//获取当前选择项的索引.
					var day = document.getElementById("daysel").options[index].text;

					var results, allpoints, weights;
					if(clusterClass == "trace"){
						$.ajaxSettings.async = false;
						// $.getJSON("data/" + day + "tsids.json", function(data){  
						// 	typedatas = data;
						// }); 
						$.getJSON("TracData/" + day + "/" + clusterType + ".json", function(data){  
							alld = data;
						}); 
						$.ajaxSettings.async = true;
						
						// var peopleIds = typedatas[clusterType.toString()];
						// var tmp = getClusterTrajectory(peopleIds);
						// results = tmp[0];
						// allpoints = tmp[1];
						// weights = tmp[2];
						// console.log(clusterType);
						// var alld = {};
						// alld["results"] = results;
						// alld["weights"] = weights;
						// alld["allpoints"] = allpoints;
						// console.log(alld);

						results = alld.results;
						allpoints = alld.allpoints;
						weights = alld.weights;
					}
					else if(clusterClass == "time"){
						$.ajaxSettings.async = false;
						$.getJSON("TimeData/" + day + "/" + clusterType + ".json", function(data){  
							alld = data;
						}); 
						$.ajaxSettings.async = true;

						results = alld.results;
						allpoints = alld.allpoints;
						weights = alld.weights;
					}

					//停留点数据
					var scatterData = new Array();
					for(var i = 0; i < allpoints.length; i++){
						var Tarea = pointToArea(allpoints[i]);
						if(Tarea != 'No'){
							scatterData.push({
								value: allpoints[i],
								symbolSize: weights[i],
								visualMap: false, //设置后颜色才能起作用
								itemStyle: {
									color: colorDic[Tarea],
								}
							});
						}
					}

					var newSeries = new Array();
					for(var i = 0;  i < MapOption.baseOption.series.length; i++){
						if(MapOption.baseOption.series[i].name != "cluster"){
							newSeries.push(MapOption.baseOption.series[i]);
						}
					}
					MapOption.baseOption.series = newSeries;

					MapOption.baseOption.series.push({
						type: 'scatter',
						name: "cluster",
						data: scatterData,
					});

					for(var i = 0; i < results.length; i++){
						var Oline = new Array();
						for(var j = 0; j < results[i].length; j++){
							Oline.push([results[i][j].x, results[i][j].y]);
						}
						MapOption.baseOption.series.push({
							type: 'line',
							name: "cluster",
							symbol: "none",
							itemStyle: {
								normal: {
									lineStyle: {
										color: colorDic[pointToArea(Oline[0])],
										opacity: 0.4,
										width: 0.5
									},
								}
							},
							data: Oline,
						});
					}
					hotChart.setOption(MapOption, true);
				}
			}
		}
		if(message == "switchCluster"){
			if(from == Cluster){
				clusterClass = data;
			}
		}
	}

    Observer.addView(map);
    return map;
}

function getClusterTrajectory(peopleIds){
	var index = document.getElementById("daysel").selectedIndex;//获取当前选择项的索引.
	var day = document.getElementById("daysel").options[index].text;
	
	var seriesData;
	var allIds;
	$.ajaxSettings.async = false;
	$.getJSON("data/" + day + "series.json", function(data){  
		seriesData = data;
	}); 
	$.getJSON("data/" + day + "ids.json", function(data){  
		allIds = data;
	}); 
	$.ajaxSettings.async = true;

	var allTypeSeries = new Array();
	for(var i = 0; i < peopleIds.length; i++){
		var ind = allIds.indexOf(peopleIds[i].toString());
		if(ind >= 0){
			allTypeSeries.push(seriesData[ind][1]);
		}
	}

	var allPeoplePoly = new Array();
	for(var i = 0; i < allTypeSeries.length; i++){
		var singleData = new Array();
		for(var j = 0; j < allTypeSeries[i].length; j++){
			var sid = allTypeSeries[i][j];
			if(sensors[sid]['floor'] == 1){
				singleData.push(pointMerge([sensors[sid]['y'], 15 - sensors[sid]['x']]));
				if((j + 1) < allTypeSeries[i].length && (sensors[allTypeSeries[i][j + 1]]['floor'] == 2)){
					singleData.push(['-', '-']);
				}
			}
			else if(sensors[sid]['floor'] == 2){
				singleData.push(pointMerge([sensors[sid]['y'] + 32, 15 - sensors[sid]['x']]));
				if((j + 1) < allTypeSeries[i].length && (sensors[allTypeSeries[i][j + 1]]['floor'] == 1)){
					singleData.push(['-', '-']);
				}	
			}
		}
		allPeoplePoly.push(singleData);
	}

	//将所有的点保存并去重得到nodes和edges对象
	//计算每个点的权重
	var allpoints = new Array();
	var weights = new Array();
	allpoints.push(allPeoplePoly[0][0]);
	weights.push(0);
	for(var i = 0; i < allPeoplePoly.length; i++){
		for(var j = 0; j < allPeoplePoly[i].length; j++){
			if(allPeoplePoly[i][j][0] != '-'){
				var pointInd = ArrayIsin(allpoints, allPeoplePoly[i][j]);
				if(pointInd < 0){
					allpoints.push(allPeoplePoly[i][j]);
					if(j != 0 && j != allPeoplePoly[i].length - 1){
						weights.push(2);
					}
					else{
						weights.push(1);
					}
				}	
				else{
					if(j != 0 && j != allPeoplePoly[i].length - 1){
						weights[pointInd] += 2;
					}
					else{
						weights[pointInd] += 1;
					}
				}
			}
		}
	}
	weights = weights.Normalize();

	var nodes = {};
	for(var i = 0; i < allpoints.length; i++){
		nodes[i.toString()] = {};
		nodes[i.toString()].x = allpoints[i][0];
		nodes[i.toString()].y = allpoints[i][1];
	}

	var edges = new Array();
	for(var i = 0; i < allPeoplePoly.length; i++){
		for(var j = 0; j < allPeoplePoly[i].length; j++){
			var p1 = allPeoplePoly[i][j];
			if(p1[0] != '-'){
				if(j + 1 < allPeoplePoly[i].length && allPeoplePoly[i][j + 1][0] != '-'){
					var p2 = allPeoplePoly[i][j + 1];
					var ind1 = ArrayIsin(allpoints, p1);
					var ind2 = ArrayIsin(allpoints, p2);
					if(ind1 != ind2){
						var singleedge = {};
						singleedge.source = ind1.toString();
						singleedge.target = ind2.toString();
						edges.push(singleedge);
					}
				}
			}	
		}
	}

	var fbundling = d3.ForceEdgeBundling().nodes(nodes).edges(edges);
	var results = fbundling();

	return [results, allpoints, weights];
}

function getHotmapData(type, typedata){
	var index = document.getElementById("daysel").selectedIndex;//获取当前选择项的索引.
	var day = document.getElementById("daysel").options[index].text;

	if(type == "all"){
		$.ajaxSettings.async = false;
		$.getJSON(typedata, function(data){
			day_data = data;           
		}); 
		$.ajaxSettings.async = true;
	}
	else if(type == "group"){
		var peopleData = new Array();

		$.ajaxSettings.async = false;
		$.getJSON("data/" + day + "type.json", function(data){  
			typeClass = data;
		}); 
		$.ajaxSettings.async = true;

		//var peopleIds = typedata;
		var peopleIds = typedata;
		$.ajaxSettings.async = false;
		$.getJSON("data/" + day + "Dic.json", function(data){  
			for(var i = 0; i < peopleIds.length; i++){
				peopleData.push(data[peopleIds[i]]);
			}      
		}); 
		$.ajaxSettings.async = true;
		
		var allRelated_Sids = new Array();
		for(var i = 0; i < peopleData.length; i++){
			for(var j = 0; j < peopleData[i].length; j++){
				allRelated_Sids.push(peopleData[i][j][1]);
			}
		}      
		allRelated_Sids = allRelated_Sids.delDup();

		var groupData = {};
		for(var i = 0; i < allRelated_Sids.length; i++){
			var sidInfo = {};
			for(var j = 0; j < timedata.length; j++){
				sidInfo[timedata[j]] = 0;
			}
			
			groupData[allRelated_Sids[i]] = sidInfo;
		}

		for(var i = 0; i < peopleData.length; i++){
			for(var j = 0; j < peopleData[i].length; j++){
				if(groupData.hasOwnProperty(peopleData[i][j][1])){
					groupData[peopleData[i][j][1]][peopleData[i][j][0]] += 1;
				}
			}
		}   
		day_data = groupData;
	}

	allSquare = new Array();
	for(var key in day_data){
		allSquare.push(key);
	}
	var alldata = new Array();
	for(var i = 0; i < timedata.length; i++){
		alldata.push(getTimeData(timedata[i]));
	}
	return alldata;
}

function updateOption(data){
	var newOptions = new Array();
	for(var i = 0; i < timelineData.length; i++){
		newOptions.push({
			title: {
				show: false,
				text: timelineData[i],
				left: '5%',
				top: 'center',
				textStyle:{
					color: "#000",
					fontFamily: "Brush Script MT",
					fontSize: 40,
				}
			},
			series: {
				data: data[i],
			}
		});
	}

	return newOptions;
}

function pointMerge(point){
	var x = point[0];
	var y = point[1];
	if(x >= 2 && x <= 3 && y >= 2 && y <= 3){
		return [3, 3];
	}
	else if(x >= 4 && x <= 5 && y >= 2 && y <= 3){
		return [5, 3];
	}
	else if(x >= 1 && x <= 3 && y >= 6 && y <= 7){
		return [2.5, 7];
	}
	else if(x >= 4 && x <= 5 && y >= 6 && y <= 7){
		return [5, 7];
	}
	else if(x >= 1 && x <= 3 && y >= 8 && y <= 9){
		return [2.5, 9];
	}
	else if(x >= 4 && x <= 5 && y >= 8 && y <= 9){
		return [5, 9];
	}
	else if(x >= 1 && x <= 3 && y >= 10 && y <= 11){
		return [2.5, 11];
	}
	else if(x >= 4 && x <= 5 && y >= 10 && y <= 11){
		return [5, 11];
	}
	else if(x >= 1 && x <= 3 && y >= 12 && y <= 13){
		return [2.5, 13];
	}
	else if(x >= 4 && x <= 5 && y >= 12 && y <= 13){
		return [5, 13];
	}
	else if(x >= 10 && x <= 11 && y >= 4 && y <= 5){
		return [11, 5];
	}
	else if(x >= 10 && x <= 11 && y >= 10 && y <= 11){
		return [11, 11];
	}
	else if(x >= 10 && x <= 11 && y >= 6 && y <= 7){
		return [11, 7];
	}
	else if(x >= 10 && x <= 11 && y >= 8 && y <= 9){
		return [11, 9];
	}
	else if(x >= 7 && x <= 8 && y >= 6 && y <= 7){
		return [8, 7];
	}
	else if(x >= 7 && x <= 8 && y >= 8 && y <= 9){
		return [8, 9];
	}
	else if(x >= 7 && x <= 8 && y >= 10 && y <= 12){
		return [8, 11.5];
	}
	else if(x >= 19 && x <= 20 && y >= 0 && y <= 1){
		return [20, 1];
	}
	else if(x >= 21 && x <= 22 && y >= 0 && y <= 1){
		return [22, 1];
	}
	else if(x >= 23 && x <= 24 && y >= 0 && y <= 1){
		return [24, 1];
	}
	else if(x >= 25 && x <= 26 && y >= 0 && y <= 1){
		return [26, 1];
	}
	else if(x >= 27 && x <= 28 && y >= 0 && y <= 1){
		return [28, 1];
	}
	else if(x >= 15 && x <= 18 && y >= 4 && y <= 13){
		x = 15 + (parseInt((x - 15) / 2)) * 2 + 1;
		y = 4 + (parseInt((y - 4) / 2)) * 2 + 1;
		return [x, y];
	}
	else if(x >= 19 && x <= 24 && y >= 4 && y <= 13){
		x = 19 + (parseInt((x - 19) / 2)) * 2 + 1;
		y = 4 + (parseInt((y - 4) / 2)) * 2 + 1;
		return [x, y];
	}
	else if(x >= 25 && x <= 27 && y >= 4 && y <= 9){
		x = 26.5;
		y = 4 + (parseInt((y - 4) / 2)) * 2 + 1;
		return [x, y];
	}
	else if(x >= 25 && x <= 27 && y >= 10 && y <= 12){
		return [26.5, 11.5];
	}
	//---------------------------------------------------------
	else if(x >= 34 && x <= 37 && y >= 6 && y <= 13){
		x = 34 + (parseInt((x - 34) / 2)) * 2 + 1;
		y = 6 + (parseInt((y - 6) / 2)) * 2 + 1;
		return [x, y];
	}
	else if(x >= 42 && x <= 43 && y >= 10 && y <= 11){
		return [43, 11];
	}
	else if(x >= 42 && x <= 43 && y >= 8 && y <= 9){
		return [43, 9];
	}
	else if(x >= 32 && x <= 37 && y >= 0 && y <= 2){
		x = 32 + (parseInt((x - 32) / 2)) * 2 + 1;
		y = 1.5;
		return [x, y];
	}
	else if(x >= 33 && x <= 35 && y >= 4 && y <= 5){
		return [34.5, 5];
	}
	else if(x >= 36 && x <= 37 && y >= 4 && y <= 5){
		return [37, 5];
	}
	else{
		return [x + 0.5, y + 0.5];
	}
}

function pointToArea(point){
	var x = point[0];
	var y = point[1];
	if(x >= 3 && x <= 5 && y == 3){
		return 'CI';
	}
	else if(x >= 2 && x <= 5 && y == 7){
		return "PSD";
	}
	else if(x >= 2 && x <= 5 && y == 9){
		return "PSC";
	}
	else if(x >= 2 && x <= 5 && y == 11){
		return "PSB";
	}
	else if(x >= 2 && x <= 5 && y == 13){
		return "PSA";
	}
	else if(x == 11 && y== 5){
		return 'ROOM2';
	}
	else if(x == 11 && y== 11){
		return 'WC1';
	}
	else if(x == 11 && y >= 7 && y <= 9){
		return 'ROOM1';
	}
	else if(x == 8 && y >= 7 && y <= 12){
		return 'POSTER';
	}
	else if(x == 20 && y == 1){
		return 'SERVE';
	}
	else if(x >= 22 && x <= 24 && y == 1){
		return 'ROOM3';
	}
	else if(x == 26 && y == 1){
		return 'ROOM4';
	}
	else if(x == 28 && y == 1){
		return 'WC2';
	}
	else if(x >= 16 && x <= 18 && y >= 5 && y <= 13){
		return 'EXHIBITION';
	}
	else if(x >= 20 && x <= 24 && y >= 5 && y <= 13){
		return 'MAIN';
	}
	else if(x >= 26 && x <= 27 && y >= 5 && y <= 12){
		return 'MAIN';
	}
	//---------------------------------------------------------
	else if(x >= 35 && x <= 37 && y >= 7 && y <= 13){
		return 'CANTEEN';
	}
	else if(x == 43 && y == 11){
		return 'WC3';
	}
	else if(x == 43 && y == 9){
		return 'ROOM6';
	}
	else if(x >= 33 && x <= 37 && y >= 1 && y <= 2){
		return 'ENTERTAIN';
	}
	else if(x >= 34 && x <= 37 && y == 5){
		return 'ROOM5';
	}
	else if(x > 10 && x < 12 && y > 14 && y < 15){
		return 'TOPLD1';
	}
	else if(x > 10 && x < 12 && y > 1 && y < 2){
		return 'BOTLD1';
	}
	else if(x > 42 && x < 44 && y > 14 && y < 15){
		return 'TOPLD2';
	}
	else if(x > 42 && x < 44 && y > 1 && y < 2){
		return 'BOTLD2';
	}
	else{
		return 'No';
	}
}

function change(){
	var index = document.getElementById("daysel").selectedIndex;//获取当前选择项的索引.
	var day = document.getElementById("daysel").options[index].text;

	var newSeries = new Array();
	for(var i = 0;  i < MapOption.baseOption.series.length; i++){
		if(MapOption.baseOption.series[i].name == "hotmap"){
			newSeries.push(MapOption.baseOption.series[i]);
		}
	}
	MapOption.baseOption.series = newSeries;

	//热力图改变
	var dataroot = "data/" + day + "sensors.json";
	if(document.getElementById("hotmap").checked){
		alldata = getHotmapData("all", dataroot);
		MapOption.baseOption.timeline.currentIndex = 0;
		MapOption.options = updateOption(alldata);
	}
	hotChart.setOption(MapOption, true);

	//改变其他相应视图
	ObserverCopy.fireEvent("selectDay", day, Map);
}

function checkboxhotmap(){
	if(document.getElementById("hotmap").checked == false){
		alldata = [];
		MapOption.baseOption.timeline.currentIndex = 0;
		MapOption.baseOption.timeline.autoPlay = false;
		MapOption.options = updateOption(alldata);
		hotChart.setOption(MapOption, true);
	}
	else{
		var index = document.getElementById("daysel").selectedIndex;//获取当前选择项的索引.
		var day = document.getElementById("daysel").options[index].text;

		alldata = getHotmapData("all", "data/" + day + "sensors.json");
		MapOption.baseOption.timeline.currentIndex = 0;
		MapOption.options = updateOption(alldata);
		hotChart.setOption(MapOption, true);
	}
}
function checkboxcluster(){
	if(document.getElementById("cluster").checked == false){
		var newSeries = new Array();
		for(var i = 0; i < MapOption.baseOption.series.length; i++){
			if(MapOption.baseOption.series[i].name != "cluster"){
				newSeries.push(MapOption.baseOption.series[i]);
			}
		}
		MapOption.baseOption.series = newSeries;
		hotChart.setOption(MapOption, true);
	}
}
function checkboxsingle(){
	if(document.getElementById("single").checked == false){
		var newSeries = new Array();
		for(var i = 0;  i < MapOption.baseOption.series.length; i++){
			if(MapOption.baseOption.series[i].name != "single"){
				newSeries.push(MapOption.baseOption.series[i]);
			}
		}
		MapOption.baseOption.series = newSeries;
		hotChart.setOption(MapOption, true);
	}
}