const jwtToken = "eyJ1c2VyaWQiOiJuamgiLCJpYXQiOjE3MTk2NzQ3NzMsImV4cCI6MTcxOTc2MTE3M30";

// Base64URL 디코딩 함수
function base64UrlDecode(str) {
    return decodeURIComponent(atob(str.replace(/-/g, '+').replace(/_/g, '/')).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
const decodedStr = base64UrlDecode(jwtToken);
console.log("Decoded JWT:", decodedStr);