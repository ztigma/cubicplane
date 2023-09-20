/** Transformador de todos los objetos */
class Transform
{
    /**
     * 
     * @param {Element} element 
     */
    constructor(element)
    {
        /**
         * @type {Element}
         */
        this.element = element;
    }
    /**
     * @returns {Vector3}
     */
    get position()
    {
        return new Vector3().get_otv(this.element);
    }
    /**
     * @param {Vector3} value 
     */
    set position(value)
    {
        new Vector3().Get(value).set_otv(this.element);
    }
    /**
     * @returns {Vector3}
     */
    get rotation()
    {
        return new Vector3().get_orv(this.element);
    }
    /**
     * @param {Vector3} value 
     */
    set rotation(value)
    {
        new Vector3().Get(value).set_orv(this.element)
    }
    /**
     * @returns {Quaternion}
     */
    get quaternion()
    {
        return new Quaternion().Euler
        (
            new Vector3().get_orv(this.element)
        )
        ;
    }
    get scale()
    {
        return new Vector3().get_scale(this.element);
    }
    set scale(value)
    {
        return new Vector3(value).set_scale(this.element);
    }
	Distance(other)
	{
		let me = this.position;
		let v = `${me} - ${other}`.op();
		let e = `${v} ** ${new Vector3(2,2,2)}`.op();
		let s = e.x + e.y + e.z;
		let r = ` // ${{x:s}}`.op();
		return r.x;
	}
}
Element.prototype.transform = function()
{
    if(this.transform instanceof Transform)
    {
        return this.transform;
    }
    else
    {
        return new Transform(this);
    }
}