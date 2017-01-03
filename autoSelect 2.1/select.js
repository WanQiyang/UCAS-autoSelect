function checkCourse(c,a) {
	var flag=false
	for(var i=0;i<a.length;i++)
		if(a[i]==c) {
			flag=true
			break
		}
	return flag
}

btn=document.getElementsByName("sb");
if(btn[0])
{
	chrome.storage.local.get("isready", function(valueArray) {
		if(valueArray.isready=="ok") {
			if(btn[0].innerHTML=="保存联系方式") {
				//btn[1].disabled=true //For Test
				//setTimeout(function(){ }, 500)
				if(btn[1].disabled)
					location.reload()
				else
					btn[1].click()
				}
			else if(btn[0].innerHTML=="确定提交选课") {
				//select
				chrome.storage.local.get("items", function(valueArray) {
					var a=valueArray.items.split(",")
					var s=document.getElementsByTagName("td")
					var str=""
					var coursecount=0
					for(var i=0;i<s.length;i++)
						if(checkCourse(s[i].innerText,a)) {
							var c=s[i].parentNode.children[0].children[0]
							if(c.disabled==false) {
								c.checked=true
								coursecount++
								str+=(s[i].parentNode.children[2].innerText + " " +s[i].parentNode.children[3].innerText+"\n")
							}
						}
					document.getElementById("regfrm").submit()
					mystr="\nMission complete !\n\n\nWe have tried to select " + a.length.toString() + " course(s).\n\nAnd below " + coursecount.toString() + " course(s) are available:\n\n" + str + "\n\n\nPlease click extension button to refresh icon.\n"
					chrome.storage.local.set( {"isready": "done"}, function() { })
					chrome.storage.local.set( {"mystr": mystr}, function() { })
				})
			}
		}
		else if(valueArray.isready="done") {
			chrome.storage.local.get("mystr", function(valueArray) {
				if((valueArray.mystr)!=undefined) {
					alert(valueArray.mystr)
					chrome.storage.local.remove("mystr", function() { })	
				}
			})
		}
	})
}