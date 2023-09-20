/** variable que comparte los objetos (id) html para comunicarse entre ellos */
var ID =
{
    
}
function IdPassing ()
{
    let w = document.querySelectorAll('[set_id]');
    w.forEach
    (
        function(n)
        {
            let name = n.getAttribute('set_id')
            ID[name] = n;
        }
    )
}
function OnStart ()
{
    let w = document.querySelectorAll('[onstart]');
    w.forEach
    (
        function(n)
        {
			let imply = n.getAttribute('imply');
			let b = imply == 'false';
			if(b)
			{
				
			}
			else
			{
				eval
	            (
	                n.getAttribute('onstart').PROPS
	                ({
	                    this:n.getAttribute('id')
	                })
	            );
			}
        }
    )
}
function OnUpdate ()
{
    let w = document.querySelectorAll('[onupdate]');
    w.forEach
    (
        function(n)
        {
			let imply = n.getAttribute('imply');
			let b = imply == 'false';
			if(b)
			{
				
			}
			else
			{
				eval
	            (
	                n.getAttribute('onupdate').PROPS
	                ({
	                    this:n.getAttribute('id')
	                })
	            );
			}
        }
    )
}
var starts = [];
var AddStart = function(clase)
{
    var find = starts.find(n => n.clase == clase);
    if(find)
    {
        console.error('ESE START YA EXISTE CLASE REPETIDA!')
    }
    else
    {
        starts.push(clase);
    }
}
var RemoveStart = function(clase)
{
    starts = starts.REMOVE_ALL(n => n == clase);
}

window.addEventListener('load', function() 
{
	Start();
});
function OnForce ()
{
    let w = document.querySelectorAll('[onforce=true]');
    w.forEach
    (
        function(n)
        {
            n.FORCE();
        }
    )
}
var is_editor = false;
function Start()
{

    starts.forEach
    (
        function(n)
        {
            n?.Start();
        }
    );

    OnForce();
    OnStart();
    if(is_editor)
    {
        
    }
    else
    {

        Importar();
    }
    IdPassing();

    StartUpdate();
}
var updates = [];

var AddUpdate = function(clase)
{
    var find = updates.find(n => n.clase == clase);
    if(find)
    {
        console.error('ESE UPDATE YA EXISTE CLASE REPETIDA!')
    }
    else
    {
        updates.push(clase);
    }
}
var RemoveUpdate = function(clase)
{
    updates = updates.REMOVE_ALL(n => n == clase);
}
function StartUpdate()
{
    setInterval
    (
        function()
        {

            OnUpdate();
            updates.forEach
            (
                function(n)
                {
                    n?.Update();
                }
            );
        }
        ,
        33
    )
}
function Importar()
{
    let w = document.querySelectorAll('[import]');
    w.forEach
    (
        function(n)
        {
            let name = n.getAttribute('import');
            let elemento = document.querySelector(`[export=${name}]`);

            //ATTRIBUTES
            elemento.getAttributeNames().forEach
            (
                function(ttr_name)
                {
                    if(ttr_name == 'import' || ttr_name == 'export' || ttr_name == 'style' || ttr_name == 'child_mode')
                    {
                        return;
                    }

                    let b = n.getAttribute(ttr_name);
                    if(b)
                    {

                    }
                    else
                    {
                        n.setAttribute(ttr_name, elemento.getAttribute(ttr_name));
                    }
                }
            );

            //STYLE
            for(let i = 0; i < elemento.style.length; i++)
            {
                let style_name = elemento.style.item(i);
                //console.log(style_name);
                let bs = n.style.getPropertyValue(style_name);
                if(bs)
                {

                }
                else
                {
                    n.style.setProperty(style_name, elemento.style.getPropertyValue(style_name));
                }
            }

            //CHILDREN
            let child_mode = n.getAttribute('child_mode');//add, replace
            if(child_mode)
            {

            }
            else
            {
                child_mode = 'replace';
                n.setAttribute('child_mode', child_mode);
            }
            child_mode = n.getAttribute('child_mode');
            if(child_mode == 'replace')
            {
                
            }
            else if(child_mode == 'add')
            {
                n.innerHTML = elemento.innerHTML + n.innerHTML;
            }
        }
    );
}