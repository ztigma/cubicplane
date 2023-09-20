class Save extends Interfaz
{
    constructor()
    {
        super();
    }
    Start()
    {
        if(localStorage[location.pathname])
        {
            is_editor = true;
            document.body.innerHTML = localStorage[location.pathname];

            //console.log(localStorage[location.pathname]);
        }
    }
    Update()
    {
        localStorage[location.pathname] = document.body.innerHTML;
    }
}
var salvar = new Save();