function picker_date1() {
	var isBlackberry = Titanium.Platform.name === 'blackberry';
	var scaleX = 1;
	var scaleY = 1;
	if (isBlackberry) {
		scaleX += 1;
		scaleY += 2;
	}
	var win = Ti.UI.createWindow();
	win.backgroundColor = 'black';
	
	var minDate = new Date();
	minDate.setFullYear(2009);
	minDate.setMonth(0);
	minDate.setDate(1);
	
	var maxDate = new Date();
	maxDate.setFullYear(2009);
	maxDate.setMonth(11);
	maxDate.setDate(31);
	
	var value = new Date();
	value.setFullYear(2009);
	value.setMonth(0);
	value.setDate(1);
	
	var picker = Ti.UI.createPicker({
		type:Ti.UI.PICKER_TYPE_DATE,
		minDate:minDate,
		maxDate:maxDate,
		value:value
	});
	
	// turn on the selection indicator (off by default)
	picker.selectionIndicator = true;
	
	win.add(picker);
	
	var label = Ti.UI.createLabel({
		text:'Choose a date',
		top:6 * scaleY,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});
	win.add(label);
	
	picker.addEventListener('change',function(e)
	{
		label.text = e.value.toLocaleString();
	});
	
	var locale = false;
	var localebutton = Ti.UI.createButton({
		title:'Change locale',
		bottom:20 * scaleY,
		width:200 * scaleX,
		height:40 * scaleY
	});
	localebutton.addEventListener('click', function() {
		if (!locale) {
			picker.setLocale('ru');
			locale = true;
		}
		else {
			locale = false;
			picker.setLocale(Titanium.Platform.locale);
		}
	});
	if (isBlackberry) {
		label.left = 10 * scaleX;
		label.width = 200 * scaleX;
		label.height = 40 * scaleY;
		localebutton.top = 200 * scaleY;
		//Review this part when Jira task: TIMOB-9788 will be implemented
		localebutton.enabled = false;
	}
	win.add(localebutton);
	
	return win;
}

module.exports = picker_date1;