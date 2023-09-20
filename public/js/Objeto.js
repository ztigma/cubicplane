Object.prototype.Instantiate = function()
{
    let clone = this.cloneNode(true);
    clone.setAttribute('id', GetId());
    return clone;
}