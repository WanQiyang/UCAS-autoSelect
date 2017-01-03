
function initial() {
	chrome.storage.local.get("isready", function(valueArray) {
		if(valueArray.isready=="done") {
			document.getElementById("itemcount").innerText="N/A"
			document.getElementById("nowstatus").innerText="Done"
			chrome.browserAction.setIcon({"path": "icons/icon_19_green.png"})
			document.getElementById("label1").innerText="The last mission has completed."
			document.getElementById("label2").innerText="You can reset this extension through the button below."
			document.getElementById("listlabel").hidden=true
			document.getElementById("itemtext").disabled=true
			document.getElementById("additem").disabled=true
			document.getElementById("delitem").innerText="Reset";
			return false
		}
		else {
			chrome.storage.local.get("items", function(valueArray) {
				var s=valueArray.items
				if(s!=undefined) {
					var a=s.split(",")
					document.getElementById("itemcount").innerText=a.length
					document.getElementById("nowstatus").innerText="Ready to auto refresh"
					chrome.storage.local.set( {"isready": "ok"}, function() { })
					chrome.browserAction.setIcon({"path": "icons/icon_19_yellow.png"})
					var u=document.getElementById("listcontent")
					for(var i=0;i<a.length;i++)
						u.appendChild(document.createElement("li")).innerText=a[i]
				}
				else {
					document.getElementById("itemcount").innerText="0"
					document.getElementById("nowstatus").innerText="Not Ready"
					//chrome.storage.local.remove("isready", function() { })
					chrome.browserAction.setIcon({"path": "icons/icon_19_red.png"})
					document.getElementById("listlabel").hidden=true
				}
			})
			document.getElementById("itemtext").focus()
		}
	})
}

function additem() {
	var t=document.getElementById("itemtext")
	if(t.value.length==0) return false
	var u=document.getElementById("listcontent")
	u.appendChild(document.createElement("li")).innerText=t.value
	document.getElementById("itemcount").innerText=u.childElementCount
	if(u.childElementCount==1) {
		document.getElementById("nowstatus").innerText="Ready to auto refresh"
		chrome.storage.local.set( {"isready": "ok"}, function() { })
		chrome.browserAction.setIcon({"path": "icons/icon_19_yellow.png"})
		document.getElementById("listlabel").hidden=false
		chrome.storage.local.set( {"items": t.value}, function() { })
	}
	else
	{
		chrome.storage.local.get("items", function(valueArray) {
			s=valueArray.items
			s+=(","+t.value)
			chrome.storage.local.set( {"items": s}, function() { })	
		})
	}
	t.focus()
	t.select()
}

function delitem() {
	chrome.storage.local.get("isready", function(valueArray) {
		if(valueArray.isready=="done") {
			//document.getElementById("itemcount").innerText="0"
			//document.getElementById("nowstatus").innerText="Not Ready"
			//chrome.storage.local.remove("items", function() { })
			//chrome.storage.local.remove("isready", function() { })
			//chrome.browserAction.setIcon({"path": "icons/icon_19_red.png"})
			//document.getElementById("listlabel").hidden=true
			//document.getElementById("label1").innerText='You can add item through the inputbox and the button "Add".'
			//document.getElementById("label2").innerText='And remove the last item through the button "Del".'
			//document.getElementById("itemtext").disabled=false
			//document.getElementById("additem").disabled=false
			//document.getElementById("delitem").innerText="Del";
			//t.focus()
			chrome.storage.local.set( {"isready": "ok"}, function() { })
			location.reload()
		}
		else {
			var u=document.getElementById("listcontent")
			if(u.childElementCount==0) {
				t=document.getElementById("itemtext")
				t.value="Nothing to remove !"
				t.focus()
				t.select()
				return false
			}
			u.removeChild(u.lastElementChild)
			document.getElementById("itemcount").innerText=u.childElementCount
			if(u.childElementCount==0) {
				document.getElementById("nowstatus").innerText="Not Ready"
				chrome.storage.local.remove("items", function() { })
				document.getElementById("listlabel").hidden=true
				chrome.storage.local.remove("isready", function() { })
				chrome.browserAction.setIcon({"path": "icons/icon_19_red.png"})
			}
			else {
				chrome.storage.local.get("items", function(valueArray) {
					a=valueArray.items.split(",")
					a.pop()
					chrome.storage.local.set( {"items": a.join(",")}, function() { })	
				})
			}
			t.focus()
			t.select()
		}
	})	
}

window.onload=initial
document.getElementById("additem").onclick=function(){additem()}
document.getElementById("delitem").onclick=function(){delitem()}