function tv_refresh() {
	var isBlackberry = Titanium.Platform.name === 'blackberry';
	//TODO remove this part when TableViewRow will be supported for BlackBerry
	if (isBlackberry) {
		alert('Titanium.UI.TableViewRow is not supported for BlackBerry yet');
		return;
	}
	var win = Ti.UI.createWindow();
	
	
	var tv = Ti.UI.createTableView();
	if (Ti.Platform.osname !== 'mobileweb') {
		if (!isBlackberry)
			tv.style = Titanium.UI.iPhone.TableViewStyle.GROUPED;
	}
	
	function setData()
	{
		var data = [];
		for (var i=0;i<30;i++)
		{
			var row;
			//TODO modify this code back when createTableViewRow() will be implemented
			if (isBlackberry) {
				row = {text:'Label ' +  i, title:'Label ' +  i};
			} else {
				row = Ti.UI.createTableViewRow({height:50});
				var l1 = Ti.UI.createLabel({text:'Label ' +  i, font:{fontSize:14}, color:'#888', left:5});
				row.add(l1);
				var image1 = Ti.UI.createImageView({image:'/images/chat.png', right:5,height:23, width:29});
				row.add(image1);				
			}
			data.push(row);
		}
		tv.setData(data);
	}
	
	var refresh = Titanium.UI.createButton();
	if (Ti.Platform.osname !== 'mobileweb'){
		if (!isBlackberry)
			refresh.systemButton = Titanium.UI.iPhone.SystemButton.REFRESH;
	}
	refresh.addEventListener('click', function()
	{
		tv.setData([]);
		setTimeout(function()
		{
			setData();
		},1000);
	});
	
	if (Ti.Platform.name == 'iPhone OS') {
		win.rightNavButton = refresh;
	} else {
		refresh.top = 5;
		refresh.title = "Refresh";
		refresh.width = 200;
		tv.top = 60;
		win.add(refresh);
	}
	if (isBlackberry) {
		refresh.width = 400;
		refresh.height = 100;
	}
	win.add(tv);
	setData();
	return win;
};

module.exports = tv_refresh;
