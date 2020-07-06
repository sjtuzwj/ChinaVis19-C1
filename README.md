# ChinaVis19-1

## 注意
访问本地json的安全性问题,只能使用远端json  
右键chrome图标选择属性，在“目标/target”那一栏里的最后加上--disable-web-security

## 文件目录
- analysis: 数据分析的脚本等 e.g. python,jupyter notebook
- data
- results: 截图等分析结果
- web: 最终用于展示和交互fen分析的网页应用

## 视图
 - 当前视图有：
   - 地图-map
   - 折线图-line   
   - 聚类视图-cluster (分为了两个div: cluster-overview和cluster-detail)
   - 甘特图-gantt

## 框架说明
- 布局  
div按照视图的名字进行了命名  
样式大小等有需要调整的请修改web/css/main.css文件
- js  
js文件按照同样的名字命名  
请将js代码填入对应文件  
- 交互
  - 发送消息  
例如，当在聚类视图中选中人员时，可以调用下面的语句发送消息
Observer.fireEvent("selectid",[...],Cluster);
参数分别为：消息名字，数据，发送者
  - 接收消息  
例如，如果map要接受Cluster发来的selectid消息，则将要响应的操作写在注释的区域

```javascript
    map.onMessage = function(message, data, from){  
        if(message == "selectid"){  
    		if(from == Cluster){	  
    			/* response to the event "selectid" */
    		}
    	}
    }
```

