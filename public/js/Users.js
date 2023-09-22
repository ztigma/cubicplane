class Users extends Interfaz
{
	constructor()
	{
		super();
		this.localplayer = undefined;
		this.users = [];
		this.playing = [];
	}
 	InstantiateUsers(users)
	{	
		for(let i = 0; i < users.length; i++)
		{
			let u = users[i];
			let find = this.playing.find(p => p.id == u.id);
			
			if(u.id == player.getAttribute('localplayer'))
			{
				continue;
			}
			
			if(find)
			{
				//console.log(`TransformSharing 0: ${find}`);
				this.TransformSharing(u);
			}
			else
			{
				this.Spawn(u);
			}
		}
	}
	Spawn(user)
	{
		console.log(`Spawn User: ${user.id}`);
		this.playing.push
		({
			...{}
			,
			...user
		});
		let r = 
		`
  			<div
			id="${user.id}"
   			remoteplayer="true"
			parent3d="true"
			style="
			--otx: 0; --oty: 0; --otz: 0;
			--orx:0; --ory:0; --orz:0;
			--osx: 1; --osy:1; --osz: 1;
   			transition: transform 1s;
			"
			>
				<section imply="true" objeto="true" style="
				--otx:0; --oty:0; --otz:0;
				--orx:0; --ory:0; --orz:0;
				--osx:1; --osy: 0.3; --osz: 3;
				">
					<div front=""></div>
					<div back=""></div>
					<div right=""></div>
					<div left=""></div>
					<div top=""></div>
					<div bottom=""></div>
				</section>
				<section imply="true" objeto="true" style="
				--otx: 0; --oty:0; --otz: 60;
				--orx:0; --ory:0; --orz:0;
				--osx: 4; --osy: 0.2; --osz: 1;
				">
					<div front=""></div>
					<div back=""></div>
					<div right=""></div>
					<div left=""></div>
					<div top=""></div>
					<div bottom=""></div>
				</section>
			</div>
  		`	
		;
		mover.innerHTML += r;		
	}
	TransformSharing(user)
	{
		//console.log(`id: ${user.id}, position: ${user.position}`);

		let element = document.querySelector(`[id=${user.id}]`);
		
		element.transform().position = user.position;
		element.transform().rotation = user.rotation;
	}
	RemoveDisconnected()
	{
		console.log(`RemoveDisconnected`);
		let remotes = document.querySelectorAll('[remoteplayer=true]');
		remotes.forEach
		(
			function(n)
			{
				let find = this.users.find(u => u.getAttribute('id') == n.getAttribute('id'));
				if(find)
				{
					
				}
				else
				{
					console.log(`${n.getAttribute('id')} Disconnected`);
					n.remove();
				}
			}
		)
	}
	Start()
	{
		//console.log('Users Start');
		let t = this;
		setInterval
		(
			function()
			{
				Cmd
				(
					function(data)
					{
						//console.log(`GetUsers:`);
						//console.log(data);

						if(typeof data == 'string')
						{
							t.users = JSON.parse(data);
							t.InstantiateUsers(t.users);
						}
					}
					,
					'GET'
					,
					'/users'
				)
			}
			,
			1000
		);
	}
}
var users = new Users();