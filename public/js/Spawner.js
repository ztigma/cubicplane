class Spawner extends Interfaz
{
	constructor()
	{
		super();
		this.magnitud = 50000;
		this.limit = 0;
	}
	Start()
	{
		
	}
	Update()
	{
		let distance = player.transform().Distance(new Vector3(0,0,0));
		if(distance < this.limit)
		{
			
		}
		else
		{
			this.limit += this.magnitud;
			let prefab_top = this.Prefab_Floor();
			let prefab_bottom = this.Prefab_Floor();
			prefab_top.CSS().set('--otz', (-this.limit) + '');
			prefab_bottom.CSS().set('--otz', (-this.limit) + '');

			prefab_bottom.CSS().set('--oty', '100');
		}
	}
	Prefab_Floor()
	{
		return floor_prefab.Instantiate();
	}
}
var spawner = new Spawner();