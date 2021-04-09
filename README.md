# validate email / check email  
--- ** JS  
```js
let isEmailAddress = val => {  
	return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val) || /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/.test(val);  
}  
```
---  
