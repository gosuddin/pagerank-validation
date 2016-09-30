var myAdjMat
function getMat(){

$(function(){

	$.ajax(
	{
		type:'GET',
		url: '/getAdjMat',
		success:function(data){
			myAdjMat = data
			console.log(data)
			console.log("Call your functions from here")
		},
		
	});
});

}