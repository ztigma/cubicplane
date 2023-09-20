class IdBase
{
    constructor()
    {
        this.contando = 0;
    }
    GetId = function()
    {
        return `id_${this.contando++}`;
    }
    SetIds ()
    {
        var t = this;
        let todos = document.querySelectorAll('*');
        todos.forEach
        (
            function(n)
            {
                if(n.getAttribute('id'))
                {
                    
                }
                else
                {
                    n.setAttribute('id', t.GetId());
                }
            }
        );
    }
    Start()
    {
        this.SetIds();
    }
}
var id_base = new IdBase();
AddStart(id_base);