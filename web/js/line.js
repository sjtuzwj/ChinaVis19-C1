function Line(Observer) {
    var line = {};
	
    var line = {};
	
    var lineChart = echarts.init(document.getElementById('line'));
    var legend_list = [
        "MAIN",
        "PSA",
        "PSB",
        "PSC",
        "PSD",
        "ROOM1",
        "ROOM2",
        "ROOM3",
        "ROOM4",
        "ROOM5",
        "ROOM6",
        "WC1",
        "WC2",
        "WC3",
        "POSTER",
        "SERVE",
        "CANTEEN",
        "CI",
        "ENTERTAIN",
        "EXHIBITION",
        "TOPLD1",
        "TOPLD2",
        "BOTLD1",
        "BOTLD2",
        "CIENTRY1",
        "CIENTRY2",
        "CIENTRY3",
        "CIENTRY4",
        "MAINEXIT",
        "EXHEXIT1",
        "EXHEXIT2",
        "CIEXIT1",
        "AISLE1",
        "AISLE2"
      ];
    
    // 选中的legend
    var selected_legend = {};
    for(let legend of legend_list){
        selected_legend[legend] = false;
    }
    selected_legend['MAIN'] = true;
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
	};
    var color_list = []
    for(let item of legend_list){
        color_list.push(colorDic[item]);
    };
    var series_data = [];
    var categories_list = [];
    for(var key in refined_day1_data['MAINEXIT']){
        categories_list.push(key);
    };
    for(var key of legend_list){
        if(legend_list.indexOf(key) >= 0){
            var line_data = {};
            line_data['name'] = key;
            line_data['type'] = 'line';
            line_data['data'] = [];
            for(var t in refined_day1_data[key]){
                line_data['data'].push(refined_day1_data[key][t])
            }
            series_data.push(line_data);
        };
    };

    var lineOption = {
        title: {
        },
        grid : {
            left: '1%',
            right: '1%',
            top: "25%",
            bottom: '1%',
            containLabel: true
        },
        legend : {
            type : 'scroll',
            icon : 'rect',
            itemWidth : 20,
            itemHeight : 10,
            data : legend_list,
            selected: selected_legend,
        },
        color : color_list,
        textStyle : {
                        color : 'black',
                        fontStyle : 'italic',
                    },
        tooltip : {
            trigger : 'axis',
            formatter : function(params){
                var minutes = Number(params[0]['axisValue']);
                var hours = parseInt(minutes/60);
                minutes = minutes - hours*60;
                if(minutes < 10){
                    minutes = '0' + minutes;
                }
                if(hours < 10){
                    hours = '0' + hours;
                }
                var time_text = hours + ':' + minutes;
                var tip = '时间:  ' + time_text;
                for(item of params){
                    var color = item['color'];
                    var markerHtml = echarts.format.getTooltipMarker(color)
                    tip = tip + '<br/>' + markerHtml + item['seriesName'] + ':  ' + item['data'];
                }
                return tip;
            },
        },
        xAxis : {
            type : 'category',
            name : '时间',
            nameTextStyle : {
                color : 'black',
                fontStyle : 'italic',
                fontSize : 12,
            },
            data : categories_list,
            axisLabel : {
                formatter : function(value,index){
                    var minutes = Number(value);
                    var hours = parseInt(minutes/60);
                    minutes = minutes - hours*60;
                    if(minutes < 10){
                        minutes = '0' + minutes;
                    }
                    if(hours < 10){
                        hours = '0' + hours;
                    }
                    var text = hours + ':' + minutes;
                    return text; 
                } 
            },
            splitLine: {
                show: false
            },
        },
        yAxis : {
            type : 'value',
            name : '',
            positon: "left",
            nameTextStyle : {
                color : 'black',
                fontStyle : 'italic',
                fontSize : 12,
            },
            splitLine: {
                show: false
            },
        },
        series : series_data,
    }    
    lineChart.setOption(lineOption);
    
    line.onMessage = function(message, data, from){
		if(message == "selectArea"){
			if(from == Map){	
                console.log(data);
                if(selected_legend[data] == true){
                    selected_legend[data] = false;
                }else{
                    selected_legend[data] = true;
                }
                lineChart.setOption({
                    legend : {selected : selected_legend}
                })
				/* response to the event "selectid" */
			}
		}
		if(message == "selectDay"){
			if(from == Map){	
                console.log(data);
                var refined_day_data;
                if(data == 'day1'){
                    refined_day_data = refined_day1_data;
                }else if(data == 'day2'){
                    refined_day_data = refined_day2_data;
                }else if(data == 'day3'){
                    refined_day_data = refined_day3_data;
                }
                var series_data = [];
                var categories_list = [];
                for(var key in refined_day_data['MAINEXIT']){
                    categories_list.push(key);
                };
                for(var key in refined_day_data){
                    if(legend_list.indexOf(key) >= 0){
                        var line_data = {};
                        line_data['name'] = key;
                        line_data['type'] = 'line';
                        line_data['data'] = [];
                        for(var t in refined_day_data[key]){
                            line_data['data'].push(refined_day_data[key][t])
                        }
                        series_data.push(line_data);
                    };
                };
                lineChart.setOption({
//                     title : {
//                         text : data + '人数折线图',
//                     },
                    series : series_data
                });
			}
		}
	}
	
    Observer.addView(line);
    return line;
}
