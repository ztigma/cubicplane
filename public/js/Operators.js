Object.prototype.Instantiate = function()
{
    let clone = this.cloneNode(true);
    clone.setAttribute('id', id_base.GetId());
	clone.setAttribute('imply', 'true');
    return clone;
}
String.prototype.to_element = function()
{
    return document.getElementById(this);
}
Object.prototype.TO_JSON = function()
{
    return JSON.stringify(this);
}
String.prototype.TO_OBJECT = function()
{
    return JSON.parse(this);
}
Object.prototype.toString = function()
{
    return this.TO_JSON()
}
Array.prototype.REMOVE_ALL = function(predicate) {
	return this.filter(n => !predicate(n));
};
String.prototype.op = function()
{
    let r = {};
    if(this.includes(" // "))
    {
        let split = this.split(' // ');
        let a = split[1].TO_OBJECT();
        
        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = Math.sqrt(a[name]);
            }
        )
        return r;
    }
    if(this.includes(" ** "))
    {
        let split = this.split(' ** ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name] ** b[name];
            }
        )
        return r;
    }
    if(this.includes(" + "))
    {
        let split = this.split(' + ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name] + b[name];
            }
        )
        return r;
    }
    if(this.includes(" - "))
    {
        let split = this.split(' - ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name] - b[name];
            }
        )
        return r;
    }
    if(this.includes(" / "))
    {
        let split = this.split(' / ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name] / b[name];
            }
        )
        return r;
    }
    if(this.includes(" * "))
    {
        let split = this.split(' * ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name] * b[name];
            }
        )
        return r;
    }
    if(this.includes(" b+b "))
    {
        let split = this.split(' b+b ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name].BALANCE(b[name], '+');
            }
        )
        return r;
    }
    if(this.includes(" b-b "))
    {
        let split = this.split(' b-b ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name].BALANCE(b[name], '-');
            }
        )
        return r;
    }
    if(this.includes(" b*b "))
    {
        let split = this.split(' b*b ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name].BALANCE(b[name], '*');
            }
        )
        return r;
    }
    if(this.includes(" b/b "))
    {
        let split = this.split(' b/b ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name].BALANCE(b[name], '/');
            }
        )
        return r;
    }
    if(this.includes(" b**b "))
    {
        let split = this.split(' b**b ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name].BALANCE(b[name], '**');
            }
        )
        return r;
    }
    if(this.includes(" a+a "))
    {
        let split = this.split(' a+a ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name].ABALANCE(b[name], '+');
            }
        )
        return r;
    }
    if(this.includes(" a-a "))
    {
        let split = this.split(' a-a ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name].ABALANCE(b[name], '-');
            }
        )
        return r;
    }
    if(this.includes(" a*a "))
    {
        let split = this.split(' a*a ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name].ABALANCE(b[name], '*');
            }
        )
        return r;
    }
    if(this.includes(" a/a "))
    {
        let split = this.split(' a/a ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name].ABALANCE(b[name], '/');
            }
        )
        return r;
    }
    if(this.includes(" a**a "))
    {
        let split = this.split(' a**a ');
        let a = split[0].TO_OBJECT();
        let b = split[1].TO_OBJECT();

        Object.keys(a).forEach
        (
            function(name)
            {
                r[name] = a[name].ABALANCE(b[name], '**');
            }
        )
        return r;
    }
    if(this.includes(" eq "))
    {
        let split = this.split(' eq ');

        let b = split[1].TO_OBJECT();

        r = EulerToQuaternion(b);

        return r;
    }
}
String.prototype.PROPS = function(props) 
{
    a = this;
    Object.keys(props).forEach
    (
        function(n) 
        {
            a = a.replaceAll(`__${n}__`, props[n]);
        }
    )
    return a;
}
Number.prototype.NATURA = function()
{
    if(this < 0)
    {
        return this * -1;
    }
    else
    {
        return this;
    }
}
Number.prototype.NEGATIVE = function()
{
    if(this < 0)
    {
        return this;
    }
    else
    {
        return this * -1;
    }
}
String.prototype.TO_FLOAT = function() 
{
    let t = this.replace('px', '');
    return parseFloat(t);
}
Math['RandomInt'] = function(max)
{
    return Math.floor(Math.random() * max);
}
Element.prototype.CSS = function()
{
    var t = this;
    this.get = function(name)
    {
        return  t.style.getPropertyValue(name);
    }
    this.set = function(name, value)
    {
        return  t.style.setProperty(name, value);
    }
    this.get_computed = function(name)
    {
        return getComputedStyle(t).getPropertyValue(name);
    }
    return this;
}
/** Busca balancear (el numero menor de ultimo) un numero a 0 para que sea discernible -1=false; 0 = null; +1=false; */
Number.prototype.BALANCE = function(other, operator)
{
    if(this < other)
    {
        return `${{x:other}} ${operator} ${{x:this}}`.op().x;
    }
    else
    {
        return `${{x:this}} ${operator} ${{x:other}}`.op().x;
    }
}
/** el numero mayor de ultimo */
Number.prototype.ABALANCE = function(other, operator)
{
    if(this < other)
    {
        return `${{x:this}} ${operator} ${{x:other}}`.op().x;
    }
    else
    {
        return `${{x:other}} ${operator} ${{x:this}}`.op().x;
    }
}
var EulerToQuaternion = function(vector3)
{
    let r = new Vector3(0,0,0);

    if(vector3.y < 0)
    {
        if(vector3.y < -90)
        {
            r.x = (vector3.y.NATURA()/-90) + 2;
        }
        else
        {
            r.x = (vector3.y/-90);
        }
    }
    else
    {
        if(vector3.y > 90)
        {
            r.x = (vector3.y.NEGATIVE()/-90) - 2;
        }
        else
        {
            r.x = (vector3.y/-90);
        }
    }

    r.z = +1 - (vector3.y.NATURA() / 90); 
    
    if(vector3.x < 0)
    {
        if(vector3.x < -90)
        {
            r.y = (vector3.x.NATURA()/90) - 2;
        }
        else
        {
            r.y = (vector3.x/90);
        }
    }
    else
    {
        if(vector3.x > 90)
        {
            r.y = (vector3.x.NEGATIVE()/90) + 2;
        }
        else
        {
            r.y = (vector3.x/90);
        }
    }
    return r;
}