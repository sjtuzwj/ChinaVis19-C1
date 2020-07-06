function Radar(Observer) {
	var radar = {};
	var radarChart = echarts.init(document.getElementById('radar'));

	// 数组求和函数
	function sumArr(arr){
		var sum = 0;
		for(let item of arr){
			sum += item;
		}
		return sum;
	}
	window.selectDay = 'day1';
	window.clusterType = 'trace';

	// 初始的类以及人员数据
	var clusterDic;
	var dayRadarData;

	var clusterDic_list = [day1cluster_dic,day2cluster_dic,day3cluster_dic];
	var timeclusterDicList = [timeday1cluster_dic,timeday2cluster_dic,timeday3cluster_dic];
	var dayDic_list = [day1radar_data,day2radar_data,day3radar_data];
	clusterDic = clusterDic_list[0];
	dayRadarData = dayDic_list[0]

	clusterData_list = [];
	// 数据格式处理
	for(let cluster in clusterDic_list[0]){
		var tmp_object = {};
		tmp_object['name'] = 'cluster-' + cluster;
		tmp_object['value'] = [];
		tmp_object['lineStyle'] = {
			opacity : 0,
		};
		// 1- 显示 0- 不显示
		tmp_object['opacity'] = 0;  
		var arrival_time_list = [];
		var leave_time_list = [];
		var position_count_list = [];
		var count = clusterDic_list[0][cluster].length;

		for(let id of clusterDic_list[0][cluster]){
			let personID = id.toString();
			if(day1radar_data.hasOwnProperty(personID)){
				arrival_time_list.push(day1radar_data[personID][0][0]);
				leave_time_list.push(day1radar_data[personID][day1radar_data[personID].length - 1][0]);
				var tmp_pos_list = [];
				for(let item of day1radar_data[personID]){
					if(tmp_pos_list.indexOf(item[1]) < 0){
						tmp_pos_list.push(item[1]);
					}
				}
				position_count_list.push(tmp_pos_list.length);
			}
		}
		tmp_object['value'].push(sumArr(arrival_time_list)/arrival_time_list.length);
		tmp_object['value'].push(sumArr(leave_time_list)/leave_time_list.length);
		tmp_object['value'].push(tmp_object['value'][1] - tmp_object['value'][0]);
		tmp_object['value'].push(sumArr(position_count_list)/position_count_list.length);
		tmp_object['value'].push(count);
		clusterData_list.push(tmp_object); 
	}

	// 初始只显示一类数据
	clusterData_list[0]['opacity'] = 1;
	clusterData_list[0]['lineStyle'] = {
		opacity : 0.7,
	};
	// 计算各个维度的max值
	var leave_list = [],arrival_list = [],stay_list = [],count_list = [],people_count_list=[];
	for(let item of clusterData_list){
		leave_list.push(item['value'][1]);
		arrival_list.push(item['value'][0]);
		stay_list.push(item['value'][2]);
		count_list.push(item['value'][3]);
		people_count_list.push(item['value'][4]);	
	}
	// console.log(arrival_list,leave_list,stay_list,count_list,people_count_list)

	// console.log('Radar view')
	// console.log(clusterData_list);
	radarOption = {
		tooltip: {
			formatter : function(params){
				// console.log(params);
				if(params['data']['opacity'] == 0){
					// return '';
				}else{
					var color = params['color']
					var type = params['data']['name'];
					var value_list = params['data']['value'];
					var markerHtml = echarts.format.getTooltipMarker(color)
					var tip = markerHtml + type + '<br/>' + '平均到达时间: ' + value_list[0].toFixed(2) + 'min';
					tip = tip + '<br/>' + '平均离开时间: ' + value_list[1].toFixed(2) + 'min';
					tip = tip + '<br/>' + '平均停留时间: ' + value_list[2].toFixed(2) + 'min';
					tip = tip + '<br/>' + '房间类型数目: ' + value_list[3].toFixed(2);
					tip = tip + '<br/>' + '总人数: ' + value_list[4] + '人';
					return tip;
				}
			},
			position : 'top',
		},
		// grid : {
		// 	top : '5%',
		// },
		// legend: {
		// 	data: ['cluster-1','cluster-2','cluster-3','cluster-4','cluster-5','cluster-6','cluster-7','cluster-8'],
		// },
		color : ['#ed8a79','#68c3dd','#6284d1','#324a94','#587e71','#1f5620','#4f9b50','#49bc4b','#7ee780','#aafaab','#ccfccc','#666666','#fefaf9','#eeeedd','#f6c9d5','#f6c9a4','#e0b7d0','#c8b7d0',],
		radar: {
			name: {
				textStyle: {
					color: '#fff',
					backgroundColor: '#999',
					borderRadius: 3,
					padding: [3, 5]
				},
			top : '5%',
			},
			// 每类人平均到达时间，离开时间，总时间，房间的类型数目，总人数
			indicator: [
				{ name: '平均到达时间', max: Math.max(...arrival_list)},
				{ name: '平均离开时间', max: Math.max(...leave_list)},
				{ name: '平均停留时间', max: Math.max(...stay_list)},
				{ name: '房间类型数目', max: Math.max(...count_list)},
				{ name: '总人数', max : Math.max(...people_count_list)},
				]
		},
		series: [{
			type: 'radar',
			data : clusterData_list,
		}]
	};
	radarChart.setOption(radarOption);

	radar.onMessage = function(message, data, from){
		if(message == "switchCluster"){
			if(from == Cluster){
				window.clusterType = data;
				if(window.selectDay == 'day1'){
					if(window.clusterType == 'trace'){
						clusterDic = clusterDic_list[0];
					}else{
						clusterDic = timeclusterDicList[0];
					}
					dayRadarData = dayDic_list[0]
                }else if(window.selectDay == 'day2'){
					if(window.clusterType == 'trace'){
						clusterDic = clusterDic_list[1];
					}else{
						clusterDic = timeclusterDicList[1];
					}					
					dayRadarData = dayDic_list[1]
                }else if(window.selectDay == 'day3'){
					if(window.clusterType == 'trace'){
						clusterDic = clusterDic_list[2];
					}else{
						clusterDic = timeclusterDicList[2];
					}					
					dayRadarData = dayDic_list[2]
				}
				clusterData_list = [];
				for(let cluster in clusterDic){
					var tmp_object = {};
					tmp_object['name'] = 'cluster-' + cluster;
					tmp_object['value'] = [];
					tmp_object['lineStyle'] = {
						opacity : 0,
					};
					tmp_object['opacity'] = 0;
					var arrival_time_list = [];
					var leave_time_list = [];
					var position_count_list = [];
					var count = clusterDic[cluster].length;
			
					for(let id of clusterDic[cluster]){
						let personID = id.toString();
						if(dayRadarData.hasOwnProperty(personID)){
							arrival_time_list.push(dayRadarData[personID][0][0]);
							leave_time_list.push(dayRadarData[personID][dayRadarData[personID].length - 1][0]);
							var tmp_pos_list = [];
							for(let item of dayRadarData[personID]){
								if(tmp_pos_list.indexOf(item[1]) < 0){
									tmp_pos_list.push(item[1]);
								}
							}
							position_count_list.push(tmp_pos_list.length);
						}
					}
					tmp_object['value'].push(sumArr(arrival_time_list)/arrival_time_list.length);
					tmp_object['value'].push(sumArr(leave_time_list)/leave_time_list.length);
					tmp_object['value'].push(tmp_object['value'][1] - tmp_object['value'][0]);
					tmp_object['value'].push(sumArr(position_count_list)/position_count_list.length);
					tmp_object['value'].push(count);
					clusterData_list.push(tmp_object); 
				}
				// 初始只显示一类数据
				clusterData_list[0]['opacity'] = 1;
				clusterData_list[0]['lineStyle'] = {
					opacity : 0.7,
				};
				var leave_list = [],arrival_list = [],stay_list = [],count_list = [],people_count_list=[];
				for(let item of clusterData_list){
					leave_list.push(item['value'][1]);
					arrival_list.push(item['value'][0]);
					stay_list.push(item['value'][2]);
					count_list.push(item['value'][3]);
					people_count_list.push(item['value'][4])	
				}
				radarChart.setOption({
					radar : {
						indicator: [
							{ name: '平均到达时间', max: Math.max(...arrival_list)},
							{ name: '平均离开时间', max: Math.max(...leave_list)},
							{ name: '平均停留时间', max: Math.max(...stay_list)},
							{ name: '房间类型数目', max: Math.max(...count_list)},
							{ name: '总人数', max : Math.max(...people_count_list)},
							]
					},
					series : [{
						type : 'radar',
						data : clusterData_list
					}]
				});
			}
		}
		if(message == "selectDay"){
			if(from == Map){
				window.selectDay = data;
				if(data == 'day1'){
					if(window.clusterType = 'trace'){
						clusterDic = clusterDic_list[0];
					}else{
						clusterDic = timeclusterDicList[0];
					}
					dayRadarData = dayDic_list[0]
                }else if(data == 'day2'){
					if(window.clusterType = 'trace'){
						clusterDic = clusterDic_list[1];
					}else{
						clusterDic = timeclusterDicList[1];
					}					
					dayRadarData = dayDic_list[1]
                }else if(data == 'day3'){
					if(window.clusterType = 'trace'){
						clusterDic = clusterDic_list[2];
					}else{
						clusterDic = timeclusterDicList[2];
					}					
					dayRadarData = dayDic_list[2]
				}
				clusterData_list = [];
				for(let cluster in clusterDic){
					var tmp_object = {};
					tmp_object['name'] = 'cluster-' + cluster;
					tmp_object['value'] = [];
					tmp_object['lineStyle'] = {
						opacity : 0,
					};
					tmp_object['opacity'] = 0;
					var arrival_time_list = [];
					var leave_time_list = [];
					var position_count_list = [];
					var count = clusterDic[cluster].length;
			
					for(let id of clusterDic[cluster]){
						let personID = id.toString();
						if(dayRadarData.hasOwnProperty(personID)){
							arrival_time_list.push(dayRadarData[personID][0][0]);
							leave_time_list.push(dayRadarData[personID][dayRadarData[personID].length - 1][0]);
							var tmp_pos_list = [];
							for(let item of dayRadarData[personID]){
								if(tmp_pos_list.indexOf(item[1]) < 0){
									tmp_pos_list.push(item[1]);
								}
							}
							position_count_list.push(tmp_pos_list.length);
						}
					}
					tmp_object['value'].push(sumArr(arrival_time_list)/arrival_time_list.length);
					tmp_object['value'].push(sumArr(leave_time_list)/leave_time_list.length);
					tmp_object['value'].push(tmp_object['value'][1] - tmp_object['value'][0]);
					tmp_object['value'].push(sumArr(position_count_list)/position_count_list.length);
					tmp_object['value'].push(count);
					clusterData_list.push(tmp_object); 
				}
				// 初始只显示一类数据
				clusterData_list[0]['opacity'] = 1;
				clusterData_list[0]['lineStyle'] = {
					opacity : 0.7,
				};
				var leave_list = [],arrival_list = [],stay_list = [],count_list = [],people_count_list=[];
				for(let item of clusterData_list){
					leave_list.push(item['value'][1]);
					arrival_list.push(item['value'][0]);
					stay_list.push(item['value'][2]);
					count_list.push(item['value'][3]);
					people_count_list.push(item['value'][4])	
				}
				radarChart.setOption({
					radar : {
						indicator: [
							{ name: '平均到达时间', max: Math.max(...arrival_list)},
							{ name: '平均离开时间', max: Math.max(...leave_list)},
							{ name: '平均停留时间', max: Math.max(...stay_list)},
							{ name: '房间类型数目', max: Math.max(...count_list)},
							{ name: '总人数', max : Math.max(...people_count_list)},
							]
					},
					series : [{
						type : 'radar',
						data : clusterData_list
					}]
				});
			}
		}
		if(message == "selectCluster"){
			if(from == Cluster){
				var clusterData_index = parseInt(data) - 1;
				if(clusterData_list[clusterData_index]['opacity'] == 0){
					clusterData_list[clusterData_index]['opacity'] = 1;
					clusterData_list[clusterData_index]['lineStyle'] = {
						opacity : 0.7,
					};
					// //设置宽度，令选择的对应类线条加粗
					// for(var item of clusterData_list){
					// 	item['lineStyle']['width'] = 1;
					// }
					// clusterData_list[clusterData_index]['lineStyle']['width'] = 5;
				}else{
					// clusterData_list[clusterData_index]['opacity'] = 0;
					// clusterData_list[clusterData_index]['lineStyle'] = {
					// 	opacity : 0,
					// };
				}
				//设置宽度，令选择的对应类线条加粗
				for(var item of clusterData_list){
					item['lineStyle']['width'] = 1;
				}
				clusterData_list[clusterData_index]['lineStyle']['width'] = 5;
				radarChart.setOption({
					series : [{
						type : 'radar',
						data : clusterData_list
					}]
				});
			}
		}
		if(message == "selectid"){
			if(from == Cluster){
				if(clusterData_list[clusterData_list.length - 1]['name'] == 'custom'){
					clusterData_list.pop();
				}
				//设置宽度，令选择的对应类线条加粗
				for(var item of clusterData_list){
					item['lineStyle']['width'] = 1;
				}
				var tmp_object = {};
				tmp_object['name'] = 'custom';
				tmp_object['value'] = [];
				tmp_object['opacity'] = 1;
				tmp_object['lineStyle'] = {
					opacity : 0.7,
					width : 5,
				};
				var arrival_time_list = [];
				var leave_time_list = [];
				var position_count_list = [];
				var count = data.length;
				if(data.length > 0){
					for(let id of data){
						let personID = id.toString();
						if(dayRadarData.hasOwnProperty(personID)){
							arrival_time_list.push(dayRadarData[personID][0][0]);
							leave_time_list.push(dayRadarData[personID][dayRadarData[personID].length - 1][0]);
							var tmp_pos_list = [];
							for(let item of dayRadarData[personID]){
								if(tmp_pos_list.indexOf(item[1]) < 0){
									tmp_pos_list.push(item[1]);
								}
							}
							position_count_list.push(tmp_pos_list.length);
						}
					}
					tmp_object['value'].push(sumArr(arrival_time_list)/arrival_time_list.length);
					tmp_object['value'].push(sumArr(leave_time_list)/leave_time_list.length);
					tmp_object['value'].push(tmp_object['value'][1] - tmp_object['value'][0]);
					tmp_object['value'].push(sumArr(position_count_list)/position_count_list.length);
					tmp_object['value'].push(count);
					clusterData_list.push(tmp_object); 
				}
				var leave_list = [],arrival_list = [],stay_list = [],count_list = [],people_count_list=[];
				for(let item of clusterData_list){
					leave_list.push(item['value'][1]);
					arrival_list.push(item['value'][0]);
					stay_list.push(item['value'][2]);
					count_list.push(item['value'][3]);
					people_count_list.push(item['value'][4])	
				}
				radarChart.setOption({
					radar : {
						indicator: [
							{ name: '平均到达时间', max: Math.max(...arrival_list)},
							{ name: '平均离开时间', max: Math.max(...leave_list)},
							{ name: '平均停留时间', max: Math.max(...stay_list)},
							{ name: '房间类型数目', max: Math.max(...count_list)},
							{ name: '总人数', max : Math.max(...people_count_list)},
							]
					},
					series : [{
						type : 'radar',
						data : clusterData_list
					}]
				});
			}
		}
	}
	
	Observer.addView(radar);
	return radar;
}
