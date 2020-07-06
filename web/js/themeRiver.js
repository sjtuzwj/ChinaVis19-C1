function ThemeRiver(Observer) {
	var themeRiver = {};
	// Time Feature
	// ObserverCopy.fireEvent("switchCluster","trace", Cluster);

	window.clusterType = 'trace';
	window.selectDay = 'day1';

	// 函数 记录每一类每个地点每个时刻的人数
	function readRefinedDaydic(dayDic,totalCountDic,positionList,idClusterDic,min_time,max_time){
		var clusterCountDic = {};
		for(let key in totalCountDic){
			clusterCountDic[key] = {};
			for(let pos of positionList){
				clusterCountDic[key][pos] = {};
				for(let i = min_time; i <= max_time; i++){
					clusterCountDic[key][pos][i.toString()] = 0;
				}
			}
		}
		for(let key in dayDic){
			var index = 0;
			var tupleList = dayDic[key];
			while(index < dayDic[key].length - 1){
				for(let i = tupleList[index][0]; i <= tupleList[index+1][0]; i ++){
					if(clusterCountDic[idClusterDic[key]] != undefined){
						clusterCountDic[idClusterDic[key]][tupleList[index][1]][i.toString()] += 1;
					}
				}
				index += 1;
			}
		}
		return clusterCountDic;
	}

	// 颜色字典
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
	}
	var legend_list = [];
	var color_list = [];
	for(let item in colorDic){
			legend_list.push(item);
			color_list.push(colorDic[item]);
	}
	// 河流图基本设置
	var baseOption = {
		title : {
			text : '',
			left : 'left',
			top : '30%',
			textStyle : {
				fontStyle : 'italic',
				fontSize : 13,
				fontWeight : 'lighter',
			},
		},
		tooltip: {
				trigger: 'axis',
				axisPointer: {
						type: 'line',
						lineStyle: {
								color: 'rgba(0,0,0,0.2)',
								width: 1,
								type: 'solid'
						}
				},
				position : ['0%','0%'],
				formatter : function(params){
						var time = params[0]['value'][0].slice(11,16);
						var data_list = []
						for(let item of params){
								// item['value'][1] = item['value'][1].toFixed(3);
								data_list.push([item['value'], item['color']])
						}
						data_list.sort(function(x,y){
								if(x[0][1] < y[0][1]){
										return 1;
								}else{
										return -1;
								}
						})
						var tip = 'Time: ' + time;
						for(let item of data_list.slice(0,7)){
								var markerHtml = echarts.format.getTooltipMarker(item[1])
								tip = tip + '<br/>' + markerHtml + item[0][2] + ':  ' + item[0][1].toString().slice(0,5);
						}
						return tip;
				},
		},   
		// legend : {
		// 		selectedMode : false,
		// 		type : 'scroll',
		// 		// data : []
		// },
		color : color_list,         
		singleAxis: {
				top: 0,
				bottom: 0,
				// bottom: 50,
				splitNumber : 6,
				axisTick: {},
				axisLabel: {},
				type: 'time',
				splitLine: {
						show: true,
						lineStyle: {
								type: 'dashed',
								opacity: 0.2
						}
				}
		},
		series: [
				{
						type: 'themeRiver',
						label : {
								show : false,
						},
						emphasis : {
								label : {
										show : true,
								}
						},
						itemStyle: {
								emphasis: {
										shadowBlur: 20,
										shadowColor: 'rgba(0, 0, 0, 0.8)'
								}
						},
						data: [],
				}
		]
	};
	// 河流图视图列表
	var clusterChartList = [];
	// 聚类数据以及原始数据
	var clusterDicList = [day1cluster_dic,day2cluster_dic,day3cluster_dic];
	var timeclusterDicList = [timeday1cluster_dic,timeday2cluster_dic,timeday3cluster_dic];
	var refinedDataList = [day1radar_data,day2radar_data,day3radar_data];
	// 每个类对应的雷达图数据
	var clusterDataList = [];
	// <div id= "themeRiver2" style="position: relative;height: 50%; width: 100%;"></div>
	//初始化 动态添加div
	var themeRiver_div = document.getElementById('themeRiver');
	for(let c in clusterDicList[0]){
		var tmp_div = document.createElement('div');
		tmp_div.id = "themeRiver" + c;
		tmp_div.style.position = 'relative';
		tmp_div.style.height = '50%';
		tmp_div.style.width = '100%';
		themeRiver_div.appendChild(tmp_div);
	}
	var clusterDic = clusterDicList[0];
	var dayDic = refinedDataList[0];
	for(let c in clusterDic){
		clusterDic[c] = clusterDic[c].map(function(a){return a.toString();});
	}
	// 键值反转
	var idClusterDic = {};
	for(let key in clusterDic){
		for(let id of clusterDic[key]){
			idClusterDic[id] = key;
		}
	}
	// 最小、最大时间
	var min_time = 999999;
	var max_time = 0;
	for(let id in dayDic){
		if(dayDic[id][0][0] < min_time){
			min_time = dayDic[id][0][0];
		}
		if(dayDic[id][dayDic[id].length - 1][0] > max_time){
			max_time = dayDic[id][dayDic[id].length - 1][0];
		}
	}
	// console.log('min/max time')
	// console.log(min_time,max_time)
	// 每一类的总人数
	var totalCountDic = {};
	for(let key in clusterDic){
		if(clusterDic[key].length > 0){
			totalCountDic[key] = clusterDic[key].length;
		}
	}
	// console.log('total Count Dic',totalCountDic);
	// console.log('posList',legend_list);
	// console.log('idClusterDic',idClusterDic);
	// console.log('dayDic',dayDic);
	var clusterCountDic = readRefinedDaydic(dayDic,totalCountDic,legend_list,idClusterDic,min_time,max_time);
	for(let c in clusterCountDic){
		for(let pos in clusterCountDic[c]){
			for(let t in clusterCountDic[c][pos]){
				clusterCountDic[c][pos][t] = clusterCountDic[c][pos][t] / totalCountDic[c];
			}
		}
	}
	for(let key in clusterCountDic){
		var test_data = [];
		for(let pos in clusterCountDic[key]){
			for(let t in clusterCountDic[key][pos]){
				var minutes = parseInt(t);
				var hours = parseInt(minutes / 60);
				minutes = minutes % 60;
				if(minutes < 10){
					minutes = '0' + minutes;
				}
				if(hours < 10){
					hours = '0' + hours;
				}
				var time = '2000-01-01' + ' ' + hours + ':' + minutes;
				test_data.push([time, clusterCountDic[key][pos][t], pos]);
			}
		}
		clusterDataList.push(test_data);
	}
	for(let c in clusterDic){
		var div_id = 'themeRiver' + c;
		var clusterChart = echarts.init(document.getElementById(div_id));
		clusterChartList.push(clusterChart);
	}
	for(var item of clusterChartList){
		item.setOption(baseOption);
	}
	for(let c in clusterDic){
		if(c == '1'){
			clusterChartList[parseInt(c) - 1].setOption({
				title : {
					text : 'cluster-1'
				},
				legend : {
					selectedMode : false,
					type : 'scroll',
					itemWidth : 15,
					itemHeight : 10,
				},
				series : {data : clusterDataList[parseInt(c) - 1]},
			})
		}else{
			clusterChartList[parseInt(c) - 1].setOption({
				title : {
					text : 'cluster-' + c,
				},
				series : {data : clusterDataList[parseInt(c) - 1]},
			})
		}
	}



	themeRiver.onMessage = function(message, data, from){
		// "switchCluster","trace", Cluster
		if(message == 'switchCluster'){
			if(from == Cluster){
				window.clusterType = data;
			}
			if(window.selectDay == 'day1'){
				if(window.clusterType == 'trace'){
					clusterDic = clusterDicList[0];
				}else{
					clusterDic = timeclusterDicList[0];
				}
				dayDic = refinedDataList[0];
			}else if(window.selectDay == 'day2'){
				if(window.clusterType == 'trace'){
					clusterDic = clusterDicList[1];
				}else{
					clusterDic = timeclusterDicList[1];
				}
				dayDic = refinedDataList[1];
			}else if(window.selectDay == 'day3'){
				if(window.clusterType == 'trace'){
					clusterDic = clusterDicList[2];
				}else{
					clusterDic = timeclusterDicList[2];
				}
				dayDic = refinedDataList[2];
			}
			// 删除视图
			for(let item of clusterChartList){
				item.dispose();
			}
			// 清空视图列表 等待重新添加
			clusterChartList = [];
			clusterDataList = [];
			// 删除对应div
			var themeRiver_div = document.getElementById('themeRiver');
			while(themeRiver_div.children.length > 0){
				themeRiver_div.removeChild(themeRiver_div.children[0]);
			}
			// 重新添加对应div
			for(let c in clusterDic){
				var tmp_div = document.createElement('div');
				tmp_div.id = "themeRiver" + c;
				tmp_div.style.position = 'relative';
				tmp_div.style.height = '50%';
				tmp_div.style.width = '100%';
				themeRiver_div.appendChild(tmp_div);
			}
			// 人员id Num -> String
			for(let c in clusterDic){
				clusterDic[c] = clusterDic[c].map(function(a){return a.toString();});
			}
			// 键值反转
			var idClusterDic = {};
			for(let key in clusterDic){
				for(let id of clusterDic[key]){
					idClusterDic[id] = key;
				}
			}
			// 最小、最大时间
			var min_time = 999999;
			var max_time = 0;
			for(let id in dayDic){
				if(dayDic[id][0][0] < min_time){
					min_time = dayDic[id][0][0];
				}
				if(dayDic[id][dayDic[id].length - 1][0] > max_time){
					max_time = dayDic[id][dayDic[id].length - 1][0];
				}
			}
			// console.log('min/max time')
			// console.log(min_time,max_time)
			// 每一类的总人数
			var totalCountDic = {};
			for(let key in clusterDic){
				if(clusterDic[key].length > 0){
					totalCountDic[key] = clusterDic[key].length;
				}
			}
			// console.log('total Count Dic',totalCountDic);
			console.log('posList',legend_list);
			// console.log('idClusterDic',idClusterDic);
			// console.log('dayDic',dayDic);
			var clusterCountDic = readRefinedDaydic(dayDic,totalCountDic,legend_list,idClusterDic,min_time,max_time);
			for(let c in clusterCountDic){
				for(let pos in clusterCountDic[c]){
					for(let t in clusterCountDic[c][pos]){
						clusterCountDic[c][pos][t] = clusterCountDic[c][pos][t] / totalCountDic[c];
					}
				}
			}
			for(let key in clusterCountDic){
				var test_data = [];
				for(let pos in clusterCountDic[key]){
					for(let t in clusterCountDic[key][pos]){
						var minutes = parseInt(t);
						var hours = parseInt(minutes / 60);
						minutes = minutes % 60;
						if(minutes < 10){
							minutes = '0' + minutes;
						}
						if(hours < 10){
							hours = '0' + hours;
						}
						var time = '2000-01-01' + ' ' + hours + ':' + minutes;
						test_data.push([time, clusterCountDic[key][pos][t], pos]);
					}
				}
				clusterDataList.push(test_data);
			}
			// 视图初始化，生成河流图
			for(let c in clusterDic){
				var div_id = 'themeRiver' + c;
				var clusterChart = echarts.init(document.getElementById(div_id));
				clusterChartList.push(clusterChart);
			}
			for(var item of clusterChartList){
				item.setOption(baseOption);
			}
			for(let c in clusterDic){
				if(c == '1'){
					clusterChartList[parseInt(c) - 1].setOption({
						title : {
							text : 'cluster-1'
						},
						legend : {
							selectedMode : false,
							type : 'scroll',
							itemWidth : 15,
							itemHeight : 10,
						},
						series : {data : clusterDataList[parseInt(c) - 1]},
					})
				}else{
					clusterChartList[parseInt(c) - 1].setOption({
						title : {
							text : 'cluster-' + c,
						},
						series : {data : clusterDataList[parseInt(c) - 1]},
					})
				}
			}
		
		}
		if(message == "selectDay"){
			if(from == Map){
				window.selectDay = data;	
				console.log('receive selected_day in themeRiver')
				if(data == 'day1'){
					if(window.clusterType == 'trace'){
						clusterDic = clusterDicList[0];
					}else{
						clusterDic = timeclusterDicList[0];
					}
					dayDic = refinedDataList[0];
				}else if(data == 'day2'){
					if(window.clusterType == 'trace'){
						clusterDic = clusterDicList[1];
					}else{
						clusterDic = timeclusterDicList[1];
					}
					dayDic = refinedDataList[1];
				}else if(data == 'day3'){
					if(window.clusterType == 'trace'){
						clusterDic = clusterDicList[2];
					}else{
						clusterDic = timeclusterDicList[2];
					}
					dayDic = refinedDataList[2];
				}
				console.log(clusterDic);
				console.log(clusterDicList);
				// 删除视图
				for(let item of clusterChartList){
					item.dispose();
				}
				// 清空视图列表 等待重新添加
				clusterChartList = [];
				clusterDataList = [];
				// 删除对应div
				var themeRiver_div = document.getElementById('themeRiver');
				while(themeRiver_div.children.length > 0){
					themeRiver_div.removeChild(themeRiver_div.children[0]);
				}
				// 重新添加对应div
				for(let c in clusterDic){
					var tmp_div = document.createElement('div');
					tmp_div.id = "themeRiver" + c;
					tmp_div.style.position = 'relative';
					tmp_div.style.height = '50%';
					tmp_div.style.width = '100%';
					themeRiver_div.appendChild(tmp_div);
				}
				// 人员id Num -> String
				for(let c in clusterDic){
					clusterDic[c] = clusterDic[c].map(function(a){return a.toString();});
				}
				// 键值反转
				var idClusterDic = {};
				for(let key in clusterDic){
					for(let id of clusterDic[key]){
						idClusterDic[id] = key;
					}
				}
				// 最小、最大时间
				var min_time = 999999;
				var max_time = 0;
				for(let id in dayDic){
					if(dayDic[id][0][0] < min_time){
						min_time = dayDic[id][0][0];
					}
					if(dayDic[id][dayDic[id].length - 1][0] > max_time){
						max_time = dayDic[id][dayDic[id].length - 1][0];
					}
				}
				console.log('min/max time')
				console.log(min_time,max_time)
				// 每一类的总人数
				var totalCountDic = {};
				for(let key in clusterDic){
					if(clusterDic[key].length > 0){
						totalCountDic[key] = clusterDic[key].length;
					}
				}
				console.log('total Count Dic',totalCountDic);
				console.log('posList',legend_list);
				console.log('idClusterDic',idClusterDic);
				console.log('dayDic',dayDic);
				var clusterCountDic = readRefinedDaydic(dayDic,totalCountDic,legend_list,idClusterDic,min_time,max_time);
				for(let c in clusterCountDic){
					for(let pos in clusterCountDic[c]){
						for(let t in clusterCountDic[c][pos]){
							clusterCountDic[c][pos][t] = clusterCountDic[c][pos][t] / totalCountDic[c];
						}
					}
				}
				for(let key in clusterCountDic){
					var test_data = [];
					for(let pos in clusterCountDic[key]){
						for(let t in clusterCountDic[key][pos]){
							var minutes = parseInt(t);
							var hours = parseInt(minutes / 60);
							minutes = minutes % 60;
							if(minutes < 10){
								minutes = '0' + minutes;
							}
							if(hours < 10){
								hours = '0' + hours;
							}
							var time = '2000-01-01' + ' ' + hours + ':' + minutes;
							test_data.push([time, clusterCountDic[key][pos][t], pos]);
						}
					}
					clusterDataList.push(test_data);
				}
				// 视图初始化，生成河流图
				for(let c in clusterDic){
					var div_id = 'themeRiver' + c;
					var clusterChart = echarts.init(document.getElementById(div_id));
					clusterChartList.push(clusterChart);
				}
				for(var item of clusterChartList){
					item.setOption(baseOption);
				}
				for(let c in clusterDic){
					if(c == '1'){
						clusterChartList[parseInt(c) - 1].setOption({
							title : {
								text : 'cluster-1'
							},
							legend : {
								selectedMode : false,
								type : 'scroll',
								itemWidth : 15,
								itemHeight : 10,
							},
							series : {data : clusterDataList[parseInt(c) - 1]},
						})
					}else{
						clusterChartList[parseInt(c) - 1].setOption({
							title : {
								text : 'cluster-' + c,
							},
							series : {data : clusterDataList[parseInt(c) - 1]},
						})
					}
				}
			}
		}
	}
	
	Observer.addView(themeRiver);
	return themeRiver;
}
