class Users extends Interfaz
{
	constructor()
	{
		super();
		this.localplayer = undefined;
		this.users = [];
		this.playing = [];
	}
	async GetUsers()
	{	
		let res = await async_cmd
		(
			'get'
			,
			'/users'
		);
		console.log(`GetUsers:`);
		console.log(res);
		
		return res.TO_OBJECT();
	}
	async InstantiateUsers(users)
	{	
		console.log(`InstantiateUsers:`);
		for(let i = 0; i < users.length; i++)
		{
			let u = users[i];
			let find = this.playing(p => p.id == u.id);

			if(find.id == player.getAttribute('localplayer'))
			{
				continue;
			}
			
			if(find)
			{
				TransformSharing(find);
			}
			else
			{
				await Spawn(u);
			}
		}
	}
	async Spawn(user)
	{
		console.log(`Spawn User:`);
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
		
		await async_timeout(1000);
		
		let u = 
			{
				...{element:document.querySelector(`[id=${user.id}]`)}
				,
				...user
			}
		;
		
		this.playing.push(u);
	}
	TransformSharing(user)
	{
		user.element.transform().position = user.position;
		user.element.transform().rotation = user.rotation;

		console.log(`TransformSharing`);
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
	async Start()
	{
		console.log('Users Start');
		await async_timeout(1000/60);
		
		this.users = await this.GetUsers();
		InstantiateUsers(this.users);
		
		await Start();
	}
}
var users = new Users();