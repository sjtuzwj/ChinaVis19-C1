var ObserverCopy;
var ganttChart = echarts.init(document.getElementById('gantt'));
// 颜色字典:
var colorDic = {
	'MAIN': '#ed8a79',
	// BLUE
	'PSA': '#68c3dd',
	'PSB': '#6284d1',
	'PSC': '#324a94',
	'PSD': '#587e71',
	// Green
	'ROOM1': '#1f5620',
	'ROOM2': '#4f9b50',
	'ROOM3': '#49bc4b',
	'ROOM4': '#7ee780',
	'ROOM5': '#aafaab',
	'ROOM6': '#ccfccc',
	// GRAY
	'WC1': '#666666',
	'WC2': '#666666',
	'WC3': '#666666',
	// LIGHT
	'POSTER': '#DB7093',
        'SERVE': '#DDA0DD',
	'CANTEEN': '#f6c9d5',
	'CI': '#f6c9a4',
	'ENTERTAIN': '#e0b7d0',
	'EXHIBITION': '#c8b7d0',
	// ONYX
	'TOPLD1': '#353a38',
	'TOPLD2': '#353a38',
	'BOTLD1': '#353a38',
	'BOTLD2': '#353a38',
	// OTHERS
	'CIENTRY1': '#221423',
	'CIENTRY2': '#221423',
	'CIENTRY3': '#221423',
	'CIENTRY4': '#221423',
	'MAINEXIT': '#221423',
	'EXHEXIT1': '#221423',
	'EXHEXIT2': '#221423',
	'CIEXIT1': '#221423',
	// AISLE
	'AISLE1': '#d3eedd',
	'AISLE2': '#d3eedd',
}
function Gantt(Observer) {
	var gantt = {};

	//-----------------------------------人员id输入框------------------------------
	if(document.getElementById("selectId_b")){
		var id_box = document.getElementById("selectId_b");  
		id_box.parentNode.removeChild(id_box);  
	}
	var parent = document.getElementById("cluster-overview");

	var div = document.createElement("div");
	div.setAttribute("class","selectId_box");
	div.setAttribute("id","selectId_b");

	var myInput = document.createElement("input");  
	myInput.setAttribute("type", "text");
	myInput.setAttribute("placeholder", "人员id");
	myInput.setAttribute("class", "inputId");
	myInput.setAttribute("id", "peopleId");
	myInput.setAttribute("onKeyDown", "selectId(event)");
	div.appendChild(myInput);  

	parent.appendChild(div);

	//------------------------------------------------------------------------

	var index = 0;
	ganttChart.dispose();
	ganttChart = echarts.init(document.getElementById('gantt'));


	ObserverCopy = Observer;
	// 初始展示的id_list
	var id_list = [];
	for(let id of day1cluster_dic["1"]){
		id_list.push(id.toString());
	}
	var id_data = {};
	for(let id of id_list){
		id_data[id] = [];
	}
	// 统计最小时间
	var min_time = 999999;
	for(let id of id_list){
		if(min_time > gantt_data[id][0][0]){
			min_time = gantt_data[id][0][0];
		}
	}
	// 统计长度
	for(let id of id_list){
		if(gantt_data[id][0][0] > min_time){
			id_data[id].push([gantt_data[id][0][0] - min_time,'None',min_time,gantt_data[id][0][0]]);			
		}
		index = 1;
		while(index < gantt_data[id].length -1){
			if(gantt_data[id][index + 1][0] > 48*60 && gantt_data[id][index][0] <= 24*60){
				id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
			}else if(gantt_data[id][index + 1][0] > 24*60 && gantt_data[id][index][0] <= 24*60){
				id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
			}else if(gantt_data[id][index + 1][0] > 48*60 && gantt_data[id][index][0] <= 48*60){
				id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
			}else if(gantt_data[id][index + 1][0] > gantt_data[id][index][0] + 1){
				id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], gantt_data[id][index][1], gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
			}
			index += 1;
		}
	}

	// 转换数据格式:
	var barData = []
		// 统计最长的堆栈
	var max_length = 0
	for(let id in id_data){
		if(max_length < id_data[id].length){ max_length = id_data[id].length;}
	}
	index = 0;
	while(index < max_length){
		var tmp_obj = {
			name: '数据',
			type: 'bar',
			stack:  '总量',
			barGap : '5%',
			large : true,
			label : {
				emphasis : {
					show : true,
					fontStyle : 'italic',
					color : 'black',
					formatter : function(params){
						var start_minutes = params.data['start'];
						var end_minutes = params.data['end'];
						var start_days = parseInt(start_minutes/24/60);
						var start_hours = parseInt((start_minutes - start_days*24*60)/60);
						var end_hours = parseInt((end_minutes - start_days*24*60)/60);
						start_minutes = start_minutes - start_hours*60 - start_days*24*60;
						end_minutes = end_minutes - end_hours*60 - start_days*24*60;
						start_days += 1;
						if(start_minutes < 10){
							start_minutes = '0' + start_minutes;
						}
						if(start_hours < 10){
							start_hours = '0' + start_hours;
						}
						if(end_minutes < 10){
							end_minutes = '0' + end_minutes;
						}
						if(end_hours < 10){
							end_hours = '0' + end_hours;
						}
						var text = ', day' + start_days + ' '+ start_hours + ':' + start_minutes + '~'  + end_hours + ':' + end_minutes;
						return params.data['place'] + text;
					},
				},
			},
			data: [],
		};
		for(let id of id_list){
			var tmp_data = {};
			if(index < id_data[id].length){
				tmp_data['value'] = id_data[id][index][0];
				tmp_data['start'] = id_data[id][index][2];
				tmp_data['end'] = id_data[id][index][3];
				tmp_data['place'] = id_data[id][index][1]; 
				if(id_data[id][index][1] == 'None'){
					tmp_data['itemStyle'] = {opacity : 0};
				}else{
					tmp_data['itemStyle'] = {
						barBorderRadius : 5,
						opacity : 0.8,
						color : colorDic[tmp_data['place']],
					}
				};
				tmp_obj['data'].push(tmp_data);
			}else{
				tmp_obj['data'].push(undefined);
			}
		}
		barData.push(tmp_obj);
		index += 1;
	}
	var yAxisData = [];
	for(let id of id_list){
		yAxisData.push(id);
	}
	// 甘特图基本设置
	var ganttOption = {
		title: {
			show: false,
		},
		textStyle : {
						color : 'black',
						fontStyle : 'italic',
					},
		grid : {
					left: '3%',
					right: '4%',
					top: "1%",
					bottom: '3%',
					containLabel: true
				},
		xAxis : {
			type : 'value',
			// name : '时间',
			position : 'top',
			nameTextStyle : {
				color : 'black',
				fontStyle : 'italic',
				fontSize : 12,
			},
			splitNumber : 7,
			axisLabel : {
				formatter : function(value,index){
					var minutes = Number(value) + min_time;				
					var days = parseInt(minutes/24/60);
					var hours = parseInt((minutes - days*24*60)/60);
					minutes = minutes - hours*60 - days*24*60;
					days += 1;
					if(minutes < 10){
						minutes = '0' + minutes;
					}
					if(hours < 10){
						hours = '0' + hours;
					}
					var text = 'day' + days + ' '+ hours + ':' + minutes;
					return text; 
					// return Number(value) + min_time;
				} 
			},
			splitLine: {
				show: false
			},
		},
		yAxis : {
			type : 'category',
			name : 'id',
			nameTextStyle : {
				color : 'black',
				fontStyle : 'italic',
				fontSize : 12,
			},
			splitLine: {
				show: false
			},
			inverse : true,
			data : yAxisData,
		},
		dataZoom : [{
			type : 'slider',
			yAxisIndex : 0,
			startValue : 0,
			endValue : 29,
			showDataShadow : false,
			showDetail : false,
			handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
			handleSize: '80%',
			width : '20px',
			handleStyle: {
				color: '#fff',
				shadowBlur: 3,
				shadowColor: 'rgba(0, 0, 0, 0.6)',
				shadowOffsetX: 2,
				shadowOffsetY: 2,
				opacity : 0.6,
			}
		},{
			type : 'inside',
			yAxisIndex : 0,
		}
		],
		series : barData,
	}
	// console.log('id_data');
	// console.log(id_data);
	// console.log(barData);
	// console.log(id_list);
	// 生成视图
	ganttChart.setOption(ganttOption);
	// 绑定鼠标点击事件
	ganttChart.on('click',function(params){
		if(params['seriesType'] == 'bar'){
			var selected_id = params['name'];
			Observer.fireEvent("selectedSingleId",selected_id,Gantt);
			console.log('selecte single id in gantt');
			console.log(selected_id);
			console.log(params);
		}
	})

	gantt.onMessage = function(message, data, from){
		// 框选 或者 选择某一类人员id数组
		if(message == "selectid" || message == "selectClusterid"){
			if(from == Cluster && data.length > 0){
				console.log('get id from cluster');
				console.log(data);
				id_list = [];
				if(data.length == 0){
					for(let id of day1cluster_dic["1"]){
						id_list.push(id.toString());
					}		
				}else{
					for(let id of data){
						id_list.push(id.toString());
					}
				}
				id_data = {};
				for(let id of id_list){
					id_data[id] = [];
				}
				// 统计最小时间
				var min_time = 999999;
				for(let id of id_list){
					if(min_time > gantt_data[id][0][0]){
						min_time = gantt_data[id][0][0];
					}
				}
				// 统计长度
				for(let id of id_list){
					if(gantt_data[id][0][0] > min_time){
						id_data[id].push([gantt_data[id][0][0] - min_time,'None',min_time,gantt_data[id][0][0]]);			
					}
					index = 1;
					while(index < gantt_data[id].length -1){
						if(gantt_data[id][index + 1][0] > 48*60 && gantt_data[id][index][0] <= 24*60){
							id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
						}else if(gantt_data[id][index + 1][0] > 24*60 && gantt_data[id][index][0] <= 24*60){
							id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
						}else if(gantt_data[id][index + 1][0] > 48*60 && gantt_data[id][index][0] <= 48*60){
							id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
						}else if(gantt_data[id][index + 1][0] > gantt_data[id][index][0] + 1){
							id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], gantt_data[id][index][1], gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
						}
						index += 1;
					}
				}

				// 转换数据格式:
				barData = [];
					// 统计最长的堆栈
				var max_length = 0
				for(let id in id_data){
					if(max_length < id_data[id].length){ max_length = id_data[id].length;}
				}
				var index = 0;
				while(index < max_length){
					var tmp_obj = {
						name: '数据',
						type: 'bar',
						stack:  '总量',
						barGap : '5%',
						label : {
							emphasis : {
								show : true,
								fontStyle : 'italic',
								color : 'black',
								formatter : function(params){
									var start_minutes = params.data['start'];
									var end_minutes = params.data['end'];
									var start_days = parseInt(start_minutes/24/60);
									var start_hours = parseInt((start_minutes - start_days*24*60)/60);
									var end_hours = parseInt((end_minutes - start_days*24*60)/60);
									start_minutes = start_minutes - start_hours*60 - start_days*24*60;
									end_minutes = end_minutes - end_hours*60 - start_days*24*60;
									start_days += 1;
									if(start_minutes < 10){
										start_minutes = '0' + start_minutes;
									}
									if(start_hours < 10){
										start_hours = '0' + start_hours;
									}
									if(end_minutes < 10){
										end_minutes = '0' + end_minutes;
									}
									if(end_hours < 10){
										end_hours = '0' + end_hours;
									}
									var text = ', day' + start_days + ' '+ start_hours + ':' + start_minutes + '~'  + end_hours + ':' + end_minutes;
									return params.data['place'] + text;
								},
							},
						},
						large : true,
						data: [],
					};
					for(let id of id_list){
						var tmp_data = {};
						if(index < id_data[id].length){
							tmp_data['value'] = id_data[id][index][0];
							tmp_data['start'] = id_data[id][index][2];
							tmp_data['end'] = id_data[id][index][3];
							tmp_data['place'] = id_data[id][index][1]; 
							if(id_data[id][index][1] == 'None'){
								tmp_data['itemStyle'] = {opacity : 0};
							}else{
								tmp_data['itemStyle'] = {
									barBorderRadius : 5,
									opacity : 0.8,
									color : colorDic[tmp_data['place']],
								}
							};
							tmp_obj['data'].push(tmp_data);
						}else{
							tmp_obj['data'].push(undefined);
						};
					}
					barData.push(tmp_obj);
					index += 1;
				}
				var yAxisData = [];
				for(let id of id_list){
					yAxisData.push(id);
				}
				// console.log('id_data');
				// console.log(id_data);
				// console.log(barData);
				// console.log(id_list);
				ganttChart.dispose();
				ganttChart = echarts.init(document.getElementById('gantt'));
				var ganttOption = {
					title: {
						show: false,
					},
					textStyle : {
									color : 'black',
									fontStyle : 'italic',
								},
					grid : {
								left: '3%',
								right: '4%',
								top: "1%",
								bottom: '3%',
								containLabel: true
							},
					xAxis : {
						type : 'value',
						// name : '时间',
						position : 'top',
						nameTextStyle : {
							color : 'black',
							fontStyle : 'italic',
							fontSize : 12,
						},
						splitNumber : 7,
						axisLabel : {
							formatter : function(value,index){
								var minutes = Number(value) + min_time;				
								var days = parseInt(minutes/24/60);
								var hours = parseInt((minutes - days*24*60)/60);
								minutes = minutes - hours*60 - days*24*60;
								days += 1;
								if(minutes < 10){
									minutes = '0' + minutes;
								}
								if(hours < 10){
									hours = '0' + hours;
								}
								var text = 'day' + days + ' '+ hours + ':' + minutes;
								return text; 
								// return Number(value) + min_time;
							} 
						},
						splitLine: {
							show: false
						},
					},
					yAxis : {
						type : 'category',
						name : 'id',
						nameTextStyle : {
							color : 'black',
							fontStyle : 'italic',
							fontSize : 12,
						},
						splitLine: {
							show: false
						},
						inverse : true,
						data : yAxisData,
					},
					dataZoom : [{
						type : 'slider',
						yAxisIndex : 0,
						startValue : 0,
						endValue : 29,
						showDataShadow : false,
						showDetail : false,
						handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
						handleSize: '80%',
						width : '20px',
						handleStyle: {
							color: '#fff',
							shadowBlur: 3,
							shadowColor: 'rgba(0, 0, 0, 0.6)',
							shadowOffsetX: 2,
							shadowOffsetY: 2,
							opacity : 0.6,
						}
					},{
						type : 'inside',
						yAxisIndex : 0,
					}
					],
					series : barData,
				}
				// ganttChart.setOption({
				// 	yAxis : {
				// 		data : yAxisData,
				// 	},
				// 	series : barData,
				// })
					// 生成视图
				ganttChart.setOption(ganttOption);
				// 绑定鼠标点击事件
				ganttChart.on('click',function(params){
					if(params['seriesType'] == 'bar'){
						var selected_id = params['name'];
						Observer.fireEvent("selectedSingleId",selected_id,Gantt);
						console.log('selecte single id in gantt');
						console.log(selected_id);
						console.log(params);
					}
				})
			}
		}
		// 箱型图选择异常点的id数组
		if(message == "selectedOutliers"){
			if(from == Boxplot){
				// console.log('selectedOutliers in gantt');
				// console.log(data);
				if(data.length > 0){
					// 将id list 重新排序
					var tmp_id_list = [];
					for(let id of data){
						tmp_id_list.push(id);
					}
					for(let id of id_list){
						if(tmp_id_list.indexOf(id) < 0){
							tmp_id_list.push(id);
						}
					}
					
					id_data = {};
					for(let id of tmp_id_list){
						id_data[id] = [];
					}
					// 统计最小时间
					var min_time = 999999;
					for(let id of tmp_id_list){
						if(min_time > gantt_data[id][0][0]){
							min_time = gantt_data[id][0][0];
						}
					}
					// 统计长度
					for(let id of tmp_id_list){
						if(gantt_data[id][0][0] > min_time){
							id_data[id].push([gantt_data[id][0][0] - min_time,'None',min_time,gantt_data[id][0][0]]);			
						}
						index = 1;
						while(index < gantt_data[id].length -1){
							if(gantt_data[id][index + 1][0] > 48*60 && gantt_data[id][index][0] <= 24*60){
								id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
							}else if(gantt_data[id][index + 1][0] > 24*60 && gantt_data[id][index][0] <= 24*60){
								id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
							}else if(gantt_data[id][index + 1][0] > 48*60 && gantt_data[id][index][0] <= 48*60){
								id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
							}else if(gantt_data[id][index + 1][0] > gantt_data[id][index][0] + 1){
								id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], gantt_data[id][index][1], gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
							}
							index += 1;
						}
					}
	
					// 转换数据格式:
					barData = [];
						// 统计最长的堆栈
					var max_length = 0
					for(let id in id_data){
						if(max_length < id_data[id].length){ max_length = id_data[id].length;}
					}
					index = 0;
					while(index < max_length){
						var tmp_obj = {
							name: '数据',
							type: 'bar',
							stack:  '总量',
							barGap : '5%',
							label : {
								emphasis : {
									show : true,
									fontStyle : 'italic',
									color : 'black',
									formatter : function(params){
										var start_minutes = params.data['start'];
										var end_minutes = params.data['end'];
										var start_days = parseInt(start_minutes/24/60);
										var start_hours = parseInt((start_minutes - start_days*24*60)/60);
										var end_hours = parseInt((end_minutes - start_days*24*60)/60);
										start_minutes = start_minutes - start_hours*60 - start_days*24*60;
										end_minutes = end_minutes - end_hours*60 - start_days*24*60;
										start_days += 1;
										if(start_minutes < 10){
											start_minutes = '0' + start_minutes;
										}
										if(start_hours < 10){
											start_hours = '0' + start_hours;
										}
										if(end_minutes < 10){
											end_minutes = '0' + end_minutes;
										}
										if(end_hours < 10){
											end_hours = '0' + end_hours;
										}
										var text = ', day' + start_days + ' '+ start_hours + ':' + start_minutes + '~'  + end_hours + ':' + end_minutes;
										return params.data['place'] + text;
									},
								},
							},
							large : true,
							data: [],
						};
						for(let id of tmp_id_list){
							var tmp_data = {};
							if(index < id_data[id].length){
								tmp_data['value'] = id_data[id][index][0];
								tmp_data['start'] = id_data[id][index][2];
								tmp_data['end'] = id_data[id][index][3];
								tmp_data['place'] = id_data[id][index][1]; 
								if(id_data[id][index][1] == 'None'){
									tmp_data['itemStyle'] = {opacity : 0};
								}else{
									tmp_data['itemStyle'] = {
										barBorderRadius : 5,
										opacity : 0.8,
										color : colorDic[tmp_data['place']],
									}
								};
								tmp_obj['data'].push(tmp_data);
							}else{
								tmp_obj['data'].push(undefined);
							}
						}
						barData.push(tmp_obj);
						index += 1;
					}
					var yAxisData = [];
					for(let id of tmp_id_list){
						if(data.indexOf(id) >= 0){
							yAxisData.push({
								value : id,
								textStyle : {
									color : 'red',
								}
							})
						}else{
							yAxisData.push(id);
						}
					}
					// 添加背景框
					var tmp_obj = {
						name: '背景框',
						type: 'bar',
						label: {
							normal: {
								show: false,
								position: 'insideRight'
							}
						},
						barGap : '-100%',
						silent : true,
						itemStyle : {
							color : 'gray',
							opacity : 0.1,
							shadowColor: 'rgba(0, 0, 0, 0.5)',
							shadowBlur: 5,
						},
						data : [],
					};
					for(let id of tmp_id_list){
						if(data.indexOf(id) >= 0){
							tmp_obj['data'].push(3200)							
						}else{
							tmp_obj['data'].push(0)
						}
					}
					barData.push(tmp_obj);
					ganttChart.dispose();
					ganttChart = echarts.init(document.getElementById('gantt'));
					var ganttOption = {
						title: {
							show: false,
						},
						textStyle : {
										color : 'black',
										fontStyle : 'italic',
									},
						grid : {
									left: '3%',
									right: '4%',
									top: "1%",
									bottom: '3%',
									containLabel: true
								},
						xAxis : {
							type : 'value',
							// name : '时间',
							position : 'top',
							nameTextStyle : {
								color : 'black',
								fontStyle : 'italic',
								fontSize : 12,
							},
							splitNumber : 7,
							axisLabel : {
								formatter : function(value,index){
									var minutes = Number(value) + min_time;				
									var days = parseInt(minutes/24/60);
									var hours = parseInt((minutes - days*24*60)/60);
									minutes = minutes - hours*60 - days*24*60;
									days += 1;
									if(minutes < 10){
										minutes = '0' + minutes;
									}
									if(hours < 10){
										hours = '0' + hours;
									}
									var text = 'day' + days + ' '+ hours + ':' + minutes;
									return text; 
									// return Number(value) + min_time;
								} 
							},
							splitLine: {
								show: false
							},
						},
						yAxis : {
							type : 'category',
							name : 'id',
							nameTextStyle : {
								color : 'black',
								fontStyle : 'italic',
								fontSize : 12,
							},
							splitLine: {
								show: false
							},
							inverse : true,
							data : yAxisData,
						},
						dataZoom : [{
							type : 'slider',
							yAxisIndex : 0,
							startValue : 0,
							endValue : 29,
							showDataShadow : false,
							showDetail : false,
							handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
							handleSize: '80%',
							width : '20px',
							handleStyle: {
								color: '#fff',
								shadowBlur: 3,
								shadowColor: 'rgba(0, 0, 0, 0.6)',
								shadowOffsetX: 2,
								shadowOffsetY: 2,
								opacity : 0.6,
							}
						},{
							type : 'inside',
							yAxisIndex : 0,
						}
						],
						series : barData,
					}
					// ganttChart.setOption({
					// 	yAxis : {
					// 		data : yAxisData,
					// 	},
					// 	series : barData,
					// })
						// 生成视图
					ganttChart.setOption(ganttOption);
					// 绑定鼠标点击事件
					ganttChart.on('click',function(params){
						if(params['seriesType'] == 'bar'){
							var selected_id = params['name'];
							Observer.fireEvent("selectedSingleId",selected_id,Gantt);
							console.log('selecte single id in gantt');
							console.log(selected_id);
							console.log(params);
						}
					})

				}
			}
		}
	}
	
    Observer.addView(gantt);
    return gantt;
}

function selectId(event){
	if (event.keyCode == 13) {
		var value = document.getElementById("peopleId").value;
		ObserverCopy.fireEvent("selectedSingleId", value, Gantt);
	}
}

var test_id_list_in_gantt = ['13563', '10019', '12726', '16099', '11496', '11662', '18185', '15062', '12854', '17787', '16700', '12555', '16977', '17822', '17378', '18607', '12832', '14257', '10427', '13578', '10309', '18869', '19137', '17662', '11317', '18294', '14582', '13205', '10463', '17306', '12320', '14255', '11221', '16652', '10633', '11383', '15893', '19886', '10996', '12019', '18811', '10705', '18062', '16837', '12442', '15387', '11169', '17704', '12527', '17512', '19514', '18246', '19479'];

function DirectGantt(id_list){

	ganttChart.dispose();
	ganttChart = echarts.init(document.getElementById('gantt'));	var id_data = {};
	
	for(let id of id_list){
		id_data[id] = [];
	}
	// 统计最小时间
	var min_time = 999999;
	for(let id of id_list){
		if(min_time > gantt_data[id][0][0]){
			min_time = gantt_data[id][0][0];
		}
	}
	// 统计长度
	for(let id of id_list){
		if(gantt_data[id][0][0] > min_time){
			id_data[id].push([gantt_data[id][0][0] - min_time,'None',min_time,gantt_data[id][0][0]]);			
		}
		index = 1;
		while(index < gantt_data[id].length -1){
			if(gantt_data[id][index + 1][0] > 48*60 && gantt_data[id][index][0] <= 24*60){
				id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
			}else if(gantt_data[id][index + 1][0] > 24*60 && gantt_data[id][index][0] <= 24*60){
				id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
			}else if(gantt_data[id][index + 1][0] > 48*60 && gantt_data[id][index][0] <= 48*60){
				id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], 'None',gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
			}else if(gantt_data[id][index + 1][0] > gantt_data[id][index][0] + 1){
				id_data[id].push([gantt_data[id][index + 1][0] - gantt_data[id][index][0], gantt_data[id][index][1], gantt_data[id][index][0], gantt_data[id][index + 1][0]]);
			}
			index += 1;
		}
	}

	// 转换数据格式:
	var barData = []
		// 统计最长的堆栈
	var max_length = 0
	for(let id in id_data){
		if(max_length < id_data[id].length){ max_length = id_data[id].length;}
	}
	index = 0;
	while(index < max_length){
		var tmp_obj = {
			name: '数据',
			type: 'bar',
			stack:  '总量',
			barGap : '5%',
			large : true,
			label : {
				emphasis : {
					show : true,
					fontStyle : 'italic',
					color : 'black',
					formatter : function(params){
						var start_minutes = params.data['start'];
						var end_minutes = params.data['end'];
						var start_days = parseInt(start_minutes/24/60);
						var start_hours = parseInt((start_minutes - start_days*24*60)/60);
						var end_hours = parseInt((end_minutes - start_days*24*60)/60);
						start_minutes = start_minutes - start_hours*60 - start_days*24*60;
						end_minutes = end_minutes - end_hours*60 - start_days*24*60;
						start_days += 1;
						if(start_minutes < 10){
							start_minutes = '0' + start_minutes;
						}
						if(start_hours < 10){
							start_hours = '0' + start_hours;
						}
						if(end_minutes < 10){
							end_minutes = '0' + end_minutes;
						}
						if(end_hours < 10){
							end_hours = '0' + end_hours;
						}
						var text = ', day' + start_days + ' '+ start_hours + ':' + start_minutes + '~'  + end_hours + ':' + end_minutes;
						return params.data['place'] + text;
					},
				},
			},
			data: [],
		};
		for(let id of id_list){
			var tmp_data = {};
			if(index < id_data[id].length){
				tmp_data['value'] = id_data[id][index][0];
				tmp_data['start'] = id_data[id][index][2];
				tmp_data['end'] = id_data[id][index][3];
				tmp_data['place'] = id_data[id][index][1]; 
				if(id_data[id][index][1] == 'None'){
					tmp_data['itemStyle'] = {opacity : 0};
				}else{
					tmp_data['itemStyle'] = {
						barBorderRadius : 5,
						opacity : 0.8,
						color : colorDic[tmp_data['place']],
					}
				};
				tmp_obj['data'].push(tmp_data);
			}else{
				tmp_obj['data'].push(undefined);
			}
		}
		barData.push(tmp_obj);
		index += 1;
	}
	var yAxisData = [];
	for(let id of id_list){
		yAxisData.push(id);
	}
	// 甘特图基本设置
	var ganttOption = {
		title: {
			show: false,
		},
		textStyle : {
						color : 'black',
						fontStyle : 'italic',
					},
		grid : {
					left: '3%',
					right: '4%',
					top: "1%",
					bottom: '3%',
					containLabel: true
				},
		xAxis : {
			type : 'value',
			// name : '时间',
			position : 'top',
			nameTextStyle : {
				color : 'black',
				fontStyle : 'italic',
				fontSize : 12,
			},
			splitNumber : 7,
			axisLabel : {
				formatter : function(value,index){
					var minutes = Number(value) + min_time;				
					var days = parseInt(minutes/24/60);
					var hours = parseInt((minutes - days*24*60)/60);
					minutes = minutes - hours*60 - days*24*60;
					days += 1;
					if(minutes < 10){
						minutes = '0' + minutes;
					}
					if(hours < 10){
						hours = '0' + hours;
					}
					var text = 'day' + days + ' '+ hours + ':' + minutes;
					return text; 
					// return Number(value) + min_time;
				} 
			},
			splitLine: {
				show: false
			},
		},
		yAxis : {
			type : 'category',
			name : 'id',
			nameTextStyle : {
				color : 'black',
				fontStyle : 'italic',
				fontSize : 12,
			},
			splitLine: {
				show: false
			},
			inverse : true,
			data : yAxisData,
		},
		dataZoom : [{
			type : 'slider',
			yAxisIndex : 0,
			startValue : 0,
			endValue : 29,
			showDataShadow : false,
			showDetail : false,
			handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
			handleSize: '80%',
			width : '20px',
			handleStyle: {
				color: '#fff',
				shadowBlur: 3,
				shadowColor: 'rgba(0, 0, 0, 0.6)',
				shadowOffsetX: 2,
				shadowOffsetY: 2,
				opacity : 0.6,
			}
		},{
			type : 'inside',
			yAxisIndex : 0,
		}
		],
		series : barData,
	}
	// 生成视图
	ganttChart.setOption(ganttOption);
	// 绑定鼠标点击事件
	ganttChart.on('click',function(params){
		if(params['seriesType'] == 'bar'){
			var selected_id = params['name'];
			ObserverCopy.fireEvent("selectedSingleId",selected_id,Gantt);
			console.log('selecte single id in gantt');
			console.log(selected_id);
			console.log(params);
		}
	})
}

