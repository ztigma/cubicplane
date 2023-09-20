Element.prototype.COLLIDER = function(e)
{
    this.collider = new Collider(this);
}
class Collider
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
        /**
         * @type {Boolean}
         */
        this.is_enter = false;
    }
    /**
     * 
     * @param {CollisionResult} collision 
     */
    OnCollisionStay(collision)
    {
        var t = this;
        let on_collisions = Object.keys(t.element).filter
        (
            function(name)
            {
                let b = t.element[name] instanceof Interfaz;
                return b;
            }
        );
        on_collisions.forEach
        (
            function(name)
            {
               t.element[name].OnCollisionStay(collision)
            }
        );
        
        eval
        (
            t.element.getAttribute('OnCollisionStay')
            ?.PROPS
            ({
                result:collision.result
                , 
                vector:collision.vector
                ,
                this:collision.this.id
                ,
                other:collision.other.id
            })
        );

        this.is_enter = true;
    }
    /**
     * 
     * @param {CollisionResult} collision 
     */
    OnCollisionEnter(collision)
    {
        if(this.is_enter)
        {
            return;
        }
        else
        {

        }

        var t = this;
        let on_collisions = Object.keys(t.element).filter
        (
            function(name)
            {
                let b = t.element[name] instanceof Interfaz;
                return b;
            }
        );
        //console.log(on_collisions);
        on_collisions.forEach
        (
            function(name)
            {
                t.element[name].OnCollisionEnter(collision)
            }
        );
        
        eval
        (
            t.element.getAttribute('OnCollisionEnter')
            ?.PROPS
            ({
                result:collision.result
                , 
                vector:collision.vector
                ,
                this:collision.this.id
                ,
                other:collision.other.id
            })
        );

        this.is_enter = true;
    }
    /**
     * 
     * @param {CollisionResult} collision 
     */
    OnCollisionExit(collision)
    {
        if(this.is_enter)
        {

        }
        else
        {
            return;
        }

        var t = this;
        let on_collisions = Object.keys(t.element).filter
        (
            function(name)
            {
                let b = t.element[name] instanceof Interfaz;
                return b;
            }
        );
        //console.log(on_collisions);
        on_collisions.forEach
        (
            function(name)
            {
                t.element[name].OnCollisionExit(collision)
            }
        );
        
        eval
        (
            t.element.getAttribute('OnCollisionExit')
            ?.PROPS
            ({
                result:collision.result
                , 
                vector:collision.vector
                ,
                this:collision.this.id
                ,
                other:collision.other.id
            })
        );

        this.is_enter = false;
    }
}
function OnCollision ()
{

    let nosotros = document.querySelectorAll('[oncollision]');
    let targets = document.querySelectorAll('[collision3d=true][imply=true]');

    nosotros.forEach
    (
        function(n)
        {
            if(n.collider)
            {

            }
            else
            {
                n.COLLIDER(n);
            }

            let is_enter = false;

            targets.forEach
            (
                function(t)
                {
                    if(n == t)
                    {

                    }
                    else
                    {
                        if(is_enter)
                        {
                            return;
                        }
                        else
                        {

                        }


                        let collision = CollisionLogic(n, t);
                        let b = collision.result;
                        n.setAttribute('is_collision', b + '');

                        if(b)
                        {
                            
                            n.collider.OnCollisionEnter(collision);
                            n.collider.OnCollisionStay(collision);
                            is_enter = true;
                        }
                        else
                        {
                            n.collider.OnCollisionExit(collision);
                        }
                    }
                }
            );
        }
    );
}
class CollisionResult
{
    constructor(e)
    {
        /**
         * @type {Boolean}
         */
        this.result = e.result;
        /**
         * @type {Vector3}
         */
        this.vector = e.vector;
        /**
         * @type {Element}
         */
        this.this = e.this;
        /**
         * @type {Element}
         */
        this.other = e.other;
        /**
         * @type {Vector3}
         */
        this.diference = e.diference
        /**
         * @type {Vector3}
         */
        this.vector_wh = e.vector_wh
        /**
         * @type {Vector3}
         */
        this.perforacion = e.perforacion
        /**
         * @type {Vector3}
         */
        this.fraguar_wh = e.fraguar_wh
    }
}
/**
 * 
 * @param {Element} me 
 * @param {Element} target 
 * @returns {CollisionResult}
 */
function CollisionLogic(me, target)
{
    //let this_id = me.getAttribute('id');

    /* X */
    let me_x = me.CSS().get_computed('--otx').TO_FLOAT();
    let me_w = me.CSS().get_computed('--w').TO_FLOAT();
    let target_x = target.CSS().get_computed('--otx').TO_FLOAT();
    let target_w = target.CSS().get_computed('--w').TO_FLOAT();

    //let target_id = target.getAttribute('id');

    /* Y */
    let me_y = me.CSS().get_computed('--oty').TO_FLOAT();
    let me_h = me.CSS().get_computed('--h').TO_FLOAT();
    let target_y = target.CSS().get_computed('--oty').TO_FLOAT();
    let target_h = target.CSS().get_computed('--h').TO_FLOAT();

    /* Z */
    let me_z = me.CSS().get_computed('--otz').TO_FLOAT();
    let target_z = target.CSS().get_computed('--otz').TO_FLOAT();

    let me_vector = new Vector3(me_x, me_y, me_z);
    let target_vector = new Vector3(target_x, target_y, target_z);

    let vector_balance = new Vector3(`${me_vector} b-b ${target_vector}`.op());
    let vector_wh = new Vector3
    (
        (me_w * me.transform().scale.x * 0.5) + (target_w * target.transform().scale.x * 0.5)
        ,
        (me_h * me.transform().scale.y * 0.5) + (target_h * target.transform().scale.y * 0.5)
        ,
        (me_w * me.transform().scale.z * 0.5) + (target_w * target.transform().scale.z * 0.5)
    )

    let vector_result = new Vector3().Get(`${vector_balance} - ${vector_wh}`.op());

    if(Number.isNaN(vector_balance.x))
    {
        console.error(`--otx; --w; no esta definido en el style=""; esta vector_balance.x: ${vector_balance.x}`);
    }
    if(Number.isNaN(vector_balance.y))
    {
        console.error(`--oty; --h; no esta definido en el style=""; esta vector_balance.y: ${vector_balance.y}`);
    }
    if(Number.isNaN(vector_balance.z))
    {
        console.error(`--otz; --w; no esta definido en el style=""; esta vector_balance.z: ${vector_balance.z}`);
    }

    let bx = vector_result.x <= 0;
    let by = vector_result.y <= 0;
    let bz = vector_result.z <= 0;

    let b = bx && by && bz;
    
    let diference = new Vector3(`${me_vector} - ${target_vector}`.op());

    let fraguar_wh = new Vector3(vector_wh);

    if(diference.x < 0)
    {
        fraguar_wh.x = fraguar_wh.x.NATURA();
    }
    else
    {
        fraguar_wh.x = fraguar_wh.x.NEGATIVE();
    }

    if(diference.y < 0)
    {
        fraguar_wh.y = fraguar_wh.y.NATURA();
    }
    else
    {
        fraguar_wh.y = fraguar_wh.y.NEGATIVE();
    }

    if(diference.z < 0)
    {
        fraguar_wh.z = fraguar_wh.z.NATURA();
    }
    else
    {
        fraguar_wh.z = fraguar_wh.z.NEGATIVE();
    }

    fraguar_wh = new Vector3(`${fraguar_wh} * ${{x:-1, y:-1, z:-1}}`.op());

    let perforacion = new Vector3(`${fraguar_wh} - ${diference}`.op());

    let r = 
    {
        result:b
        , 
        vector:vector_result
        ,
        this:me
        ,
        other:target
        ,
        diference:diference
        ,
        vector_wh:vector_wh
        ,
        perforacion:perforacion
        ,
        fraguar_wh:fraguar_wh
    };

    return new CollisionResult(r);
}
setInterval
(
    function()
    {
        OnCollision();
    }
    ,
    33
)