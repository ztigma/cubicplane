class Vector3
{
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x, y, z)
    {
        /**
         * @type {Number}
         */
        this.x = 0;
        /**
         * @type {Number}
         */
        this.y = 0;
        /**
         * @type {Number}
         */
        this.z = 0;

        if(x?.x == undefined)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        else
        {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        }
    }
    ToArray()
    {
        return [this.x, this.y, this.z]
    }
    /**
     * 
     * @param {Vector3} vector3 
     * @returns 
     */
    Get(vector3)
    {
        this.x = vector3.x;
        this.y = vector3.y;
        this.z = vector3.z;
        return this;
    }
    /**
     * 
     * @param {Element} element 
     * @returns {Vector3}
     */
    set_otv(element)
    {
        element.CSS().set('--otx', this.x);
        element.CSS().set('--oty', this.y);
        element.CSS().set('--otz', this.z);
        return this;
    }
    /**
     * 
     * @param {Element} element 
     * @returns {Vector3}
     */
    get_otv(element)
    {
        this.x = element.CSS().get('--otx').TO_FLOAT();
        this.y = element.CSS().get('--oty').TO_FLOAT();
        this.z = element.CSS().get('--otz').TO_FLOAT();
        return this;
    }
    /**
     * 
     * @param {Element} element 
     * @returns {Vector3}
     */
    set_orv(element)
    {
        element.CSS().set('--orx', this.x);
        element.CSS().set('--ory', this.y);
        element.CSS().set('--orz', this.z);
        return this;
    }
    /**
     * 
     * @param {Element} element 
     * @returns {Vector3}
     */
    get_orv(element)
    {
        this.x = element.CSS().get('--orx').TO_FLOAT();
        this.y = element.CSS().get('--ory').TO_FLOAT();
        this.z = element.CSS().get('--orz').TO_FLOAT();
        return this;
    }
    /**
     * 
     * @param {Element} element 
     * @returns {Vector3}
     */
    set_scale(element)
    {
        element.CSS().set('--osx', this.x);
        element.CSS().set('--osy', this.y);
        element.CSS().set('--osz', this.y);
        return this;
    }
    /**
     * 
     * @param {Element} element 
     * @returns {Vector3}
     */
    get_scale(element)
    {
        this.x = element.CSS().get('--osx').TO_FLOAT();
        this.y = element.CSS().get('--osy').TO_FLOAT();
        this.z = element.CSS().get('--osz').TO_FLOAT();
        return this;
    }
}
/*
let d = __this__.transform().Distance(player.transform().position);
if(d > 50000)
{
	__this__.remove();
}
else
{
	let child = __this__.querySelector(':scope > *');
	let opacity = child.CSS().get('opacity').TO_FLOAT();
	if(opacity < 1)
	{
		child.CSS().set('opacity', (opacity + 0.01) + '');
	}
	else
	{

	}
}
*/