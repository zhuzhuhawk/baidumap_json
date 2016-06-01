function MapHelper() { };
	MapHelper.Map;
	MapHelper.data;
	MapHelper.IntMapCanvas = function(dbLng, dbLat, nZoomSize, divMapCanvas, bState) {
	MapHelper.Map = new BMap.Map(divMapCanvas);
	var latlng = new BMap.Point(dbLng, dbLat);
	MapHelper.Map.centerAndZoom(latlng, nZoomSize);
	MapHelper.Map.enableScrollWheelZoom();
	MapHelper.Map.disableDoubleClickZoom();
	var opts = { type: BMAP_NAVIGATION_CONTROL_SMALL };
	MapHelper.Map.addControl(new BMap.NavigationControl(opts));
	if (bState) {
		MapHelper.Map.addEventListener("click", function(event) { alert(event.point.lng + "---" + event.point.lat); });
	}
	MapHelper.IntViewPort();
	MapHelper.Map.addEventListener("dragend", function() { MapHelper.IntViewPort(); });
	MapHelper.Map.addEventListener("zoomend", function() {
		if (MapHelper.Map.getZoom() < 12) {
			$("#list_panel").hide();
			$("#region_panel").show();
			MapHelper.Map.clearOverlays();
		}else {
			$("#list_panel").show();
			$("#region_panel").hide();
			MapHelper.IntViewPort();
		}
	});
	$("#divMapCanvas").css({ height: $(window).height() - 87 + "px", width: $(window).width() - 381 + "px" });
	$("#i_shadow").css({ left: $(window).width() - 386 + "px" });
}
MapHelper.IntViewPort = function() {
	var bounds = MapHelper.Map.getBounds();
	var dbSouthWestLng = bounds.getSouthWest().lng;
	var dbSouthWestLat = bounds.getSouthWest().lat;
	var dbNorthEastLng = bounds.getNorthEast().lng;
	var dbNorthEastLat = bounds.getNorthEast().lat;
	var para = { "dbSouthWestLng": dbSouthWestLng, "dbSouthWestLat": dbSouthWestLat, "dbNorthEastLng": dbNorthEastLng, "dbNorthEastLat": dbNorthEastLat };
	if (MapHelper.Map.getZoom() < 12) {
		$("#list_panel").hide();
		$("#region_panel").show();
		MapHelper.Map.clearOverlays();
		return;
	}
	// $.getJSON("/map/map_show/?time="+Math.random()*9,para,function(JsonData){
	$.getJSON("http://localhost/test/map/b.json",para,function(JsonData){
		MapHelper.data = eval(JsonData); //保存本地数据用排序
		MapHelper.DrawMarker(eval(JsonData));
	});
}
MapHelper.IntViewSearch = function() {
	var bounds = MapHelper.Map.getBounds();
	var para = {txtKeyWord: $("#txtKeyWord").val() };
	if (MapHelper.Map.getZoom() < 12) {
		$("#list_panel").hide();
		$("#region_panel").show();
		MapHelper.Map.clearOverlays();
		return;
	}
	// $.getJSON("http://localhost/test/map/a.json?time="+Math.random()*9,para,function(JsonData){
	$.getJSON("http://localhost/test/map/a.json",para,function(JsonData){
		MapHelper.data = eval(JsonData); //保存本地数据用排序
		MapHelper.DrawMarker(eval(JsonData));
	});
}
MapHelper.DrawMarker = function(data) {
	$("#lp_count").text(data.length);
	MapHelper.Map.clearOverlays();
	var latlng, html, divMarker, text="";
	MapWindows.Hide();
	$("#map_pan_list").html("");
	$.each(data, function(i, item){
		latlng = new BMap.Point(item.LocationLng, item.LocationLat);
		switch(item.type){
			case "1":
				html = "<div onclick=\"MapWindows.Show(" + item.id + "," + item.LocationLng + "," + item.LocationLat + "," + i + ")\" onmouseout=\"HtmlMarker.Hover(this)\" onmouseover=\"HtmlMarker.Active(this);\" style=\"position:absolute\" class=\"markerA marker_hoverA\"><div class=\"marker_bgA\">" + item.title + "</div></div>";
				break;
			case "2":
				html = "<div onclick=\"MapWindows.Show(" + item.id + "," + item.LocationLng + "," + item.LocationLat + "," + i + ")\" onmouseout=\"HtmlMarker.Hover(this)\" onmouseover=\"HtmlMarker.Active(this);\" style=\"position:absolute\" class=\"markerB marker_hoverB\"><div class=\"marker_bgB\">" + item.title + "</div></div>";
				break;
			case "3":
				html = "<div onclick=\"MapWindows.Show(" + item.id + "," + item.LocationLng + "," + item.LocationLat + "," + i + ")\" onmouseout=\"HtmlMarker.Hover(this)\" onmouseover=\"HtmlMarker.Active(this);\" style=\"position:absolute\" class=\"markerC marker_hoverC\"><div class=\"marker_bgC\">" + item.title + "</div></div>";
				break;
			case "4":
				html = "<div onclick=\"MapWindows.Show(" + item.id + "," + item.LocationLng + "," + item.LocationLat + "," + i + ")\" onmouseout=\"HtmlMarker.Hover(this)\" onmouseover=\"HtmlMarker.Active(this);\" style=\"position:absolute\" class=\"markerD marker_hoverD\"><div class=\"marker_bgD\">" + item.title + "</div></div>";
				break;
			default:
				html = "";
		}
		text += " <li onmouseover=\"this.className='list_li  fix actived';\" onmouseout=\"this.className='list_li  fix';\" link=\""+item.url+"\" id=\"LP_"+item.id+"\" lpid=\""+item.id+"\" class=\"list_li  fix\">";
		text += " <a target=\"_blank\" href=\""+item.url+"\" class=\"a_img\"><img width=\"87\" height=\"67\" src=\""+item.img+"\"></a>";
		text += "<dl class=\"dl_info\">";
		text += "<dt class=\"dt_01\"><a href=\""+item.url+"\" target=\"_blank\">"+item.title+"</a></dt>";
		text += "<dd class=\"dd_02\">"+item.address+"</dd>";
		text += "<dd class=\"dd_03\">"+item.decorate+"</dd>";
		text += "<dd class=\"dd_pri\"><i class=\"i_col\">"+item.price+"</i> 元/平米</dd>";
		text += "</dl></li>";
		var overlay = new HtmlMarkerOverlay(latlng, html);
		setTimeout(function() { MapHelper.Map.addOverlay(overlay);  }, i * 100);
	});
	$("#map_pan_list").html(text);
}
function AjaxHelper() { }
AjaxHelper.ObtainJsonContent = function(url, para, cllback) {
	$.getJSON(url, para, function(data) {
		cllback(data);
	});
}
function HtmlMarkerOverlay(latlng, html) {
	this._latlng = latlng;
	this._html = html;
}
HtmlMarkerOverlay.prototype = new BMap.Overlay();
HtmlMarkerOverlay.prototype.initialize = function() {
	this._map = MapHelper.Map;
	var div = document.createElement("div");
	div.style.position = "absolute";
	div.innerHTML = this._html;
	MapHelper.Map.getPanes().markerPane.appendChild(div);
	this._div = div;
	return div;
}
HtmlMarkerOverlay.prototype.draw = function() {
	var position = this._map.pointToOverlayPixel(this._latlng);
	this._div.style.left = position.x + "px";
	this._div.style.top = position.y + "px";
}
function MapArea() { }
MapArea.m_element = "#tool_area_pop";
MapArea.m_sort = 0;
MapArea.m_scale = 0;
MapArea.Over = function(){
	$(MapArea.m_element).css({ display: "block" });
	document.getElementById("tool_area").className = "tool_area tool_hover";
}
MapArea.Out = function() {
	$(MapArea.m_element).css({ display: "none" });
	document.getElementById("tool_area").className = "tool_area";
}
MapArea.Indicator = function(obj) {
	if (MapArea.m_scale == 0) {
		obj.className = "tit_close";
		MapArea.m_scale = 1;
		$("#chart").css({ height: 22});
	}
	else if (MapArea.m_scale == 1) {
		obj.className = "tit";
		MapArea.m_scale = 0;
		$("#chart").css({ height: 120 });
	}
}
MapArea.Click = function(dbLng, dbLat, zoom, obj) {
	var latlng = new BMap.Point(dbLng, dbLat);
	MapHelper.Map.centerAndZoom(latlng, zoom);
	$("#tool_area").text(obj.innerHTML);
	MapArea.Out();
}
MapArea.DisClose = function(flag) {
	if (flag == 0) MapHelper.data.sort(function(a, b) { return a.price < b.price; });
	if (flag == 1) MapHelper.data.sort(function(a, b) { return a.price > b.price; });
	MapHelper.DrawMarker(MapHelper.data);
}
MapArea.Sort = function(obj){
	if (MapArea.m_sort == 0){
		obj.className = "sort_off sort_up";
		MapArea.m_sort = 1;
		MapArea.DisClose(0);
	}
	else if (MapArea.m_sort == 1) {
		obj.className = "sort_off sort_down";
		MapArea.m_sort = 0;
		MapArea.DisClose(1);
	}
}
function HtmlMarker() { }
HtmlMarker.Active = function(obj) {
	obj.style.zIndex = 200;
}
HtmlMarker.Hover = function(obj){
	obj.style.zIndex = 100;
}
function MapWindows() { }
MapWindows.MapWindow = "#divMapPop";
MapWindows.lat = 0;
MapWindows.lng = 0;
MapWindows.id = 0;
MapWindows.marker=0;
MapWindows.Show = function(id, lng, lat, mk){
	MapWindows.id = id;
	MapWindows.lat = lat;
	MapWindows.lng = lng;
	MapWindows.GetDetail();
	var pos = MapHelper.Map.pointToPixel(new BMap.Point(lng, lat));
	var w = $(window).width() - 381 - (pos.x + 59);
	var h = $(window).height() - 87 - (pos.y + 30);
	if (w < 405) {
		MapHelper.Map.panBy(-(405 - w), 0);
		$(MapWindows.MapWindow).css({ top: pos.y + 11 + "px", left: pos.x + 63 - (405 - w) + "px" });
	}
	//    else if (h < 232)
	//    {
	//        MapHelper.Map.panBy(0, -(232-h));
	//        //$(MapWindows.MapWindow).css({ top: pos.y + 10 + "px", left: pos.x + 59 + "px" });
	//    }
	else
		$(MapWindows.MapWindow).css({ top: pos.y + 11 + "px", left: pos.x + 63+ "px" });
	$(MapWindows.MapWindow).show();
}
MapWindows.Hide = function(){
	MapWindows.id = 0;
	MapWindows.marker.className = "MarkerHover FontStyle";
	$(MapWindows.MapWindow).hide();
}
MapWindows.GetDetail = function(){
    var para = { "id": MapWindows.id };
    /*异步数据*/
    // AjaxHelper.ObtainJsonContent("/map/map_info",para, MapWindows.FillContainer);
    // AjaxHelper.ObtainJsonContent("http://loupan.xtfw.cn/map/map_info",para, MapWindows.FillContainer);
    AjaxHelper.ObtainJsonContent("http://localhost/test/map/map_info.js",para, MapWindows.FillContainer);
	/*异步数据*/
	//AjaxHelper.ObtainJsonContent("/serv/data.php",para, MapWindows.FillContainer);
	/*测试数据*/
	//var data = { "id": MapWindows.id, price: 5000, text: "绿地国际金融城", address: "武昌和平大道三角路", img: "http://c.pic1.ajkimg.com/display/xfnew/68b2b9eb69718c3757ea96e153cd30e0/480x336c.jpg" };
	//MapWindows.FillContainer(data);
}
MapWindows.FillContainer = function(data)
{
    var content = "";
    content += "<div class=\"m_content\">";
    content += "<a href=\""+data.url+"\" class=\"m_img\" target=\"_blank\"><img class=\"m_a_img\" width=\"122\" height=\"94\" src=\""+data.img+"\" /></a>";
    content += "<dl class=\"m_box\">";
    content += "<dt class=\"dt_001\"><b><a href=\""+data.url+"\" target=\"_blank\" class=\"m_cname\">"+data.title+"</a></b></dt>";
    content += "<dd class=\"dd_002\">价格：<span>"+data.price+"</span>元/平米</dd>";
    content += "<dd class=\"dd_003\">地址：<span>" + data.address + "</span></dd>";
    content += "<dd class=\"dd_004\"><i class=\"i_con i_type\">"+data.decorate+"</i> <i class=\"i_con i_buil\">"+data.structure+"</i></dd>";
    content += "<dd class=\"dd_005\"><a href=\""+data.url+"\" class=\"m_detail\" target=\"_blank\">查看详情&nbsp;&gt;&gt;</a></dd>";
    content += "</dl>";
    content += "<div class=\"m_close\" onclick=\"MapWindows.Hide()\"  id=\"m_close\"></div>";
    content += "</div></div>";
    $("#divMapPop").html(content);
}
