class Quaternion
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
        this.x = x;
        /**
         * @type {Number}
         */
        this.y = y;
        /**
         * @type {Number}
         */
        this.z = z;
    }
    /**
     * 
     * @param {Quaternion} quaternion
     * @returns {Quaternion}
     */
    Get(quaternion)
    {
        this.x = quaternion.x;
        this.y = quaternion.y;
        this.z = quaternion.z;
        return this;
    }
    /**
     * 
     * @param {Vector3} vector3 
     * @returns {Vector3}
     */
    CalcForce(vector3)
    {        
        let r = new Vector3(vector3.x, vector3.y, vector3.z);

        //SOLO SE PROCESA UNO A LA VEZ
        /* X */if(this.x.NATURA() > this.z.NATURA())   //0.6
        {
            if(vector3.x.NATURA() > 0)
            {
                r.z = vector3.x * -this.x;
                r.x = vector3.x * this.z;
            }
            else if(vector3.y.NATURA() > 0)
            {
                
            }
            else if(vector3.z.NATURA() > 0)
            {
                r.x = vector3.z * this.x;
                r.z = vector3.z * this.z;
            }
        }
        /* Z */else                                    //0.4
        {
            if(vector3.x.NATURA() > 0)//ad
            {
                r.x = vector3.x * this.z;
                r.z = vector3.x * -this.x;
            }
            else if(vector3.y.NATURA() > 0)
            {

            }
            else if(vector3.z.NATURA() > 0)//ws
            {
                r.z = vector3.z * this.z;
                r.x = vector3.z * this.x;
            }
        }
        return r;
    }
    /**
     * Es para convertir 360 grados a numeros que van de -1 a 1 o quaterniones
     * @param {Vector3} vector3 
     * @returns {Quaternion}
     */
    Euler(vector3)
    {
        let q = ` eq ${vector3}`.op();//eq esta en operators como EulerToQuaternion
        this.Get(q);
        return this;
    }
}