function Boxplot(Observer) {
	var boxplot = {};

	// 数组 求和函数
	window.selectDay = 'day1';
	window.clusterType = 'trace';
	function sumArr(arr){
		var sum = 0;
		for(let item of arr){
			sum += item;
		}
		return sum;
	}

	// 查找列表中的所有元素
	function findAllIndexes(arr,item){
		var finded_indexes_list = [];
		var i =0;
		while(i<arr.length){
			if(arr[i] == item){
				finded_indexes_list.push(i);
			}
			i += 1;
		};
		return finded_indexes_list;
	}
	var boxplotChart = echarts.init(document.getElementById('boxplot'));
	// 默认显示第一天，cluster1数据
	var selected_day = 'day1';
	var clusterDic_list = [day1cluster_dic,day2cluster_dic,day3cluster_dic];
	var timeclusterDicList = [timeday1cluster_dic,timeday2cluster_dic,timeday3cluster_dic];
	var default_radar_data = day1radar_data;
	var default_clusterDic = day1cluster_dic;
	var default_cluster = default_clusterDic['1'];
	var posList = [
		"MAIN","PSA","PSB","PSC","PSD","ROOM1","ROOM2","ROOM3","ROOM4","ROOM5","ROOM6","WC1","WC2","WC3","POSTER","SERVE","CANTEEN","CI","ENTERTAIN",
		"EXHIBITION","TOPLD1","TOPLD2","BOTLD1","BOTLD2","CIENTRY1","CIENTRY2","CIENTRY3","CIENTRY4","MAINEXIT","EXHEXIT1","EXHEXIT2","CIEXIT1","AISLE1","AISLE2"
	  ];
	var posStayTimeDic = {};
	// StayTimeDic中的数据对应人员id
	var id_list = []
	for(let pos of posList){
		posStayTimeDic[pos] = [];
	}
	for(let id of default_cluster){
		id = id.toString();
		var index = 0
		var tmp_pos_count_dic = {};
		while(index < default_radar_data[id].length - 1){
			if(tmp_pos_count_dic.hasOwnProperty(default_radar_data[id][index][1])){
				tmp_pos_count_dic[default_radar_data[id][index][1]] = tmp_pos_count_dic[default_radar_data[id][index][1]] + default_radar_data[id][index + 1][0] - default_radar_data[id][index][0];
			}else{
				tmp_pos_count_dic[default_radar_data[id][index][1]] = default_radar_data[id][index + 1][0] - default_radar_data[id][index][0];
			}
			index += 1;
		}
		for(let key in posStayTimeDic){
			if(tmp_pos_count_dic.hasOwnProperty(key)){
				posStayTimeDic[key].push(tmp_pos_count_dic[key]);
			}else{
				posStayTimeDic[key].push(0);
			}
		}
		id_list.push(id);
	}

	var Sum_list = [];
	for(let key in posStayTimeDic){
		Sum_list.push([key,sumArr(posStayTimeDic[key]),posStayTimeDic[key]]);
	}
	Sum_list.sort(function(x,y){
		if(x[1] < y[1]){
			return 1;
		}else{
			return -1;
		}
	});
	// console.log('SumList');
	// console.log(Sum_list);
	var boxplotAxisData = [];
	var boxplotRawData = [];
	for(let i =0; i < Sum_list.length; i++){
		boxplotAxisData.push(Sum_list[i][0]);
		boxplotRawData.push(Sum_list[i][2]);
	}
	// console.log('boxPLOT');
	// console.log(boxplotRawData);
	var boxplotData = echarts.dataTool.prepareBoxplotData(boxplotRawData);
	// console.log(boxplotData);


	var boxplotOption = {
		title: [
			{
				text: 'cluster-1  ' + day1cluster_dic['1'].length + '人',
				textStyle: {
					fontSize: 12,
					fontStyle : 'italic',
				},
				left: 'left',
				top: 'top',
			},{
				text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
				borderColor: '#999',
				borderWidth: 1,
				textStyle: {
					fontSize: 12,
					fontStyle : 'italic',
					fontWeight : 'lighter',
				},
				left: '70%',
				top: '3%'
			}
		],
		tooltip: {
			trigger: 'item',
			axisPointer: {
				type: 'shadow'
			},
			position : 'top',
		},
		grid: {
			left: '10%',
			right: '10%',
			bottom: '15%'
		},
		xAxis: {
			type: 'category',
			data: boxplotAxisData,
			boundaryGap: true,
			nameGap: 30,
			splitArea: {
				show: false
			},
			// axisLabel: {
			// 	formatter: 'e {value}'
			// },
			splitLine: {
				show: false
			}
		},
		yAxis: {
			type: 'value',
			name: 'time/minutes',
			splitArea: {
				show: true
			}
		},
		brush : {
			toolbox : ['rect','clear'],
			throttleType : 'debounce',
			throttleDelay : 400,	
		},
		dataZoom : [{
			type : 'inside',
			yAxisIndex : 0,
		},{
			type : 'slider',
			xAxisIndex : 0,
			startValue : 0,
			endValue : 9,
			showDataShadow : false,
			showDetail : false,
			handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
			handleSize: '80%',
			height : '20px',
			handleStyle: {
				color: '#fff',
				shadowBlur: 3,
				shadowColor: 'rgba(0, 0, 0, 0.6)',
				shadowOffsetX: 2,
				shadowOffsetY: 2,
				opacity : 0.,
			}
		}],
		series: [
			{
				name: 'boxplot',
				type: 'boxplot',
				data: boxplotData.boxData,
				tooltip: {
					formatter: function (param) {
						return [
							param.name + ': ',
							'upper: ' + param.data[5] + 'min',
							'Q3: ' + param.data[4] + 'min',
							'median: ' + param.data[3] + 'min',
							'Q1: ' + param.data[2] + 'min',
							'lower: ' + param.data[1] + 'min',
						].join('<br/>');
					}
				}
			},
			{
				name: 'outlier',
				type: 'scatter',
				symbolSize : 7,
				itemStyle : {
					opacity : 0.7,

				},
				data: boxplotData.outliers
			}
		]
	};
	boxplotChart.setOption(boxplotOption);
	boxplotChart.on('brushSelected',function(params){
		var selected_outlier = params['batch'][0]['selected'][1];
		if(selected_outlier['dataIndex'].length > 0){
			var output_id_list = [];
			for(let index of selected_outlier['dataIndex']){
				// console.log(boxplotData.outliers[index]);
				var outlier_data = boxplotData.outliers[index]
				var id_indexs_list = findAllIndexes(boxplotRawData[outlier_data[0]],outlier_data[1]);
				// console.log('id')
				for(let id_index of id_indexs_list){
					// console.log(id_list[id_index]);
					if(output_id_list.indexOf(id_list[id_index]) < 0)
					{
						output_id_list.push(id_list[id_index]);
					}
				}
			}
			console.log('outliers');
			console.log(output_id_list);
			Observer.fireEvent("selectedOutliers",output_id_list,Boxplot);
		}
	})
	boxplot.onMessage = function(message, data, from){
		var tmp_cluster_type = '1';
		if(message == "switchCluster"){
			if(from == Cluster){
				console.log('in boxPlot cluster switch');
				window.clusterType = data;
				if(window.selectDay == 'day1'){
					if(window.clusterType == 'trace'){
						default_clusterDic = clusterDic_list[0];
					}else{
						default_clusterDic = timeclusterDicList[0];
					}
					default_radar_data = day1radar_data;
                }else if(window.selectDay == 'day2'){
					if(window.clusterType == 'trace'){
						default_clusterDic = clusterDic_list[1];
					}else{
						default_clusterDic = timeclusterDicList[1];
					}					
					default_radar_data = day2radar_data;
                }else if(window.selectDay == 'day3'){
					if(window.clusterType == 'trace'){
						default_clusterDic = clusterDic_list[2];
					}else{
						default_clusterDic = timeclusterDicList[2];
					}					
					default_radar_data = day3radar_data;
				}
				default_cluster = default_clusterDic['1'];
			}
		}
		if(message == "selectDay"){
			if(from == Map){
				window.selectDay = data;
				selected_day = data;	
				if(data == 'day1'){
					if(window.clusterType == 'trace'){
						default_clusterDic = clusterDic_list[0];
					}else{
						default_clusterDic = timeclusterDicList[0];
					}
					default_radar_data = day1radar_data;
                }else if(data == 'day2'){
					if(window.clusterType == 'trace'){
						default_clusterDic = clusterDic_list[1];
					}else{
						default_clusterDic = timeclusterDicList[1];
					}					
					default_radar_data = day2radar_data;
                }else if(data == 'day3'){
					if(window.clusterType == 'trace'){
						default_clusterDic = clusterDic_list[2];
					}else{
						default_clusterDic = timeclusterDicList[2];
					}					
					default_radar_data = day3radar_data;
				}
				default_cluster = default_clusterDic['1'];
			}
		}
		if(message == "selectid"){
			if(from == Cluster && data.length > 0){
				if(data.length > 0){
					default_cluster = data;
					tmp_cluster_type = 'custom'
				}else{
					default_cluster = default_clusterDic['1'];
					tmp_cluster_type = '1';
				}
			}
		}
		if(message == "selectCluster"){
			if(from == Cluster){
				default_cluster = default_clusterDic[data];
				tmp_cluster_type = data;
			}
		}
		if(message == "selectCluster" || message == "selectDay" || message == "selectid" || message == "switchCluster"){
			if(from == Cluster || from == Map){
				posStayTimeDic = {};
				// StayTimeDic中的数据对应人员id
				id_list = []
				for(let pos of posList){
					posStayTimeDic[pos] = [];
				}
				for(let id of default_cluster){
					id = id.toString();
					var index = 0
					var tmp_pos_count_dic = {};
					while(index < default_radar_data[id].length - 1){
						if(tmp_pos_count_dic.hasOwnProperty(default_radar_data[id][index][1])){
							tmp_pos_count_dic[default_radar_data[id][index][1]] = tmp_pos_count_dic[default_radar_data[id][index][1]] + default_radar_data[id][index + 1][0] - default_radar_data[id][index][0];
						}else{
							tmp_pos_count_dic[default_radar_data[id][index][1]] = default_radar_data[id][index + 1][0] - default_radar_data[id][index][0];
						}
						index += 1;
					}
					for(let key in posStayTimeDic){
						if(tmp_pos_count_dic.hasOwnProperty(key)){
							posStayTimeDic[key].push(tmp_pos_count_dic[key]);
						}else{
							posStayTimeDic[key].push(0);
						}
					}
					id_list.push(id);
				}
				Sum_list = [];
				for(let key in posStayTimeDic){
					Sum_list.push([key,sumArr(posStayTimeDic[key]),posStayTimeDic[key]]);
				}
				Sum_list.sort(function(x,y){
					if(x[1] < y[1]){
						return 1;
					}else{
						return -1;
					}
				});
				// console.log('SumList');
				// console.log(Sum_list);
				boxplotAxisData = [];
				boxplotRawData = [];
				for(let i =0; i < Sum_list.length; i++){
					boxplotAxisData.push(Sum_list[i][0]);
					boxplotRawData.push(Sum_list[i][2]);
				}
				// console.log('boxPLOT');
				// console.log(boxplotRawData);
				boxplotData = echarts.dataTool.prepareBoxplotData(boxplotRawData);
				// console.log(boxplotData);
				// 传递数据，修改视图
				boxplotChart.setOption({
					title: [
						{
							text: 'cluster-' + tmp_cluster_type + ' ' + default_cluster.length + '人',
							textStyle: {
								fontSize: 12,
								fontStyle : 'italic',
							},
							left: 'left',
							top: 'top',
						},{
							text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
							borderColor: '#999',
							borderWidth: 1,
							textStyle: {
								fontSize: 12,
								fontStyle : 'italic',
								fontWeight : 'lighter',
							},
							left: '70%',
							top: '3%'
						}
					],
					xAxis: {
						data: boxplotAxisData,
					},
					series: [
						{
							name: 'boxplot',
							type: 'boxplot',
							data: boxplotData.boxData,
						},
						{
							name: 'outlier',
							type: 'scatter',
							data: boxplotData.outliers
						}
					]
				});
			}
		}
	}
	
	Observer.addView(boxplot);
	return boxplot;
}
