class Interconnect
{
	constructor()
	{
		
	}
}
Interconnect.users = [];

class User
{
	constructor(ip, id)
	{
		this.ip = ip;
		this.id = `user_${id}`;
		this.name = 'none';
		this.vida = 100;
		this.position = {x:0, y:0, z:0};
		this.rotation = {x:0, y:0, z:0};
	}
}
module.exports = 
{
	Interconnect:Interconnect
	,
	User:User
}	
;