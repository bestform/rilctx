function post(url, params, savedUrl){
  var request = new XMLHttpRequest();
  request.open("POST", url, true);   
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.onreadystatechange = function(){
    if (getShownotifications() && request.readyState==4 && request.status==200){
      var notification = webkitNotifications.createNotification(
        'link_add.png',  // icon url - can be relative
        'Saved URL to Pocket',  // notification title
        savedUrl  // notification body text
      );
      notification.show();
    }
  }
  request.send(params);    
}

function getUsername(){
  var username =  encodeURIComponent(localStorage["username"]);
  return username;
}

function getPassword(){
  var password = encodeURIComponent(localStorage["password"]);
  return password;
}

function getShownotifications(){
	return localStorage['shownotifications'] !== "false";
}

function getPrefix(){
  return "username="+getUsername()+"&password="+getPassword();
}

function getApiKey(){
    return "eb7dmX46Taf23C2c57A2e87t0lg0Q529"
}

function validate(){
  return localStorage["username"] && localStorage["password"];
}

function getBaseURL(method){
  return "https://readitlaterlist.com/v2/"+method;
}

function add(url){
  if(!validate()){
    alert("Please set your credentials in the options of the extension!");
    return;
  }
  var encodedUrl = encodeURIComponent(url);
  var apiurl = getBaseURL("add");
  var params = getPrefix()+"&apikey="+getApiKey()+"&url="+encodedUrl+"&title="+encodedUrl;
  post(apiurl, params, url);    
}

function ril(info, tab){
  var url;
  if(info && info.linkUrl){
    url = info.linkUrl;
  } else if(info && info.pageUrl) {
    url = info.pageUrl;
  }
  if(url){
    add(url);
  }
}

chrome.contextMenus.removeAll();
chrome.contextMenus.create({"title":"Send to Pocket", "contexts":["link","page"], "onclick":ril});
